import {
  translations,
  skillsList,
  experiencesList,
  projectsList,
  testimonialsList,
} from "../data";

type LanguageText = {
  id: string;
  en: string;
};

type PortfolioDocument = {
  id: string;
  category: string;
  title: string;
  content: string;
  keywords: string[];
};

type RetrieverOptions = {
  limit?: number;
  minScore?: number;
};

type ScoredDocument = {
  document: PortfolioDocument;
  score: number;
};

const stopWords = new Set([
  "apa",
  "siapa",
  "bagaimana",
  "berapa",
  "kapan",
  "dimana",
  "mana",
  "yang",
  "dan",
  "atau",
  "dari",
  "dengan",
  "untuk",
  "tentang",
  "saya",
  "aku",
  "kamu",
  "anda",
  "the",
  "what",
  "who",
  "how",
  "when",
  "where",
  "which",
  "and",
  "or",
  "of",
  "for",
  "with",
  "about",
  "is",
  "are",
  "do",
  "does",
  "can",
  "could",
  "tell",
  "me",
  "your",
  "you",
  "please",
  "this",
  "that",
]);

const synonymGroups: string[][] = [
  [
    "skill",
    "skills",
    "keahlian",
    "kemampuan",
    "teknologi",
    "technology",
    "stack",
  ],
  ["pengalaman", "experience", "karier", "career", "riwayat", "history"],
  [
    "proyek",
    "project",
    "projects",
    "portfolio",
    "portofolio",
    "karya",
    "works",
  ],
  ["testimoni", "testimonial", "testimonials", "review", "ulasan", "feedback"],
  ["profil", "profile", "tentang", "about", "biodata", "bio", "perkenalan"],
  ["kontak", "contact", "email", "hubungi", "menghubungi", "hire", "hiring"],
  ["peran", "role", "posisi", "position", "jabatan"],
  ["perusahaan", "company", "organisasi", "organization", "klien", "client"],
  ["deskripsi", "description", "detail", "details", "informasi", "information"],
  ["tahun", "year", "kapan", "when"],
  ["backend", "server", "api"],
  ["frontend", "ui", "ux", "antarmuka"],
  ["database", "basisdata", "basis", "data"],
  ["website", "web", "situs"],
  ["aplikasi", "application", "app", "sistem", "system"],
];

const synonymMap = new Map<string, Set<string>>();

for (const group of synonymGroups) {
  const expanded = new Set(group);

  for (const word of group) {
    synonymMap.set(word, expanded);
  }
}

function normalizeText(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9+#.]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenize(value: string): string[] {
  return normalizeText(value)
    .split(" ")
    .filter((word) => word.length > 1 && !stopWords.has(word));
}

function unique<T>(items: T[]): T[] {
  return [...new Set(items)];
}

function expandKeywords(words: string[]): Set<string> {
  const expanded = new Set(words);

  for (const word of words) {
    const synonyms = synonymMap.get(word);

    if (synonyms) {
      for (const synonym of synonyms) {
        expanded.add(synonym);
      }
    }
  }

  return expanded;
}

function getLocalizedText(value: LanguageText): string {
  return `${value.id} ${value.en}`;
}

function buildDocuments(): PortfolioDocument[] {
  const documents: PortfolioDocument[] = [];

  // Profile: bilingual content comes from src/data.ts.
  documents.push({
    id: "profile",
    category: "Profil",
    title: "Diva Alfahrizy - Profile",
    content: [
      translations.id.hero.badge,
      translations.id.hero.title,
      translations.id.hero.subtitle,
      translations.id.hero.subtext,
      translations.id.about.title,
      translations.id.about.subtitle,
      translations.id.about.heading,
      translations.id.about.bioParagraph1,
      translations.id.about.bioParagraph2,
      translations.en.hero.badge,
      translations.en.hero.title,
      translations.en.hero.subtitle,
      translations.en.hero.subtext,
      translations.en.about.title,
      translations.en.about.subtitle,
      translations.en.about.heading,
      translations.en.about.bioParagraph1,
      translations.en.about.bioParagraph2,
    ].join("\n"),
    keywords: [
      "Diva Alfahrizy",
      "Alfay",
      "profil",
      "profile",
      "fullstack engineer",
      "UI UX architect",
      "developer",
      "pengembang",
    ],
  });

  // Skills.
  for (const skill of skillsList) {
    documents.push({
      id: `skill-${normalizeText(skill.name).replace(/\s+/g, "-")}`,
      category: "Skill",
      title: skill.name,
      content: [
        `Nama skill: ${skill.name}`,
        `Kategori: ${skill.category}`,
        `Teknologi: ${skill.name}`,
      ].join("\n"),
      keywords: [
        skill.name,
        skill.category,
        "skill",
        "skills",
        "keahlian",
        "teknologi",
        "technology",
      ],
    });
  }

  // Professional experience.
  for (const experience of experiencesList) {
    documents.push({
      id: experience.id,
      category: "Pengalaman",
      title: `${experience.company} - ${experience.role.id}`,
      content: [
        `Perusahaan: ${experience.company}`,
        `Company: ${experience.company}`,
        `Posisi: ${experience.role.id}`,
        `Role: ${experience.role.en}`,
        `Periode: ${experience.period}`,
        `Lokasi: ${experience.location}`,
        "Pencapaian Bahasa Indonesia:",
        ...experience.achievements.id.map((item) => `- ${item}`),
        "Achievements in English:",
        ...experience.achievements.en.map((item) => `- ${item}`),
      ].join("\n"),
      keywords: [
        experience.id,
        experience.company,
        experience.role.id,
        experience.role.en,
        experience.period,
        experience.location,
        "pengalaman",
        "experience",
        ...experience.achievements.id,
        ...experience.achievements.en,
      ],
    });
  }

  // Projects.
  for (const project of projectsList) {
    documents.push({
      id: project.id,
      category: "Project",
      title: `${project.title.id} / ${project.title.en}`,
      content: [
        `Nama proyek: ${project.title.id}`,
        `Project name: ${project.title.en}`,
        `Deskripsi: ${project.description.id}`,
        `Description: ${project.description.en}`,
        `Kategori: ${project.category}`,
        `Teknologi: ${project.tags.join(", ")}`,
        `Role: ${project.role.id} / ${project.role.en}`,
        `Tahun: ${project.year}`,
        `Link: ${project.link}`,
        `Featured: ${project.featured ? "Yes" : "No"}`,
      ].join("\n"),
      keywords: [
        project.id,
        project.title.id,
        project.title.en,
        project.description.id,
        project.description.en,
        project.category,
        ...project.tags,
        project.role.id,
        project.role.en,
        project.year,
        "proyek",
        "project",
        "portfolio",
        "portofolio",
      ],
    });
  }

  // Testimonials.
  for (const testimonial of testimonialsList) {
    documents.push({
      id: testimonial.id,
      category: "Testimoni",
      title: `${testimonial.name} - ${testimonial.role}`,
      content: [
        `Nama: ${testimonial.name}`,
        `Peran: ${testimonial.role}`,
        `Testimoni Bahasa Indonesia: ${testimonial.text.id}`,
        `Testimonial in English: ${testimonial.text.en}`,
      ].join("\n"),
      keywords: [
        testimonial.id,
        testimonial.name,
        testimonial.role,
        testimonial.text.id,
        testimonial.text.en,
        "testimoni",
        "testimonial",
        "review",
        "ulasan",
      ],
    });
  }

  return documents;
}

const portfolioDocuments = buildDocuments();

function scoreDocument(
  query: string,
  queryWords: Set<string>,
  document: PortfolioDocument,
): number {
  const normalizedQuery = normalizeText(query);
  const normalizedTitle = normalizeText(document.title);
  const normalizedContent = normalizeText(document.content);
  const normalizedKeywords = normalizeText(document.keywords.join(" "));

  const documentWords = expandKeywords(
    tokenize(
      [document.title, document.content, document.keywords.join(" ")].join(" "),
    ),
  );

  let matchedWords = 0;
  let weightedMatches = 0;

  for (const word of queryWords) {
    if (!documentWords.has(word)) continue;

    matchedWords += 1;

    if (normalizedTitle.includes(word)) {
      weightedMatches += 3;
    } else if (normalizedKeywords.includes(word)) {
      weightedMatches += 2;
    } else {
      weightedMatches += 1;
    }
  }

  const queryTokens = tokenize(query);
  const matchRatio =
    queryTokens.length > 0 ? matchedWords / queryTokens.length : 0;

  let score = matchRatio * 0.7;

  if (normalizedQuery.length >= 3) {
    if (normalizedTitle.includes(normalizedQuery)) {
      score += 0.35;
    }

    if (normalizedKeywords.includes(normalizedQuery)) {
      score += 0.2;
    }

    if (normalizedContent.includes(normalizedQuery)) {
      score += 0.1;
    }
  }

  score += (weightedMatches / Math.max(queryTokens.length * 3, 1)) * 0.3;

  return Math.min(score, 1);
}

export function searchPortfolio(
  query: string,
  options: RetrieverOptions = {},
): PortfolioDocument[] {
  const limit = Math.max(1, Math.min(options.limit ?? 5, 10));
  const minScore = options.minScore ?? 0.08;
  if (typeof query !== "string" || !query.trim()) return [];

  const queryWords = expandKeywords(tokenize(query));
  if (queryWords.size === 0) return [];

  return portfolioDocuments
    .map((document) => ({
      document,
      score: scoreDocument(query, queryWords, document),
    }))
    .filter((item) => item.score >= minScore)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.document);
}
