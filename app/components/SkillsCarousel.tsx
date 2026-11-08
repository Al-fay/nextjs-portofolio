"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  animate,
  useInView,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";
import { skillsList } from "../data";
import { TechIcon } from "./TechIcon";
import {
  IconChevronLeft,
  IconChevronRight,
  IconPlayerPause,
  IconPlayerPlay,
} from "@tabler/icons-react";

interface SkillsCarouselProps {
  lang: "en" | "id";
}

const AUTOPLAY_MS = 3000;
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const copy = {
  en: {
    all: "All",
    region: "Skills carousel",
    filter: "Filter skills by category",
    prev: "Previous skills",
    next: "Next skills",
    pause: "Pause autoplay",
    play: "Start autoplay",
    slide: (n: number, t: number) => `Skill ${n} of ${t}`,
    goTo: (n: number) => `Go to slide ${n}`,
  },
  id: {
    all: "Semua",
    region: "Carousel keahlian",
    filter: "Filter keahlian berdasarkan kategori",
    prev: "Keahlian sebelumnya",
    next: "Keahlian berikutnya",
    pause: "Jeda otomatis",
    play: "Mulai otomatis",
    slide: (n: number, t: number) => `Keahlian ${n} dari ${t}`,
    goTo: (n: number) => `Ke slide ${n}`,
  },
} as const;

const categoryLabels: Record<string, string> = {
  frontend: "Frontend",
  backend: "Backend",
  database: "Database",
  tools: "Tools",
  devops: "DevOps",
};

const labelOf = (c: string) =>
  categoryLabels[c] ?? c.charAt(0).toUpperCase() + c.slice(1);

const pad = (n: number) => String(n).padStart(2, "0");

interface Theme {
  glow: string;
  tile: string;
  icon: string;
  badge: string;
  dot: string;
  bar: string;
  ambient: string;
}

const themes: Record<string, Theme> = {
  frontend: {
    glow: "rgba(59,130,246,0.20)",
    tile: "from-blue-500/25 via-blue-500/5 to-transparent border-blue-500/20",
    icon: "text-blue-600 dark:text-blue-400",
    badge:
      "bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-500/10 dark:text-blue-300 dark:border-blue-500/20",
    dot: "bg-blue-500",
    bar: "from-blue-500 to-cyan-400",
    ambient: "bg-blue-500/20",
  },
  backend: {
    glow: "rgba(16,185,129,0.20)",
    tile: "from-emerald-500/25 via-emerald-500/5 to-transparent border-emerald-500/20",
    icon: "text-emerald-600 dark:text-emerald-400",
    badge:
      "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/20",
    dot: "bg-emerald-500",
    bar: "from-emerald-500 to-teal-400",
    ambient: "bg-emerald-500/20",
  },
  database: {
    glow: "rgba(6,182,212,0.20)",
    tile: "from-cyan-500/25 via-cyan-500/5 to-transparent border-cyan-500/20",
    icon: "text-cyan-600 dark:text-cyan-400",
    badge:
      "bg-cyan-50 text-cyan-700 border-cyan-100 dark:bg-cyan-500/10 dark:text-cyan-300 dark:border-cyan-500/20",
    dot: "bg-cyan-500",
    bar: "from-cyan-500 to-sky-400",
    ambient: "bg-cyan-500/20",
  },
  tools: {
    glow: "rgba(245,158,11,0.20)",
    tile: "from-amber-500/25 via-amber-500/5 to-transparent border-amber-500/20",
    icon: "text-amber-600 dark:text-amber-400",
    badge:
      "bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/20",
    dot: "bg-amber-500",
    bar: "from-amber-500 to-orange-400",
    ambient: "bg-amber-500/20",
  },
  devops: {
    glow: "rgba(147,51,234,0.22)",
    tile: "from-purple-500/25 via-purple-500/5 to-transparent border-purple-500/20",
    icon: "text-purple-600 dark:text-purple-400",
    badge:
      "bg-purple-50 text-purple-700 border-purple-100 dark:bg-purple-500/10 dark:text-purple-300 dark:border-purple-500/25",
    dot: "bg-purple-500",
    bar: "from-purple-500 to-fuchsia-400",
    ambient: "bg-purple-500/20",
  },
};

const fallbackTheme: Theme = {
  glow: "rgba(115,115,115,0.18)",
  tile: "from-neutral-500/20 via-neutral-500/5 to-transparent border-neutral-500/20",
  icon: "text-neutral-600 dark:text-neutral-300",
  badge:
    "bg-neutral-50 text-neutral-600 border-neutral-200 dark:bg-white/5 dark:text-neutral-300 dark:border-white/10",
  dot: "bg-neutral-400",
  bar: "from-neutral-400 to-neutral-300",
  ambient: "bg-neutral-500/15",
};

const getTheme = (category?: string): Theme =>
  (category && themes[category]) || fallbackTheme;

interface SkillCardProps {
  name: string;
  icon: string;
  category: string;
  order: number;
  isActive: boolean;
  reduced: boolean;
}

const SkillCard: React.FC<SkillCardProps> = ({
  name,
  icon,
  category,
  order,
  isActive,
  reduced,
}) => {
  const theme = getTheme(category);
  const ref = useRef<HTMLDivElement>(null);

  const mx = useMotionValue(-300);
  const my = useMotionValue(-300);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const springRx = useSpring(rx, { stiffness: 220, damping: 20 });
  const springRy = useSpring(ry, { stiffness: 220, damping: 20 });
  const spotlight = useMotionTemplate`radial-gradient(220px circle at ${mx}px ${my}px, ${theme.glow}, transparent 75%)`;

  const handleMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const px = e.clientX - r.left;
    const py = e.clientY - r.top;
    mx.set(px);
    my.set(py);
    if (!reduced) {
      ry.set((px / r.width - 0.5) * 12);
      rx.set(-(py / r.height - 0.5) * 12);
    }
  };

  const handleLeave = () => {
    rx.set(0);
    ry.set(0);
    mx.set(-300);
    my.set(-300);
  };

  const floating = isActive && !reduced;

  return (
    <motion.div
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      style={{
        rotateX: springRx,
        rotateY: springRy,
        transformPerspective: 900,
      }}
      animate={{ opacity: isActive ? 1 : 0.5, scale: isActive ? 1 : 0.965 }}
      whileHover={reduced ? undefined : { y: -6 }}
      transition={{ type: "spring", stiffness: 260, damping: 24 }}
      className="group relative h-full min-h-[190px] overflow-hidden rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm transition-[border-color,box-shadow] duration-300 hover:border-neutral-300 hover:shadow-xl dark:border-white/10 dark:bg-[#111113] dark:hover:border-white/20 md:p-6"
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: spotlight }}
      />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-neutral-300/70 to-transparent dark:via-white/20"
      />

      <span
        aria-hidden
        className="pointer-events-none absolute inset-y-0 -left-full w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-1000 ease-out group-hover:translate-x-[400%] dark:via-white/10"
      />

      <div
        aria-hidden
        className={`pointer-events-none absolute -bottom-5 -right-5 opacity-[0.05] transition-all duration-500 group-hover:rotate-12 group-hover:scale-110 group-hover:opacity-[0.1] ${theme.icon}`}
      >
        <TechIcon name={icon} className="h-28 w-28 -rotate-12" />
      </div>

      <div className="relative flex h-full flex-col justify-between">
        <div>
          <div className="mb-5 flex items-start justify-between">
            <motion.div
              animate={floating ? { y: [0, -4, 0] } : { y: 0 }}
              transition={
                floating
                  ? {
                      duration: 3 + (order % 3) * 0.6,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: (order % 5) * 0.2,
                    }
                  : { duration: 0.3 }
              }
              className="relative"
            >
              <span
                aria-hidden
                className={`pointer-events-none absolute -inset-1.5 rounded-2xl border border-dashed border-current opacity-0 transition-opacity duration-300 group-hover:opacity-40 group-hover:animate-[spin_8s_linear_infinite] motion-reduce:animate-none ${theme.icon}`}
              />
              <div
                className={`relative flex h-12 w-12 items-center justify-center rounded-xl border bg-gradient-to-br transition-transform duration-300 group-hover:-rotate-3 group-hover:scale-110 ${theme.tile} ${theme.icon}`}
              >
                <TechIcon name={icon} className="h-6 w-6" />
              </div>
            </motion.div>

            <span
              aria-hidden
              className="font-mono text-2xl font-semibold tabular-nums leading-none text-neutral-200 transition-colors duration-300 group-hover:text-neutral-300 dark:text-white/10 dark:group-hover:text-white/25"
            >
              {pad(order + 1)}
            </span>
          </div>

          <h3 className="text-base font-semibold leading-snug text-neutral-900 dark:text-white/90 md:text-lg">
            {name}
          </h3>
        </div>

        <div className="mt-5">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[11px] uppercase tracking-wider ${theme.badge}`}
          >
            <span className="relative flex h-1.5 w-1.5">
              <span
                className={`relative inline-flex h-1.5 w-1.5 rounded-full ${theme.dot}`}
              />

              {isActive && (
                <span
                  aria-hidden="true"
                  className={`absolute inset-0 rounded-full opacity-60 ${
                    reduced ? "" : "animate-ping"
                  } ${theme.dot}`}
                />
              )}
            </span>

            {labelOf(category)}
          </span>
        </div>
      </div>

      <div
        aria-hidden
        className={`absolute bottom-0 left-0 h-[3px] w-full origin-left scale-x-0 bg-gradient-to-r transition-transform duration-500 ease-out group-hover:scale-x-100 ${theme.bar}`}
      />
    </motion.div>
  );
};

function useClientReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const update = () => setReduced(mediaQuery.matches);

    update();

    mediaQuery.addEventListener("change", update);

    return () => {
      mediaQuery.removeEventListener("change", update);
    };
  }, []);

  return reduced;
}

export const SkillsCarousel: React.FC<SkillsCarouselProps> = ({ lang }) => {
  const t = copy[lang];
  const reduced = useClientReducedMotion();

  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef, { amount: 0.25 });

  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(4);
  const [trackWidth, setTrackWidth] = useState(0);

  const [userPaused, setUserPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [tabHidden, setTabHidden] = useState(false);

  const x = useMotionValue(0);
  const progress = useMotionValue(0);

  const categories = useMemo(
    () => Array.from(new Set(skillsList.map((s) => s.category))),
    [],
  );

  const items = useMemo(
    () =>
      activeCategory === "all"
        ? skillsList
        : skillsList.filter((s) => s.category === activeCategory),
    [activeCategory],
  );

  const totalItems = items.length;
  const maxIndex = Math.max(0, totalItems - visibleCount);
  const slideW = trackWidth / visibleCount;

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w >= 1280) setVisibleCount(5);
      else if (w >= 1024) setVisibleCount(4);
      else if (w >= 768) setVisibleCount(3);
      else if (w >= 640) setVisibleCount(2);
      else setVisibleCount(1);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setTrackWidth(el.clientWidth));
    ro.observe(el);
    setTrackWidth(el.clientWidth);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const onVis = () => setTabHidden(document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  useEffect(() => {
    if (currentIndex > maxIndex) setCurrentIndex(maxIndex);
  }, [maxIndex, currentIndex]);

  useEffect(() => {
    if (!slideW) return;
    const controls = animate(
      x,
      -currentIndex * slideW,
      reduced
        ? { duration: 0 }
        : { type: "spring", stiffness: 210, damping: 28 },
    );
    return () => controls.stop();
  }, [currentIndex, slideW, reduced, x]);

  const isRunning =
    !userPaused &&
    !hovered &&
    !focused &&
    !dragging &&
    !tabHidden &&
    maxIndex > 0;

  useEffect(() => {
    progress.set(0);
  }, [currentIndex, activeCategory, progress]);

  useEffect(() => {
    if (!isRunning) return;
    const remaining = (AUTOPLAY_MS / 1000) * (1 - progress.get());
    const controls = animate(progress, 1, {
      duration: Math.max(remaining, 0.05),
      ease: "linear",
      onComplete: () => setCurrentIndex((p) => (p >= maxIndex ? 0 : p + 1)),
    });
    return () => controls.stop();
  }, [isRunning, currentIndex, activeCategory, maxIndex, progress]);

  const goNext = () => setCurrentIndex((p) => (p >= maxIndex ? 0 : p + 1));
  const goPrev = () => setCurrentIndex((p) => (p <= 0 ? maxIndex : p - 1));

  const selectCategory = (c: string) => {
    if (c === activeCategory) return;
    setActiveCategory(c);
    setCurrentIndex(0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      goNext();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      goPrev();
    }
  };

  const handleDragEnd = (_: unknown, info: { velocity: { x: number } }) => {
    setDragging(false);
    if (!slideW) return;
    const projected = x.get() + info.velocity.x * 0.2;
    const target = Math.min(
      maxIndex,
      Math.max(0, Math.round(-projected / slideW)),
    );
    animate(
      x,
      -target * slideW,
      reduced
        ? { duration: 0 }
        : { type: "spring", stiffness: 210, damping: 28 },
    );
    setCurrentIndex(target);
  };

  const lastVisible = Math.min(totalItems, currentIndex + visibleCount);
  const leadItem =
    items[
      Math.min(items.length - 1, currentIndex + Math.floor(visibleCount / 2))
    ];
  const ambient = getTheme(leadItem?.category).ambient;

  const countFor = (c: string) =>
    c === "all"
      ? skillsList.length
      : skillsList.filter((s) => s.category === c).length;

  const arrowClass =
    "absolute top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-neutral-200 bg-white/90 text-neutral-600 shadow-md backdrop-blur transition hover:scale-105 hover:border-amber-500/40 hover:bg-white hover:text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 active:scale-95 dark:border-white/10 dark:bg-[#111113]/90 dark:text-white/65 dark:hover:bg-[#18181b] dark:hover:text-white sm:flex";

  return (
    <div
      ref={containerRef}
      id="skills-carousel-container"
      role="region"
      aria-roledescription="carousel"
      aria-label={t.region}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onPointerEnter={(e) => e.pointerType === "mouse" && setHovered(true)}
      onPointerLeave={(e) => e.pointerType === "mouse" && setHovered(false)}
      onFocus={(e) => {
        if ((e.target as HTMLElement).matches(":focus-visible"))
          setFocused(true);
      }}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null))
          setFocused(false);
      }}
      className="relative mx-auto w-full max-w-7xl select-none rounded-3xl px-6 py-4 outline-none focus-visible:ring-2 focus-visible:ring-amber-500/60 md:px-8"
    >
      <motion.div
        aria-hidden
        animate={
          reduced ? undefined : { scale: [1, 1.12, 1], opacity: [0.7, 1, 0.7] }
        }
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className={`pointer-events-none absolute inset-x-16 top-1/2 h-48 -translate-y-1/2 rounded-full blur-3xl transition-colors duration-700 ${ambient}`}
      />

      <div
        role="tablist"
        aria-label={t.filter}
        className="relative mb-4 flex flex-wrap items-center justify-center gap-2"
      >
        {["all", ...categories].map((c) => {
          const selected = c === activeCategory;
          return (
            <motion.button
              key={c}
              role="tab"
              aria-selected={selected}
              onClick={() => selectCategory(c)}
              whileHover={reduced ? undefined : { y: -2 }}
              whileTap={reduced ? undefined : { scale: 0.96 }}
              className={`relative flex min-h-[40px] cursor-pointer items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 ${
                selected
                  ? "text-white dark:text-neutral-900"
                  : "text-neutral-600 hover:text-neutral-900 dark:text-white/60 dark:hover:text-white"
              }`}
            >
              {selected && (
                <motion.span
                  layoutId="skills-filter-pill"
                  className="absolute inset-0 rounded-full bg-neutral-900 shadow-[0_4px_20px_rgba(245,158,11,0.25)] dark:bg-white"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              {!selected && (
                <span
                  aria-hidden
                  className="absolute inset-0 rounded-full border border-neutral-200 transition-colors hover:border-amber-500/40 dark:border-white/10"
                />
              )}
              <span className="relative">
                {c === "all" ? t.all : labelOf(c)}
              </span>
              <span
                className={`relative rounded-full px-1.5 font-mono text-[11px] tabular-nums ${
                  selected
                    ? "bg-white/20 dark:bg-neutral-900/10"
                    : "bg-neutral-100 text-neutral-500 dark:bg-white/5 dark:text-white/40"
                }`}
              >
                {countFor(c)}
              </span>
            </motion.button>
          );
        })}
      </div>

      <div className="relative" id="carousel-viewport-wrapper">
        <div
          id="carousel-inner-overflow"
          className="overflow-hidden px-1 py-6 [-webkit-mask-image:linear-gradient(to_right,transparent,#000_4%,#000_96%,transparent)] [mask-image:linear-gradient(to_right,transparent,#000_4%,#000_96%,transparent)]"
        >
          <motion.div
            ref={trackRef}
            id="carousel-slider-track"
            className="flex cursor-grab active:cursor-grabbing"
            style={{ x }}
            drag={maxIndex > 0 ? "x" : false}
            dragConstraints={{ left: -maxIndex * slideW, right: 0 }}
            dragElastic={0.14}
            dragMomentum={false}
            onDragStart={() => setDragging(true)}
            onDragEnd={handleDragEnd}
            aria-live={isRunning ? "off" : "polite"}
          >
            {items.map((skill, idx) => {
              const isActive =
                idx >= currentIndex && idx < currentIndex + visibleCount;
              return (
                <motion.div
                  key={`${activeCategory}-${skill.name}`}
                  id={`carousel-slide-${idx}`}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={t.slide(idx + 1, totalItems)}
                  aria-hidden={!isActive}
                  initial={reduced ? false : { opacity: 0, y: 28 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: Math.min(idx, 7) * 0.05,
                    duration: 0.5,
                    ease: EASE,
                  }}
                  style={{
                    minWidth: `${100 / visibleCount}%`,
                    padding: "0 10px",
                  }}
                  className="flex-shrink-0"
                >
                  <SkillCard
                    name={skill.name}
                    icon={skill.icon}
                    category={skill.category}
                    order={idx}
                    isActive={isActive}
                    reduced={reduced}
                  />
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {maxIndex > 0 && (
          <>
            <button
              onClick={goPrev}
              aria-label={t.prev}
              id="carousel-btn-prev"
              className={`${arrowClass} -left-4`}
            >
              <IconChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={goNext}
              aria-label={t.next}
              id="carousel-btn-next"
              className={`${arrowClass} -right-4`}
            >
              <IconChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

      {maxIndex > 0 && (
        <div
          id="carousel-bullet-navigation"
          className="relative mt-2 flex items-center justify-center gap-4"
        >
          <motion.button
            onClick={() => setUserPaused((p) => !p)}
            whileHover={reduced ? undefined : { scale: 1.08 }}
            whileTap={reduced ? undefined : { scale: 0.92 }}
            aria-label={userPaused ? t.play : t.pause}
            title={userPaused ? t.play : t.pause}
            id="carousel-btn-play-pause"
            className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-neutral-200 bg-neutral-50 text-neutral-500 transition-colors hover:border-amber-500/40 hover:text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 dark:border-white/10 dark:bg-white/[0.03] dark:text-white/50 dark:hover:text-white"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={userPaused ? "play" : "pause"}
                initial={{ scale: 0.5, opacity: 0, rotate: -45 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                exit={{ scale: 0.5, opacity: 0, rotate: 45 }}
                transition={{ duration: 0.15 }}
                className="flex"
              >
                {userPaused ? (
                  <IconPlayerPlay className="h-4 w-4" />
                ) : (
                  <IconPlayerPause className="h-4 w-4" />
                )}
              </motion.span>
            </AnimatePresence>
          </motion.button>

          <div className="flex items-center">
            {Array.from({ length: maxIndex + 1 }).map((_, i) => {
              const current = i === currentIndex;
              return (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  aria-label={t.goTo(i + 1)}
                  aria-current={current}
                  id={`carousel-dot-${i}`}
                  className="group/dot flex h-11 cursor-pointer items-center px-1 focus-visible:outline-none"
                >
                  <span
                    className={`relative block h-1.5 overflow-hidden rounded-full transition-all duration-300 group-focus-visible/dot:ring-2 group-focus-visible/dot:ring-amber-500 ${
                      current
                        ? "w-10 bg-neutral-200 dark:bg-white/15"
                        : "w-2 bg-neutral-300 group-hover/dot:bg-neutral-400 dark:bg-white/20 dark:group-hover/dot:bg-white/40"
                    }`}
                  >
                    {current && (
                      <motion.span
                        className="absolute inset-0 origin-left rounded-full bg-gradient-to-r from-amber-500 to-orange-400"
                        style={{ scaleX: progress }}
                      />
                    )}
                  </span>
                </button>
              );
            })}
          </div>

          <div
            aria-hidden
            className="hidden items-center gap-1 font-mono text-xs tabular-nums text-neutral-400 dark:text-white/35 sm:flex"
          >
            <div className="relative h-4 w-5 overflow-hidden text-right">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={lastVisible}
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -10, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="absolute inset-0 text-neutral-700 dark:text-white/80"
                >
                  {pad(lastVisible)}
                </motion.span>
              </AnimatePresence>
            </div>
            <span>/ {pad(totalItems)}</span>
          </div>
        </div>
      )}
    </div>
  );
};
