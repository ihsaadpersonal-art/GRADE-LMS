import { NextResponse } from "next/server";
import { leadSchema, type LeadInput } from "@/lib/lead-schema";
import { createSupabaseServiceClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);
  const parsed = leadSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, errors: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const supabase = createSupabaseServiceClient();
  const message = buildLeadMessage(parsed.data);

  if (supabase) {
    const { error } = await supabase.from("leads").insert({
      student_name: parsed.data.studentName,
      parent_name: parsed.data.parentName,
      student_phone: parsed.data.studentPhone,
      parent_phone: parsed.data.parentPhone,
      whatsapp: parsed.data.whatsapp,
      email: parsed.data.email || null,
      current_level: parsed.data.currentLevel,
      version: parsed.data.version,
      institution: parsed.data.institution,
      interested_programme: parsed.data.interestedProgramme,
      preferred_mode: parsed.data.preferredMode,
      source: parsed.data.source,
      message,
      status: "new",
    });

    if (error) {
      return NextResponse.json({ ok: false, message: error.message }, { status: 500 });
    }
  }

  return NextResponse.json({
    ok: true,
    message: supabase
      ? "Lead saved."
      : "Lead validated locally. Add Supabase env vars to persist it.",
  });
}

function buildLeadMessage(data: LeadInput) {
  const baseMessage = data.message?.trim() ?? "";
  const paymentMethod = data.paymentMethod?.trim() ?? "";
  const transactionId = data.transactionId?.trim() ?? "";
  const paymentSenderNumber = data.paymentSenderNumber?.trim() ?? "";
  const proofUrl = data.proofUrl?.trim() ?? "";

  const paymentLines = [
    paymentMethod ? `Method: ${paymentMethod}` : null,
    transactionId ? `Transaction ID: ${transactionId}` : null,
    paymentSenderNumber ? `Sender number: ${paymentSenderNumber}` : null,
    proofUrl ? `Proof URL: ${proofUrl}` : null,
  ].filter((line): line is string => Boolean(line));

  if (paymentLines.length === 0) {
    return baseMessage || null;
  }

  const paymentInformation = ["Payment information:", ...paymentLines].join("\n");

  return [baseMessage, paymentInformation].filter(Boolean).join("\n\n");
}
