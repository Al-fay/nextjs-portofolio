"use client";

import React, { useState } from "react";
import { testimonialsList } from "../data";
import { Language } from "../types";
import {
  IconPlayerPause,
  IconPlayerPlay,
  IconQuote,
} from "@tabler/icons-react";

interface TestimonialsMarqueeProps {
  lang: Language;
  title?: string;
  subtitle?: string;
}

const COPIES = 6;

const getInitials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

const MARQUEE_CSS = `
@keyframes tm-scroll {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
.tm-track {
  animation: tm-scroll 70s linear infinite;
  will-change: transform;
}
.tm-viewport:hover .tm-track,
.tm-viewport:focus-within .tm-track,
.tm-track[data-paused="true"] {
  animation-play-state: paused;
}
@media (prefers-reduced-motion: reduce) {
  .tm-track { animation-duration: 200s; }
}
`;

export const TestimonialsMarquee: React.FC<TestimonialsMarqueeProps> = ({
  lang,
  title,
  subtitle,
}) => {
  const [paused, setPaused] = useState(false);

  const items = Array.from({ length: COPIES }).flatMap((_, copy) =>
    testimonialsList.map((item) => ({
      ...item,
      key: `${item.id}-${copy}`,
      hidden: copy > 0,
    })),
  );

  const regionLabel =
    title ?? (lang === "id" ? "Testimoni klien" : "Client testimonials");
  const toggleLabel = paused
    ? lang === "id"
      ? "Putar animasi testimoni"
      : "Play testimonials animation"
    : lang === "id"
      ? "Jeda animasi testimoni"
      : "Pause testimonials animation";

  return (
    <section
      id="testimonials-marquee-wrapper"
      role="region"
      aria-label={regionLabel}
      className="relative overflow-hidden border-y border-neutral-200/60 bg-neutral-50 py-16 dark:border-white/5 dark:bg-[#0A0A0B] md:py-20"
    >
      <style>{MARQUEE_CSS}</style>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-[radial-gradient(50%_100%_at_50%_0%,rgba(245,158,11,0.10),transparent_70%)] dark:bg-[radial-gradient(50%_100%_at_50%_0%,rgba(245,158,11,0.07),transparent_70%)]"
      />

      {(title || subtitle) && (
        <div className="relative mx-auto mb-10 max-w-2xl px-6 text-center md:mb-12">
          {title && (
            <h2 className="text-balance text-3xl font-semibold tracking-tight text-neutral-950 dark:text-white md:text-4xl">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="mt-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400 md:text-base">
              {subtitle}
            </p>
          )}
        </div>
      )}

      <div className="tm-viewport relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
        <div
          className="tm-track flex w-max items-stretch py-2"
          data-paused={paused}
          id="testimonials-scroll-motion"
        >
          {items.map((item) => (
            <figure
              key={item.key}
              aria-hidden={item.hidden}
              className="group relative mr-5 flex w-[300px] shrink-0 flex-col justify-between rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm transition-[border-color,box-shadow] duration-300 hover:border-amber-500/40 hover:shadow-lg hover:shadow-amber-500/5 dark:border-white/10 dark:bg-[#111113] dark:hover:border-amber-400/30 dark:hover:shadow-black/40 sm:mr-6 sm:w-[380px] sm:p-7"
            >
              <IconQuote
                aria-hidden="true"
                className="h-7 w-7 text-amber-500/70 transition-colors duration-300 group-hover:text-amber-500 dark:text-amber-400/60 dark:group-hover:text-amber-400"
              />

              <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
                {item.text[lang]}
              </blockquote>

              <figcaption className="mt-6 flex items-center gap-3 border-t border-neutral-200 pt-5 dark:border-white/10">
                <span
                  aria-hidden="true"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-xs font-bold text-white dark:text-neutral-950"
                >
                  {getInitials(item.name)}
                </span>
                <span className="flex min-w-0 flex-col">
                  <span className="truncate text-sm font-semibold text-neutral-950 dark:text-white">
                    {item.name}
                  </span>
                  <span className="truncate text-xs text-neutral-600 dark:text-neutral-400">
                    {item.role}
                  </span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>

      <div className="relative mt-8 flex justify-center">
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          aria-label={toggleLabel}
          aria-pressed={paused}
          className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2 text-xs font-medium text-neutral-700 transition-colors hover:border-neutral-300 hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-50 dark:border-white/10 dark:bg-white/5 dark:text-neutral-200 dark:hover:border-white/20 dark:hover:bg-white/10 dark:focus-visible:ring-offset-[#0A0A0B]"
        >
          {paused ? (
            <IconPlayerPlay className="h-3.5 w-3.5" aria-hidden="true" />
          ) : (
            <IconPlayerPause className="h-3.5 w-3.5" aria-hidden="true" />
          )}
          {paused
            ? lang === "id"
              ? "Putar"
              : "Play"
            : lang === "id"
              ? "Jeda"
              : "Pause"}
        </button>
      </div>
    </section>
  );
};
