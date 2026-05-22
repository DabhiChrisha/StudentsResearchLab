const express = require('express');
const multer = require('multer');
const XLSX = require('xlsx');
const prisma = require('../config/prisma');
const { adminAuthMiddleware } = require('../middleware/adminAuth');
const { broadcast } = require('../utils/sseManager');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

function excelDateToJSDate(excelSerial) {
  // Excel to JS: days since 1899-12-31 (Excel epoch) -> milliseconds
  const ms = (excelSerial - 25569) * 86400 * 1000;
  return new Date(ms);
}

function parseDateCell(cell) {
  if (!cell) return null;
  const v = cell.v;
  if (typeof v === 'number') return excelDateToJSDate(v);
  if (typeof v === 'string') {
    // Try DD/MM/YYYY
    const m = v.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
    if (m) {
      const d = parseInt(m[1], 10);
      const mo = parseInt(m[2], 10) - 1;
      const y = parseInt(m[3], 10);
      return new Date(Date.UTC(y, mo, d));
    }
    // Fallback: Date.parse
    const parsed = Date.parse(v);
    if (!Number.isNaN(parsed)) return new Date(parsed);
  }
  return null;
}

function getCell(sheet, r, c) {
  const addr = XLSX.utils.encode_cell({ r, c });
  return sheet[addr];
}

function findMergeForCell(sheet, r, c) {
  const merges = sheet['!merges'] || [];
  for (const m of merges) {
    if (r >= m.s.r && r <= m.e.r && c >= m.s.c && c <= m.e.c) return m;
  }
  return null;
}

function pickSheet(wb, candidates, fallbackMatchers = []) {
  for (const name of candidates) {
    if (wb.Sheets[name]) return wb.Sheets[name];
  }

  const sheetNames = wb.SheetNames || [];
  for (const matcher of fallbackMatchers) {
    const match = sheetNames.find((name) => matcher(name.toLowerCase()));
    if (match) return wb.Sheets[match];
  }

  return null;
}

function isDateLikeCellValue(value) {
  if (typeof value === 'number') return true;
  if (typeof value !== 'string') return false;
  return /\d{1,2}[\/-]\d{1,2}[\/-]\d{2,4}/.test(value) || /\b(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\b/i.test(value);
}

function sheetLooksLikeScoresSheet(sheet) {
  const range = XLSX.utils.decode_range(sheet['!ref']);
  let dateCount = 0;
  let secondRowCount = 0;

  for (let c = range.s.c; c <= range.e.c; c++) {
    const header = getCell(sheet, range.s.r, c);
    if (header && isDateLikeCellValue(header.v)) dateCount++;
    if (getCell(sheet, range.s.r + 1, c)?.v !== undefined && getCell(sheet, range.s.r + 1, c)?.v !== null && String(getCell(sheet, range.s.r + 1, c)?.v).trim() !== '') secondRowCount++;
  }

  return dateCount > 0 && secondRowCount > 0;
}

function sheetLooksLikeRoundsSheet(sheet) {
  const range = XLSX.utils.decode_range(sheet['!ref']);
  let dateCount = 0;
  let roundLabelCount = 0;

  for (let c = range.s.c; c <= range.e.c; c++) {
    const header = getCell(sheet, range.s.r, c);
    if (header && isDateLikeCellValue(header.v)) dateCount++;
    const label = normalizeText(getCell(sheet, range.s.r + 1, c)?.v);
    if (label === '1' || label === '2' || label === '3' || label === 'i' || label === 'ii' || label === 'iii' || label.includes('round')) {
      roundLabelCount++;
    }
  }

  return dateCount > 0 && roundLabelCount > 0;
}

function pickSheetByHintOrStructure(wb, preferredName, candidates, fallbackMatchers, structureMatcher) {
  if (preferredName) return wb.Sheets[preferredName] || null;

  const namedSheet = pickSheet(wb, candidates, fallbackMatchers);
  if (namedSheet) return namedSheet;

  const sheetNames = wb.SheetNames || [];
  for (const name of sheetNames) {
    const sheet = wb.Sheets[name];
    if (sheet && structureMatcher(sheet)) return sheet;
  }

  return null;
}

function normalizeText(value) {
  return String(value ?? "").trim().toLowerCase();
}

function looksLikeEnrollmentNo(value) {
  const text = String(value ?? "").trim();
  if (!text) return false;
  if (!/[a-zA-Z]/.test(text) || !/\d/.test(text)) return false;
  return /^[a-zA-Z0-9\-\/\s]+$/.test(text) && text.length >= 5;
}

function findColumnByHeader(sheet, range, terms, maxHeaderRows = 3) {
  const limitRow = Math.min(range.e.r, range.s.r + maxHeaderRows - 1);
  for (let r = range.s.r; r <= limitRow; r++) {
    for (let c = range.s.c; c <= range.e.c; c++) {
      const text = normalizeText(getCell(sheet, r, c)?.v);
      if (!text) continue;
      if (terms.some((term) => text.includes(term))) return c;
    }
  }
  return null;
}

function detectEnrollmentColumn(sheet, range) {
  const headerCol = findColumnByHeader(sheet, range, ['enrollment no', 'enrollment', 'enrolment no', 'enrolment']);
  if (headerCol !== null) return headerCol;

  const maxColsToScan = Math.min(range.e.c, range.s.c + 10);
  let bestCol = range.s.c + 2;
  let bestCount = -1;

  for (let c = range.s.c; c <= maxColsToScan; c++) {
    let count = 0;
    for (let r = Math.max(range.s.r + 2, 0); r <= Math.min(range.e.r, range.s.r + 25); r++) {
      const cell = getCell(sheet, r, c);
      if (cell && looksLikeEnrollmentNo(cell.v)) count++;
    }
    if (count > bestCount) {
      bestCount = count;
      bestCol = c;
    }
  }

  return bestCol;
}

function detectDataStartRow(sheet, range, enrollmentCol) {
  const headerCol = findColumnByHeader(sheet, range, ['enrollment no', 'enrollment', 'enrolment no', 'enrolment']);
  if (headerCol !== null) {
    for (let r = range.s.r; r <= Math.min(range.e.r, range.s.r + 6); r++) {
      const cell = getCell(sheet, r, headerCol);
      if (cell && looksLikeEnrollmentNo(cell.v)) return r;
    }
    return Math.max(range.s.r + 2, 0);
  }

  for (let r = Math.max(range.s.r + 2, 0); r <= range.e.r; r++) {
    const cell = getCell(sheet, r, enrollmentCol);
    if (cell && looksLikeEnrollmentNo(cell.v)) return r;
  }
  return Math.max(range.s.r + 2, 0);
}

function collectScoresByColumn(sheet, range, enrollmentCol, valueCol, startRow) {
  const scores = {};
  for (let r = startRow; r <= range.e.r; r++) {
    const enCell = getCell(sheet, r, enrollmentCol);
    const en = enCell?.v ? String(enCell.v).trim() : null;
    if (!en) continue;
    const valueCell = getCell(sheet, r, valueCol);
    const value = valueCell?.v;
    if (value === undefined || value === null || value === '') continue;
    const n = Number(value);
    if (!Number.isNaN(n) && n > 0) scores[en] = n;
  }
  return scores;
}

function parseScoreBlocks(sheet) {
  const range = XLSX.utils.decode_range(sheet['!ref']);
  const enrollmentCol = detectEnrollmentColumn(sheet, range);
  const startRow = detectDataStartRow(sheet, range, enrollmentCol);
  const blocks = [];

  for (let c = range.s.c; c <= range.e.c; c++) {
    const header = getCell(sheet, range.s.r, c);
    const dateObj = parseDateCell(header);
    if (!header || !header.v || !dateObj) continue;

    const merge = findMergeForCell(sheet, range.s.r, c);
    let nextDateCol = range.e.c + 1;
    for (let scan = c + 1; scan <= range.e.c; scan++) {
      const scanHeader = getCell(sheet, range.s.r, scan);
      if (scanHeader && scanHeader.v && parseDateCell(scanHeader)) {
        nextDateCol = scan;
        break;
      }
    }
    const endC = merge ? Math.max(merge.e.c, nextDateCol - 1) : nextDateCol - 1;
    const typeRow = range.s.r + 1;
    let type = '';
    let finalCol = c;

    for (let scan = c; scan <= endC; scan++) {
      const labelCell = getCell(sheet, typeRow, scan);
      const rawLabel = String(labelCell?.v || '').trim();
      const label = normalizeText(rawLabel);
      if (!type && rawLabel) {
        type = rawLabel;
      }
      if (rawLabel) {
        finalCol = scan;
      }
      if (label.includes('grand total') || label.includes('final score') || label === 'final' || label === 'score') {
        finalCol = scan;
        break;
      }
    }

    blocks.push({
      dateKey: dateObj.toISOString().slice(0, 10),
      dateObj,
      type: type || 'Test',
      startC: c,
      endC,
      finalCol,
      enrollmentCol,
      startRow,
    });

    c = endC;
  }

  return blocks;
}

function parseAttendanceByEnrollmentColumn(sheet, range, startRow, enrollmentCol, valueCol) {
  const attendees = [];
  const scores = {};

  for (let r = startRow; r <= range.e.r; r++) {
    const enCell = getCell(sheet, r, enrollmentCol);
    const enrollmentNo = enCell?.v ? String(enCell.v).trim() : null;
    if (!enrollmentNo) continue;

    const valueCell = getCell(sheet, r, valueCol);
    const value = valueCell?.v;
    if (value === undefined || value === null || value === '') continue;

    const numericValue = Number(value);
    if (Number.isNaN(numericValue) || numericValue <= 0) continue;

    attendees.push(enrollmentNo);
    scores[enrollmentNo] = numericValue;
  }

  return { attendees, scores };
}

router.post('/api/sessions/upload', adminAuthMiddleware, upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const wb = XLSX.read(req.file.buffer, { type: 'buffer' });
    const preferredScoresSheetName = String(req.body?.scoresSheetName || '').trim();
    const preferredRoundsSheetName = String(req.body?.roundsSheetName || '').trim();
    const preferredUpdateDate = String(req.body?.updateDate || '').trim();
    const scoresSheet = pickSheetByHintOrStructure(
      wb,
      preferredScoresSheetName,
      ['Scores', 'scores', 'Schema - Scores'],
      [
        (name) => name.includes('schema') && name.includes('score') && !name.includes('round'),
        (name) => name.includes('final score'),
        (name) => name === 'scores',
      ],
      sheetLooksLikeScoresSheet
    );
    const roundsSheet = preferredRoundsSheetName
      ? pickSheetByHintOrStructure(
          wb,
          preferredRoundsSheetName,
          ['Rounds', 'rounds', 'Schema - Roundwise Scores', 'Schema - Rounds'],
          [
            (name) => name.includes('round') && name.includes('score'),
            (name) => name.includes('roundwise'),
            (name) => name === 'rounds',
          ],
          sheetLooksLikeRoundsSheet
        )
      : null;
    if (preferredScoresSheetName && !scoresSheet) {
      return res.status(400).json({
        error: 'Missing required sheets',
        message: `Selected Scores sheet "${preferredScoresSheetName}" was not found. Available sheets: ${wb.SheetNames.join(', ')}`,
      });
    }
    if (!scoresSheet) {
      return res.status(400).json({
        error: 'Missing required sheets',
        message: `Could not find a Scores sheet. Available sheets: ${wb.SheetNames.join(', ')}`,
      });
    }
    if (preferredRoundsSheetName && !roundsSheet) {
      return res.status(400).json({
        error: 'Missing required sheets',
        message: `Selected Rounds sheet "${preferredRoundsSheetName}" was not found. Available sheets: ${wb.SheetNames.join(', ')}`,
      });
    }

    const scoresRange = XLSX.utils.decode_range(scoresSheet['!ref']);
    const scoreBlocks = parseScoreBlocks(scoresSheet);
    const activeScoreBlocks = preferredUpdateDate
      ? scoreBlocks.filter((block) => block.dateKey >= preferredUpdateDate)
      : scoreBlocks;

    if (preferredUpdateDate && activeScoreBlocks.length === 0) {
      return res.status(400).json({
        error: 'Missing required data',
        message: `No score block was found for the selected date ${preferredUpdateDate}.`,
      });
    }

    const sessionsCreated = [];
    const scoresUpdated = [];

    for (const scoreBlock of activeScoreBlocks) {
      const daySessionId = `${scoreBlock.dateKey}_${scoreBlock.type.replace(/\s+/g, '_')}_day`;
      const finalScores = collectScoresByColumn(scoresSheet, scoresRange, scoreBlock.enrollmentCol, scoreBlock.finalCol, scoreBlock.startRow);
      const attendees = Object.keys(finalScores);
      if (attendees.length === 0) continue;

      const daySession = await prisma.session_attendee.upsert({
        where: {
          date_type_round: {
            date: scoreBlock.dateObj,
            type: scoreBlock.type,
            round: 1,
          },
        },
        create: { id: daySessionId, date: scoreBlock.dateObj, type: scoreBlock.type, round: 1, attendees },
        update: { attendees },
      });
      sessionsCreated.push(daySession.id);

      await prisma.session_score.upsert({
        where: { r_id: daySession.id },
        create: { r_id: daySession.id, scores: finalScores },
        update: { scores: finalScores },
      });
      scoresUpdated.push(daySession.id);
    }

    // --- Parse Rounds sheet
    if (roundsSheet) {
      const roundsRange = XLSX.utils.decode_range(roundsSheet['!ref']);
      const enrollmentColRounds = detectEnrollmentColumn(roundsSheet, roundsRange);
      const startRowRounds = detectDataStartRow(roundsSheet, roundsRange, enrollmentColRounds);

      for (let c = roundsRange.s.c; c <= roundsRange.e.c; c++) {
        const header = getCell(roundsSheet, roundsRange.s.r, c);
        if (!header || !header.v) continue;
        const merge = findMergeForCell(roundsSheet, roundsRange.s.r, c);
        const endC = merge ? merge.e.c : c;
        const dateObj = parseDateCell(header);
        if (!dateObj) { c = endC; continue; }
        const dateKey = dateObj.toISOString().slice(0, 10);

        if (preferredUpdateDate && dateKey < preferredUpdateDate) {
          c = endC;
          continue;
        }

        const matchingScoreBlocks = activeScoreBlocks.filter((block) => block.dateKey === dateKey);
        if (matchingScoreBlocks.length === 0) {
          c = endC;
          continue;
        }
        const primaryType = matchingScoreBlocks[0]?.type || 'Test';

        for (let col = c; col <= endC; col++) {
          const roundCell = getCell(roundsSheet, roundsRange.s.r + 1, col);
          const roundLabel = (roundCell && roundCell.v) ? String(roundCell.v).trim() : null;
          if (!roundLabel) continue;
          const romanToInt = { I: 1, II: 2, III: 3 };
          const roundNo = romanToInt[roundLabel.toUpperCase()] || parseInt(roundLabel, 10) || 1;
          const sessionId = `${dateKey}_${primaryType.replace(/\s+/g, '_')}_${roundNo}`;
          const roundsEnrollmentCol = findColumnByHeader(roundsSheet, roundsRange, ['enrollment no', 'enrollment', 'enrolment no', 'enrolment']) ?? enrollmentColRounds;
          const parsedRoundData = parseAttendanceByEnrollmentColumn(roundsSheet, roundsRange, startRowRounds, roundsEnrollmentCol, col);
          const attendees = parsedRoundData.attendees;
          const scoresObj = parsedRoundData.scores;
          if (attendees.length === 0) continue;

          const roundSession = await prisma.session_attendee.upsert({
            where: {
              date_type_round: {
                date: dateObj,
                type: primaryType,
                round: roundNo,
              },
            },
            create: { id: sessionId, date: dateObj, type: primaryType, round: roundNo, attendees },
            update: { attendees },
          });
          sessionsCreated.push(roundSession.id);

          await prisma.session_score.upsert({
            where: { r_id: roundSession.id },
            create: { r_id: roundSession.id, scores: scoresObj },
            update: { scores: scoresObj },
          });
          scoresUpdated.push(roundSession.id);
        }

        c = endC;
      }
    }

    broadcast('session_changed', {
      sessionsCreated: sessionsCreated.length,
      scoresUpdated: scoresUpdated.length,
    });

    res.json({ success: true, sessionsCreated: sessionsCreated.length, scoresUpdated: scoresUpdated.length });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
