import { NextResponse } from "next/server";
import { answerPortfolio } from "../../rag/answer";

export async function POST(req: Request) {
  const { message, lang } = await req.json().catch(() => ({}));

  if (typeof message !== "string" || !message.trim() || message.length > 500) {
    return NextResponse.json({ error: "Invalid message" }, { status: 400 });
  }

  return NextResponse.json({
    answer: answerPortfolio(message, lang === "id" ? "id" : "en"),
  });
}
