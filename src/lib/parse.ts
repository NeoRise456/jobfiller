import { getDocumentProxy, extractText as pdfText } from "unpdf";
import mammoth from "mammoth";

export async function extractText(
  buf: ArrayBuffer,
  mime: string,
  filename: string,
): Promise<string> {
  const ext = filename.toLowerCase().split(".").pop() ?? "";
  if (ext === "pdf" || mime === "application/pdf") {
    const pdf = await getDocumentProxy(new Uint8Array(buf));
    try {
      const { text } = await pdfText(pdf, { mergePages: true });
      return text.trim();
    } finally {
      await pdf.cleanup();
    }
  }
  if (ext === "docx" || mime.includes("wordprocessingml")) {
    const r = await mammoth.extractRawText({ buffer: Buffer.from(buf) });
    return r.value.trim();
  }
  if (ext === "txt" || ext === "md" || mime.startsWith("text/")) {
    return new TextDecoder().decode(buf).trim();
  }
  throw new Error("Unsupported file. Use PDF, DOCX, or TXT.");
}
