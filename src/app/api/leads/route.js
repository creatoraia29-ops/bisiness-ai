import { NextResponse } from "next/server";
import { createLead } from "@/lib/leads";
import { sendTelegramLead } from "@/lib/telegram";
import { looksLikePhone } from "@/lib/gemini";

export async function POST(request) {
  try {
    const body = await request.json();
    const name = String(body.name || "").trim();
    const phone = String(body.phone || "").trim();
    const company = String(body.company || "").trim();
    const message = String(body.message || "").trim();
    const source = ["form", "quiz", "chat"].includes(body.source)
      ? body.source
      : "form";

    if (!name || name.length < 2) {
      return NextResponse.json(
        { ok: false, error: "Укажите имя" },
        { status: 400 }
      );
    }

    if (!looksLikePhone(phone)) {
      return NextResponse.json(
        { ok: false, error: "Укажите корректный телефон" },
        { status: 400 }
      );
    }

    const telegram = await sendTelegramLead({
      name,
      phone,
      company,
      message,
      source,
    });

    const lead = await createLead({
      name,
      phone,
      company,
      message,
      source,
      telegramSent: telegram.ok,
      telegramError: telegram.ok ? null : telegram.error,
    });

    return NextResponse.json({
      ok: true,
      lead: { id: lead.id },
      telegramSent: telegram.ok,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error ? error.message : "Не удалось сохранить заявку",
      },
      { status: 500 }
    );
  }
}
