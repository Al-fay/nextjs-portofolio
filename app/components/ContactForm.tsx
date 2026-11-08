"use client";

import {
  motion,
  AnimatePresence,
  useAnimationControls,
  useReducedMotion,
} from "motion/react";
import { Language, TranslationDict } from "../types";
import {
  IconAlertCircle,
  IconCheckupList,
  IconCopy,
  IconCopyCheck,
  IconLoader3,
  IconMail,
  IconMapPin,
  IconSendFilled,
  IconShieldCheck,
} from "@tabler/icons-react";
import { useState } from "react";

interface ContactFormProps {
  lang: Language;
  dict: TranslationDict;
}

interface FormState {
  name: string;
  email: string;
  company: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const EMAIL_ADDRESS = "divaalfahrizy02878@gmail.com";
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbx56DQXzbcWRCd34h_CjiBNGIKKuA1XH1B99VsJth6iWrT7v_-F6PnyaM46pVJb29kN/exec";
const EMPTY_FORM: FormState = { name: "", email: "", company: "", message: "" };

const CARD =
  "group relative overflow-hidden rounded-2xl border border-neutral-200/70 bg-white/90 shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-[#111113]/90";
const LABEL =
  "block text-[10px] font-mono uppercase tracking-widest text-neutral-500 dark:text-white/50";

const moveSpot = (e: React.MouseEvent<HTMLElement>) => {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
};

const SpotOverlay: React.FC = () => (
  <span
    aria-hidden="true"
    className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
    style={{
      background:
        "radial-gradient(300px circle at var(--mx, 50%) var(--my, 50%), rgba(245,158,11,0.12), transparent 70%)",
    }}
  />
);

interface FieldProps {
  id: string;
  name: keyof FormState;
  label: string;
  value: string;
  placeholder: string;
  disabled: boolean;
  touched: boolean;
  error?: string;
  required?: boolean;
  optionalText?: string;
  requiredText?: string;
  invalidText?: string;
  completeText: string;
  type?: string;
  multiline?: boolean;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const Field: React.FC<FieldProps> = ({
  id,
  name,
  label,
  value,
  placeholder,
  disabled,
  touched,
  error,
  required,
  optionalText,
  requiredText,
  invalidText,
  completeText,
  type = "text",
  multiline,
  onChange,
  onBlur,
}) => {
  const hasError = touched && !!error;
  const isValid = touched && !error && (required || value.trim().length > 0);
  const errorId = `${id}-error`;

  const stateClass = hasError
    ? "border-red-500/60 focus:border-red-500 focus:ring-red-500/20"
    : isValid
      ? "border-emerald-500/50 focus:border-emerald-500/80 focus:ring-emerald-500/20"
      : "border-neutral-200 dark:border-white/10 focus:border-amber-500/60 focus:ring-amber-500/20";

  const inputClass = `w-full rounded-xl border bg-white/60 py-3 pl-4 pr-11 font-sans text-base font-light text-neutral-800 placeholder-neutral-400 transition-all duration-200 focus:outline-none focus:ring-4 disabled:opacity-60 dark:bg-white/[0.02] dark:text-white dark:placeholder-white/25 md:text-sm ${stateClass} ${
    multiline ? "resize-none" : ""
  }`;

  const statusText = hasError
    ? error === undefined
      ? ""
      : name === "email" && value.trim()
        ? invalidText
        : requiredText
    : isValid
      ? completeText
      : "";

  const common = {
    id,
    name,
    value,
    onChange,
    onBlur,
    placeholder,
    disabled,
    "aria-invalid": hasError,
    "aria-describedby": hasError ? errorId : undefined,
    "aria-required": required,
    className: inputClass,
  };

  return (
    <div id={`fg-${name}`}>
      <div className="mb-2 flex items-center justify-between">
        <label htmlFor={id} className={LABEL}>
          {label}
          {required && (
            <span
              aria-hidden="true"
              className="ml-1 text-amber-600 dark:text-amber-400"
            >
              *
            </span>
          )}
        </label>
        <AnimatePresence mode="wait" initial={false}>
          {optionalText && !touched ? (
            <motion.span
              key="optional"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-[9px] font-mono uppercase tracking-wider text-neutral-400 dark:text-white/35"
            >
              {optionalText}
            </motion.span>
          ) : statusText ? (
            <motion.span
              key={statusText}
              initial={{ opacity: 0, x: 6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 6 }}
              className={`text-[9px] font-mono uppercase tracking-wider ${
                hasError
                  ? "text-red-600 dark:text-red-400"
                  : "text-emerald-600 dark:text-emerald-400"
              }`}
            >
              {statusText}
            </motion.span>
          ) : null}
        </AnimatePresence>
      </div>

      <div className="relative">
        {multiline ? (
          <textarea {...common} rows={4} />
        ) : (
          <input {...common} type={type} />
        )}
        <div
          className={`pointer-events-none absolute right-3.5 flex items-center ${
            multiline ? "top-3.5" : "top-1/2 -translate-y-1/2"
          }`}
          aria-hidden="true"
        >
          <AnimatePresence mode="wait" initial={false}>
            {hasError && (
              <motion.span
                key="err"
                initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.5 }}
                className="text-red-500"
              >
                <IconAlertCircle className="h-4 w-4" />
              </motion.span>
            )}
            {isValid && (
              <motion.span
                key="ok"
                initial={{ opacity: 0, scale: 0.5, rotate: 20 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.5 }}
                className="text-emerald-500"
              >
                <IconCheckupList className="h-4 w-4" />
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="mt-1.5 min-h-[1.1rem]">
        <AnimatePresence>
          {hasError && (
            <motion.div
              key="msg"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              role="alert"
              id={errorId}
              className="flex items-center gap-1.5 text-[11px] font-mono text-red-600 dark:text-red-400"
            >
              <IconAlertCircle
                className="h-3 w-3 shrink-0"
                aria-hidden="true"
              />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const SuccessBurst: React.FC<{ reduce: boolean | null }> = ({ reduce }) => (
  <div
    className="relative flex h-20 w-20 items-center justify-center"
    id="success-icon-wrapper"
  >
    {!reduce &&
      Array.from({ length: 10 }).map((_, i) => {
        const angle = (i / 10) * Math.PI * 2;
        return (
          <motion.span
            key={i}
            aria-hidden="true"
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{
              x: Math.cos(angle) * 56,
              y: Math.sin(angle) * 56,
              opacity: 0,
              scale: 0.3,
            }}
            transition={{ duration: 0.9, delay: 0.25, ease: "easeOut" }}
            className={`absolute h-1.5 w-1.5 rounded-full ${
              i % 2 === 0 ? "bg-emerald-400" : "bg-amber-400"
            }`}
          />
        );
      })}
    <motion.span
      aria-hidden="true"
      initial={reduce ? false : { scale: 0.6, opacity: 0.8 }}
      animate={reduce ? undefined : { scale: 1.8, opacity: 0 }}
      transition={{ duration: 1, ease: "easeOut" }}
      className="absolute inset-0 rounded-full border-2 border-emerald-500/60"
    />
    <motion.div
      initial={reduce ? false : { scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 16 }}
      className="relative flex h-16 w-16 items-center justify-center rounded-full border border-emerald-500/40 bg-emerald-500/10"
    >
      <svg
        viewBox="0 0 24 24"
        className="h-8 w-8"
        fill="none"
        aria-hidden="true"
      >
        <motion.path
          d="M5 12.5l4.5 4.5L19 7.5"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-emerald-500"
          initial={reduce ? false : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.5, delay: 0.25, ease: "easeOut" }}
        />
      </svg>
    </motion.div>
  </div>
);

export const ContactForm: React.FC<ContactFormProps> = ({ lang, dict }) => {
  const reduce = useReducedMotion();
  const shake = useAnimationControls();

  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSending, setIsSending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [copied, setCopied] = useState(false);

  const t = {
    required: lang === "en" ? "Required" : "Wajib diisi",
    invalid: lang === "en" ? "Invalid" : "Tidak valid",
    complete: lang === "en" ? "Complete" : "Lengkap",
    optional: lang === "id" ? "Opsional" : "Optional",
    channels: lang === "en" ? "Direct Channels" : "Saluran Langsung",
    copy: lang === "en" ? "Copy email" : "Salin email",
    copiedText: lang === "en" ? "Copied" : "Tersalin",
    sendFail:
      lang === "en"
        ? "Message could not be sent. Please try again or email me directly."
        : "Pesan gagal dikirim. Coba lagi atau kirim langsung lewat email.",
    ndaTitle: "NDAs & IP Protection",
    ndaBody:
      lang === "en"
        ? "All initial communications and code consultations are protected under mutual non-disclosure agreements. Intellectual property is fully assigned upon milestones."
        : "Seluruh komunikasi awal dan konsultasi kode dilindungi oleh klausul kerahasiaan bersama. Hak Kekayaan Intelektual dialihkan penuh setelah milestone selesai.",
    another: lang === "en" ? "Transmit Another Inquiry" : "Kirim Pesan Lainnya",
  };

  const getFieldError = (name: string, value: string): string | undefined => {
    if (name === "name" || name === "message") {
      return value.trim() ? undefined : dict.contact.errorRequired;
    }
    if (name === "email") {
      if (!value.trim()) return dict.contact.errorRequired;
      return EMAIL_REGEX.test(value) ? undefined : dict.contact.errorEmail;
    }
    return undefined;
  };

  const validate = (): boolean => {
    const next: FormErrors = {
      name: getFieldError("name", form.name),
      email: getFieldError("email", form.email),
      message: getFieldError("message", form.message),
    };

    setTouched({ name: true, email: true, company: true, message: true });
    setErrors(next);

    const firstInvalid = (["name", "email", "message"] as const).find(
      (key) => next[key],
    );
    if (firstInvalid) {
      if (!reduce) {
        shake.start({
          x: [0, -8, 8, -5, 5, 0],
          transition: { duration: 0.4 },
        });
      }
      document.getElementById(`input-${firstInvalid}`)?.focus();
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitError(false);
    setIsSending(true);

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("email", form.email);
    formData.append("company", form.company);
    formData.append("message", form.message);

    try {
      const response = await fetch(SCRIPT_URL, {
        method: "POST",
        body: formData,
      });
      const result = (await response.text()).trim();

      if (result !== "success") {
        throw new Error("Gagal mengirim");
      }

      setIsSuccess(true);
      setForm(EMPTY_FORM);
      setTouched({});
      setErrors({});
    } catch {
      setSubmitError(true);
    } finally {
      setIsSending(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (submitError) setSubmitError(false);
    if (touched[name]) {
      setErrors((prev) => ({ ...prev, [name]: getFieldError(name, value) }));
    }
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: getFieldError(name, value) }));
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL_ADDRESS);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  const fieldProps = {
    disabled: isSending,
    completeText: t.complete,
    requiredText: t.required,
    invalidText: t.invalid,
    onChange: handleInputChange,
    onBlur: handleBlur,
  };

  return (
    <section
      className="relative overflow-hidden border-t border-neutral-100 bg-neutral-50 py-24 transition-colors duration-300 scroll-mt-24 dark:border-white/5 dark:bg-[#0A0A0B]"
      id="contact-section"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.04)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)] dark:bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)]"
      />
      <motion.div
        aria-hidden="true"
        animate={
          reduce
            ? undefined
            : { x: [0, 40, 0], y: [0, 24, 0], opacity: [0.45, 0.85, 0.45] }
        }
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute -top-20 right-1/4 h-72 w-72 rounded-full bg-amber-500/15 blur-[90px]"
      />
      <motion.div
        aria-hidden="true"
        animate={
          reduce
            ? undefined
            : { x: [0, -40, 0], y: [0, -20, 0], opacity: [0.35, 0.7, 0.35] }
        }
        transition={{ duration: 17, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute -bottom-24 left-1/4 h-72 w-72 rounded-full bg-orange-500/10 blur-[90px]"
      />

      <div
        className="relative mx-auto max-w-7xl px-6 md:px-8"
        id="contact-wrapper"
      >
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: EASE }}
          className="mb-16 text-center"
          id="contact-header"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white/70 px-3.5 py-1.5 text-[10px] font-mono uppercase tracking-wider text-neutral-600 backdrop-blur-sm dark:border-white/10 dark:bg-white/5 dark:text-white/60">
            <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
              <span className="absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-60 animate-ping motion-reduce:animate-none" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-amber-500" />
            </span>
            {dict.nav.contact}
          </span>
          <h2
            className="mt-5 font-sans text-3xl font-light tracking-tight text-neutral-900 dark:text-white md:text-4xl lg:text-5xl"
            id="contact-title"
          >
            <motion.span
              animate={
                reduce
                  ? undefined
                  : { backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }
              }
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              style={{ backgroundSize: "200% 200%" }}
              className="bg-gradient-to-r from-neutral-900 via-amber-600 to-neutral-900 bg-clip-text text-transparent dark:from-white dark:via-amber-400 dark:to-white"
            >
              {dict.contact.title}
            </motion.span>
          </h2>
          <p
            className="mx-auto mt-4 max-w-2xl font-sans text-sm font-light italic text-neutral-500 dark:text-white/45"
            id="contact-subtitle"
          >
            {dict.contact.subtitle}
          </p>
        </motion.div>

        <div
          className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-12"
          id="contact-inner-grid"
        >
          <motion.div
            initial={reduce ? false : { opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
            className="space-y-6 lg:col-span-5"
            id="contact-info-col"
          >
            <div
              className={`${CARD} p-8`}
              id="info-card-main"
              onMouseMove={moveSpot}
            >
              <SpotOverlay />
              <span
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-500/60 to-transparent"
              />
              <h3 className="relative mb-8 text-xs font-mono uppercase tracking-widest text-neutral-500 dark:text-white/45">
                {t.channels}
              </h3>

              <div className="relative space-y-8" id="info-channel-items">
                <div className="flex items-start gap-4" id="channel-email">
                  <motion.div
                    whileHover={reduce ? undefined : { rotate: 8, scale: 1.1 }}
                    className="shrink-0 rounded-xl border border-amber-500/20 bg-amber-500/10 p-2.5 text-amber-700 dark:text-amber-400"
                  >
                    <IconMail className="h-4 w-4" aria-hidden="true" />
                  </motion.div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-[9px] font-mono uppercase tracking-widest text-neutral-500 dark:text-white/40">
                      Email Address
                    </h4>
                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                      <a
                        href={`mailto:${EMAIL_ADDRESS}`}
                        className="break-all font-sans text-sm font-medium text-neutral-900 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/60 dark:text-white"
                      >
                        {EMAIL_ADDRESS}
                      </a>
                      <button
                        type="button"
                        onClick={copyEmail}
                        className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-neutral-200 px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-neutral-500 transition-colors hover:border-amber-500/40 hover:text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/60 dark:border-white/10 dark:text-white/50 dark:hover:text-white"
                        aria-label={t.copy}
                      >
                        <AnimatePresence mode="wait" initial={false}>
                          <motion.span
                            key={copied ? "done" : "idle"}
                            initial={{ opacity: 0, scale: 0.6 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.6 }}
                            transition={{ duration: 0.15 }}
                            className="flex"
                          >
                            {copied ? (
                              <IconCopyCheck className="h-3 w-3 text-emerald-500" />
                            ) : (
                              <IconCopy className="h-3 w-3" />
                            )}
                          </motion.span>
                        </AnimatePresence>
                        <span aria-live="polite">
                          {copied ? t.copiedText : t.copy}
                        </span>
                      </button>
                    </div>
                    <span className="mt-1 block font-sans text-[11px] font-light text-neutral-500 dark:text-white/40">
                      Typical response under 12 hours.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-4" id="channel-location">
                  <motion.div
                    whileHover={reduce ? undefined : { rotate: -8, scale: 1.1 }}
                    className="shrink-0 rounded-xl border border-amber-500/20 bg-amber-500/10 p-2.5 text-amber-700 dark:text-amber-400"
                  >
                    <IconMapPin className="h-4 w-4" aria-hidden="true" />
                  </motion.div>
                  <div>
                    <h4 className="text-[9px] font-mono uppercase tracking-widest text-neutral-500 dark:text-white/40">
                      Operating base
                    </h4>
                    <p className="mt-1 font-sans text-sm font-medium text-neutral-900 dark:text-white">
                      Pekalongan, Indonesia
                    </p>
                    <span className="mt-0.5 block font-sans text-[11px] font-light text-neutral-500 dark:text-white/40">
                      Providing technical leadership from SEA timezone.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div
              className={`${CARD} p-6`}
              id="contact-faq-panel"
              onMouseMove={moveSpot}
            >
              <SpotOverlay />
              <h4 className="relative mb-2 flex items-center gap-2 font-mono text-xs font-medium uppercase tracking-wide text-neutral-900 dark:text-white">
                <IconShieldCheck
                  className="h-4 w-4 text-emerald-600 dark:text-emerald-400"
                  aria-hidden="true"
                />
                {t.ndaTitle}
              </h4>
              <p className="relative font-sans text-xs font-light leading-relaxed text-neutral-600 dark:text-white/50">
                {t.ndaBody}
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={reduce ? false : { opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.2 }}
            className="lg:col-span-7"
            id="contact-form-col"
          >
            <div className={`${CARD} p-6 md:p-8`} id="form-card-main">
              <span
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-amber-400 via-orange-500 to-amber-400"
              />
              <AnimatePresence mode="wait">
                {!isSuccess ? (
                  <motion.form
                    key="contact-form-node"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, y: -8 }}
                    onSubmit={handleSubmit}
                    noValidate
                    id="communication-form"
                  >
                    <motion.div animate={shake} className="space-y-1">
                      <Field
                        id="input-name"
                        name="name"
                        label={dict.contact.name}
                        value={form.name}
                        placeholder={dict.contact.placeholderName}
                        touched={!!touched.name}
                        error={errors.name}
                        required
                        {...fieldProps}
                      />
                      <Field
                        id="input-email"
                        name="email"
                        type="email"
                        label={dict.contact.email}
                        value={form.email}
                        placeholder={dict.contact.placeholderEmail}
                        touched={!!touched.email}
                        error={errors.email}
                        required
                        {...fieldProps}
                      />
                      <Field
                        id="input-company"
                        name="company"
                        label={dict.contact.company}
                        value={form.company}
                        placeholder={dict.contact.placeholderCompany}
                        touched={!!touched.company}
                        optionalText={t.optional}
                        {...fieldProps}
                      />
                      <Field
                        id="input-message"
                        name="message"
                        label={dict.contact.message}
                        value={form.message}
                        placeholder={dict.contact.placeholderMessage}
                        touched={!!touched.message}
                        error={errors.message}
                        required
                        multiline
                        {...fieldProps}
                      />
                    </motion.div>

                    <AnimatePresence>
                      {submitError && (
                        <motion.div
                          key="submit-error"
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          role="alert"
                          className="mb-4 flex items-start gap-2.5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-xs text-red-700 dark:text-red-300"
                          id="submit-error-banner"
                        >
                          <IconAlertCircle
                            className="mt-0.5 h-4 w-4 shrink-0"
                            aria-hidden="true"
                          />
                          <span>{t.sendFail}</span>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <motion.button
                      type="submit"
                      disabled={isSending}
                      whileHover={reduce || isSending ? undefined : { y: -2 }}
                      whileTap={
                        reduce || isSending ? undefined : { scale: 0.98 }
                      }
                      className="group/btn relative mt-2 flex w-full cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 py-3.5 font-medium text-neutral-950 shadow-lg shadow-amber-500/20 transition-shadow duration-200 hover:shadow-xl hover:shadow-amber-500/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-70 dark:focus-visible:ring-offset-[#111113]"
                      id="submit-contact-btn"
                    >
                      <span
                        aria-hidden="true"
                        className="absolute inset-y-0 -left-full w-1/2 -skew-x-12 bg-white/40 transition-transform duration-700 group-hover/btn:translate-x-[400%]"
                      />
                      {isSending ? (
                        <IconLoader3
                          className="relative h-4 w-4 animate-spin motion-reduce:animate-none"
                          aria-hidden="true"
                        />
                      ) : (
                        <IconSendFilled
                          className="relative h-4 w-4 transition-transform duration-300 group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-1"
                          aria-hidden="true"
                        />
                      )}
                      <span
                        className="relative font-mono text-xs uppercase tracking-wider"
                        aria-live="polite"
                      >
                        {isSending ? dict.contact.sending : dict.contact.send}
                      </span>
                    </motion.button>
                  </motion.form>
                ) : (
                  <motion.div
                    key="success-form-node"
                    initial={reduce ? false : { opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    className="flex flex-col items-center space-y-6 py-12 text-center"
                    role="status"
                    id="success-panel-form"
                  >
                    <SuccessBurst reduce={reduce} />
                    <div className="space-y-2">
                      <h3
                        className="text-xl font-medium text-neutral-900 dark:text-white"
                        id="success-title-text"
                      >
                        {dict.contact.successTitle}
                      </h3>
                      <p
                        className="max-w-md font-sans text-sm font-light leading-relaxed text-neutral-600 dark:text-white/50"
                        id="success-body-text"
                      >
                        {dict.contact.successMessage}
                      </p>
                    </div>
                    <motion.button
                      type="button"
                      whileHover={reduce ? undefined : { y: -2 }}
                      whileTap={reduce ? undefined : { scale: 0.97 }}
                      onClick={() => setIsSuccess(false)}
                      className="cursor-pointer rounded-xl border border-neutral-200 px-6 py-2.5 text-[10px] font-mono uppercase tracking-wider text-neutral-600 transition-colors hover:border-amber-500/40 hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/60 dark:border-white/10 dark:text-white/60 dark:hover:bg-white/5"
                      id="reset-form-btn"
                    >
                      {t.another}
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
