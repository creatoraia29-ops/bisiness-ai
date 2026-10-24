export async function sendTelegramLead(lead) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    return {
      ok: false,
      error: "Telegram не настроен: задайте TELEGRAM_BOT_TOKEN и TELEGRAM_CHAT_ID",
    };
  }

  const sourceLabel = {
    form: "Форма на сайте",
    quiz: "Квиз помощника",
    chat: "Чат с ИИ",
  };

  const lines = [
    "🌱 Новая заявка — Мох",
    "",
    `Источник: ${sourceLabel[lead.source] || lead.source}`,
    `Имя: ${lead.name || "—"}`,
    `Телефон: ${lead.phone || "—"}`,
  ];

  if (lead.company) lines.push(`Компания: ${lead.company}`);
  if (lead.message) lines.push("", lead.message);

  const text = lines.join("\n");

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          disable_web_page_preview: true,
        }),
      }
    );

    const data = await response.json();
    if (!response.ok || !data.ok) {
      return {
        ok: false,
        error: data.description || `Telegram HTTP ${response.status}`,
      };
    }

    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Ошибка отправки в Telegram",
    };
  }
}
