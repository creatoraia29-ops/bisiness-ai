import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";

const DATA_DIR = path.join(process.cwd(), "data");
const LEADS_FILE = path.join(DATA_DIR, "leads.json");

async function ensureStore() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(LEADS_FILE);
  } catch {
    await fs.writeFile(LEADS_FILE, "[]", "utf8");
  }
}

export async function readLeads() {
  await ensureStore();
  const raw = await fs.readFile(LEADS_FILE, "utf8");
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function writeLeads(leads) {
  await ensureStore();
  await fs.writeFile(LEADS_FILE, JSON.stringify(leads, null, 2), "utf8");
}

export async function createLead(payload) {
  const leads = await readLeads();
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

  leads.unshift(lead);
  await writeLeads(leads);
  return lead;
}

export async function updateLeadStatus(id, status) {
  const leads = await readLeads();
  const index = leads.findIndex((lead) => lead.id === id);
  if (index === -1) return null;

  leads[index] = { ...leads[index], status };
  await writeLeads(leads);
  return leads[index];
}
