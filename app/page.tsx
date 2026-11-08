"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  animate,
  useScroll,
  useSpring,
  useMotionValue,
  useMotionValueEvent,
  useMotionTemplate,
  useReducedMotion,
  useTransform,
} from "motion/react";
import { Language, TranslationDict } from "./types";
import { translations } from "./data";
import { Hero } from "./components/Hero";
import { AboutSection } from "./components/AboutSection";
import { ExperienceTimeline } from "./components/ExperienceTimeline";
import { ProjectGallery } from "./components/ProjectGallery";
import { StatsDashboard } from "./components/StatsDashboard";
import { TestimonialsMarquee } from "./components/TestimonialsMarquee";
import { ContactForm } from "./components/ContactForm";
import { AIAssistant } from "./components/AIAssistant";
import {
  IconArrowUpDashed,
  IconBrandGithubFilled,
  IconBrandLinkedinFilled,
  IconFileDownload,
  IconGlobe,
  IconMail,
  IconMenu4,
  IconMoonFilled,
  IconSunFilled,
  IconTerminal,
  IconX,
} from "@tabler/icons-react";
import { SkillsCarousel } from "./components/SkillsCarousel";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const navItems: {
  key: keyof TranslationDict["nav"];
  target: string;
  observe: string;
}[] = [
  { key: "about", target: "about-section", observe: "about-section" },
  { key: "skills", target: "tech-skills-anchor", observe: "skills-section" },
  {
    key: "experience",
    target: "experience-section",
    observe: "experience-section",
  },
  { key: "projects", target: "projects-section", observe: "projects-section" },
  { key: "contact", target: "contact-section", observe: "contact-section" },
];

const socials: {
  id: string;
  href: string;
  label: string;
  Icon: typeof IconBrandGithubFilled;
  hover: string;
  external: boolean;
}[] = [
  {
    id: "social-github-link",
    href: "https://github.com/Al-Fay",
    label: "GitHub",
    Icon: IconBrandGithubFilled,
    hover: "hover:text-neutral-900 dark:hover:text-white",
    external: true,
  },
  {
    id: "social-linkedin-link",
    href: "https://www.linkedin.com/in/muhammad-diva-alfahrizy-1422ba208/",
    label: "LinkedIn",
    Icon: IconBrandLinkedinFilled,
    hover: "hover:text-sky-600 dark:hover:text-sky-400",
    external: true,
  },
  {
    id: "social-email-link",
    href: "mailto:divaalfahrizy02878@gmail.com",
    label: "Email",
    Icon: IconMail,
    hover: "hover:text-amber-600 dark:hover:text-amber-400",
    external: false,
  },
];

const menuContainer = {
  hidden: { opacity: 0, y: -15 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 350,
      damping: 28,
      staggerChildren: 0.06,
      delayChildren: 0.05,
    },
  },
};

const menuItem = {
  hidden: { opacity: 0, x: -16 },
  show: { opacity: 1, x: 0 },
};

// useReducedMotion() beda antara server (false) dan client (bisa true),
// jadi nilai aslinya baru dipakai setelah mount agar hydration cocok.
function useSafeReducedMotion() {
  const prefers = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  return mounted ? !!prefers : false;
}

function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduce = useSafeReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, ease: EASE, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function ThemeIcon({
  theme,
  className = "w-4 h-4",
}: {
  theme: "light" | "dark";
  className?: string;
}) {
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.span
        key={theme}
        initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
        animate={{ rotate: 0, opacity: 1, scale: 1 }}
        exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="flex items-center justify-center"
      >
        {theme === "light" ? (
          <IconMoonFilled className={className} />
        ) : (
          <IconSunFilled className={`${className} text-amber-400`} />
        )}
      </motion.span>
    </AnimatePresence>
  );
}

function SectionTitle({
  title,
  subtitle,
}: {
  title?: string;
  subtitle?: string;
}) {
  return (
    <div className="text-center">
      <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
        {title}
      </h2>
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: EASE, delay: 0.2 }}
        className="mx-auto mt-3 h-0.5 w-16 origin-center rounded-full bg-linear-to-r from-transparent via-amber-500 to-transparent"
      />
      <p className="text-neutral-500 dark:text-neutral-400 text-xs mt-3 font-mono uppercase tracking-widest max-w-lg mx-auto">
        {subtitle}
      </p>
    </div>
  );
}

export default function Home() {
  const reduce = useSafeReducedMotion();

  const [showSplash, setShowSplash] = useState(true);

  // Nilai awal harus sama di server & client; localStorage dibaca setelah mount.
  const [lang, setLang] = useState<Language>("en");
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [year, setYear] = useState<number | null>(null);

  const [activeTransitionTheme, setActiveTransitionTheme] = useState<
    "light" | "dark" | null
  >(null);
  const [transitionOrigin, setTransitionOrigin] = useState({
    x: "50%",
    y: "50%",
  });

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [activeSection, setActiveSection] = useState("about-section");

  const dict: TranslationDict = translations[lang];

  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 30,
    restDelta: 0.001,
  });
  const lastY = useRef(0);

  const splashCount = useMotionValue(0);
  const splashText = useTransform(splashCount, (v) => `${Math.round(v)}`);

  const mouseX = useMotionValue(-600);
  const mouseY = useMotionValue(-600);
  const spotX = useSpring(mouseX, { stiffness: 180, damping: 28 });
  const spotY = useSpring(mouseY, { stiffness: 180, damping: 28 });
  const spotlight = useMotionTemplate`radial-gradient(520px circle at ${spotX}px ${spotY}px, rgba(245,158,11,0.09), transparent 70%)`;

  const toggleLanguage = () => {
    const nextLang: Language = lang === "en" ? "id" : "en";
    setLang(nextLang);
    try {
      localStorage.setItem("portfolio-lang", nextLang);
    } catch {}
  };

  const toggleTheme = (e?: React.MouseEvent) => {
    const nextTheme = theme === "light" ? "dark" : "light";

    if (e && e.clientX && e.clientY) {
      setTransitionOrigin({
        x: `${e.clientX}px`,
        y: `${e.clientY}px`,
      });
    } else {
      setTransitionOrigin({ x: "50%", y: "50%" });
    }

    setActiveTransitionTheme(nextTheme);

    setTimeout(() => {
      setTheme(nextTheme);
      try {
        localStorage.setItem("portfolio-theme", nextTheme);
      } catch {}
    }, 150);

    setTimeout(() => {
      setActiveTransitionTheme(null);
    }, 600);
  };

  // Baca preferensi tersimpan + tahun, hanya di client setelah mount.
  useEffect(() => {
    setYear(new Date().getFullYear());

    try {
      const savedLang = localStorage.getItem("portfolio-lang");
      if (savedLang === "id" || savedLang === "en") setLang(savedLang);

      const savedTheme = localStorage.getItem("portfolio-theme");
      if (savedTheme === "light" || savedTheme === "dark") {
        setTheme(savedTheme);
        return;
      }
    } catch {}

    setTheme(
      window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light",
    );
  }, []);

  useEffect(() => {
    const controls = animate(splashCount, 100, {
      duration: 1.8,
      ease: "easeInOut",
    });
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2200);
    return () => {
      controls.stop();
      clearTimeout(timer);
    };
  }, [splashCount]);

  useEffect(() => {
    document.body.style.overflow = showSplash ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [showSplash]);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  useEffect(() => {
    document.documentElement.lang = lang;

    const seoData = {
      en: {
        title:
          "Diva Alfahrizy | Mid-level Fullstack Engineer & UI/UX Architect",
        description:
          "Mid-level Fullstack Engineer & UI/UX Architect specializing in high-performance real-time applications, serverless architecture, and modern landing pages.",
        keywords:
          "Mid-level Fullstack Engineer, UI/UX Architect, Diva Alfahrizy, React, Next.js, TypeScript, Portfolio, Web Developer, Web Designer, Technical Architect",
      },
      id: {
        title: "Diva Alfahrizy | Mid-level Fullstack Engineer & UI/UX Arsitek",
        description:
          "Mid-level Fullstack Engineer & UI/UX Architect berspesialisasi dalam membangun aplikasi real-time berkinerja tinggi, arsitektur serverless, dan landing page modern.",
        keywords:
          "Mid-level Fullstack Engineer, UI/UX Architect, Diva Alfahrizy, React, Next.js, TypeScript, Portofolio, Web Developer, Arsitek Teknis",
      },
    };

    const currentSeo = seoData[lang];

    document.title = currentSeo.title;

    const setMetaTagValue = (selector: string, value: string) => {
      const element = document.querySelector(selector);
      if (element) {
        element.setAttribute("content", value);
      }
    };

    setMetaTagValue('meta[name="description"]', currentSeo.description);
    setMetaTagValue('meta[name="keywords"]', currentSeo.keywords);
    setMetaTagValue('meta[property="og:title"]', currentSeo.title);
    setMetaTagValue('meta[property="og:description"]', currentSeo.description);
    setMetaTagValue('meta[name="twitter:title"]', currentSeo.title);
    setMetaTagValue('meta[name="twitter:description"]', currentSeo.description);
  }, [lang]);

  useMotionValueEvent(scrollY, "change", (y) => {
    setShowScrollTop(y > 300);
    setScrolled(y > 20);

    const difference = y - lastY.current;

    if (y < 50) {
      setVisible(true);
    } else if (Math.abs(difference) > 8) {
      if (difference > 0) {
        setVisible(false);
        setMobileMenuOpen(false);
      } else {
        setVisible(true);
      }
      lastY.current = y;
    }
  });

  useEffect(() => {
    const elements = navItems
      .map((item) => document.getElementById(item.observe))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (reduce) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const handlePointerMove = (e: PointerEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, [reduce, mouseX, mouseY]);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: reduce ? "auto" : "smooth",
        block: "start",
      });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: reduce ? "auto" : "smooth",
    });
  };

  return (
    <div
      className="min-h-screen bg-white dark:bg-[#0A0A0B] text-neutral-800 dark:text-[#E2E2E2] transition-colors duration-300 font-sans selection:bg-amber-500/25"
      id="portfolio-app-root"
    >
      <motion.div
        aria-hidden="true"
        className="fixed top-0 left-0 right-0 h-0.75 z-100 origin-left bg-linear-to-r from-amber-500 via-orange-500 to-red-500 dark:from-amber-400 dark:via-orange-400 dark:to-rose-500 shadow-[0_0_12px_rgba(245,158,11,0.6)]"
        style={{ scaleX: progress }}
        id="scroll-progress-indicator"
      />

      {!reduce && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-5 hidden md:block"
          style={{ background: spotlight }}
          id="cursor-spotlight"
        />
      )}

      <AnimatePresence mode="wait">
        {showSplash && (
          <motion.div
            key="splash-screen"
            initial={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-9999 bg-[#0A0A0B] flex flex-col items-center justify-center p-6 text-white overflow-hidden"
            id="app-splash-screen"
          >
            <div className="absolute inset-0 pointer-events-none opacity-70 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-size-[44px_44px] mask-[radial-gradient(ellipse_at_center,black,transparent_70%)]" />

            <motion.div
              aria-hidden="true"
              animate={
                reduce
                  ? undefined
                  : { scale: [1, 1.2, 1], opacity: [0.5, 0.9, 0.5] }
              }
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute w-95 h-95 rounded-full bg-amber-500/15 blur-[100px] pointer-events-none"
            />

            <div className="relative flex flex-col items-center max-w-sm text-center">
              <motion.div
                initial={{ scale: 0.6, opacity: 0, rotate: -12 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                transition={{ delay: 0.15, duration: 0.7, type: "spring" }}
                className="relative w-20 h-20"
                id="splash-monogram"
              >
                <motion.div
                  aria-hidden="true"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 rounded-3xl bg-[conic-gradient(from_0deg,transparent_0%,transparent_55%,rgba(245,158,11,0.95)_100%)]"
                />
                <div className="absolute inset-0.5 rounded-[22px] bg-[#0A0A0B] flex items-center justify-center font-mono font-bold text-2xl text-white shadow-[0_0_40px_rgba(245,158,11,0.2)]">
                  DA
                </div>
              </motion.div>

              <h1
                aria-label="Diva Alfahrizy"
                className="mt-7 font-sans text-2xl md:text-3xl font-light tracking-tight text-white/90"
              >
                {"Diva Alfahrizy".split("").map((char, i) => (
                  <motion.span
                    key={i}
                    initial={{ y: 24, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{
                      delay: 0.5 + i * 0.04,
                      duration: 0.5,
                      ease: EASE,
                    }}
                    className="inline-block"
                    aria-hidden="true"
                  >
                    {char === " " ? "\u00A0" : char}
                  </motion.span>
                ))}
              </h1>

              <motion.p
                initial={{ y: 15, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.1, duration: 0.5 }}
                className="mt-2 font-mono text-[10px] text-amber-500/85 uppercase tracking-[0.3em]"
              >
                {lang === "en"
                  ? "Technical Architect Portfolio"
                  : "Portofolio Arsitek Teknis"}
              </motion.p>

              <div className="mt-10 w-56 h-0.5 bg-white/10 rounded-full overflow-hidden relative">
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1.8, ease: "easeInOut" }}
                  className="absolute top-0 left-0 h-full bg-linear-to-r from-amber-500 to-orange-500 rounded-full shadow-[0_0_12px_rgba(245,158,11,0.8)]"
                />
              </div>

              <div className="mt-3.5 w-56 flex items-center justify-between font-mono text-[9px] text-white/50 tracking-wider">
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.7 }}
                  transition={{ delay: 0.8, duration: 0.3 }}
                >
                  {lang === "en"
                    ? "INITIALIZING SYSTEM..."
                    : "MEMPERSIAPKAN SISTEM..."}
                </motion.span>
                <span className="tabular-nums text-amber-400/90">
                  <motion.span>{splashText}</motion.span>%
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: visible ? 0 : -120, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 28 }}
        className="fixed top-3 inset-x-0 z-40 px-3 md:px-6"
        id="main-navigation-header"
      >
        <div
          className={`max-w-6xl mx-auto h-16 px-4 md:px-5 flex items-center justify-between rounded-2xl border backdrop-blur-xl transition-all duration-300 ${
            scrolled
              ? "bg-white/80 dark:bg-[#0A0A0B]/80 border-neutral-200/70 dark:border-white/10 shadow-lg shadow-black/5 dark:shadow-black/40"
              : "bg-white/40 dark:bg-[#0A0A0B]/40 border-transparent"
          }`}
          id="navbar-container"
        >
          <button
            onClick={() => scrollToSection("hero-section")}
            className="flex items-center gap-2.5 font-bold text-lg text-neutral-900 dark:text-white cursor-pointer group rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/60"
            aria-label="Diva Alfahrizy - Home"
            id="nav-logo"
          >
            <div
              className="w-9 h-9 rounded-xl bg-neutral-900 dark:bg-white/5 border dark:border-white/15 flex items-center justify-center text-white font-mono font-bold text-xs transition-all duration-300 group-hover:rotate-6 group-hover:scale-105 group-hover:shadow-[0_0_20px_rgba(245,158,11,0.35)]"
              id="logo-icon"
            >
              DA
            </div>
            <div className="text-left leading-none" id="logo-text">
              <span className="block font-sans tracking-tight">
                Diva Alfahrizy
              </span>
              <span className="block text-[10px] font-mono text-neutral-400 dark:text-white/30 font-normal mt-0.5 uppercase tracking-wider">
                TECHNICAL ARCHITECT
              </span>
            </div>
          </button>

          <nav
            className="hidden lg:flex items-center gap-1 text-xs font-mono tracking-wider uppercase font-medium"
            aria-label="Primary"
            id="desktop-links"
          >
            {navItems.map((item) => {
              const active = activeSection === item.observe;
              return (
                <button
                  key={item.key}
                  onClick={() => scrollToSection(item.target)}
                  aria-current={active ? "true" : undefined}
                  className={`relative px-3.5 py-2 rounded-xl cursor-pointer transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/60 ${
                    active
                      ? "text-neutral-900 dark:text-white"
                      : "text-neutral-500 hover:text-neutral-900 dark:text-white/40 dark:hover:text-white"
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="nav-active-pill"
                      className="absolute inset-0 rounded-xl bg-neutral-900/5 dark:bg-white/10 border border-neutral-900/5 dark:border-white/10"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 30,
                      }}
                    >
                      <span className="absolute left-1/2 bottom-1 -translate-x-1/2 w-1 h-1 rounded-full bg-amber-500" />
                    </motion.span>
                  )}
                  <span className="relative">{dict.nav[item.key]}</span>
                </button>
              );
            })}
          </nav>

          <div
            className="hidden lg:flex items-center gap-2"
            id="utility-switches"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.94 }}
              onClick={toggleLanguage}
              className="p-2 px-3 rounded-xl hover:bg-neutral-100 dark:hover:bg-white/5 text-neutral-500 dark:text-white/50 font-mono text-xs transition-colors cursor-pointer flex items-center gap-1.5 border border-neutral-200 dark:border-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/60"
              title={lang === "en" ? "Ganti Bahasa" : "Switch Language"}
              aria-label={lang === "en" ? "Ganti Bahasa" : "Switch Language"}
              id="lang-toggler-btn"
            >
              <IconGlobe className="w-3.5 h-3.5" />
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={lang}
                  initial={{ y: 8, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -8, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  {lang === "en" ? "EN" : "ID"}
                </motion.span>
              </AnimatePresence>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={toggleTheme}
              className="p-2 px-2.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-white/5 text-neutral-500 dark:text-white/50 transition-colors cursor-pointer border border-neutral-200 dark:border-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/60"
              title={
                theme === "light"
                  ? "Activate dark theme"
                  : "Activate light theme"
              }
              aria-label={
                theme === "light"
                  ? "Activate dark theme"
                  : "Activate light theme"
              }
              id="theme-toggler-btn"
            >
              <ThemeIcon theme={theme} />
            </motion.button>
          </div>

          <div
            className="flex lg:hidden items-center gap-1"
            id="mobile-controls-row"
          >
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl text-neutral-600 dark:text-neutral-400 cursor-pointer"
              aria-label="Toggle theme"
              id="mobile-theme-toggler-btn"
            >
              <ThemeIcon theme={theme} className="w-4.5 h-4.5" />
            </button>
            <button
              onClick={toggleLanguage}
              className="p-2.5 font-mono text-xs font-bold text-neutral-600 dark:text-neutral-400 cursor-pointer"
              aria-label={lang === "en" ? "Ganti Bahasa" : "Switch Language"}
              id="mobile-lang-toggler-btn"
            >
              {lang === "en" ? "EN" : "ID"}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl text-neutral-700 dark:text-gray-200 cursor-pointer"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
              id="mobile-hamburger-btn"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={mobileMenuOpen ? "close" : "open"}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.18 }}
                  className="flex"
                >
                  {mobileMenuOpen ? (
                    <IconX className="w-6 h-6" />
                  ) : (
                    <IconMenu4 className="w-6 h-6" />
                  )}
                </motion.span>
              </AnimatePresence>
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="fixed inset-0 bg-neutral-950/30 dark:bg-black/50 backdrop-blur-md z-30 lg:hidden cursor-pointer"
              onClick={() => setMobileMenuOpen(false)}
              id="mobile-drawer-overlay"
            />

            <motion.div
              variants={menuContainer}
              initial="hidden"
              animate="show"
              exit={{ opacity: 0, y: -15 }}
              className="fixed inset-x-3 top-21 bg-white/95 dark:bg-[#111113]/95 backdrop-blur-xl border border-neutral-200 dark:border-white/10 rounded-2xl z-35 shadow-2xl lg:hidden flex flex-col p-3"
              id="mobile-drawer-menu"
            >
              {navItems.map((item, index) => {
                const active = activeSection === item.observe;
                return (
                  <motion.button
                    key={item.key}
                    variants={menuItem}
                    onClick={() => scrollToSection(item.target)}
                    className={`flex items-center gap-4 text-left px-4 py-3.5 rounded-xl font-medium transition-colors cursor-pointer text-sm font-sans ${
                      active
                        ? "bg-amber-500/10 text-neutral-900 dark:text-white"
                        : "text-neutral-600 dark:text-white/75 hover:bg-neutral-100 dark:hover:bg-white/5 hover:text-neutral-900 dark:hover:text-white"
                    }`}
                  >
                    <span className="font-mono text-[10px] text-amber-500/80 tabular-nums">
                      0{index + 1}
                    </span>
                    <span>{dict.nav[item.key]}</span>
                  </motion.button>
                );
              })}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <main id="portfolio-main-layout">
        <Hero
          lang={lang}
          dict={dict}
          scrollToContact={() => scrollToSection("contact-section")}
          scrollToProjects={() => scrollToSection("projects-section")}
        />

        <Reveal>
          <AboutSection lang={lang} dict={dict} />
        </Reveal>

        <div id="tech-skills-anchor" className="scroll-mt-28"></div>

        <section
          className="py-14 bg-white dark:bg-neutral-950"
          id="skills-section"
        >
          <Reveal>
            <div className="max-w-7xl mx-auto px-6 md:px-8 mb-10">
              <SectionTitle
                title={dict.skills.title}
                subtitle={dict.skills.subtitle}
              />
            </div>
            <SkillsCarousel lang={lang} />
          </Reveal>
        </section>

        <div
          className="relative max-w-5xl mx-auto px-6 py-6 md:py-10 flex items-center justify-center overflow-hidden"
          id="skills-experience-divider"
        >
          <div
            className="absolute inset-0 flex items-center"
            aria-hidden="true"
          >
            <div className="w-full border-t border-neutral-200/60 dark:border-white/5"></div>
          </div>
          <div className="relative flex justify-center">
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              whileInView={{ width: "160px", opacity: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="h-0.5 bg-linear-to-r from-transparent via-amber-500/80 to-transparent absolute -top-px"
            />
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 5 }}
              whileInView={{ scale: 1, opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.15 }}
              className="bg-white dark:bg-[#0A0A0B] border border-neutral-200 dark:border-white/10 px-4 py-1.5 rounded-full flex items-center gap-2 shadow-sm transition-colors duration-150"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              <span className="text-[9px] font-mono tracking-widest text-neutral-400 dark:text-white/35 uppercase">
                {lang === "en" ? "BIO & TIMELINE" : "RIWAYAT & PERJALANAN"}
              </span>
              <div className="w-1.5 h-1.5 rounded-full bg-amber-500/30" />
            </motion.div>
          </div>
        </div>

        <Reveal>
          <ExperienceTimeline lang={lang} dict={dict} />
        </Reveal>

        <ProjectGallery lang={lang} dict={dict} />

        <Reveal>
          <StatsDashboard lang={lang} dict={dict} />
        </Reveal>

        <section
          className="py-16 bg-neutral-50/50 dark:bg-neutral-950/20 border-t border-neutral-200/50 dark:border-white/5 scroll-mt-24"
          id="testimonials-section"
        >
          <Reveal>
            <div className="max-w-7xl mx-auto px-6 md:px-8 mb-10">
              <SectionTitle
                title={dict.testimonials?.title}
                subtitle={dict.testimonials?.subtitle}
              />
            </div>
            <TestimonialsMarquee lang={lang} />
          </Reveal>
        </section>

        <Reveal>
          <ContactForm lang={lang} dict={dict} />
        </Reveal>
      </main>

      <footer
        className="relative bg-neutral-50 dark:bg-[#0A0A0B] border-t border-neutral-200 dark:border-white/5 py-16 transition-colors duration-300 overflow-hidden"
        id="portfolio-standard-footer"
      >
        <motion.div
          aria-hidden="true"
          initial={{ scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: EASE }}
          className="absolute top-0 inset-x-0 h-px bg-linear-to-r from-transparent via-amber-500/70 to-transparent origin-center"
        />
        <motion.div
          aria-hidden="true"
          animate={reduce ? undefined : { opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="pointer-events-none absolute -bottom-32 left-1/2 -translate-x-1/2 w-130 h-55 rounded-full bg-amber-500/10 blur-[90px]"
        />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.8, ease: EASE }}
          className="relative max-w-7xl mx-auto px-6 md:px-8 flex flex-col md:flex-row items-center justify-between gap-8"
          id="footer-container"
        >
          <div
            className="text-center md:text-left space-y-2"
            id="footer-branding-block"
          >
            <div className="flex items-center justify-center md:justify-start gap-2 text-neutral-900 dark:text-white font-bold">
              <IconTerminal className="w-4 h-4 text-amber-500" />
              <span className="font-sans leading-none tracking-tight">
                Muhammad Diva Alfahrizy
              </span>
            </div>
            <p className="text-neutral-400 dark:text-white/30 text-xs max-w-md font-sans font-light">
              {dict.footer.tagline}
            </p>
          </div>

          <div
            className="flex flex-col items-center md:items-end gap-4"
            id="footer-links-block"
          >
            <div
              className="flex flex-wrap items-center justify-center md:justify-end gap-3.5"
              id="footer-social-logos"
            >
              <motion.a
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.97 }}
                href="/diva_alfahrizy_resume.pdf"
                download="Diva_Alfahrizy_Resume.pdf"
                className="group relative overflow-hidden inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 dark:bg-amber-500/10 dark:hover:bg-amber-500/20 text-white dark:text-amber-400 border border-amber-500 dark:border-amber-400/20 text-xs font-mono tracking-wide transition-colors shadow-xs cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/60"
                title={
                  lang === "en" ? "Download PDF Resume" : "Unduh Resume PDF"
                }
                id="footer-resume-download-btn"
              >
                <span
                  aria-hidden="true"
                  className="absolute inset-y-0 -left-full w-1/2 -skew-x-12 bg-white/30 dark:bg-amber-300/20 transition-transform duration-700 group-hover:translate-x-[400%]"
                />
                <IconFileDownload className="relative w-3.5 h-3.5 transition-transform group-hover:translate-y-0.5" />
                <span className="relative">{dict.footer.downloadResume}</span>
              </motion.a>

              <span className="w-px h-4 bg-neutral-200 dark:bg-white/10 self-center hidden sm:inline-block"></span>

              {socials.map(({ id, href, label, Icon, hover, external }) => (
                <motion.a
                  key={id}
                  whileHover={{ scale: 1.15, y: -3 }}
                  whileTap={{ scale: 0.92 }}
                  transition={{ type: "spring", stiffness: 400, damping: 18 }}
                  href={href}
                  {...(external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  aria-label={label}
                  className={`p-2.5 rounded-xl bg-white dark:bg-white/5 border border-neutral-200 dark:border-white/10 text-neutral-500 dark:text-white/40 ${hover} hover:border-amber-500/40 hover:shadow-[0_0_18px_rgba(245,158,11,0.18)] transition-colors shadow-xs cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/60`}
                  id={id}
                >
                  <Icon className="w-4 h-4" />
                </motion.a>
              ))}
            </div>
            <p
              className="text-neutral-400 dark:text-white/30 text-[10px] font-mono tracking-wider whitespace-nowrap"
              id="copyright-text"
            >
              © {year ?? ""} Diva Alfahrizy. {dict.footer.rights}
            </p>
          </div>
        </motion.div>
      </footer>

      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            key="scroll-to-top"
            onClick={scrollToTop}
            initial={{ opacity: 0, scale: 0.6, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.6, y: 16 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            transition={{ type: "spring", stiffness: 320, damping: 22 }}
            className="fixed bottom-24 right-8 z-45 w-12 h-12 bg-white dark:bg-[#111113] text-neutral-600 dark:text-white/70 hover:text-neutral-900 dark:hover:text-white rounded-full shadow-lg cursor-pointer flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/60"
            title={lang === "en" ? "Back to Top" : "Kembali ke Atas"}
            aria-label={lang === "en" ? "Back to Top" : "Kembali ke Atas"}
            id="scroll-to-top-btn"
          >
            <svg
              className="absolute inset-0 -rotate-90"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <circle
                cx="24"
                cy="24"
                r="22"
                fill="none"
                strokeWidth="2"
                className="stroke-neutral-200 dark:stroke-white/10"
              />
              <motion.circle
                cx="24"
                cy="24"
                r="22"
                fill="none"
                strokeWidth="2"
                strokeLinecap="round"
                className="stroke-amber-500"
                style={{ pathLength: progress }}
              />
            </svg>
            <IconArrowUpDashed className="relative w-4 h-4" />
          </motion.button>
        )}
      </AnimatePresence>

      <AIAssistant lang={lang} />

      <motion.button
        key="floating-theme-switcher"
        onClick={toggleTheme}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.08, rotate: 8 }}
        whileTap={{ scale: 0.92 }}
        className="fixed bottom-8 left-8 z-40 p-3 bg-white dark:bg-[#111113] text-neutral-600 dark:text-white/70 hover:text-neutral-900 dark:hover:text-white border border-neutral-300 dark:border-white/15 rounded-xl shadow-md hover:shadow-[0_0_20px_rgba(245,158,11,0.2)] transition-shadow duration-200 cursor-pointer flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/60"
        title={
          theme === "light" ? "Activate dark theme" : "Activate light theme"
        }
        aria-label={
          theme === "light" ? "Activate dark theme" : "Activate light theme"
        }
        id="floating-theme-toggle-btn"
      >
        <ThemeIcon theme={theme} />
      </motion.button>

      <AnimatePresence>
        {activeTransitionTheme && (
          <motion.div
            key="theme-transition-lock"
            initial={{
              clipPath: `circle(0% at ${transitionOrigin.x} ${transitionOrigin.y})`,
            }}
            animate={{
              clipPath: `circle(150% at ${transitionOrigin.x} ${transitionOrigin.y})`,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
            className={`fixed inset-0 z-10000 pointer-events-none flex items-center justify-center ${
              activeTransitionTheme === "dark" ? "bg-[#0A0A0B]" : "bg-white"
            }`}
            id="premium-theme-transition-overlay"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: [0, 1, 0.9, 0], scale: [0.8, 1.1, 1, 1.15] }}
              transition={{ duration: 0.55, ease: "easeInOut" }}
              className={`w-60 h-60 rounded-full flex flex-col items-center justify-center font-mono text-[9px] tracking-widest uppercase transition-colors duration-150 ${
                activeTransitionTheme === "dark"
                  ? "bg-amber-400/5 text-amber-400 border border-amber-400/15 shadow-[0_0_50px_rgba(245,158,11,0.15)]"
                  : "bg-neutral-900/5 text-neutral-800 border border-neutral-800/10 shadow-lg"
              }`}
            >
              {activeTransitionTheme === "dark" ? (
                <>
                  <IconMoonFilled className="w-5 h-5 mb-2.5 animate-pulse" />
                  <span>DARKING SYSTEM</span>
                </>
              ) : (
                <>
                  <IconSunFilled
                    className="w-5 h-5 mb-2.5 text-amber-500 animate-spin"
                    style={{ animationDuration: "3s" }}
                  />
                  <span>LIGHTING SYSTEM</span>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
