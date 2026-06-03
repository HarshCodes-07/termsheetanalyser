import { NextResponse } from "next/server";
import { MAX_FILE_BYTES } from "@/lib/constants";
import { extractPdfText } from "@/lib/pdf";

export const runtime = "nodejs";
export const maxDuration = 30;

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
    return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
  }

  if (file.size > MAX_FILE_BYTES) {
    return NextResponse.json(
      { error: "File is too large. Please upload a file under 10MB." },
      { status: 400 }
    );
  }

  const name = file.name.toLowerCase();
  const isPdf = file.type === "application/pdf" || name.endsWith(".pdf");
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

      let text: string;
      try {
        text = await extractPdfText(buffer);
      } catch (err) {
        const code = err instanceof Error ? err.message : "";
        if (code === "INVALID_PDF") {
          return NextResponse.json(
            {
              error:
                "This file doesn't appear to be a valid PDF. Try a text-based PDF or paste the text manually.",
            },
            { status: 422 }
          );
        }
        if (code === "PDF_PARSE_TIMEOUT") {
          return NextResponse.json(
            {
              error:
                "PDF parsing took too long. Try a smaller file or paste the text manually.",
            },
            { status: 422 }
          );
        }
        throw err;
      }

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
    }

    return NextResponse.json(
      {
        error:
          "Unsupported file type. Please upload a .pdf or .txt file. (DOC/DOCX coming soon.)",
      },
      { status: 415 }
    );
  } catch (err) {
    console.error("[extract] error:", err);
    return NextResponse.json(
      {
        error:
          "Could not extract text from the file. Please try a different file or paste the text manually.",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ error: "Method not allowed." }, { status: 405 });
}
