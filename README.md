# Мох — лендинг с ИИ для сбора заявок

Продающий сайт студии внедрения ИИ «Мох» на Next.js: лендинг, помощник на Gemini, админка `/admin` и дублирование заявок в Telegram.

## Запуск

```bash
npm install
cp .env.example .env.local
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000). Админка: [http://localhost:3000/admin](http://localhost:3000/admin).

## Переменные окружения

| Переменная | Назначение |
|---|---|
| `GEMINI_API_KEY` | Ключ Google AI для помощника |
| `GEMINI_MODEL` | Модель, по умолчанию `gemini-3.5-flash-lite` |
| `TELEGRAM_BOT_TOKEN` | Токен бота от @BotFather |
| `TELEGRAM_CHAT_ID` | ID чата или группы для заявок |
| `ADMIN_PASSWORD` | Пароль входа в `/admin` |
| `ADMIN_SECRET` | Секрет подписи cookie сессии |

Как получить `TELEGRAM_CHAT_ID`: напишите боту `/start` (или добавьте в группу), затем откройте `https://api.telegram.org/bot<token>/getUpdates` и возьмите `chat.id`.

## Стек

- Next.js (App Router) + JavaScript
- framer-motion — параллакс и появление секций
- Gemini API — чат-помощник
- Локальный `data/leads.json` — хранение заявок
