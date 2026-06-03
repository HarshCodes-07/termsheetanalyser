import {
  MAX_PDF_PAGES,
  PDF_PARSE_TIMEOUT_MS,
} from "./constants";

export function isPdfMagicBuffer(buffer: Buffer): boolean {
  return buffer.length >= 4 && buffer.subarray(0, 4).toString("ascii") === "%PDF";
}

export async function extractPdfText(buffer: Buffer): Promise<string> {
  if (!isPdfMagicBuffer(buffer)) {
    throw new Error("INVALID_PDF");
  }

  const { PDFParse } = await import("pdf-parse");
  const parser = new PDFParse({ data: buffer });

  try {
    const result = await Promise.race([
      parser.getText({ first: MAX_PDF_PAGES }),
      new Promise<never>((_, reject) =>
        setTimeout(
          () => reject(new Error("PDF_PARSE_TIMEOUT")),
          PDF_PARSE_TIMEOUT_MS
        )
      ),
    ]);
    return (result.text ?? "").trim();
  } finally {
    await parser.destroy().catch(() => {});
  }
}
