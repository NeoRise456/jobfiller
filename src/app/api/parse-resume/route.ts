import { NextRequest, NextResponse } from "next/server";
import { extractText } from "@/lib/parse";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "file required" }, { status: 400 });
    }
    const text = await extractText(await file.arrayBuffer(), file.type, file.name);
    if (!text) return NextResponse.json({ error: "No text extracted. Scanned PDF? Use a text-based file." }, { status: 422 });
    return NextResponse.json({ text, filename: file.name });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Parse failed" },
      { status: 422 },
    );
  }
}
