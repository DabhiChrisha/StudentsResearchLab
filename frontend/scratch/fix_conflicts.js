
import fs from 'fs';

const filePath = 'd:\\StudentsResearchLab\\frontend\\src\\pages\\Publications.jsx';
let content = fs.readFileSync(filePath, 'utf8');

// A function to resolve conflicts favoring "Stashed changes"
function resolveConflicts(text) {
    const lines = text.split('\n');
    const result = [];
    let inConflict = false;
    let inUpstream = false;
    let inStashed = false;
    let upstreamBuffer = [];
    let stashedBuffer = [];

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (line.includes('<<<<<<< Updated upstream')) {
            inConflict = true;
            inUpstream = true;
            upstreamBuffer = [];
            stashedBuffer = [];
        } else if (line.includes('=======') && inConflict) {
            inUpstream = false;
            inStashed = true;
        } else if (line.includes('>>>>>>> Stashed changes') && inConflict) {
            inConflict = false;
            inStashed = false;
            // Choose stashed
            result.push(...stashedBuffer);
        } else if (inConflict) {
            if (inUpstream) {
                upstreamBuffer.push(line);
            } else if (inStashed) {
                stashedBuffer.push(line);
            }
        } else {
            result.push(line);
        }
    }
    return result.join('\n');
}

let resolvedContent = resolveConflicts(content);

// Also add formatAuthors if missing (it's used in stashed version)
if (resolvedContent.includes('formatAuthors') && !resolvedContent.includes('function formatAuthors')) {
    resolvedContent = resolvedContent.replace(
        'function formatDate(raw) {',
        'function formatAuthors(authorsStr) {\n  if (!authorsStr) return [];\n  return authorsStr.split(",").map(a => a.trim());\n}\n\nfunction formatDate(raw) {'
    );
}

fs.writeFileSync(filePath, resolvedContent);
console.log('Merge conflicts resolved successfully.');
