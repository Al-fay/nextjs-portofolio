"use client";

import React from "react";
import { motion } from "motion/react";
import { Language, TranslationDict } from "../types";
import { experiencesList } from "../data";
import {
  IconBookFilled,
  IconBriefcase,
  IconCalendar,
  IconMapPin,
} from "@tabler/icons-react";

interface ExperienceTimelineProps {
  lang: Language;
  dict: TranslationDict;
}

const calculateReadingTime = (text: string) => {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const seconds = Math.ceil((words / 200) * 60);
  if (seconds < 60) {
    return { value: seconds, unitLabel: { en: "sec read", id: "detik baca" } };
  }
  const mins = Math.ceil(words / 200);
  return { value: mins, unitLabel: { en: "min read", id: "menit baca" } };
};

export const ExperienceTimeline: React.FC<ExperienceTimelineProps> = ({
  lang,
  dict,
}) => {
  return (
    <section
      className="py-24 bg-neutral-50 dark:bg-[#0A0A0B] border-t border-neutral-100 dark:border-white/5 transition-colors duration-305"
      id="experience-section"
    >
      <div className="max-w-5xl mx-auto px-6 md:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-20"
          id="exp-header"
        >
          <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 dark:text-white/50 border border-neutral-200 dark:border-white/10 px-3.5 py-1 rounded-full">
            {dict.nav.experience}
          </span>
          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-sans font-light text-neutral-900 dark:text-white mt-4 tracking-tight"
            id="exp-title"
          >
            {dict.experience.title}
          </h2>
          <p
            className="text-neutral-500 dark:text-white/40 mt-3 font-sans max-w-2xl mx-auto font-light text-sm italic"
            id="exp-subtitle"
          >
            {dict.experience.subtitle}
          </p>
        </motion.div>

        {/* Timeline body */}
        <div
          className="relative border-l border-neutral-200 dark:border-white/5 ml-4 md:ml-12"
          id="timeline-tree"
        >
          {experiencesList.map((exp, idx) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, x: -15 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="mb-14 last:mb-0 relative pl-8 md:pl-12"
              id={`timeline-node-${exp.id}`}
            >
              {/* Elegant dot */}
              <div
                className="absolute -left-[10px] top-6 w-5 h-5 rounded-full bg-white dark:bg-[#0A0A0B] border border-neutral-200 dark:border-white/10 flex items-center justify-center"
                id={`timeline-dot-${exp.id}`}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-neutral-900 dark:bg-white/70"></div>
              </div>

              {/* Card Container */}
              <div
                className="bg-white dark:bg-[#111113] p-6 md:p-8 rounded-2xl border border-neutral-200/60 dark:border-white/5 shadow-2xs hover:border-neutral-350 dark:hover:border-white/10 transition-all duration-300 relative overflow-hidden group"
                id={`timeline-card-${exp.id}`}
              >
                <div
                  className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-4"
                  id="card-meta"
                >
                  <div>
                    <h3
                      className="text-lg md:text-xl font-medium text-neutral-900 dark:text-white"
                      id={`role-text-${exp.id}`}
                    >
                      {exp.role[lang]}
                    </h3>
                    <p
                      className="text-neutral-500 dark:text-white/60 font-medium text-xs mt-1 flex items-center gap-1.5"
                      id={`company-text-${exp.id}`}
                    >
                      <IconBriefcase className="w-3.5 h-3.5 text-neutral-400 dark:text-white/30" />
                      {exp.company}
                    </p>
                  </div>
                  <div
                    className="flex flex-wrap items-center gap-2.5 text-neutral-400 dark:text-white/40 font-mono text-[11px] md:text-right"
                    id={`meta-tags-${exp.id}`}
                  >
                    {(() => {
                      const readingTime = calculateReadingTime(
                        exp.achievements[lang].join(" "),
                      );
                      return (
                        <span className="flex items-center gap-1.5 bg-neutral-50 dark:bg-white/5 border border-neutral-150 dark:border-white/5 px-2.5 py-0.5 rounded-md">
                          <IconBookFilled className="w-3 h-3 text-amber-500 dark:text-amber-400" />
                          <span>
                            {readingTime.value}{" "}
                            {lang === "en"
                              ? readingTime.unitLabel.en
                              : readingTime.unitLabel.id}
                          </span>
                        </span>
                      );
                    })()}
                    <span className="flex items-center gap-1.5 bg-neutral-50 dark:bg-white/5 border border-neutral-150 dark:border-white/5 px-2.5 py-0.5 rounded-md">
                      <IconCalendar className="w-3 h-3 text-neutral-400 dark:text-white/30" />
                      {exp.period}
                    </span>
                    <span className="flex items-center gap-1.5 bg-neutral-50 dark:bg-white/5 border border-neutral-150 dark:border-white/5 px-2.5 py-0.5 rounded-md">
                      <IconMapPin className="w-3 h-3 text-neutral-400 dark:text-white/30" />
                      {exp.location}
                    </span>
                  </div>
                </div>

                {/* Achievements List */}
                <ul
                  className="space-y-2.5 mt-5 text-neutral-600 dark:text-white/75 font-sans text-xs md:text-sm leading-relaxed font-light"
                  id={`achievements-list-${exp.id}`}
                >
                  {exp.achievements[lang].map((ach, aIdx) => (
                    <li
                      key={aIdx}
                      className="flex items-start gap-2.5"
                      id={`bullet-${exp.id}-${aIdx}`}
                    >
                      <span className="text-amber-500/70 dark:text-white/30 text-base leading-5 select-none">
                        •
                      </span>
                      <span>{ach}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
