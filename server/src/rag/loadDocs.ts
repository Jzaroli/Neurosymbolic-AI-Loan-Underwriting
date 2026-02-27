import * as PdfParse from 'pdf-parse-new';
import fs from 'fs';
import path from 'path';
// Cast to callable function for TypeScript

export async function parsePDF(filePath: string): Promise<string> {
    const buffer = fs.readFileSync(path.resolve(filePath));
    
    const parser = new PdfParse.SmartPDFParser({
        enableFastPath: true, // Optional: performance optimization
    });

    const result = await parser.parse(buffer);

    console.log('Parsed pages:', result.numpages);
    return result.text ?? '';
}

// still minimal but slightly more robust.
function cleanText(text: string): string {
  return text
    .replace(/^\s*(?:\[\d+\]\s*)?.+?\.{5,}\s*\d+\s*$/gm, "") // remove TOC lines first
    .split("\n")
    .map(l => l.trim())
    .filter(l => {
      if (!l) return false;
      const digits = l.replace(/[^0-9]/g, "").length;
      if (digits / l.length > 0.4) return false;
      if (l.length < 6) return false;
      if (l.split(/\s+/).length < 3) return false;
      return true;
    })
    .join("\n");
}

// Load all PDFs from ./files
export async function loadPDFs(): Promise<string[]> {
    const dir = path.join(process.cwd(), 'files');
    const files = fs.readdirSync(dir).filter((f) => f.endsWith('.pdf'));

  const docs: string[] = [];
  for (const file of files) {
    try {
      const text = await parsePDF(path.join(dir, file));
      const cleanedText = cleanText(text)
      docs.push(cleanedText);
    } catch (err) {
      console.error(`Failed to parse ${file}:`, err);
    }
  }

  console.log(`Loaded ${docs.length} documents.`);
  return docs;
}