import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 30;

const MAX_FILE_BYTES = 10 * 1024 * 1024;

export async function POST(request: Request) {
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json(
      { error: "Expected multipart/form-data with a 'file' field." },
      { status: 400 }
    );
  }

  const file = formData.get("file");
  if (!file || !(file instanceof File)) {
    return NextResponse.json(
      { error: "No file uploaded." },
      { status: 400 }
    );
  }

  if (file.size > MAX_FILE_BYTES) {
    return NextResponse.json(
      { error: "File is too large. Please upload a file under 10MB." },
      { status: 400 }
    );
  }

  const name = file.name.toLowerCase();
  const isPdf =
    file.type === "application/pdf" || name.endsWith(".pdf");
  const isTxt =
    file.type === "text/plain" ||
    name.endsWith(".txt") ||
    name.endsWith(".md");

  try {
    if (isTxt) {
      const text = await file.text();
      return NextResponse.json({ text, kind: "txt" });
    }

    if (isPdf) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const { PDFParse } = await import("pdf-parse");
      const parser = new PDFParse({ data: buffer });
      try {
        const result = await parser.getText();
        const text = (result.text ?? "").trim();
        if (!text) {
          return NextResponse.json(
            {
              error:
                "Could not extract readable text from this PDF. If it's scanned, try a text-based version or paste the text manually.",
            },
            { status: 422 }
          );
        }
        return NextResponse.json({ text, kind: "pdf" });
      } finally {
        await parser.destroy().catch(() => {});
      }
    }

    return NextResponse.json(
      {
        error:
          "Unsupported file type. For this prototype, please upload a .pdf or .txt file. (DOC/DOCX coming soon.)",
      },
      { status: 415 }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      {
        error: `Could not extract text from the file. ${message}`,
      },
      { status: 500 }
    );
  }
}
