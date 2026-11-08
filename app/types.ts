export type Language = "en" | "id";

export interface TranslationDict {
  nav: {
    about: string;
    skills: string;
    experience: string;
    projects: string;
    contact: string;
  };
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
    subtext: string;
  };
  skills: {
    title: string;
    subtitle: string;
  };
  experience: {
    title: string;
    subtitle: string;
    present: string;
  };
  projects: {
    title: string;
    subtitle: string;
    all: string;
    viewProject: string;
    roleLabel: string;
    yearLabel: string;
  };
  contact: {
    title: string;
    subtitle: string;
    name: string;
    email: string;
    company: string;
    message: string;
    placeholderName: string;
    placeholderEmail: string;
    placeholderCompany: string;
    placeholderMessage: string;
    send: string;
    sending: string;
    successTitle: string;
    successMessage: string;
    errorEmail: string;
    errorRequired: string;
  };
  footer: {
    rights: string;
    tagline: string;
    downloadResume: string;
  };
  testimonials?: {
    title: string;
    subtitle: string;
  };
  about: {
    title: string;
    subtitle: string;
    heading: string;
    bioParagraph1: string;
    bioParagraph2: string;
    highlights: Array<{ title: string; desc: string }>;
  };
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  text: {
    en: string;
    id: string;
  };
}

export interface Project {
  id: string;
  title: {
    en: string;
    id: string;
  };
  description: {
    en: string;
    id: string;
  };
  // category: 'web' | 'mobile' | 'ai';
  category: "web";
  tags: string[];
  link: string;
  image: string;
  images?: string[];
  role: {
    en: string;
    id: string;
  };
  year: string;
  featured: boolean;
}

export interface Experience {
  id: string;
  company: string;
  role: {
    en: string;
    id: string;
  };
  period: string;
  location: string;
  achievements: {
    en: string[];
    id: string[];
  };
}

export interface SkillItem {
  name: string;
  category: "frontend" | "backend" | "database" | "devops" | "tools";
  icon: string; // lucide icon name or logo representation
}
