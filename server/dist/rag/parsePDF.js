import fs from 'fs';
import path from 'path';
let pdfParse;
async function loadPdfParse() {
    const mod = await import('pdf-parse'); // dynamic import
    pdfParse = mod.default || mod; // callable
}
export async function parsePDF(filePath) {
    if (!pdfParse) {
        await loadPdfParse();
    }
    const buffer = fs.readFileSync(path.resolve(filePath));
    const data = await pdfParse(buffer);
    return data.text;
}
