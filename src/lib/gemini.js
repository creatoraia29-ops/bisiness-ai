const SYSTEM_PROMPT = `Ты — консультант студии «Мох». Студия внедряет компаниям ИИ-помощников: они отвечают клиентам на сайте и в мессенджерах и мягко доводят диалог до заявки.

Факты о услуге:
- Ответ клиенту за секунды, даже ночью и в выходные.
- Помощник задаёт уточняющие вопросы и собирает контакты.
- Внедрение под нишу бизнеса: клиники, школы, сервисы, продажи.
- Заявки сразу попадают владельцу: в админку и Telegram.
- Срок типового запуска — от 5 до 14 дней.
- Стоимость обсуждается после короткого подбора задачи.

Правила общения:
- Отвечай по-русски, коротко и по делу, дружелюбно.
- Не выдумывай цены и гарантии, которых нет в фактах.
- После 1–2 полезных ответов мягко предложи короткий подбор или оставить заявку.
- Не дави и не повторяй призыв к заявке в каждом сообщении.

Ответь ТОЛЬКО валидным JSON без markdown:
{"reply":"текст ответа пользователю","suggestLead":true|false,"extractedName":"имя или пустая строка","extractedPhone":"телефон или пустая строка"}`;

function extractJson(text) {
  const trimmed = String(text || "").trim();
  try {
    return JSON.parse(trimmed);
  } catch {
    const match = trimmed.match(/\{[\s\S]*\}/);
    if (!match) return null;
    try {
      return JSON.parse(match[0]);
    } catch {
      return null;
    }
  }
}

export async function askGemini(messages) {
  const apiKey = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL || "gemini-3.5-flash-lite";

  if (!apiKey) {
    return {
      ok: false,
      error:
        "ИИ-помощник ещё не настроен. Добавьте GEMINI_API_KEY в .env.local или оставьте заявку через форму ниже.",
    };
  }

  const contents = messages
    .filter((message) => message.role === "user" || message.role === "assistant")
    .map((message) => ({
      role: message.role === "assistant" ? "model" : "user",
      parts: [{ text: message.content }],
    }));

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
      contents,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 512,
        responseMimeType: "application/json",
      },
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    const message =
      data?.error?.message ||
      `Gemini вернул ошибку ${response.status}. Проверьте модель и ключ API.`;
    return { ok: false, error: message };
  }

  const text = data?.candidates?.[0]?.content?.parts
    ?.map((part) => part.text || "")
    .join("")
    .trim();

  const parsed = extractJson(text);
  if (!parsed?.reply) {
    return {
      ok: true,
      reply:
        text ||
        "Могу рассказать про внедрение или помочь подобрать решение. Чем заняться?",
      suggestLead: true,
      extractedName: "",
      extractedPhone: "",
    };
  }

  return {
    ok: true,
    reply: String(parsed.reply),
    suggestLead: Boolean(parsed.suggestLead),
    extractedName: String(parsed.extractedName || "").trim(),
    extractedPhone: String(parsed.extractedPhone || "").trim(),
  };
}

export function looksLikePhone(value) {
  const digits = String(value || "").replace(/\D/g, "");
  return digits.length >= 10 && digits.length <= 15;
}
