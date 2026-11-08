"use client";

import React, { useCallback, useEffect, useId, useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useInView,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import { Language, TranslationDict, Project } from "../types";
import { projectsList } from "../data";
import {
  IconArrowUpRight,
  IconBook,
  IconCalendar,
  IconChevronLeft,
  IconChevronRight,
  IconExternalLink,
  IconLayersIntersect,
  IconMaximize,
  IconPolaroidFilled,
  IconShieldCheck,
  IconUserCheck,
  IconWorld,
  IconX,
} from "@tabler/icons-react";

interface ProjectGalleryProps {
  lang: Language;
  dict: TranslationDict;
}

type Filter = "all" | "web" | "mobile" | "ai";

const FILTERS = ["all", "web"] as const;
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const TILT_SPRING = { damping: 25, stiffness: 220, mass: 0.6 };

const calculateReadingTime = (text: string) => {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const seconds = Math.ceil((words / 200) * 60);
  if (seconds < 60) {
    return { value: seconds, unitLabel: { en: "sec read", id: "detik baca" } };
  }
  const mins = Math.ceil(words / 200);
  return { value: mins, unitLabel: { en: "min read", id: "menit baca" } };
};

const getImages = (project: Project) =>
  project.images && project.images.length > 0
    ? project.images
    : [project.image];

const AnimatedCounter: React.FC<{
  value: number;
  duration?: number;
  suffix?: string;
  isDecimal?: boolean;
}> = ({ value, duration = 1400, suffix = "", isDecimal = false }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, {
    once: true,
    margin: "-40px",
  });

  const reduce = useReducedMotion();

  // Server dan client selalu memiliki initial state yang sama.
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
      {isDecimal ? count.toFixed(1) : Math.floor(count)}
      {suffix}
    </span>
  );
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
        "radial-gradient(260px circle at var(--mx, 50%) var(--my, 50%), rgba(245,158,11,0.13), transparent 70%)",
    }}
  />
);

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring" as const, stiffness: 90, damping: 15 },
  },
};

const slideVariants = {
  enter: (d: number) => ({ opacity: 0, x: d * 48 }),
  center: { opacity: 1, x: 0 },
  exit: (d: number) => ({ opacity: 0, x: d * -48 }),
};

interface ProjectCardProps {
  proj: Project;
  lang: Language;
  dict: TranslationDict;
  onClick: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  proj,
  lang,
  dict,
  onClick,
}) => {
  const reduce = useReducedMotion();
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);

  const rotateX = useSpring(useTransform(y, [0, 1], [6, -6]), TILT_SPRING);
  const rotateY = useSpring(useTransform(x, [0, 1], [-6, 6]), TILT_SPRING);
  const scale = useMotionValue(1);
  const scaleSpring = useSpring(scale, TILT_SPRING);

  const glareX = useTransform(x, (v) => `${v * 100}%`);
  const glareY = useTransform(y, (v) => `${v * 100}%`);
  const glare = useMotionTemplate`radial-gradient(360px circle at ${glareX} ${glareY}, rgba(245,158,11,0.16), transparent 65%)`;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduce) return;
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width);
    y.set((e.clientY - rect.top) / rect.height);
    scale.set(1.02);
  };

  const handleMouseLeave = () => {
    x.set(0.5);
    y.set(0.5);
    scale.set(1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick();
    }
  };

  const readingTime = calculateReadingTime(proj.description[lang]);

  return (
    <motion.div
      role="button"
      tabIndex={0}
      aria-label={`${proj.title[lang]} - ${dict.projects.viewProject}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onKeyDown={handleKeyDown}
      onClick={onClick}
      style={
        reduce
          ? undefined
          : {
              transformPerspective: 1000,
              rotateX,
              rotateY,
              scale: scaleSpring,
            }
      }
      className="group relative flex h-full cursor-pointer select-none flex-col overflow-hidden rounded-2xl border border-neutral-200/70 bg-white shadow-sm transition-[border-color,box-shadow] duration-300 hover:border-amber-500/30 hover:shadow-xl hover:shadow-amber-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-white/10 dark:bg-[#111113] dark:hover:border-amber-400/25 dark:focus-visible:ring-offset-[#0A0A0B]"
      id={`project-card-${proj.id}`}
    >
      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-20 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: glare }}
      />

      <div
        className="relative aspect-video w-full overflow-hidden bg-neutral-100 dark:bg-neutral-900/60"
        id={`p-image-container-${proj.id}`}
      >
        <div
          className="absolute left-4 top-4 z-10 flex max-w-[80%] flex-wrap items-center gap-1.5"
          id={`p-badges-container-${proj.id}`}
        >
          <span className="rounded-md border border-white/5 bg-neutral-950/85 px-2.5 py-1 text-[9px] font-mono font-normal uppercase tracking-widest text-white/85 backdrop-blur-sm">
            {proj.category}
          </span>
          {proj.featured && (
            <motion.span
              initial={reduce ? false : { opacity: 0, x: -10, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              whileHover={reduce ? undefined : { scale: 1.05 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="flex items-center gap-1.5 rounded-md border border-amber-400 bg-amber-500 px-2.5 py-1 text-[9px] font-mono font-bold uppercase tracking-widest text-neutral-950 shadow-[0_0_14px_rgba(245,158,11,0.3)]"
              id={`featured-badge-${proj.id}`}
            >
              <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
                <span className="absolute inline-flex h-full w-full rounded-full bg-neutral-950 opacity-75 animate-ping motion-reduce:animate-none" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-neutral-950" />
              </span>
              <span>{lang === "en" ? "Case Study" : "Studi Kasus"}</span>
            </motion.span>
          )}
        </div>

        {proj.images && proj.images.length > 1 && (
          <span
            className="absolute right-4 top-4 z-10 flex items-center gap-1.5 rounded-md border border-white/10 bg-neutral-950/85 px-2.5 py-1 text-[9px] font-mono font-medium tracking-wider text-white shadow-sm backdrop-blur-sm"
            title={
              lang === "en"
                ? `${proj.images.length} screenshots available`
                : `${proj.images.length} gambar tersedia`
            }
          >
            <IconPolaroidFilled className="w-3" aria-hidden="true" />
            <span>
              {proj.images.length} {lang === "en" ? "Photos" : "Gambar"}
            </span>
          </span>
        )}

        <img
          src={proj.image}
          alt={proj.title[lang]}
          referrerPolicy="no-referrer"
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover opacity-90 brightness-95 grayscale transition-all duration-700 ease-out group-hover:scale-[1.06] group-hover:opacity-100 group-hover:grayscale-0 group-focus-visible:grayscale-0"
          id={`p-image-${proj.id}`}
        />

        <div
          className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-neutral-950/70 via-neutral-950/10 to-transparent p-5 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
          id={`p-rollover-${proj.id}`}
        >
          <span className="inline-flex translate-y-2 items-center gap-1.5 rounded-xl bg-white px-4 py-2 font-mono text-[11px] uppercase tracking-wider text-neutral-950 shadow-lg transition-transform duration-300 group-hover:translate-y-0 group-focus-visible:translate-y-0">
            {dict.projects.viewProject}
            <IconArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6" id={`p-content-${proj.id}`}>
        <span className="mb-1 block text-[10px] font-mono uppercase tracking-wider text-neutral-500 dark:text-white/40">
          {proj.year} • {proj.role[lang]} • {readingTime.value}{" "}
          {readingTime.unitLabel[lang]}
        </span>

        <h3
          className="text-lg font-medium text-neutral-900 transition-colors duration-300 group-hover:text-amber-600 dark:text-white dark:group-hover:text-amber-400"
          id={`p-title-${proj.id}`}
        >
          {proj.title[lang]}
        </h3>

        <p
          className="mt-2 line-clamp-2 flex-1 font-sans text-xs font-light leading-relaxed text-neutral-600 dark:text-white/60 md:text-sm"
          id={`p-desc-${proj.id}`}
        >
          {proj.description[lang]}
        </p>

        <div
          className="mt-5 flex flex-wrap gap-1.5 border-t border-neutral-100 pt-4 dark:border-white/5"
          id={`p-tags-${proj.id}`}
        >
          {proj.tags.slice(0, 4).map((tag, tIdx) => (
            <span
              key={tIdx}
              className="rounded-md border border-neutral-200/60 bg-neutral-50 px-2 py-0.5 text-[9px] font-mono text-neutral-600 transition-colors group-hover:border-amber-500/20 dark:border-white/5 dark:bg-white/5 dark:text-white/50"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <span
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-gradient-to-r from-amber-400 via-orange-500 to-amber-400 transition-transform duration-500 group-hover:scale-x-100"
      />
    </motion.div>
  );
};

interface ProjectModalProps {
  project: Project;
  lang: Language;
  dict: TranslationDict;
  onClose: () => void;
}

const ProjectModal: React.FC<ProjectModalProps> = ({
  project,
  lang,
  dict,
  onClose,
}) => {
  const reduce = useReducedMotion();
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const zoomCloseRef = useRef<HTMLButtonElement>(null);
  const images = getImages(project);
  const total = images.length;

  const [[index, direction], setPage] = useState<[number, number]>([0, 0]);
  const [zoomOpen, setZoomOpen] = useState(false);

  const paginate = useCallback(
    (dir: number) => setPage(([i]) => [(i + dir + total) % total, dir]),
    [total],
  );

  const goTo = (target: number) =>
    setPage(([current]) => [target, target > current ? 1 : -1]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const previousFocus = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus?.();
    };
  }, []);

  useEffect(() => {
    if (zoomOpen) zoomCloseRef.current?.focus();
    else closeRef.current?.focus();
  }, [zoomOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (zoomOpen) setZoomOpen(false);
        else onClose();
        return;
      }
      if (total > 1) {
        if (e.key === "ArrowRight") paginate(1);
        else if (e.key === "ArrowLeft") paginate(-1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [zoomOpen, total, paginate, onClose]);

  const modalReadingTime = calculateReadingTime(project.description[lang]);
  const slideTransition = { duration: reduce ? 0 : 0.3, ease: EASE };

  const navButton =
    "absolute top-1/2 z-20 -translate-y-1/2 cursor-pointer rounded-full border border-white/10 bg-neutral-950/60 p-2 text-white shadow-md backdrop-blur-sm transition-all hover:scale-105 hover:bg-neutral-950 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 md:opacity-0 md:group-hover/carousel:opacity-100";

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm md:p-6"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        id="details-modal-overlay"
      >
        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.94, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 16 }}
          transition={{ type: "spring", stiffness: 260, damping: 26 }}
          className="relative flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-neutral-300 bg-white shadow-2xl dark:border-white/10 dark:bg-[#111113]"
          onClick={(e) => e.stopPropagation()}
          id="details-modal-card"
        >
          <span
            aria-hidden="true"
            className="absolute inset-x-0 top-0 z-30 h-0.5 bg-gradient-to-r from-amber-400 via-orange-500 to-amber-400"
          />

          <button
            ref={closeRef}
            onClick={onClose}
            className="absolute right-4 top-4 z-30 cursor-pointer rounded-full border border-white/10 bg-neutral-950/60 p-2 text-white/95 shadow-md backdrop-blur-sm transition-all hover:rotate-90 hover:bg-neutral-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
            aria-label={lang === "en" ? "Close" : "Tutup"}
            id="close-modal-btn"
          >
            <IconX className="h-4 w-4" />
          </button>

          <div
            className="group/carousel relative h-[200px] w-full flex-shrink-0 overflow-hidden bg-neutral-950 sm:h-[240px] md:h-[280px]"
            id="modal-cover-container"
          >
            <AnimatePresence
              initial={false}
              custom={direction}
              mode="popLayout"
            >
              <motion.img
                key={index}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={slideTransition}
                src={images[index]}
                alt={`${project.title[lang]} - Screenshot ${index + 1}`}
                referrerPolicy="no-referrer"
                className="absolute inset-0 h-full w-full cursor-zoom-in object-cover brightness-95"
                onClick={() => setZoomOpen(true)}
                id="modal-cover-image"
              />
            </AnimatePresence>

            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent" />

            <div className="absolute left-4 top-4 z-10 flex gap-2">
              <span className="rounded-md border border-white/10 bg-neutral-950/80 px-2.5 py-1 text-[10px] font-mono font-normal uppercase tracking-widest text-neutral-300 backdrop-blur-sm">
                {project.category}
              </span>
              <span className="rounded-md border border-white/10 bg-neutral-950/80 px-2.5 py-1 text-[10px] font-mono tabular-nums text-white/90 backdrop-blur-sm">
                {index + 1} / {total}
              </span>
            </div>

            <button
              onClick={() => setZoomOpen(true)}
              className="absolute right-14 top-4 z-20 cursor-pointer rounded-full border border-white/10 bg-neutral-950/60 p-2 text-white/95 shadow-md backdrop-blur-sm transition-all hover:scale-105 hover:bg-neutral-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
              title={lang === "en" ? "Zoom Image" : "Perbesar Gambar"}
              aria-label={lang === "en" ? "Zoom Image" : "Perbesar Gambar"}
              id="zoom-image-btn"
            >
              <IconMaximize className="h-4 w-4" />
            </button>

            {total > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    paginate(-1);
                  }}
                  className={`${navButton} left-4`}
                  aria-label={
                    lang === "en" ? "Previous image" : "Gambar sebelumnya"
                  }
                  id="prev-image-btn"
                >
                  <IconChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    paginate(1);
                  }}
                  className={`${navButton} right-4`}
                  aria-label={
                    lang === "en" ? "Next image" : "Gambar berikutnya"
                  }
                  id="next-image-btn"
                >
                  <IconChevronRight className="h-5 w-5" />
                </button>
              </>
            )}

            <div
              className="absolute bottom-6 left-6 z-10 pr-6"
              id="modal-cover-title-group"
            >
              <h3
                id={titleId}
                className="text-xl font-light tracking-tight text-white md:text-2xl"
              >
                <span id="modal-project-title">{project.title[lang]}</span>
              </h3>
            </div>
          </div>

          {total > 1 && (
            <div
              className="scrollbar-none flex flex-shrink-0 gap-2 overflow-x-auto border-b border-neutral-100 bg-neutral-50/60 px-6 py-3 dark:border-white/5 dark:bg-white/[0.03] md:px-8"
              id="modal-thumbnails-container"
            >
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => goTo(idx)}
                  aria-label={`Screenshot ${idx + 1}`}
                  aria-current={index === idx}
                  className="relative aspect-video w-20 flex-shrink-0 cursor-pointer overflow-hidden rounded-lg border-2 border-transparent transition-colors hover:border-neutral-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 dark:hover:border-white/15"
                  id={`thumbnail-selector-${idx}`}
                >
                  <img
                    src={img}
                    alt=""
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    className={`h-full w-full object-cover transition-all duration-300 ${
                      index === idx
                        ? "brightness-100"
                        : "brightness-75 hover:brightness-100"
                    }`}
                  />
                  {index === idx && (
                    <motion.span
                      layoutId="modal-thumb-ring"
                      aria-hidden="true"
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 32,
                      }}
                      className="absolute inset-0 rounded-md border-2 border-amber-500"
                    />
                  )}
                </button>
              ))}
            </div>
          )}

          <motion.div
            variants={{
              hidden: {},
              show: {
                transition: { staggerChildren: 0.07, delayChildren: 0.1 },
              },
            }}
            initial={reduce ? false : "hidden"}
            animate="show"
            className="modal-scrollbar flex-1 space-y-6 overflow-y-auto py-6 pl-6 pr-4 md:py-8 md:pl-8 md:pr-6"
            id="modal-body-content"
          >
            <motion.p
              variants={{
                hidden: { opacity: 0, y: 12 },
                show: { opacity: 1, y: 0 },
              }}
              className="font-sans text-xs font-light leading-relaxed text-neutral-600 dark:text-white/70 md:text-sm"
              id="modal-project-description"
            >
              {project.description[lang]}
            </motion.p>

            <motion.div
              variants={{
                hidden: { opacity: 0, y: 12 },
                show: { opacity: 1, y: 0 },
              }}
              className="grid grid-cols-3 gap-2 border-y border-neutral-100 py-4 font-mono text-[10px] text-neutral-500 dark:border-white/5 dark:text-white/45 sm:gap-4 sm:text-[11px]"
              id="modal-metadata-grid"
            >
              <div className="flex items-center gap-2">
                <IconUserCheck
                  className="h-4 w-4 flex-shrink-0 text-neutral-400 dark:text-white/30"
                  aria-hidden="true"
                />
                <div className="min-w-0">
                  <span className="block text-[8px] uppercase tracking-wider text-neutral-500 dark:text-white/35">
                    {dict.projects.roleLabel}
                  </span>
                  <span className="line-clamp-1 font-medium text-neutral-800 dark:text-white/80">
                    {project.role[lang]}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <IconCalendar
                  className="h-4 w-4 flex-shrink-0 text-neutral-400 dark:text-white/30"
                  aria-hidden="true"
                />
                <div>
                  <span className="block text-[8px] uppercase tracking-wider text-neutral-500 dark:text-white/35">
                    {dict.projects.yearLabel}
                  </span>
                  <span className="font-medium text-neutral-800 dark:text-white/80">
                    {project.year}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <IconBook
                  className="h-4 w-4 flex-shrink-0 text-amber-600 dark:text-amber-400"
                  aria-hidden="true"
                />
                <div>
                  <span className="block text-[8px] uppercase tracking-wider text-neutral-500 dark:text-white/35">
                    {lang === "en" ? "READ TIME" : "WAKTU BACA"}
                  </span>
                  <span className="whitespace-nowrap font-medium text-neutral-800 dark:text-white/80">
                    {modalReadingTime.value}{" "}
                    {modalReadingTime.unitLabel[lang].split(" ")[0]}
                  </span>
                </div>
              </div>
            </motion.div>

            <motion.div
              variants={{
                hidden: { opacity: 0, y: 12 },
                show: { opacity: 1, y: 0 },
              }}
              className="space-y-3"
              id="modal-tech-stack-group"
            >
              <h4 className="font-mono text-[10px] uppercase tracking-widest text-neutral-500 dark:text-white/40">
                Engineered with
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {project.tags.map((tag, tIdx) => (
                  <motion.span
                    key={tIdx}
                    whileHover={reduce ? undefined : { y: -2 }}
                    className="rounded-md border border-neutral-200/60 bg-neutral-50 px-2.5 py-0.5 font-mono text-[10px] text-neutral-700 transition-colors hover:border-amber-500/30 dark:border-white/5 dark:bg-white/5 dark:text-white/75"
                  >
                    {tag}
                  </motion.span>
                ))}
              </div>
            </motion.div>

            <motion.div
              variants={{
                hidden: { opacity: 0, y: 12 },
                show: { opacity: 1, y: 0 },
              }}
              className="flex justify-end pt-2"
              id="modal-action-row"
            >
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group/cta relative inline-flex cursor-pointer items-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 px-6 py-2.5 font-mono text-[11px] font-medium text-neutral-950 shadow-lg shadow-amber-500/20 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-amber-500/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white active:translate-y-0 dark:focus-visible:ring-offset-[#111113]"
                id="modal-external-link"
              >
                <span
                  aria-hidden="true"
                  className="absolute inset-y-0 -left-full w-1/2 -skew-x-12 bg-white/40 transition-transform duration-700 group-hover/cta:translate-x-[400%]"
                />
                <IconWorld
                  className="relative h-3.5 w-3.5"
                  aria-hidden="true"
                />
                <span className="relative">
                  {lang === "en" ? "Open Live App" : "Buka Aplikasi"}
                </span>
                <IconExternalLink
                  className="relative h-3.5 w-3.5 transition-transform group-hover/cta:-translate-y-0.5 group-hover/cta:translate-x-0.5"
                  aria-hidden="true"
                />
              </a>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {zoomOpen && (
          <motion.div
            key="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-neutral-950/95 p-4 backdrop-blur-md"
            onClick={() => setZoomOpen(false)}
            role="dialog"
            aria-modal="true"
            aria-label={project.title[lang]}
            id="fullscreen-lightbox-overlay"
          >
            <button
              ref={zoomCloseRef}
              onClick={(e) => {
                e.stopPropagation();
                setZoomOpen(false);
              }}
              className="absolute right-6 top-6 z-30 cursor-pointer rounded-full border border-white/10 bg-neutral-900/80 p-3 text-white/90 shadow-lg transition-all hover:rotate-90 hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
              aria-label={lang === "en" ? "Close" : "Tutup"}
              id="lightbox-close-btn"
            >
              <IconX className="h-5 w-5" />
            </button>

            <div
              className="relative flex h-full max-h-[82vh] w-full max-w-5xl items-center justify-center overflow-hidden"
              onClick={(e) => e.stopPropagation()}
              id="lightbox-content-container"
            >
              <AnimatePresence
                initial={false}
                custom={direction}
                mode="popLayout"
              >
                <motion.img
                  key={index}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={slideTransition}
                  src={images[index]}
                  alt={`${project.title[lang]} - Screenshot ${index + 1}`}
                  referrerPolicy="no-referrer"
                  className="max-h-full max-w-full rounded-xl border border-white/15 object-contain shadow-2xl"
                  id="lightbox-main-img"
                />
              </AnimatePresence>

              {total > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      paginate(-1);
                    }}
                    className="absolute left-2 top-1/2 z-20 -translate-y-1/2 cursor-pointer rounded-full border border-white/10 bg-neutral-900/80 p-3 text-white/90 shadow-lg transition-all hover:scale-105 hover:bg-white hover:text-neutral-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 md:left-4"
                    aria-label={
                      lang === "en" ? "Previous image" : "Gambar sebelumnya"
                    }
                    id="lightbox-prev-btn"
                  >
                    <IconChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      paginate(1);
                    }}
                    className="absolute right-2 top-1/2 z-20 -translate-y-1/2 cursor-pointer rounded-full border border-white/10 bg-neutral-900/80 p-3 text-white/90 shadow-lg transition-all hover:scale-105 hover:bg-white hover:text-neutral-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 md:right-4"
                    aria-label={
                      lang === "en" ? "Next image" : "Gambar berikutnya"
                    }
                    id="lightbox-next-btn"
                  >
                    <IconChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}
            </div>

            <div
              className="absolute bottom-6 flex select-none items-center gap-3 rounded-full border border-white/10 bg-neutral-900/80 px-4 py-1.5 font-mono text-xs text-white/70"
              onClick={(e) => e.stopPropagation()}
              id="lightbox-counter"
            >
              <span className="tabular-nums">
                {index + 1} / {total}
              </span>
              {total > 1 && (
                <span className="flex items-center gap-1.5" aria-hidden="true">
                  {images.map((_, i) => (
                    <span
                      key={i}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        i === index ? "w-4 bg-amber-400" : "w-1.5 bg-white/30"
                      }`}
                    />
                  ))}
                </span>
              )}
              <span className="hidden sm:inline">• {project.title[lang]}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

function useHydratedReducedMotion() {
  const prefersReducedMotion = useReducedMotion();

  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  return Boolean(hydrated && prefersReducedMotion);
}

export const ProjectGallery: React.FC<ProjectGalleryProps> = ({
  lang,
  dict,
}) => {
  const reduce = useHydratedReducedMotion();
  const [activeFilter, setActiveFilter] = useState<Filter>("all");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const closeModal = useCallback(() => setSelectedProject(null), []);

  const countFor = (filter: Filter) =>
    projectsList.filter((p) => filter === "all" || p.category === filter)
      .length;

  const filteredProjects = projectsList.filter((proj) => {
    if (activeFilter === "all") return true;
    return proj.category === activeFilter;
  });

  const categoryLabels: Record<(typeof FILTERS)[number], string> = {
    all: dict.projects.all,
    web: "Web Apps",
  };

  const stats = [
    {
      icon: IconLayersIntersect,
      label:
        lang === "en" ? "Total Projects Completed" : "Total Proyek Selesai",
      value: 42,
      suffix: "+",
      isDecimal: false,
      desc:
        lang === "en"
          ? "SaaS, Mobile, & Open Source"
          : "SaaS, Mobile, & Terbuka",
    },
    {
      icon: IconCalendar,
      label: lang === "en" ? "Years of Experience" : "Tahun Pengalaman",
      value: 4,
      suffix: "+",
      isDecimal: false,
      desc: lang === "en" ? "Professional Engineering" : "Rekayasa Profesional",
    },
    {
      icon: IconShieldCheck,
      label:
        lang === "en" ? "System & SLA Reliability" : "Keandalan & SLA Sistem",
      value: 99.9,
      suffix: "%",
      isDecimal: true,
      desc:
        lang === "en"
          ? "Fault-tolerant server availability"
          : "Ketersediaan server bebas downtime",
    },
  ];

  return (
    <section
      className="relative scroll-mt-24 overflow-hidden border-t border-neutral-100 bg-white py-24 transition-colors duration-300 dark:border-white/5 dark:bg-[#0A0A0B]"
      id="projects-section"
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
        className="pointer-events-none absolute -top-20 left-1/4 h-72 w-72 rounded-full bg-amber-500/15 blur-[90px]"
      />
      <motion.div
        aria-hidden="true"
        animate={
          reduce
            ? undefined
            : { x: [0, -40, 0], y: [0, 30, 0], opacity: [0.35, 0.7, 0.35] }
        }
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute right-1/4 top-72 h-64 w-64 rounded-full bg-orange-500/10 blur-[90px]"
      />

      <div className="relative mx-auto max-w-7xl px-6 md:px-8">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: EASE }}
          className="mb-16 text-center"
          id="projects-header"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white/70 px-3.5 py-1.5 text-[10px] font-mono uppercase tracking-wider text-neutral-600 backdrop-blur-sm dark:border-white/10 dark:bg-white/5 dark:text-white/60">
            <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
              <span className="absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-60 animate-ping motion-reduce:animate-none" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-amber-500" />
            </span>
            {dict.nav.projects}
          </span>
          <h2
            className="mt-5 font-sans text-3xl font-light tracking-tight text-neutral-900 dark:text-white md:text-4xl lg:text-5xl"
            id="projects-title"
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
              {dict.projects.title}
            </motion.span>
          </h2>
          <p
            className="mx-auto mt-4 max-w-2xl font-sans text-sm font-light italic text-neutral-500 dark:text-white/45"
            id="projects-subtitle"
          >
            {dict.projects.subtitle}
          </p>
        </motion.div>

        <div
          className="mx-auto mb-16 grid max-w-4xl grid-cols-1 gap-6 px-4 sm:grid-cols-3"
          id="projects-stats-grid"
        >
          {stats.map((stat, idx) => {
            const StatIcon = stat.icon;
            return (
              <motion.div
                key={idx}
                initial={reduce ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: EASE, delay: idx * 0.1 }}
                whileHover={reduce ? undefined : { y: -4 }}
                onMouseMove={moveSpot}
                className="group relative overflow-hidden rounded-2xl border border-neutral-200/70 bg-neutral-50/80 p-6 text-center transition-colors duration-300 hover:border-amber-500/30 dark:border-white/10 dark:bg-white/[0.03] dark:hover:border-amber-400/25"
              >
                <SpotOverlay />
                <span
                  className="relative mx-auto mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-700 transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110 dark:text-amber-400"
                  aria-hidden="true"
                >
                  <StatIcon className="h-4 w-4" />
                </span>
                <div className="relative mb-1 bg-gradient-to-r from-amber-600 to-orange-500 bg-clip-text font-mono text-3xl font-bold text-transparent dark:from-amber-300 dark:to-orange-400 md:text-4xl">
                  <AnimatedCounter
                    value={stat.value}
                    suffix={stat.suffix}
                    isDecimal={stat.isDecimal}
                  />
                </div>
                <div className="relative text-xs font-mono font-medium uppercase tracking-wider text-neutral-800 dark:text-white/80">
                  {stat.label}
                </div>
                <div className="relative mt-1 text-[11px] font-light text-neutral-500 dark:text-white/45">
                  {stat.desc}
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.1 }}
          className="mb-16 flex flex-wrap justify-center gap-2.5"
          role="group"
          aria-label={dict.projects.title}
          id="filter-controls"
        >
          {FILTERS.map((filter) => {
            const active = activeFilter === filter;
            return (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                aria-pressed={active}
                className={`relative cursor-pointer rounded-full border px-5 py-2 text-[10px] font-mono uppercase tracking-wider transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-[#0A0A0B] ${
                  active
                    ? "border-transparent text-white dark:text-neutral-950"
                    : "border-neutral-200 bg-transparent text-neutral-600 hover:border-amber-500/40 hover:text-neutral-900 dark:border-white/10 dark:text-white/50 dark:hover:text-white"
                }`}
                id={`filter-${filter}`}
              >
                {active && (
                  <motion.span
                    layoutId="filter-pill"
                    aria-hidden="true"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    className="absolute inset-0 rounded-full bg-neutral-900 shadow-md dark:bg-white"
                  />
                )}
                <span className="relative flex items-center gap-2">
                  {categoryLabels[filter]}
                  <span className="tabular-nums opacity-60">
                    {countFor(filter)}
                  </span>
                </span>
              </button>
            );
          })}
        </motion.div>

        <motion.div
          layout
          variants={containerVariants}
          initial={reduce ? false : "hidden"}
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
          id="project-cards-grid"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((proj) => (
              <motion.div
                key={proj.id}
                layout
                variants={cardVariants}
                exit={{ opacity: 0, scale: 0.95 }}
                className="h-full"
              >
                <ProjectCard
                  proj={proj}
                  lang={lang}
                  dict={dict}
                  onClick={() => setSelectedProject(proj)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      <AnimatePresence>
        {selectedProject && (
          <ProjectModal
            key={selectedProject.id}
            project={selectedProject}
            lang={lang}
            dict={dict}
            onClose={closeModal}
          />
        )}
      </AnimatePresence>
    </section>
  );
};
