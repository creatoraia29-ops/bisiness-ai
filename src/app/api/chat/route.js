import { NextResponse } from "next/server";
import { askGemini, looksLikePhone } from "@/lib/gemini";
import { createLead } from "@/lib/leads";
import { sendTelegramLead } from "@/lib/telegram";

export async function POST(request) {
  try {
    const body = await request.json();
    const messages = Array.isArray(body.messages) ? body.messages : [];

    if (!messages.length) {
      return NextResponse.json(
        { ok: false, error: "Пустой диалог" },
        { status: 400 }
      );
    }

    const safeMessages = messages
      .slice(-12)
      .map((message) => ({
        role: message.role === "assistant" ? "assistant" : "user",
        content: String(message.content || "").slice(0, 2000),
      }))
      .filter((message) => message.content);

    const result = await askGemini(safeMessages);
    if (!result.ok) {
      return NextResponse.json(
        { ok: false, error: result.error },
        { status: 503 }
      );
    }

    let leadCreated = false;
    const phone = result.extractedPhone;
    if (looksLikePhone(phone)) {
      const name = result.extractedName || "Клиент из чата";
      const transcript = safeMessages
        .map((message) => `${message.role === "user" ? "Клиент" : "Мох"}: ${message.content}`)
        .join("\n");

      const telegram = await sendTelegramLead({
        name,
        phone,
        company: "",
        message: transcript.slice(0, 1500),
        source: "chat",
      });

      await createLead({
        name,
        phone,
        company: "",
        message: transcript.slice(0, 1500),
        source: "chat",
        telegramSent: telegram.ok,
        telegramError: telegram.ok ? null : telegram.error,
      });

      leadCreated = true;
    }

    return NextResponse.json({
      ok: true,
      reply: result.reply,
      suggestLead: result.suggestLead || leadCreated,
      leadCreated,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Ошибка чата",
      },
      { status: 500 }
    );
  }
}
