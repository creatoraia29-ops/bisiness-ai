import { randomUUID } from "crypto";
import { ensureLeadsTable, getTurso, mapLeadRow } from "./turso";

export async function readLeads() {
  await ensureLeadsTable();
  const result = await getTurso().execute(
    "SELECT * FROM leads ORDER BY created_at DESC"
  );
  return result.rows.map(mapLeadRow);
}

export async function createLead(payload) {
  await ensureLeadsTable();

  const lead = {
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    name: String(payload.name || "").trim(),
    phone: String(payload.phone || "").trim(),
    company: String(payload.company || "").trim(),
    message: String(payload.message || "").trim(),
    source: payload.source || "form",
    status: "new",
    telegramSent: Boolean(payload.telegramSent),
    telegramError: payload.telegramError || null,
  };

  await getTurso().execute({
    sql: `INSERT INTO leads (
      id, created_at, name, phone, company, message, source, status, telegram_sent, telegram_error
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [
      lead.id,
      lead.createdAt,
      lead.name,
      lead.phone,
      lead.company,
      lead.message,
      lead.source,
      lead.status,
      lead.telegramSent ? 1 : 0,
      lead.telegramError,
    ],
  });

  return lead;
}

export async function updateLeadStatus(id, status) {
  await ensureLeadsTable();
  const db = getTurso();

  await db.execute({
    sql: "UPDATE leads SET status = ? WHERE id = ?",
    args: [status, id],
  });

  const result = await db.execute({
    sql: "SELECT * FROM leads WHERE id = ?",
    args: [id],
  });

  if (!result.rows.length) return null;
  return mapLeadRow(result.rows[0]);
}
