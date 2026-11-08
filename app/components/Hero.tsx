"use client";

import React from "react";
import { motion } from "motion/react";
import { Language, TranslationDict } from "../types";
import avatarImg from "../assets/images/developer_avatar_1779937938255.png";
import {
  IconArrowUpRight,
  IconMapPin,
  IconSparkles,
} from "@tabler/icons-react";
import Image from "next/image";

interface HeroProps {
  lang: Language;
  dict: TranslationDict;
  scrollToContact: () => void;
  scrollToProjects: () => void;
}

const STATS = [
  {
    value: "42+",
    en: "Projects delivered",
    id: "Proyek diselesaikan",
  },
  {
    value: "4+",
    en: "Years of experience",
    id: "Tahun pengalaman",
  },
] as const;

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const item = {
  hidden: {
    opacity: 0,
    y: 16,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut" as const,
    },
  },
};

const FOCUS =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-[#0A0A0B]";

export const Hero: React.FC<HeroProps> = ({
  lang,
  dict,
  scrollToContact,
  scrollToProjects,
}) => {
  const accent =
    "pr-1 font-serif font-normal italic bg-gradient-to-r from-amber-700 to-orange-600 bg-clip-text text-transparent dark:from-amber-300 dark:to-orange-400";

  const title =
    lang === "en" ? (
      <>
        Engineering <span className={accent}>Global-Scale Products</span> Users
        Love and Investors Back
      </>
    ) : (
      <>
        Membangun <span className={accent}>Produk Skala Global</span> yang
        Dicintai Pengguna &amp; Investor
      </>
    );

  return (
    <section
      id="hero-section"
      className="relative flex items-center overflow-hidden bg-white pb-16 pt-28 transition-colors duration-300 dark:bg-[#0A0A0B] md:pb-24 md:pt-36 lg:min-h-[720px]"
    >
      {/* Background grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[720px] bg-[radial-gradient(rgba(0,0,0,0.09)_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,#000_40%,transparent_100%)] dark:bg-[radial-gradient(rgba(255,255,255,0.09)_1px,transparent_1px)]"
      />

      {/* Ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 right-0 h-[560px] w-[560px] bg-[radial-gradient(closest-side,rgba(245,158,11,0.16),transparent)] dark:bg-[radial-gradient(closest-side,rgba(245,158,11,0.10),transparent)]"
      />

      <div className="relative mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 px-6 md:grid-cols-12 md:px-8">
        {/* Main content */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="flex flex-col items-start text-left md:col-span-7 lg:col-span-8"
        >
          {/* Badge */}
          <motion.div
            variants={item}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white/70 px-3.5 py-1.5 font-mono text-xs font-medium uppercase tracking-wider text-neutral-600 dark:border-white/10 dark:bg-white/5 dark:text-neutral-300"
          >
            <span className="relative flex h-2 w-2" aria-hidden="true">
              <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-60 animate-ping motion-reduce:animate-none" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>

            <span>{dict.hero.badge}</span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            variants={item}
            id="hero-main-title"
            className="mb-6 text-balance text-4xl font-semibold leading-[1.1] tracking-tight text-neutral-950 dark:text-white md:text-5xl lg:text-6xl"
          >
            {title}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={item}
            id="hero-subtitle"
            className="mb-8 max-w-2xl text-base leading-relaxed text-neutral-600 dark:text-neutral-400 md:text-lg"
          >
            {dict.hero.subtitle}
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            variants={item}
            id="hero-cta-buttons"
            className="mb-10 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:gap-4"
          >
            <button
              type="button"
              onClick={scrollToContact}
              id="cta-primary-btn"
              className={`group inline-flex min-h-[48px] cursor-pointer items-center justify-center gap-2 rounded-xl bg-neutral-900 px-7 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-neutral-800 active:scale-[0.98] dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200 ${FOCUS}`}
            >
              {dict.hero.ctaPrimary}

              <IconArrowUpRight
                className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transition-none"
                aria-hidden="true"
              />
            </button>

            <button
              type="button"
              onClick={scrollToProjects}
              id="cta-secondary-btn"
              className={`inline-flex min-h-[48px] cursor-pointer items-center justify-center rounded-xl border border-neutral-300 bg-transparent px-7 text-sm font-semibold text-neutral-900 transition-all duration-200 hover:border-neutral-400 hover:bg-neutral-50 active:scale-[0.98] dark:border-white/15 dark:text-white dark:hover:border-white/30 dark:hover:bg-white/5 ${FOCUS}`}
            >
              {dict.hero.ctaSecondary}
            </button>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            variants={item}
            id="trust-indicators"
            className="w-full space-y-5 border-t border-neutral-200 pt-6 dark:border-white/10"
          >
            <dl className="flex flex-wrap gap-x-10 gap-y-4">
              {STATS.map((stat) => (
                <div key={stat.value} className="flex flex-col">
                  <dt className="order-2 mt-1 text-xs text-neutral-600 dark:text-neutral-400">
                    {stat[lang]}
                  </dt>

                  <dd className="order-1 font-mono text-3xl font-bold tabular-nums tracking-tight text-neutral-950 dark:text-white">
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>

            <p className="flex items-center gap-2.5 font-mono text-xs tracking-wider text-neutral-600 dark:text-neutral-400">
              <span
                className="h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500"
                aria-hidden="true"
              />

              {dict.hero.subtext}
            </p>
          </motion.div>
        </motion.div>

        {/* Avatar */}
        <div
          id="hero-photo-col"
          className="hidden justify-center md:col-span-5 md:flex lg:col-span-4"
        >
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.96,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            transition={{
              duration: 0.7,
              delay: 0.2,
              ease: "easeOut",
            }}
            className="relative"
          >
            {/* Glow */}
            <div
              aria-hidden="true"
              className="absolute -inset-3 rounded-[2rem] bg-gradient-to-tr from-amber-500/25 via-transparent to-orange-500/20 dark:from-amber-400/20 dark:to-orange-400/10"
            />

            <div
              id="avatar-image-container"
              className="relative h-[22rem] w-72 overflow-hidden rounded-3xl border border-neutral-200 bg-neutral-100 shadow-xl shadow-neutral-900/5 dark:border-white/10 dark:bg-[#141416] dark:shadow-black/40"
            >
              <Image
                id="avatar-image"
                src={avatarImg}
                alt={lang === "id" ? "Avatar Alfay" : "Alfay's avatar"}
                width={288}
                height={352}
                priority
                decoding="async"
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover transition-transform duration-700 hover:scale-[1.03] motion-reduce:transition-none"
              />

              {/* Avatar label */}
              <div className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-medium text-neutral-800 shadow-sm dark:bg-[#0A0A0B]/85 dark:text-neutral-100">
                <IconSparkles
                  className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400"
                  aria-hidden="true"
                />
                Fullstack Developer · UI/UX
              </div>

              {/* Location */}
              <div className="absolute inset-x-3 bottom-3 flex items-center gap-3 rounded-xl bg-white/90 p-3 shadow-sm dark:bg-[#0A0A0B]/85">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-400">
                  <IconMapPin className="h-4 w-4" aria-hidden="true" />
                </span>

                <div className="min-w-0">
                  <div className="truncate text-sm font-medium text-neutral-900 dark:text-white">
                    {lang === "id"
                      ? "Berbasis di Pekalongan, Indonesia"
                      : "Based in Pekalongan, Indonesia"}
                  </div>

                  <div className="font-mono text-xs text-neutral-600 dark:text-neutral-400">
                    GMT +07:00
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
