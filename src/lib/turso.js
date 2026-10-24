import { createClient } from "@libsql/client";

let client;
let schemaReady = false;

export function getTurso() {
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!url || !authToken) {
    throw new Error(
      "Turso не настроен: задайте TURSO_DATABASE_URL и TURSO_AUTH_TOKEN"
    );
  }

  if (!client) {
    client = createClient({ url, authToken });
  }

  return client;
}

export async function ensureLeadsTable() {
  if (schemaReady) return;

  const db = getTurso();
  await db.execute(`
    CREATE TABLE IF NOT EXISTS leads (
      id TEXT PRIMARY KEY,
      created_at TEXT NOT NULL,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      company TEXT,
      message TEXT,
      source TEXT NOT NULL DEFAULT 'form',
      status TEXT NOT NULL DEFAULT 'new',
      telegram_sent INTEGER NOT NULL DEFAULT 0,
      telegram_error TEXT
    )
  `);
  schemaReady = true;
}

export function mapLeadRow(row) {
  return {
    id: row.id,
    createdAt: row.created_at,
    name: row.name,
    phone: row.phone,
    company: row.company || "",
    message: row.message || "",
    source: row.source,
    status: row.status,
    telegramSent: Boolean(row.telegram_sent),
    telegramError: row.telegram_error || null,
  };
}
