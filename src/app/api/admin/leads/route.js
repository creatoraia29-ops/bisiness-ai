import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { readLeads, updateLeadStatus } from "@/lib/leads";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const leads = await readLeads();
  return NextResponse.json({ ok: true, leads });
}

export async function PATCH(request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const id = String(body.id || "");
    const status = body.status === "in_progress" ? "in_progress" : "new";

    const lead = await updateLeadStatus(id, status);
    if (!lead) {
      return NextResponse.json(
        { ok: false, error: "Заявка не найдена" },
        { status: 404 }
      );
    }

    return NextResponse.json({ ok: true, lead });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Не удалось обновить статус" },
      { status: 500 }
    );
  }
}
