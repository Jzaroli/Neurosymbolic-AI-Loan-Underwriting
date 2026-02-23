import fs from 'fs';
import path from 'path';
// import pdf from 'pdf-parse';
const pdf = require('pdf-parse');

// pdf parsing and chart noise removal
function cleanText(text: string): string {
  const lines = text.split("\n");

  return lines
    .map(l => l.trim())
    .filter(l => {
      if (!l) return false;

      // Remove mostly numeric lines (charts / tables)
      const digits = l.replace(/[^0-9]/g, '').length;
      const digitRatio = digits / l.length;
      if (digitRatio > 0.4) return false;

      // Remove very short fragments
      if (l.length < 6) return false;

      // Remove lines with too few words
      if (l.split(/\s+/).length < 3) return false;

      return true;
    })
    .join("\n");
}

export async function loadPDFs(): Promise<string[]> {
  const dir = path.join(process.cwd(), 'files');
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.pdf'));

  const docs: string[] = [];

  for (const file of files) {
    const buffer = fs.readFileSync(path.join(dir, file));
    const data = await pdf(buffer);
    docs.push(cleanText(data.text));
  }
  console.log('Start of doc-ren', docs)
  return docs;
}