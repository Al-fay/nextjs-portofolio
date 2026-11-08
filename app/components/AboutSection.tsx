"use client";

import React, { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  useMotionTemplate,
  type MotionValue,
} from "motion/react";
import { TranslationDict } from "../types";
import {
  IconBolt,
  IconCheckbox,
  IconLayersLinked,
  IconMapPin,
  IconShieldCheck,
  IconSparklesFilled,
  IconTerminal2,
  IconUser,
} from "@tabler/icons-react";

interface AboutSectionProps {
  lang: "en" | "id";
  dict: TranslationDict;
}

const EASE = [0.22, 1, 0.36, 1] as const;

const reveal = (delay = 0, x = 0, y = 24) => ({
  initial: {
    opacity: 0,
    x,
    y,
  },
  whileInView: {
    opacity: 1,
    x: 0,
    y: 0,
  },
  viewport: {
    once: true,
    margin: "-60px",
  },
  transition: {
    duration: 0.8,
    delay,
    ease: EASE,
  },
});

// Scroll-highlighted word
const Word: React.FC<{
  children: string;
  range: [number, number];
  progress: MotionValue<number>;
}> = ({ children, range, progress }) => {
  const opacity = useTransform(progress, range, [0.25, 1]);

  return (
    <motion.span style={{ opacity }} className="inline-block mr-[0.28em]">
      {children}
    </motion.span>
  );
};

// Paragraph with scroll-based word animation
const ScrollParagraph: React.FC<{
  text: string;
}> = ({ text }) => {
  const ref = useRef<HTMLParagraphElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.9", "end 0.6"],
  });

  const words = text.split(" ");

  return (
    <p
      ref={ref}
      className="text-neutral-700 dark:text-neutral-200 text-sm md:text-base leading-relaxed mb-4 font-normal"
    >
      {words.map((word, i) => (
        <Word
          key={i}
          progress={scrollYProgress}
          range={[i / words.length, (i + 1) / words.length]}
        >
          {word}
        </Word>
      ))}
    </p>
  );
};

export const AboutSection: React.FC<AboutSectionProps> = ({ lang, dict }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  // Mouse interaction values
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);

  const spring = {
    stiffness: 140,
    damping: 18,
    mass: 0.6,
  };

  const rotateX = useSpring(useTransform(my, [0, 1], [5, -5]), spring);

  const rotateY = useSpring(useTransform(mx, [0, 1], [-6, 6]), spring);

  const spotX = useTransform(mx, (v) => `${v * 100}%`);

  const spotY = useTransform(my, (v) => `${v * 100}%`);

  const spotlight = useMotionTemplate`
    radial-gradient(
      300px circle at ${spotX} ${spotY},
      rgba(245,158,11,0.14),
      transparent 70%
    )
  `;

  const spotOpacity = useMotionValue(0);

  if (!dict.about) return null;

  const { title, subtitle, heading, bioParagraph1, bioParagraph2, highlights } =
    dict.about;

  const highlightIcons = [
    <IconLayersLinked key="layers" className="w-5 h-5 text-amber-500" />,
    <IconBolt key="bolt" className="w-5 h-5 text-amber-500" />,
    <IconTerminal2 key="terminal" className="w-5 h-5 text-amber-500" />,
  ];

  // Mouse movement
  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();

    if (!rect.width || !rect.height) return;

    mx.set((e.clientX - rect.left) / rect.width);
    my.set((e.clientY - rect.top) / rect.height);
  };

  const handleEnter = () => {
    spotOpacity.set(1);
  };

  const handleLeave = () => {
    mx.set(0.5);
    my.set(0.5);
    spotOpacity.set(0);
  };

  return (
    <section
      className="py-16 lg:py-24 bg-neutral-50 dark:bg-[#0C0C0E] border-y border-neutral-200/60 dark:border-white/5 relative overflow-hidden"
      id="about-section"
    >
      {/* Background ambient glow */}
      <motion.div
        aria-hidden="true"
        animate={{
          y: [0, -30, 0],
          x: [0, 20, 0],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"
      />

      <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
          <motion.div
            {...reveal(0, 0, 12)}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-[10px] font-mono tracking-widest uppercase mb-3"
          >
            <IconUser className="w-3 h-3" />

            <span>{title}</span>
          </motion.div>

          <motion.h2
            {...reveal(0.1, 0, 16)}
            className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-neutral-900 dark:text-white"
          >
            {heading}
          </motion.h2>

          <motion.p
            {...reveal(0.2, 0, 12)}
            className="text-neutral-500 dark:text-neutral-400 text-xs mt-2 font-mono uppercase tracking-wider"
          >
            {subtitle}
          </motion.p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Profile Card */}
          <motion.div
            {...reveal(0, -32, 0)}
            className="lg:col-span-4"
            style={{ perspective: 1000 }}
            id="owner-profile-card"
          >
            <motion.div
              ref={cardRef}
              onMouseMove={handleMove}
              onMouseEnter={handleEnter}
              onMouseLeave={handleLeave}
              style={{
                rotateX,
                rotateY,
              }}
              className="h-full rounded-3xl bg-white dark:bg-[#131316] p-8 border border-neutral-200/80 dark:border-white/10 shadow-xl flex flex-col justify-between relative group overflow-hidden will-change-transform"
            >
              {/* Spotlight */}
              <motion.div
                aria-hidden="true"
                style={{
                  background: spotlight,
                  opacity: spotOpacity,
                }}
                className="absolute inset-0 pointer-events-none transition-opacity duration-300"
              />

              {/* Decorative gradient */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-500/10 to-transparent rounded-bl-full pointer-events-none transition-transform duration-700 ease-out group-hover:scale-125 origin-top-right" />

              <div className="relative">
                {/* Status */}
                <div className="flex items-center justify-between mb-6">
                  <span className="px-2.5 py-1 rounded-md text-[9px] font-mono uppercase tracking-widest bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5 font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />

                    {lang === "en" ? "Verified Owner" : "Pemilik Resmi"}
                  </span>

                  <IconShieldCheck className="w-5 h-5 text-neutral-400 dark:text-white/30 transition-colors duration-300 group-hover:text-emerald-500" />
                </div>

                {/* Avatar */}
                <motion.div
                  initial={{
                    scale: 0.8,
                    opacity: 0,
                  }}
                  whileInView={{
                    scale: 1,
                    opacity: 1,
                  }}
                  viewport={{
                    once: true,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 16,
                    delay: 0.25,
                  }}
                  whileHover={{
                    rotate: -4,
                    scale: 1.06,
                  }}
                  className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-600 p-[2px] mb-6 shadow-lg shadow-amber-500/15"
                >
                  <div className="w-full h-full bg-white dark:bg-[#0A0A0B] rounded-[14px] flex items-center justify-center text-amber-500 font-mono text-2xl md:text-3xl font-bold">
                    DA
                  </div>
                </motion.div>

                {/* Owner info */}
                <h3 className="text-xl md:text-2xl font-bold text-neutral-900 dark:text-white tracking-tight">
                  Diva Alfahrizy
                </h3>

                <p className="text-amber-600 dark:text-amber-400 text-xs font-mono font-medium mt-1">
                  Mid-Level Fullstack &amp; UI/UX
                </p>

                <div className="flex items-center gap-1.5 text-neutral-500 dark:text-neutral-400 text-xs mt-3">
                  <IconMapPin className="w-3.5 h-3.5 text-neutral-400" />

                  <span>Indonesia (UTC+7)</span>
                </div>
              </div>

              {/* Experience details */}
              <motion.div
                initial="hidden"
                whileInView="show"
                viewport={{
                  once: true,
                }}
                variants={{
                  hidden: {},
                  show: {
                    transition: {
                      staggerChildren: 0.1,
                      delayChildren: 0.4,
                    },
                  },
                }}
                className="relative mt-8 pt-6 border-t border-neutral-100 dark:border-white/5 space-y-3 font-mono text-xs text-neutral-600 dark:text-neutral-300"
              >
                {[
                  {
                    k: "EXPERIENCE",
                    v: <>Intermediate / Mid</>,
                    c: "text-neutral-900 dark:text-white",
                  },
                  {
                    k: "SPECIALTY",
                    v: <>0ms SPA &amp; APIs</>,
                    c: "text-neutral-900 dark:text-white",
                  },
                  {
                    k: "STATUS",
                    v: (
                      <span className="flex items-center gap-1">
                        <IconCheckbox className="w-3 h-3" />
                        Ready
                      </span>
                    ),
                    c: "text-emerald-500",
                  },
                ].map((row) => (
                  <motion.div
                    key={row.k}
                    variants={{
                      hidden: {
                        opacity: 0,
                        x: -12,
                      },
                      show: {
                        opacity: 1,
                        x: 0,
                        transition: {
                          duration: 0.6,
                          ease: EASE,
                        },
                      },
                    }}
                    className="flex items-center justify-between"
                  >
                    <span className="text-neutral-400 dark:text-white/40">
                      {row.k}
                    </span>

                    <span className={`font-semibold ${row.c}`}>{row.v}</span>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Right Bio & Highlights */}
          <div className="lg:col-span-8 flex flex-col justify-between space-y-8">
            {/* Bio Card */}
            <motion.div
              {...reveal(0, 32, 0)}
              whileHover={{ y: -3 }}
              className="rounded-3xl bg-white dark:bg-[#131316] p-8 md:p-10 border border-neutral-200/80 dark:border-white/10 shadow-xl relative"
              id="owner-bio-content"
            >
              <div className="flex items-center gap-2 text-neutral-400 dark:text-white/40 text-[10px] font-mono uppercase tracking-widest mb-4">
                <motion.span
                  animate={{
                    rotate: [0, 15, -10, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    repeatDelay: 3,
                    ease: "easeInOut",
                  }}
                  className="inline-flex"
                >
                  <IconSparklesFilled className="w-3.5 h-3.5 text-amber-500" />
                </motion.span>

                <span>
                  {lang === "en" ? "Personal Statement" : "Pernyataan Pribadi"}
                </span>
              </div>

              <ScrollParagraph text={bioParagraph1} />

              <p className="text-neutral-600 dark:text-neutral-400 text-sm md:text-base leading-relaxed font-light">
                {bioParagraph2}
              </p>
            </motion.div>

            {/* Highlights Grid */}
            <div
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
              id="owner-highlights-grid"
            >
              {highlights.map((item, idx) => (
                <motion.div
                  key={idx}
                  {...reveal(0.15 + idx * 0.12, 0, 28)}
                  whileHover={{ y: -6 }}
                  className="group/card rounded-2xl bg-white dark:bg-[#131316] p-6 border border-neutral-200/70 dark:border-white/10 hover:border-amber-500/40 hover:shadow-lg hover:shadow-amber-500/5 transition-[border-color,box-shadow] duration-300 shadow-sm flex flex-col justify-between"
                  id={`highlight-card-${idx}`}
                >
                  <div className="mb-4">
                    {/* Icon */}
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-3.5 transition-transform duration-500 ease-out group-hover/card:-rotate-6 group-hover/card:scale-110">
                      {highlightIcons[idx] || (
                        <IconBolt className="w-5 h-5 text-amber-500" />
                      )}
                    </div>

                    {/* Title */}
                    <h4 className="font-bold text-neutral-900 dark:text-white text-sm mb-1.5">
                      {item.title}
                    </h4>

                    {/* Description */}
                    <p className="text-neutral-500 dark:text-neutral-400 text-xs leading-relaxed font-light">
                      {item.desc}
                    </p>
                  </div>

                  <div className="h-0.5 w-8 bg-amber-500/40 rounded-full mt-2 transition-all duration-500 ease-out group-hover/card:w-full" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
