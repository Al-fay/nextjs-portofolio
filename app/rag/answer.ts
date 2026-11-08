import { searchPortfolio } from "./portfolio-retriever";
import {
  skillsList,
  experiencesList,
  projectsList,
  testimonialsList,
} from "../data";

const EMAIL = "divaalfahrizy02878@gmail.com";

const IS_EN =
  /\b(what|who|how|which|where|your|tell|does|do|is|are|can|available|hire|projects?|skills?|experience)\b/i;

const INTENTS = {
  greeting: /^\s*(halo|hai|hi|hello|hey|selamat (pagi|siang|sore|malam))\b/i,
  location:
    /orang mana|\basal\b|tinggal|domisili|lokasi|where.*(from|live|based)|located|location/i,
  unavailable:
    /alamat|umur|usia|lahir|gaji|\btarif\b|\bharga\b|nomor|whatsapp|\bage\b|salary|\brate\b|address|price/i,
  availability:
    /remote|menerima|terima|tersedia|available|hire|rekrut|sewa|kontrak|freelance|startup|jasa|order|pesan proyek|bisa dipakai|open to/i,
  contact:
    /kontak|contact|email|hubungi|menghubungi|reach|cara memulai|mulai proyek/i,
  skills:
    /skill|keahlian|kemampuan|teknologi|tech ?stack|stack|bahasa pemrograman|framework|bisa apa/i,
  experience:
    /pengalaman|experience|karier|career|riwayat|history|perusahaan|company|kerja di|bekerja di|worked/i,
  projects:
    /proyek|project|portofolio|portfolio|karya|works|dikerjakan|dibuat|built/i,
  testimonials:
    /testimoni|testimonial|review|ulasan|feedback|kata (mereka|klien)/i,
  profile:
    /siapa|who is|who's|profil|profile|tentang|about|perkenalan|biodata/i,
};

type T = (x: { id: string; en: string }) => string;

export function answerPortfolio(
  query: string,
  lang: "id" | "en" = "en",
): string {
  const en = lang === "en";
  const t: T = (x) => (en ? x.en : x.id);
  const is = (k: keyof typeof INTENTS) => INTENTS[k].test(query);

  const msg = {
    unavailable: en
      ? `That information isn't available in Diva's portfolio. You can ask Diva directly at ${EMAIL} or via the Contact form.`
      : `Informasi itu belum tersedia di portofolio Diva. Kamu bisa menanyakannya langsung lewat ${EMAIL} atau Contact Form di website.`,
    notFound: en
      ? `I couldn't find that. Try asking about skills, experience, projects, or testimonials, or contact Diva at ${EMAIL}.`
      : `Maaf, saya belum menemukan informasi itu. Coba tanya soal keahlian, pengalaman, proyek, atau testimoni, atau hubungi Diva di ${EMAIL}.`,
  };

  // Detail satu proyek (judul disebut persis).
  const q = query.toLowerCase();
  const proj = projectsList.find(
    (p) =>
      q.includes(p.title.id.toLowerCase()) ||
      q.includes(p.title.en.toLowerCase()),
  );
  if (proj)
    return en
      ? `${proj.title.en} (${proj.year})\n${proj.description.en}\nTech: ${proj.tags.join(", ")}\nRole: ${proj.role.en}`
      : `${proj.title.id} (${proj.year})\n${proj.description.id}\nTeknologi: ${proj.tags.join(", ")}\nPeran: ${proj.role.id}`;

  if (is("greeting"))
    return en
      ? "Hi! Ask me about Diva's skills, experience, projects, or how to start a project together."
      : "Halo! Silakan tanya soal keahlian, pengalaman, proyek Diva, atau cara memulai proyek bersama.";

  if (is("location"))
    return en
      ? "Diva is based in Pekalongan, Indonesia."
      : "Diva berasal dari Pekalongan, Indonesia.";

  if (is("unavailable")) return msg.unavailable;

  if (is("availability"))
    return en
      ? `Yes. Diva is open to contracts and startup projects, and has worked as a remote freelance fullstack developer since 2022. To discuss your project, email ${EMAIL} or use the Contact form.`
      : `Ya. Diva terbuka untuk kontrak dan proyek startup, dan sudah mengerjakan proyek freelance fullstack secara remote sejak 2022. Untuk mendiskusikan proyekmu, hubungi ${EMAIL} atau gunakan Contact Form di website.`;

  if (is("contact"))
    return en
      ? `You can reach Diva at ${EMAIL} or through the Contact form on this website.`
      : `Kamu bisa menghubungi Diva di ${EMAIL} atau lewat Contact Form di website ini.`;

  if (is("skills")) return skills(en);
  if (is("experience")) return experience(en, t);
  if (is("projects")) return projects(en, t, query);
  if (is("testimonials")) return testimonials(t);
  if (is("profile")) return profile(en, t);

  // Fallback: dokumen terdekat, abaikan Profil (kata "Diva" ada di mana-mana).
  const top = searchPortfolio(query).find((d) => d.category !== "Profil");
  switch (top?.category) {
    case "Skill":
      return skills(en);
    case "Pengalaman":
      return experience(en, t);
    case "Project":
      return projects(en, t, query);
    case "Testimoni":
      return testimonials(t);
    default:
      return msg.notFound;
  }
}

function skills(en: boolean) {
  const groups: Record<string, string[]> = {};
  for (const s of skillsList) (groups[s.category] ??= []).push(s.name);
  const lines = Object.entries(groups)
    .map(([c, n]) => `• ${c}: ${n.join(", ")}`)
    .join("\n");
  return `${en ? "Diva's technical skills:" : "Keahlian teknis Diva:"}\n${lines}`;
}

function experience(en: boolean, t: T) {
  return (
    `${en ? "Diva's work experience:" : "Pengalaman kerja Diva:"}\n` +
    experiencesList
      .map((e) => `• ${e.company} — ${t(e.role)} (${e.period})`)
      .join("\n")
  );
}

function projects(en: boolean, t: T, query: string) {
  const q = query.toLowerCase();
  const byTech = projectsList.filter((p) =>
    p.tags.some((tag) => q.includes(tag.toLowerCase())),
  );
  const list = byTech.length ? byTech : projectsList;
  return (
    `${en ? "Projects Diva has built:" : "Proyek yang pernah dikerjakan Diva:"}\n` +
    list
      .map((p) => `• ${t(p.title)} (${p.year}) — ${p.tags.join(", ")}`)
      .join("\n")
  );
}

function testimonials(t: T) {
  return testimonialsList
    .map((x) => `"${t(x.text)}"\n— ${x.name}, ${x.role}`)
    .join("\n\n");
}

function profile(en: boolean, t: T) {
  const [now, before] = experiencesList;
  return en
    ? `Diva Alfahrizy (Alfay) is a ${t(now.role)} at ${now.company} (${now.period}), and has worked as a ${t(before.role)} since 2022.`
    : `Diva Alfahrizy (Alfay) adalah ${t(now.role)} di ${now.company} (${now.period}), dan juga bekerja sebagai ${t(before.role)} sejak 2022.`;
}
