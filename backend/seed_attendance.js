const prisma = require('./src/lib/prisma');
const fs = require('fs');
const path = require('path');

// Map of CSV names (as written in spreadsheets) → enrollment_no from students_details
// Built by matching CSV name patterns to DB student_name + enrollment_no
const NAME_TO_ENROLLMENT = {
  'Ghetiya Poojan Rahulbhai':       '25MECE30003',
  'Kansara Dev Dharmeshkumar':      '24BECE30114',
  'Gajjar Antra Ashvinkumar':       '24BECE30081',
  'Kumavat Yash Nenaram':           '24BECE30122',
  'Dabhi Chrisha Manish':           '24BECE30489',
  'Rudr Jayeshkumar Halvadiya':     '24BECE30094',
  'Pragati Varu':                   '24BECE30436',
  'Aayush Viral Pandya':            '24BECE30541',
  'Mahi Nitinchandra Parmar':       '24BECE30548',
  'Honey Modha':                    '224SBECE30016',
  'Prem Raichura':                  '224SBECE30059',
  'Hetvi Hinsu':                    '23BECE30449',
  'Patel Banshari Rahulkumar':      '23BECE30168',
  'Mihir Patel':                    '23BECE30542',
  'Heny Patel':                     '23BECE30521',
  'Patel Krish Himanshu':           '23BECE30532',
  'Pande Hemant Rameshwarkumar':    '23BECE30493',
  'Devda Rachita Bharatsinh':       '23BECE30059',
  'Patel Jainee Hasmukhbhai':       '23BECE30203',
  'Krishna Bhatt':                  '23BECE30023',
  'Chavda Yashvi Surendrasinh':     '23BECE30036',
  'Padh Charmi Ketankumar':         '23BECE30144',
  'Panchal Henit Shaileshbhai':     '23BECE30490',
  'Jenish Sorathiya':               '23BEIT54020',
  'Kanksha Keyur Buch':             '23BECE30029',
  'Janki Chitroda':                 '23BECE30040',
  'Rohan Thakar':                   '23BECE30364',
  'Kanudawala Zeel PareshKumar':    '23BECE30101',
  'Zenisha Devani':                 '23BECE30058',
  'Yajurshi Velani':                '24BECE30441',
  'Parva Kumar':                    '22BECE30153',
  'Kandarp Dipakkumar Gajjar':      '22BECE30091',
  'Ridham Patel':                   '22BEIT30133',
  'Nancy Rajesh Patel':             '22BEIT30123',
  'Krutika Vijaybhai Patel':        '22BEIT30118',
  'Jadeja Bhagyashree Vanrajsinh':  '24BECE30099',
  'Patel Hency Mukesh':             '24BECE30225',
  'Arnab Ghosh':                    '23BECE54003',
};

// Month year map for parsing dates
const MONTH_MAP = {
  'Jan': { month: 1, year: 2026 },
  'Feb': { month: 2, year: 2026 },
  'Mar': { month: 3, year: 2026 },
  'Apr': { month: 4, year: 2026 },
};

function parseDate(dayStr, monthYear) {
  // dayStr is like "5 Jan", "2 Feb", etc.
  const parts = dayStr.trim().split(' ');
  if (parts.length !== 2) return null;
  const day = parseInt(parts[0], 10);
  const monthKey = parts[1];
  const my = MONTH_MAP[monthKey];
  if (!my || isNaN(day)) return null;
  // Return ISO date string YYYY-MM-DD
  const month = String(my.month).padStart(2, '0');
  const dayStr2 = String(day).padStart(2, '0');
  return `${my.year}-${month}-${dayStr2}`;
}

function parseHours(val) {
  if (!val || val.trim() === '' || val.trim() === '-' || val.trim() === 'l' || val.trim() === 'L') {
    return null; // absent / no data
  }
  // Handle "1:30" style values
  if (val.includes(':')) {
    const [h, m] = val.split(':').map(Number);
    if (!isNaN(h) && !isNaN(m)) {
      const total = h + m / 60;
      return total > 0 ? total : null; // 0 = absent
    }
    return null;
  }
  const num = parseFloat(val);
  if (isNaN(num) || num <= 0) return null; // 0 = absent
  return num;
}

function parseCsv(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\r\n').filter(l => l.trim() !== '');
  
  // First line = headers
  const headers = lines[0].split(',');
  // Date columns start at index 2
  const dateCols = headers.slice(2);
  
  const records = [];
  
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(',');
    const csvName = (cols[1] || '').trim();
    if (!csvName) continue;
    
    const enrollment = NAME_TO_ENROLLMENT[csvName];
    if (!enrollment) {
      console.warn(`  ⚠️  No enrollment mapping for: "${csvName}"`);
      continue;
    }
    
    // Each date column
    for (let d = 0; d < dateCols.length; d++) {
      const dateStr = parseDate(dateCols[d]);
      if (!dateStr) continue;
      
      const rawVal = (cols[d + 2] || '').trim();
      const hours = parseHours(rawVal);
      
      // Only insert if there is a value (even 0 counts as attended for 0 hours)
      // We insert rows for every cell that has a numeric value (including 0)
      if (hours !== null && hours > 0) {
        records.push({
          enrollment_no: enrollment,
          date: new Date(dateStr),
          hours: hours,
          notes: null,
        });
      }
    }
  }
  
  return records;
}

const CSV_FILES = [
  path.join(__dirname, '..', 'January 2026 - SRL Members Performance Sheet - Hours Dedicated (1).csv'),
  path.join(__dirname, '..', 'February 2026 - SRL Members Performance Sheet - Hours Dedicated (1).csv'),
  path.join(__dirname, '..', 'March 2026 - SRL Members Performance Sheet - Hours Dedicated (2).csv'),
  path.join(__dirname, '..', 'April 2026 - SRL Members Performance Sheet - Hours Dedicated.csv'),
];

async function main() {
  console.log('📂 Parsing CSV files...\n');
  
  let allRecords = [];
  
  for (const f of CSV_FILES) {
    const label = path.basename(f);
    console.log(`Processing: ${label}`);
    const records = parseCsv(f);
    console.log(`  → ${records.length} rows parsed\n`);
    allRecords = allRecords.concat(records);
  }
  
  console.log(`\nTotal rows to insert: ${allRecords.length}`);
  
  // Check existing count
  const existing = await prisma.$queryRaw`SELECT COUNT(*) as count FROM attendance`;
  console.log(`Existing rows in attendance: ${existing[0].count}`);
  
  if (Number(existing[0].count) > 0) {
    console.log('\n⚠️  Attendance table already has data. Clearing before re-seeding...');
    await prisma.$executeRaw`TRUNCATE TABLE attendance RESTART IDENTITY`;
    console.log('✅ Table cleared.\n');
  }
  
  // Insert in batches
  console.log('Inserting records...');
  const BATCH = 200;
  let inserted = 0;
  
  for (let i = 0; i < allRecords.length; i += BATCH) {
    const batch = allRecords.slice(i, i + BATCH);
    
    // Build values string for raw insert
    const values = batch.map(r => {
      const dateStr = r.date.toISOString().split('T')[0];
      const hours = r.hours !== null ? r.hours : 'NULL';
      return `('${r.enrollment_no}', '${dateStr}', ${hours}, NULL)`;
    }).join(',\n');
    
    await prisma.$executeRawUnsafe(
      `INSERT INTO attendance (enrollment_no, date, hours, notes) VALUES ${values} ON CONFLICT DO NOTHING`
    );
    
    inserted += batch.length;
    process.stdout.write(`\r  Inserted ${inserted}/${allRecords.length}...`);
  }
  
  console.log('\n\n✅ Done! Attendance data seeded successfully.');
  
  // Final count
  const final = await prisma.$queryRaw`SELECT COUNT(*) as count FROM attendance`;
  console.log(`Total rows in attendance table: ${final[0].count}`);
}

main()
  .catch(e => {
    console.error('\n❌ Error:', e.message);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
