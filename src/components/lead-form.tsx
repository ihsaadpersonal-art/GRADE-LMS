"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send } from "lucide-react";
import { useForm } from "react-hook-form";
import { leadSchema, type LeadInput } from "@/lib/lead-schema";

const defaultValues: LeadInput = {
  studentName: "",
  parentName: "",
  studentPhone: "",
  parentPhone: "",
  whatsapp: "",
  email: "",
  currentLevel: "SSC completed",
  version: "Bangla Version",
  institution: "",
  interestedProgramme: "SSC-to-HSC Science Bridge Course",
  preferredMode: "online",
  source: "Facebook",
  message: "",
};

export function LeadForm({ programme = defaultValues.interestedProgramme }: { programme?: string }) {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LeadInput>({
    resolver: zodResolver(leadSchema),
    defaultValues: { ...defaultValues, interestedProgramme: programme },
  });

  async function onSubmit(values: LeadInput) {
    setStatus("idle");
    const response = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const data = (await response.json()) as { ok: boolean; message?: string };
    if (!response.ok || !data.ok) {
      setStatus("error");
      setMessage(data.message ?? "Could not submit enrolment request.");
      return;
    }
    setStatus("success");
    setMessage(data.message ?? "Enrolment request submitted.");
    reset({ ...defaultValues, interestedProgramme: programme });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 rounded-lg border border-border bg-card p-5 shadow-sm">
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Student name" error={errors.studentName?.message}>
          <input {...register("studentName")} className="input" />
        </Field>
        <Field label="Parent name" error={errors.parentName?.message}>
          <input {...register("parentName")} className="input" />
        </Field>
        <Field label="Student phone" error={errors.studentPhone?.message}>
          <input {...register("studentPhone")} className="input" />
        </Field>
        <Field label="Parent phone" error={errors.parentPhone?.message}>
          <input {...register("parentPhone")} className="input" />
        </Field>
        <Field label="WhatsApp number" error={errors.whatsapp?.message}>
          <input {...register("whatsapp")} className="input" />
        </Field>
        <Field label="Email optional" error={errors.email?.message}>
          <input {...register("email")} className="input" />
        </Field>
        <Field label="Current level" error={errors.currentLevel?.message}>
          <select {...register("currentLevel")} className="input">
            <option>SSC completed</option>
            <option>HSC 26</option>
            <option>Other</option>
          </select>
        </Field>
        <Field label="Version" error={errors.version?.message}>
          <select {...register("version")} className="input">
            <option>Bangla Version</option>
            <option>English Version</option>
          </select>
        </Field>
        <Field label="Institution" error={errors.institution?.message}>
          <input {...register("institution")} className="input" />
        </Field>
        <Field label="Interested programme" error={errors.interestedProgramme?.message}>
          <select {...register("interestedProgramme")} className="input">
            <option>SSC-to-HSC Science Bridge Course</option>
            <option>HSC 26 Exam Ready Crash Course</option>
            <option>English Language Course</option>
          </select>
        </Field>
        <Field label="Preferred mode" error={errors.preferredMode?.message}>
          <select {...register("preferredMode")} className="input">
            <option value="online">Online</option>
            <option value="offline">Offline</option>
            <option value="hybrid">Hybrid</option>
          </select>
        </Field>
        <Field label="How did you hear about GRADE?" error={errors.source?.message}>
          <select {...register("source")} className="input">
            <option>Facebook</option>
            <option>YouTube</option>
            <option>WhatsApp</option>
            <option>Referral</option>
            <option>Organic</option>
            <option>Offline</option>
          </select>
        </Field>
      </div>
      <Field label="Message" error={errors.message?.message}>
        <textarea {...register("message")} className="input min-h-28 resize-y" />
      </Field>
      {status !== "idle" ? (
        <p className={status === "success" ? "text-sm font-medium text-primary" : "text-sm font-medium text-danger"}>
          {message}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-[#164d3a] disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Send className="size-4" aria-hidden="true" />
        {isSubmitting ? "Submitting..." : "Submit enrolment request"}
      </button>
    </form>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="grid gap-1.5 text-sm font-medium">
      <span>{label}</span>
      {children}
      {error ? <span className="text-xs text-danger">{error}</span> : null}
    </label>
  );
}
