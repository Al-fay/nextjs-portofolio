"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useInView,
  useReducedMotion,
} from "motion/react";
import { Language, TranslationDict } from "../types";
import {
  IconBinaryTreeFilled,
  IconBolt,
  IconBriefcase,
  IconBuilding,
  IconChartAreaLineFilled,
  IconCircle,
  IconCircleCheck,
  IconCreditCard,
  IconDeviceDesktopFilled,
  IconDeviceMobileFilled,
  IconLayersDifference,
  IconTerminal2,
  IconTicket,
  IconWorldCode,
} from "@tabler/icons-react";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const AnimatedCounter: React.FC<{
  value: number;
  duration?: number;
  suffix?: string;
  decimals?: number;
}> = ({ value, duration = 1400, suffix = "", decimals = 0 }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, {
    once: true,
    margin: "-40px",
  });

  const reduce = useReducedMotion();

  // Harus konsisten antara SSR dan initial hydration.
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;

    if (reduce) {
      setCount(value);
      return;
    }

    let raf = 0;
    let start: number | null = null;

    const step = (timestamp: number) => {
      if (start === null) start = timestamp;

      const progress = Math.min((timestamp - start) / duration, 1);

      const eased = 1 - Math.pow(1 - progress, 3);

      setCount(eased * value);

      if (progress < 1) {
        raf = requestAnimationFrame(step);
      } else {
        setCount(value);
      }
    };

    raf = requestAnimationFrame(step);

    return () => cancelAnimationFrame(raf);
  }, [inView, reduce, value, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {decimals > 0 ? count.toFixed(decimals) : Math.floor(count)}
      {suffix}
    </span>
  );
};

const COPY = {
  en: {
    eyebrow: "System statistics & analytics",
    sectionTitle: "Operational Execution Dashboard",
    sectionSubtitle:
      "Performance metrics, real-time workload division, and architectural execution highlights.",
    tabs: {
      projects: "Projects Breakdown",
      experience: "Career Milestones",
      integrations: "System & SLA",
    },
    kpi: {
      projects: "Total projects delivered",
      experience: "Years of hands-on coding",
      integrations: "Core support SLA & uptime",
    },
    unit: "projects",
    current: "Current",
    projectsBreakdown: {
      title: "Project Allocations & Contributions",
      heading: "Robust allocation across platforms",
      subtitle:
        "Breakdown of 42+ completed platforms and mobile products across distinct markets.",
      webApps: "Web Applications",
      webAppsDesc:
        "Fullstack CMS portals, Bapperida correspondence system, civic report portals, and welfare trackers.",
      mobileApps: "Mobile Banking & Apps",
      mobileAppsDesc:
        "iOS Mobile Banking features, finance tracking, and user transaction portals.",
      openSource: "Open Source & API Tools",
      openSourceDesc:
        "Virtual Account automated gateways, IT ticketers, and developer utilities.",
      metricsHeader: "Distribution Share",
      footnote: "Across web, mobile & internal systems",
    },
    milestones: {
      title: "Professional Progression & Engineering Speed",
      subtitle: "Chronological development and real impact created per epoch.",
      kopsYear: "2024 - Present",
      kopsTitle: "Mid-level Fullstack Developer & UI/UX Architect",
      kopsCompany: "Kospin Jasa Syariah",
      kopsPoints: [
        "Reduced IT ticket latency through custom ticket systems, streamlining cross-division approvals.",
        "Integrated secure automated billing linked to corporate bank Virtual Accounts.",
        "Maintained high-availability iOS m-Banking edits for cooperative cash flows.",
      ],
      freelanceYear: "2022 - 2024",
      freelanceTitle: "Freelance Fullstack Developer & Designer",
      freelanceCompany: "Self-Employed Contracts",
      freelancePoints: [
        "Engineered civic feedback websites for village transparency, gaining high local adoption.",
        "Developed welfare tracking platforms directly benefiting public aid distribution.",
        "Successfully built responsive, custom CMS business suites for diverse enterprises.",
      ],
    },
    integrations: {
      title: "System Security, SLA, & Digital Efficiency",
      subtitle:
        "99.9% uptime reliability and enterprise-grade SLA service resolution.",
      vaCardTitle: "Bank Virtual Account (VA) Gateway",
      vaCardDesc:
        "Full automated billing matching with corporate banks. Zero manual ledger updates needed.",
      vaLabel: "VA payments",
      vaValue: "100% online",
      indexingTitle: "Ultra-Fast File Indexing",
      indexingDesc:
        "Bapperida record lookup system retrieving letters and archives in less than 400 milliseconds.",
      indexingLabel: "Index search",
      indexingValue: "< 400 ms",
      slaTitle: "IT Ticketing SLA",
      slaDesc:
        "Fast issue resolution and inter-department request automation with full activity tracking.",
      slaLabel: "Tickets SLA",
      slaValue: "100% done",
    },
  },
  id: {
    eyebrow: "Statistik & analitik sistem",
    sectionTitle: "Dasbor Eksekusi Operasional",
    sectionSubtitle:
      "Metrik kinerja nyata, distribusi beban kerja langsung, dan poin-poin rekayasa sistem.",
    tabs: {
      projects: "Distribusi Proyek",
      experience: "Tonggak Karier",
      integrations: "Keandalan & SLA",
    },
    kpi: {
      projects: "Total proyek diselesaikan",
      experience: "Tahun pengalaman kerja",
      integrations: "Uptime sistem & SLA IT",
    },
    unit: "proyek",
    current: "Saat ini",
    projectsBreakdown: {
      title: "Alokasi Proyek & Spesialisasi",
      heading: "Alokasi kokoh di berbagai platform",
      subtitle:
        "Analisis dari 42+ website dan aplikasi mobile yang dibuat untuk berbagai kebutuhan pasar.",
      webApps: "Aplikasi Web Fullstack",
      webAppsDesc:
        "Website profil bisnis kustom, sistem surat-menyurat Bapperida, portal Dinsos & pengaduan desa.",
      mobileApps: "Aplikasi & Fitur Mobile",
      mobileAppsDesc:
        "Pengembangan m-Banking iOS, pelacak finansial koperasi, dan UI transaksi ringkas.",
      openSource: "Gerbang API & Sistem Internal",
      openSourceDesc:
        "Integrasi Virtual Account perbankan, IT ticketing desk, dan tools otomatisasi pengembang.",
      metricsHeader: "Proporsi Distribusi",
      footnote: "Mencakup web, mobile & sistem internal",
    },
    milestones: {
      title: "Progres Portofolio & Kecepatan Rekayasa",
      subtitle:
        "Pencapaian profesional dan dampak arsitektur sistem dari tahun ke tahun.",
      kopsYear: "2024 - Sekarang",
      kopsTitle: "Developer Fullstack Mid-level",
      kopsCompany: "Kospin Jasa Syariah",
      kopsPoints: [
        "Memangkas waktu birokrasi request IT antar divisi menggunakan IT Desk kustom.",
        "Menyatukan pembayaran SPP digital langsung ke jaringan Virtual Account perbankan komersial.",
        "Mengambil alih peningkatan performa dan penambahan fitur m-Banking iOS anggota.",
      ],
      freelanceYear: "2022 - 2024",
      freelanceTitle: "Freelance Fullstack Developer & Designer",
      freelanceCompany: "Kontrak Mandiri",
      freelancePoints: [
        "Menciptakan sistem pelaporan sarpras Desa Gandu guna mewujudkan transparansi penuh kelurahan.",
        "Membuat web pemohon bansos terpadu untuk Dinsos Kab. Pekalongan secara aman & tepat sasaran.",
        "Menerapkan website company profile dinamis berbasis CMS kustom yang modern dan ramah SEO.",
      ],
    },
    integrations: {
      title: "Keamanan Sistem, SLA, & Efisiensi Digital",
      subtitle:
        "Sertifikasi 99.9% keandalan sistem bebas gangguan dan pemenuhan layanan IT prima.",
      vaCardTitle: "Gerbang Virtual Account Bank",
      vaCardDesc:
        "Pencocokan pembayaran otomatis realtime dengan bank. Eliminasi total rekonsiliasi manual.",
      vaLabel: "Pembayaran VA",
      vaValue: "100% online",
      indexingTitle: "Indeks Arsip Super Cepat",
      indexingDesc:
        "Sistem pencarian surat nirkertas Bapperida yang menyaring dokumen dalam waktu di bawah 400ms.",
      indexingLabel: "Pencarian indeks",
      indexingValue: "< 400 ms",
      slaTitle: "SLA IT Ticketing",
      slaDesc:
        "Pemberian solusi cepat dan otomatisasi alur kerja departemen dengan audit log transparan.",
      slaLabel: "SLA tiket",
      slaValue: "100% selesai",
    },
  },
} as const;

type TabType = "projects" | "experience" | "integrations";
const TAB_ORDER: TabType[] = ["projects", "experience", "integrations"];

const PROJECT_SPLIT = [
  {
    key: "webApps",
    value: 24,
    icon: IconDeviceDesktopFilled,
    bar: "bg-amber-500",
    dot: "bg-amber-500",
    stroke: "stroke-amber-500",
    tile: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
  },
  {
    key: "mobileApps",
    value: 10,
    icon: IconDeviceMobileFilled,
    bar: "bg-teal-500",
    dot: "bg-teal-500",
    stroke: "stroke-teal-500",
    tile: "bg-teal-500/10 text-teal-700 dark:text-teal-400",
  },
  {
    key: "openSource",
    value: 8,
    icon: IconTerminal2,
    bar: "bg-slate-500 dark:bg-slate-400",
    dot: "bg-slate-500 dark:bg-slate-400",
    stroke: "stroke-slate-500 dark:stroke-slate-400",
    tile: "bg-slate-500/10 text-slate-700 dark:text-slate-300",
  },
] as const;
const PROJECT_TOTAL = PROJECT_SPLIT.reduce((s, p) => s + p.value, 0);

const CARD =
  "rounded-2xl border border-neutral-200 dark:border-white/10 bg-neutral-50/70 dark:bg-white/[0.03]";
const MUTED = "text-neutral-600 dark:text-neutral-400";
const EYEBROW =
  "text-xs font-mono font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400";

const listVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

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
        "radial-gradient(260px circle at var(--mx, 50%) var(--my, 50%), rgba(245,158,11,0.14), transparent 70%)",
    }}
  />
);

const PanelHeader: React.FC<{
  icon: React.ElementType;
  title: string;
  subtitle: string;
  heading?: string;
}> = ({ icon: Icon, title, subtitle, heading }) => (
  <div className="mb-8 max-w-2xl space-y-2">
    <div className="flex items-center gap-2">
      <Icon
        className="h-4 w-4 text-amber-600 dark:text-amber-400"
        aria-hidden="true"
      />
      <span className={EYEBROW}>{title}</span>
    </div>
    {heading && (
      <h3 className="text-xl md:text-2xl font-semibold tracking-tight text-neutral-950 dark:text-white">
        {heading}
      </h3>
    )}
    <p className={`text-sm leading-relaxed ${MUTED}`}>{subtitle}</p>
  </div>
);

interface DonutRow {
  key: string;
  value: number;
  stroke: string;
}

const Donut: React.FC<{
  rows: DonutRow[];
  hovered: string | null;
  total: number;
  unit: string;
  reduce: boolean | null;
}> = ({ rows, hovered, total, unit, reduce }) => {
  const gap = 0.014;
  let acc = 0;
  const segments = rows.map((r) => {
    const fraction = r.value / total;
    const seg = { ...r, len: Math.max(fraction - gap, 0.001), offset: -acc };
    acc += fraction;
    return seg;
  });

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[220px]">
      <svg
        viewBox="0 0 160 160"
        className="h-full w-full -rotate-90"
        aria-hidden="true"
      >
        <circle
          cx="80"
          cy="80"
          r="64"
          fill="none"
          strokeWidth="16"
          className="stroke-neutral-200/70 dark:stroke-white/10"
        />
        {segments.map((s, i) => {
          const dimmed = hovered !== null && hovered !== s.key;
          const focused = hovered === s.key;
          return (
            <motion.circle
              key={s.key}
              cx="80"
              cy="80"
              r="64"
              fill="none"
              pathLength={1}
              strokeDashoffset={s.offset}
              className={s.stroke}
              initial={
                reduce
                  ? false
                  : { strokeDasharray: "0 1", strokeWidth: 16, opacity: 1 }
              }
              animate={{
                strokeDasharray: `${s.len} ${1 - s.len}`,
                strokeWidth: focused ? 20 : 16,
                opacity: dimmed ? 0.25 : 1,
              }}
              transition={{
                strokeDasharray: {
                  duration: reduce ? 0 : 1,
                  delay: reduce ? 0 : 0.15 + i * 0.12,
                  ease: EASE,
                },
                strokeWidth: { duration: 0.2 },
                opacity: { duration: 0.2 },
              }}
            />
          );
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-mono text-4xl font-bold tabular-nums text-neutral-950 dark:text-white">
          <AnimatedCounter value={total} />
        </span>
        <span className={`text-xs ${MUTED}`}>{unit}</span>
      </div>
    </div>
  );
};

interface StatsDashboardProps {
  lang: Language;
  dict: TranslationDict;
}

export const StatsDashboard: React.FC<StatsDashboardProps> = ({ lang }) => {
  const [activeTab, setActiveTab] = useState<TabType>("projects");
  const [hovered, setHovered] = useState<string | null>(null);
  const reduce = useReducedMotion();
  const uid = useId();
  const tabRefs = useRef<Record<TabType, HTMLButtonElement | null>>({
    projects: null,
    experience: null,
    integrations: null,
  });

  const content = lang === "id" ? COPY.id : COPY.en;
  const tabId = (t: TabType) => `${uid}-tab-${t}`;
  const panelId = (t: TabType) => `${uid}-panel-${t}`;

  const tabs = [
    {
      id: "projects" as const,
      icon: IconLayersDifference,
      value: 42,
      suffix: "+",
      decimals: 0,
    },
    {
      id: "experience" as const,
      icon: IconBriefcase,
      value: 4,
      suffix: "+",
      decimals: 0,
    },
    {
      id: "integrations" as const,
      icon: IconBinaryTreeFilled,
      value: 99.9,
      suffix: "%",
      decimals: 1,
    },
  ];

  const onKeyDown = (e: React.KeyboardEvent) => {
    const i = TAB_ORDER.indexOf(activeTab);
    let next = i;
    if (e.key === "ArrowRight") next = (i + 1) % TAB_ORDER.length;
    else if (e.key === "ArrowLeft")
      next = (i + TAB_ORDER.length - 1) % TAB_ORDER.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = TAB_ORDER.length - 1;
    else return;
    e.preventDefault();
    setActiveTab(TAB_ORDER[next]);
    tabRefs.current[TAB_ORDER[next]]?.focus();
  };

  const panelMotion = {
    initial: reduce ? false : { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -6 },
    transition: { duration: reduce ? 0 : 0.25, ease: "easeOut" as const },
  };

  const stagger = {
    variants: listVariants,
    initial: reduce ? (false as const) : ("hidden" as const),
    animate: "show" as const,
  };

  const rows = [
    {
      ...PROJECT_SPLIT[0],
      title: content.projectsBreakdown.webApps,
      desc: content.projectsBreakdown.webAppsDesc,
    },
    {
      ...PROJECT_SPLIT[1],
      title: content.projectsBreakdown.mobileApps,
      desc: content.projectsBreakdown.mobileAppsDesc,
    },
    {
      ...PROJECT_SPLIT[2],
      title: content.projectsBreakdown.openSource,
      desc: content.projectsBreakdown.openSourceDesc,
    },
  ].map((r) => ({ ...r, pct: Math.round((r.value / PROJECT_TOTAL) * 100) }));

  const integrationCards = [
    {
      icon: IconCreditCard,
      title: content.integrations.vaCardTitle,
      desc: content.integrations.vaCardDesc,
      label: content.integrations.vaLabel,
      value: content.integrations.vaValue,
      tile: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
      valueColor: "text-emerald-700 dark:text-emerald-400",
      meter: 100,
      meterColor: "bg-gradient-to-r from-emerald-500 to-teal-400",
      bars: "bg-emerald-500",
    },
    {
      icon: IconBolt,
      title: content.integrations.indexingTitle,
      desc: content.integrations.indexingDesc,
      label: content.integrations.indexingLabel,
      value: content.integrations.indexingValue,
      tile: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
      valueColor: "text-amber-700 dark:text-amber-400",
      meter: null,
      meterColor: "",
      bars: "bg-amber-500",
    },
    {
      icon: IconTicket,
      title: content.integrations.slaTitle,
      desc: content.integrations.slaDesc,
      label: content.integrations.slaLabel,
      value: content.integrations.slaValue,
      tile: "bg-sky-500/10 text-sky-700 dark:text-sky-400",
      valueColor: "text-sky-700 dark:text-sky-400",
      meter: 100,
      meterColor: "bg-gradient-to-r from-sky-500 to-indigo-400",
      bars: "bg-sky-500",
    },
  ];

  const experiences = [
    {
      icon: IconBuilding,
      company: content.milestones.kopsCompany,
      year: content.milestones.kopsYear,
      title: content.milestones.kopsTitle,
      points: content.milestones.kopsPoints,
      current: true,
    },
    {
      icon: IconWorldCode,
      company: content.milestones.freelanceCompany,
      year: content.milestones.freelanceYear,
      title: content.milestones.freelanceTitle,
      points: content.milestones.freelancePoints,
      current: false,
    },
  ];

  return (
    <section
      id="stats-dashboard-section"
      className="relative overflow-hidden scroll-mt-24 border-t border-neutral-200/60 dark:border-white/5 bg-neutral-50 dark:bg-[#070708] py-20 md:py-24"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.04)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]"
      />
      <motion.div
        aria-hidden="true"
        animate={
          reduce
            ? undefined
            : { x: [0, 40, 0], y: [0, 20, 0], opacity: [0.5, 0.9, 0.5] }
        }
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute -top-24 left-1/4 h-72 w-72 rounded-full bg-amber-500/15 blur-[90px]"
      />
      <motion.div
        aria-hidden="true"
        animate={
          reduce
            ? undefined
            : { x: [0, -50, 0], y: [0, 30, 0], opacity: [0.4, 0.8, 0.4] }
        }
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute top-40 right-1/4 h-64 w-64 rounded-full bg-orange-500/10 blur-[90px]"
      />

      <div className="relative mx-auto max-w-7xl px-6 md:px-8">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <motion.span
            initial={reduce ? false : { opacity: 0, y: 6, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: EASE }}
            className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1.5 text-xs font-mono font-semibold uppercase tracking-wider text-amber-700 backdrop-blur-sm dark:text-amber-400"
          >
            <span className="relative flex h-2 w-2" aria-hidden="true">
              <span className="absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-60 animate-ping motion-reduce:animate-none" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-500" />
            </span>
            {content.eyebrow}
          </motion.span>

          <motion.h2
            initial={reduce ? false : { opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: EASE }}
            className="mt-5 text-3xl md:text-5xl font-semibold tracking-tight text-balance text-neutral-950 dark:text-white"
          >
            <motion.span
              animate={
                reduce
                  ? undefined
                  : { backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }
              }
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              style={{ backgroundSize: "200% 200%" }}
              className="bg-gradient-to-r from-neutral-950 via-amber-600 to-neutral-950 dark:from-white dark:via-amber-400 dark:to-white bg-clip-text text-transparent"
            >
              {content.sectionTitle}
            </motion.span>
          </motion.h2>
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className={`mt-4 text-sm md:text-base leading-relaxed ${MUTED}`}
          >
            {content.sectionSubtitle}
          </motion.p>
        </div>

        <div
          role="tablist"
          aria-label={content.sectionTitle}
          onKeyDown={onKeyDown}
          className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3"
        >
          {tabs.map((tab, index) => {
            const active = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <motion.button
                key={tab.id}
                ref={(el) => {
                  tabRefs.current[tab.id] = el;
                }}
                type="button"
                role="tab"
                id={tabId(tab.id)}
                aria-selected={active}
                aria-controls={panelId(tab.id)}
                tabIndex={active ? 0 : -1}
                onClick={() => setActiveTab(tab.id)}
                onMouseMove={moveSpot}
                initial={reduce ? false : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.6, ease: EASE, delay: index * 0.1 }}
                whileHover={reduce ? undefined : { y: -4 }}
                whileTap={reduce ? undefined : { scale: 0.98 }}
                className={`group relative min-h-[10rem] cursor-pointer overflow-hidden rounded-2xl p-[1px] text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-50 dark:focus-visible:ring-offset-[#070708] ${
                  active
                    ? "shadow-xl shadow-amber-500/15"
                    : "shadow-sm hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/30"
                }`}
              >
                <span
                  aria-hidden="true"
                  className="absolute inset-0 rounded-2xl border border-neutral-200 dark:border-white/10"
                />
                {active && (
                  <motion.span
                    aria-hidden="true"
                    animate={reduce ? undefined : { rotate: 360 }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="absolute -inset-[60%] bg-[conic-gradient(from_0deg,transparent_0deg,transparent_240deg,rgba(245,158,11,0.95)_320deg,transparent_360deg)]"
                  />
                )}

                <span
                  className={`relative flex h-full min-h-[calc(10rem-2px)] flex-col justify-between rounded-[15px] p-6 transition-colors duration-300 ${
                    active
                      ? "bg-white dark:bg-[#141416]"
                      : "bg-white/80 dark:bg-[#0e0e10]/90"
                  }`}
                >
                  <SpotOverlay />

                  <span className="relative flex items-center justify-between gap-3">
                    <span
                      className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-300 group-hover:rotate-6 group-hover:scale-110 ${
                        active
                          ? "bg-amber-500 text-white shadow-lg shadow-amber-500/30 dark:text-neutral-950"
                          : "bg-amber-500/10 text-amber-700 dark:text-amber-400"
                      }`}
                    >
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <span className="text-xs font-mono font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                      {content.tabs[tab.id]}
                    </span>
                  </span>

                  <span className="relative mt-6 block">
                    <span
                      className={`block font-mono text-4xl font-bold tracking-tight md:text-5xl transition-colors duration-300 ${
                        active
                          ? "bg-gradient-to-r from-amber-600 to-orange-500 bg-clip-text text-transparent dark:from-amber-300 dark:to-orange-400"
                          : "text-neutral-950 dark:text-white"
                      }`}
                    >
                      <AnimatedCounter
                        value={tab.value}
                        suffix={tab.suffix}
                        decimals={tab.decimals}
                      />
                    </span>
                    <span className={`mt-1.5 block text-sm ${MUTED}`}>
                      {content.kpi[tab.id]}
                    </span>
                  </span>
                </span>
              </motion.button>
            );
          })}
        </div>

        <div
          id="stats-dashboard-container"
          className="relative overflow-hidden rounded-3xl border border-neutral-200 bg-white/90 p-6 shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-[#0e0e10]/90 md:p-8"
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-500/60 to-transparent"
          />

          <AnimatePresence mode="wait">
            {activeTab === "projects" && (
              <motion.div
                key="projects"
                role="tabpanel"
                id={panelId("projects")}
                aria-labelledby={tabId("projects")}
                tabIndex={0}
                {...panelMotion}
                className="focus-visible:outline-none"
              >
                <PanelHeader
                  icon={IconChartAreaLineFilled}
                  title={content.projectsBreakdown.title}
                  heading={content.projectsBreakdown.heading}
                  subtitle={content.projectsBreakdown.subtitle}
                />

                <motion.div {...stagger} className="grid gap-6 lg:grid-cols-5">
                  <div className="space-y-3 lg:col-span-3">
                    {rows.map((r) => {
                      const RowIcon = r.icon;
                      return (
                        <motion.div
                          key={r.key}
                          variants={itemVariants}
                          whileHover={reduce ? undefined : { x: 4 }}
                          onMouseEnter={() => setHovered(r.key)}
                          onMouseLeave={() => setHovered(null)}
                          onMouseMove={moveSpot}
                          className={`${CARD} group relative flex items-start gap-4 overflow-hidden p-4 transition-colors hover:border-amber-500/30 dark:hover:border-amber-400/25 ${
                            hovered && hovered !== r.key ? "opacity-60" : ""
                          }`}
                        >
                          <SpotOverlay />
                          <div
                            className={`relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110 ${r.tile}`}
                          >
                            <RowIcon className="h-5 w-5" aria-hidden="true" />
                          </div>
                          <div className="relative min-w-0 flex-1">
                            <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                              <h4 className="text-sm font-semibold text-neutral-950 dark:text-white">
                                {r.title}
                              </h4>
                              <span className="rounded-md border border-neutral-200 bg-white px-2 py-0.5 font-mono text-xs font-semibold tabular-nums text-neutral-700 dark:border-white/10 dark:bg-white/5 dark:text-neutral-200">
                                {r.value} {content.unit}
                              </span>
                            </div>
                            <p
                              className={`mt-1 text-sm leading-relaxed ${MUTED}`}
                            >
                              {r.desc}
                            </p>
                            <div
                              aria-hidden="true"
                              className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-neutral-200/70 dark:bg-white/10"
                            >
                              <motion.span
                                initial={reduce ? false : { scaleX: 0 }}
                                animate={{ scaleX: r.pct / 100 }}
                                transition={{
                                  duration: reduce ? 0 : 1,
                                  delay: reduce ? 0 : 0.3,
                                  ease: EASE,
                                }}
                                className={`block h-full origin-left rounded-full ${r.bar}`}
                              />
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>

                  <motion.div
                    variants={itemVariants}
                    className={`${CARD} flex flex-col p-6 lg:col-span-2`}
                  >
                    <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                      {content.projectsBreakdown.metricsHeader}
                    </h4>

                    <div
                      role="img"
                      aria-label={rows
                        .map((r) => `${r.title}: ${r.pct}%`)
                        .join(", ")}
                      className="mt-5"
                    >
                      <Donut
                        rows={rows}
                        hovered={hovered}
                        total={PROJECT_TOTAL}
                        unit={content.unit}
                        reduce={reduce}
                      />
                    </div>

                    <ul className="mt-6 space-y-1">
                      {rows.map((r) => (
                        <li
                          key={r.key}
                          onMouseEnter={() => setHovered(r.key)}
                          onMouseLeave={() => setHovered(null)}
                          className={`flex items-center justify-between gap-3 rounded-lg px-2 py-1.5 text-sm transition-colors hover:bg-neutral-100 dark:hover:bg-white/5 ${
                            hovered && hovered !== r.key ? "opacity-50" : ""
                          }`}
                        >
                          <span className="flex min-w-0 items-center gap-2.5">
                            <span
                              aria-hidden="true"
                              className={`h-2.5 w-2.5 shrink-0 rounded-full ${r.dot}`}
                            />
                            <span className="truncate text-neutral-800 dark:text-neutral-200">
                              {r.title}
                            </span>
                          </span>
                          <span className="font-mono font-semibold tabular-nums text-neutral-950 dark:text-white">
                            {r.pct}%
                          </span>
                        </li>
                      ))}
                    </ul>

                    <p
                      className={`mt-auto border-t border-neutral-200 pt-5 text-xs dark:border-white/10 ${MUTED}`}
                    >
                      {PROJECT_TOTAL} {content.unit} ·{" "}
                      {content.projectsBreakdown.footnote}
                    </p>
                  </motion.div>
                </motion.div>
              </motion.div>
            )}

            {activeTab === "experience" && (
              <motion.div
                key="experience"
                role="tabpanel"
                id={panelId("experience")}
                aria-labelledby={tabId("experience")}
                tabIndex={0}
                {...panelMotion}
                className="focus-visible:outline-none"
              >
                <PanelHeader
                  icon={IconCircle}
                  title={content.milestones.title}
                  subtitle={content.milestones.subtitle}
                />

                <motion.div
                  {...stagger}
                  className="relative mx-auto max-w-3xl space-y-6"
                >
                  <motion.span
                    aria-hidden="true"
                    initial={reduce ? false : { scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ duration: reduce ? 0 : 1.2, ease: EASE }}
                    className="absolute bottom-6 left-5 top-6 w-px origin-top bg-gradient-to-b from-amber-500 via-amber-500/30 to-transparent"
                  />

                  {experiences.map((exp) => {
                    const ExpIcon = exp.icon;
                    return (
                      <motion.div
                        key={exp.company}
                        variants={itemVariants}
                        className="relative pl-16"
                      >
                        <span className="absolute left-0 top-5 flex h-10 w-10 items-center justify-center">
                          {exp.current && (
                            <span
                              aria-hidden="true"
                              className="absolute inline-flex h-full w-full rounded-xl bg-amber-500/40 animate-ping motion-reduce:animate-none"
                            />
                          )}
                          <span
                            className={`relative flex h-10 w-10 items-center justify-center rounded-xl border ${
                              exp.current
                                ? "border-amber-500/50 bg-amber-500 text-white shadow-lg shadow-amber-500/30 dark:text-neutral-950"
                                : "border-neutral-300 bg-white text-neutral-600 dark:border-white/15 dark:bg-[#141416] dark:text-neutral-300"
                            }`}
                          >
                            <ExpIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        </span>

                        <motion.article
                          whileHover={reduce ? undefined : { y: -3 }}
                          onMouseMove={moveSpot}
                          className={`${CARD} group relative flex flex-col overflow-hidden p-6 transition-colors hover:border-amber-500/30 dark:hover:border-amber-400/25 ${
                            exp.current
                              ? "border-amber-500/40 dark:border-amber-400/30"
                              : ""
                          }`}
                        >
                          <SpotOverlay />
                          {exp.current && (
                            <span
                              aria-hidden="true"
                              className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-amber-400 to-orange-500"
                            />
                          )}

                          <div className="relative flex flex-wrap items-start justify-between gap-3">
                            <div>
                              <h4 className="text-base font-semibold text-neutral-950 dark:text-white">
                                {exp.company}
                              </h4>
                              <p className={`mt-0.5 text-sm ${MUTED}`}>
                                {exp.title}
                              </p>
                            </div>

                            <div className="flex items-center gap-2">
                              {exp.current && (
                                <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                                  <span
                                    aria-hidden="true"
                                    className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse motion-reduce:animate-none"
                                  />
                                  {content.current}
                                </span>
                              )}
                              <span className="rounded-md border border-neutral-200 bg-white px-2.5 py-0.5 font-mono text-xs font-semibold text-neutral-700 dark:border-white/10 dark:bg-white/5 dark:text-neutral-200">
                                {exp.year}
                              </span>
                            </div>
                          </div>

                          <ul className="relative mt-5 space-y-3 border-t border-neutral-200 pt-5 dark:border-white/10">
                            {exp.points.map((pt, i) => (
                              <motion.li
                                key={i}
                                initial={
                                  reduce ? false : { opacity: 0, x: -10 }
                                }
                                animate={{ opacity: 1, x: 0 }}
                                transition={{
                                  duration: 0.4,
                                  ease: EASE,
                                  delay: reduce ? 0 : 0.4 + i * 0.1,
                                }}
                                className="flex items-start gap-2.5 text-sm"
                              >
                                <IconCircleCheck
                                  className={`mt-0.5 h-4 w-4 shrink-0 ${
                                    exp.current
                                      ? "text-amber-600 dark:text-amber-400"
                                      : "text-neutral-400 dark:text-neutral-500"
                                  }`}
                                  aria-hidden="true"
                                />
                                <span className={`leading-relaxed ${MUTED}`}>
                                  {pt}
                                </span>
                              </motion.li>
                            ))}
                          </ul>
                        </motion.article>
                      </motion.div>
                    );
                  })}
                </motion.div>
              </motion.div>
            )}

            {activeTab === "integrations" && (
              <motion.div
                key="integrations"
                role="tabpanel"
                id={panelId("integrations")}
                aria-labelledby={tabId("integrations")}
                tabIndex={0}
                {...panelMotion}
                className="focus-visible:outline-none"
              >
                <PanelHeader
                  icon={IconBinaryTreeFilled}
                  title={content.integrations.title}
                  subtitle={content.integrations.subtitle}
                />

                <motion.div {...stagger} className="grid gap-6 md:grid-cols-3">
                  {integrationCards.map((card) => {
                    const CardIcon = card.icon;
                    return (
                      <motion.article
                        key={card.title}
                        variants={itemVariants}
                        whileHover={reduce ? undefined : { y: -6 }}
                        onMouseMove={moveSpot}
                        className={`${CARD} group relative flex h-full flex-col justify-between overflow-hidden p-6 transition-colors hover:border-amber-500/30 dark:hover:border-amber-400/25`}
                      >
                        <SpotOverlay />
                        <div className="relative space-y-3">
                          <span
                            className={`flex h-11 w-11 items-center justify-center rounded-xl transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110 ${card.tile}`}
                          >
                            <CardIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                          <h4 className="text-sm font-semibold text-neutral-950 dark:text-white">
                            {card.title}
                          </h4>
                          <p className={`text-sm leading-relaxed ${MUTED}`}>
                            {card.desc}
                          </p>
                        </div>

                        <div className="relative mt-6 border-t border-neutral-200 pt-4 dark:border-white/10">
                          <div className="flex items-end justify-between gap-3">
                            <span className="text-xs font-mono uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                              {card.label}
                            </span>
                            <span
                              className={`font-mono text-lg font-bold tabular-nums ${card.valueColor}`}
                            >
                              {card.value}
                            </span>
                          </div>

                          <div
                            aria-hidden="true"
                            className="mt-4 flex h-6 items-center"
                          >
                            {card.meter !== null ? (
                              <div className="h-1.5 w-full overflow-hidden rounded-full bg-neutral-200/70 dark:bg-white/10">
                                <motion.span
                                  initial={reduce ? false : { scaleX: 0 }}
                                  animate={{ scaleX: card.meter / 100 }}
                                  transition={{
                                    duration: reduce ? 0 : 1.1,
                                    delay: reduce ? 0 : 0.4,
                                    ease: EASE,
                                  }}
                                  className={`block h-full origin-left rounded-full ${card.meterColor}`}
                                />
                              </div>
                            ) : (
                              <div className="flex h-6 w-full items-center gap-1">
                                {Array.from({ length: 16 }).map((_, i) => (
                                  <motion.span
                                    key={i}
                                    animate={
                                      reduce
                                        ? undefined
                                        : { scaleY: [0.25, 1, 0.25] }
                                    }
                                    transition={{
                                      duration: 1.4,
                                      repeat: Infinity,
                                      ease: "easeInOut",
                                      delay: i * 0.07,
                                    }}
                                    className={`h-full flex-1 origin-center rounded-full ${card.bars}`}
                                    style={{ opacity: 0.35 + (i / 16) * 0.65 }}
                                  />
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.article>
                    );
                  })}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
