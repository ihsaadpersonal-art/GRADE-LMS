"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Send } from "lucide-react";
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
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid gap-5 rounded-3xl border border-border bg-card p-5 shadow-[0_18px_45px_rgba(32,48,37,0.08)] sm:p-6"
    >
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.12em] text-primary">
          Enrolment request
        </p>
        <h2 className="mt-2 text-2xl font-semibold">Tell us about the student</h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Required fields help our academic team suggest the right course, batch, and mode.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Student name" required error={errors.studentName?.message}>
          <input {...register("studentName")} className="input" placeholder="Student full name" />
        </Field>
        <Field label="Parent name" required error={errors.parentName?.message}>
          <input {...register("parentName")} className="input" placeholder="Parent or guardian name" />
        </Field>
        <Field label="Student phone" required error={errors.studentPhone?.message}>
          <input {...register("studentPhone")} className="input" placeholder="01XXXXXXXXX" />
        </Field>
        <Field label="Parent phone" required error={errors.parentPhone?.message}>
          <input {...register("parentPhone")} className="input" placeholder="01XXXXXXXXX" />
        </Field>
        <Field label="WhatsApp number" required error={errors.whatsapp?.message}>
          <input {...register("whatsapp")} className="input" placeholder="Best WhatsApp number" />
        </Field>
        <Field label="Email optional" error={errors.email?.message}>
          <input {...register("email")} className="input" placeholder="name@example.com" />
        </Field>
        <Field label="Current level" required error={errors.currentLevel?.message}>
          <select {...register("currentLevel")} className="input">
            <option>SSC completed</option>
            <option>HSC 26</option>
            <option>Other</option>
          </select>
        </Field>
        <Field label="Version" required error={errors.version?.message}>
          <select {...register("version")} className="input">
            <option>Bangla Version</option>
            <option>English Version</option>
          </select>
        </Field>
        <Field label="Institution" required error={errors.institution?.message}>
          <input {...register("institution")} className="input" placeholder="School or college name" />
        </Field>
        <Field label="Interested programme" required error={errors.interestedProgramme?.message}>
          <select {...register("interestedProgramme")} className="input">
            <option>SSC-to-HSC Science Bridge Course</option>
            <option>HSC 26 Exam Ready Crash Course</option>
            <option>English Language Course</option>
          </select>
        </Field>
        <Field label="Preferred mode" required error={errors.preferredMode?.message}>
          <select {...register("preferredMode")} className="input">
            <option value="online">Online</option>
            <option value="offline">Offline</option>
            <option value="hybrid">Hybrid</option>
          </select>
        </Field>
        <Field label="How did you hear about GRADE?" required error={errors.source?.message}>
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
        <textarea
          {...register("message")}
          className="input min-h-28 resize-y"
          placeholder="Share preferred batch time, questions, or student needs."
        />
      </Field>
      {status !== "idle" ? (
        <div
          className={
            status === "success"
              ? "flex items-start gap-2 rounded-2xl border border-primary/20 bg-[#edf7ee] p-4 text-sm font-medium text-primary"
              : "rounded-2xl border border-danger/20 bg-[#fff6f6] p-4 text-sm font-medium text-danger"
          }
        >
          {status === "success" ? <CheckCircle2 className="mt-0.5 size-4 shrink-0" aria-hidden="true" /> : null}
          <span>{message}</span>
        </div>
      ) : null}
      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-[0_14px_32px_rgba(21,95,67,0.20)] hover:bg-[#104d36] disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Send className="size-4" aria-hidden="true" />
        {isSubmitting ? "Submitting..." : "Submit enrolment request"}
      </button>
    </form>
  );
}

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="grid gap-2 text-sm font-medium">
      <span>
        {label}
        {required ? <span className="text-danger"> *</span> : null}
      </span>
      {children}
      {error ? <span className="text-xs text-danger">{error}</span> : null}
    </label>
  );
}
