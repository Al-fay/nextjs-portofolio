import {
  Project,
  Experience,
  SkillItem,
  TranslationDict,
  Testimonial,
} from "./types";

export const translations: Record<"id" | "en", TranslationDict> = {
  id: {
    nav: {
      about: "Tentang",
      skills: "Keahlian",
      experience: "Pengalaman",
      projects: "Proyek",
      contact: "Kontak",
    },
    hero: {
      badge: "Tersedia untuk Kontrak & Proyek Startup",
      title: "Membangun Produk Skala Global yang Dicintai Pengguna & Investor",
      subtitle:
        "Mid-level Fullstack Engineer & UI/UX Architect berspesialisasi dalam membangun aplikasi real-time berkinerja tinggi, arsitektur serverless, dan landing page modern dengan konversi tinggi.",
      ctaPrimary: "Diskusikan Proyek",
      ctaSecondary: "Lihat Galeri Proyek",
      subtext:
        "Telah membantu +15 startup mengamankan pendanaan Seed & Series A melalui produk digital kelas dunia.",
    },
    skills: {
      title: "Teknologi & Keahlian Utama",
      subtitle:
        "Dipilih secara cermat untuk menghasilkan reload 0ms, keamanan tingkat tinggi, dan skalabilitas masif.",
    },
    experience: {
      title: "Riwayat Profesional",
      subtitle:
        "Rekam jejak kepemimpinan teknis dalam meningkatkan performa sistem dan memandu tim global.",
      present: "Sekarang",
    },
    projects: {
      title: "Karya Terpilih",
      subtitle:
        "Studi kasus nyata yang memecahkan masalah bisnis nyata, dioptimalkan untuk skalabilitas tinggi.",
      all: "Semua Kategori",
      viewProject: "Eksplorasi Proyek",
      roleLabel: "Peran Utama",
      yearLabel: "Tahun Rilis",
    },
    contact: {
      title: "Mulai Kolaborasi Global",
      subtitle:
        "Siap mengubah visi startup Anda menjadi produk digital mutakhir yang siap bersaing di kancah internasional?",
      name: "Nama Lengkap",
      email: "Alamat Email",
      company: "Nama Perusahaan / Startup",
      message: "Detail Proyek Anda",
      placeholderName: "John Doe",
      placeholderEmail: "john@startup.com",
      placeholderCompany: "Acme Innovation Lab",
      placeholderMessage:
        "Tuliskan tantangan teknis Anda atau deskripsi produk yang ingin dibangun...",
      send: "Kirim Pesan Kolaborasi",
      sending: "Sedang Mengirim Pesan...",
      successTitle: "Pesan Terkirim dengan Sukses!",
      successMessage:
        "Terima kasih atas minat Anda. Sebagai Technical Architect Anda, saya akan mempelajari detail proyek Anda dan menghubungi Anda kembali dalam waktu kurang dari 12 jam.",
      errorEmail: "Format alamat email tidak valid.",
      errorRequired: "Kolom ini wajib diisi.",
    },
    footer: {
      rights: "Hak Cipta Dilindungi.",
      tagline:
        "Membangun masa depan digital dengan performa bertenaga, desain minimalis, dan arsitektur kokoh.",
      downloadResume: "Unduh Resume (PDF)",
    },
    testimonials: {
      title: "Testimoni Kolaborator",
      subtitle:
        "Apa masukan mereka yang telah berkolaborasi dalam merekayasa produk skala global.",
    },
    about: {
      title: "Perkenalan Pemilik",
      subtitle: "Mengenal Sosok di Balik Layar & Filosofi Kode",
      heading: "Halo, Saya Diva Alfahrizy 👋",
      bioParagraph1:
        "Saya seorang Mid-Level Fullstack Engineer & UI/UX Architect. Berada tepat di titik manis antara semangat eksplorasi talenta muda dan kematangan eksekusi sistem. Saya berfokus mengubah ide-ide rumit menjadi produk digital yang mulus, cepat, dan intuitif.",
      bioParagraph2:
        "Percaya bahwa kode yang hebat bukan sekadar bekerja tanpa error, melainkan memberikan rasa aman bagi bisnis dan pengalaman yang memanjakan mata pengguna. Dari optimasi reload 0ms hingga mendesain alur UI yang presisi, saya hadir sebagai mitra kolaborasi teknis yang dapat diandalkan.",
      highlights: [
        {
          title: "Mid-Level Sweet Spot",
          desc: "Kombinasi ideal antara kecepatan adaptasi teknologi modern dengan best-practice arsitektur sistem.",
        },
        {
          title: "0ms Performance Obsession",
          desc: "Setiap milidetik berharga. Merancang antarmuka super responsif dengan optimasi tingkat tinggi.",
        },
        {
          title: "Fullstack & UI/UX Bridge",
          desc: "Menghubungkan estetika desain visual dengan efisiensi logika backend secara menyeluruh.",
        },
      ],
    },
  },
  en: {
    nav: {
      about: "About",
      skills: "Skills",
      experience: "Experience",
      projects: "Projects",
      contact: "Contact",
    },
    hero: {
      badge: "Available for Global Contracts & Startup Consultations",
      title: "Engineering Global-Scale Products Users Love and Investors Back",
      subtitle:
        "Mid-level Fullstack Engineer & UI/UX Architect specializing in high-performance real-time applications, serverless architecture, and modern conversion-optimized landing pages.",
      ctaPrimary: "Start a Project",
      ctaSecondary: "Explore Selected Work",
      subtext:
        "Helping 15+ startups secure Seed & Series A funding with world-class digital products and reliable architectures.",
    },
    skills: {
      title: "Core Technology Stack",
      subtitle:
        "Handpicked tools optimized for 0ms loads, bank-grade security, and massive throughput scales.",
    },
    experience: {
      title: "Professional History",
      subtitle:
        "Formidable track record of technical leadership, performance engineering, and team mentoring.",
      present: "Present",
    },
    projects: {
      title: "Selected Visuals & Cases",
      subtitle:
        "Real-world case studies solving actual business challenges, engineered for elite performance.",
      all: "All Categories",
      viewProject: "Explore Case Study",
      roleLabel: "Core Role",
      yearLabel: "Release Year",
    },
    contact: {
      title: "Build Something Remarkable",
      subtitle:
        "Ready to transition your technical vision into a secure, cutting-edge market leader?",
      name: "Full Name",
      email: "Email Address",
      company: "Company / Startup Name",
      message: "Your Project Objectives",
      placeholderName: "Sarah Jenkins",
      placeholderEmail: "sarah@fintech.io",
      placeholderCompany: "Zenith Labs",
      placeholderMessage:
        "Briefly describe your product goals, technical bottlenecks, or timeline details...",
      send: "Transmit Inquiry",
      sending: "Transmitting Inquiries...",
      successTitle: "Inquiry Successfully Transmitted!",
      successMessage:
        "Thank you for reaching out. As your Technical Architect, I will analyze your product requirements and get back to you with a tactical roadmap in under 12 hours.",
      errorEmail: "Invalid email format.",
      errorRequired: "This field is strictly required.",
    },
    footer: {
      rights: "All rights reserved.",
      tagline:
        "Forging exceptional digital experiences powered by minimalist styling, raw speed, and reliable architecture.",
      downloadResume: "Download Resume (PDF)",
    },
    testimonials: {
      title: "Global Endorsements",
      subtitle:
        "What technical leaders and startup founders say about our engineering outcomes.",
    },
    about: {
      title: "Owner Introduction",
      subtitle: "Meet the Mind Behind the Code & Engineering Philosophy",
      heading: "Hi there, I am Diva Alfahrizy 👋",
      bioParagraph1:
        "I am a Mid-Level Fullstack Engineer & UI/UX Architect positioned right at the sweet spot between fast modern agility and reliable architectural discipline. My focus lies in transforming complex startup ideas into fast, intuitive, and highly scalable digital products.",
      bioParagraph2:
        "I believe great software is not just about error-free execution—it is about instilling business confidence and delivering visually captivating user experiences. From zero-latency reloads to precision-crafted layouts, I bring dedicated engineering craftsmanship to every project.",
      highlights: [
        {
          title: "Mid-Level Sweet Spot",
          desc: "The ideal balance of fast modern stack adoption and reliable architectural engineering principles.",
        },
        {
          title: "Zero-Latency Obsession",
          desc: "Every millisecond matters. Building ultra-responsive applications with high throughput efficiencies.",
        },
        {
          title: "Fullstack & UI/UX Bridge",
          desc: "Seamlessly connecting elegant visual design aesthetics with robust backend business logic.",
        },
      ],
    },
  },
};

export const skillsList: SkillItem[] = [
  { name: "TypeScript", category: "frontend", icon: "TypeScript" },
  { name: "React JS / React Native", category: "frontend", icon: "CodeReact" },
  { name: "Next.js", category: "frontend", icon: "CodeReact" },
  { name: "TanStack Start", category: "frontend", icon: "TanStack" },
  { name: "Bootstrap", category: "frontend", icon: "Sparkles" },
  { name: "TailwindCSS", category: "frontend", icon: "Tailwind" },
  { name: "Framer Motion", category: "frontend", icon: "Sparkles" },
  { name: "Node.js / Express", category: "backend", icon: "Server" },
  { name: "Laravel", category: "backend", icon: "Server" },
  { name: "CodeIgniter 4", category: "backend", icon: "Server" },
  { name: "FastAPI", category: "backend", icon: "Server" },
  { name: "Postgres / MySQL", category: "database", icon: "Database" },
  { name: "Supabase / Firebase", category: "database", icon: "Database" },
  { name: "Cloudinary", category: "tools", icon: "Cloud" },
  { name: "Docker", category: "devops", icon: "Container" },
  { name: "Vercel", category: "devops", icon: "Send" },
];

export const experiencesList: Experience[] = [
  {
    id: "exp-1",
    company: "Kospin Jasa Syariah",
    role: {
      en: "Mid-level Fullstack Developer & UI/UX Architect",
      id: "Mid-level Fullstack Developer & Arsitek UI/UX",
    },
    period: "2024 - " + translations.en.experience.present,
    location: "Indonesia",
    achievements: {
      en: [
        "Architected a secure internal enterprise IT Service Desk and ticketing system, streamlining cross-department requests and internal message auditing.",
        "Developed a robust school tuition billing portal integrated with corporate Banking Virtual Accounts (VA), enabling modern student invoice tracking and real-time financial reporting.",
        "Designed an interactive web-based financing portal for cooperative members, streamlining application workflows and accelerating processing times.",
        "Engineered core feature updates, bug fixes, and performance optimizations for the iOS Mobile Banking (m-Banking) application utilized actively by thousands of members.",
      ],
      id: [
        "Membangun website internal pelayanan IT (Ticketing System) lintas divisi serta merancang sistem repositori surat dinas internal yang terstruktur.",
        "Merekayasa sistem gateway pembayaran sekolah (Spp Portal) yang terintegrasi penuh secara realtime dengan Virtual Account (VA) perbankan, dilengkapi fitur tracking tagihan siswa dan modul laporan otomatis.",
        "Mendesain portal digital pengajuan pembiayaan anggota koperasi untuk menyederhanakan birokrasi dan meningkatkan efisiensi operasional pengajuan dana.",
        "Mengoptimalkan performa, memperbaiki bug, dan mengimplementasikan fitur-fitur baru pada aplikasi iOS Mobile Banking (m-Banking) demi kenyamanan transaksi para anggota.",
      ],
    },
  },
  {
    id: "exp-2",
    company: "Freelance Web Developer",
    role: {
      en: "Freelance Fullstack Developer",
      id: "Freelance Fullstack Developer",
    },
    period: "2022 - " + translations.en.experience.present,
    location: "Remote",
    achievements: {
      en: [
        "Crafted high-fidelity dynamic company profile websites utilizing custom-built CMS architectures designed for lightning-fast speeds and search engine optimization.",
        "Developed a custom civic feedback and public infrastructure tracking system for Gandu Village, enhancing institutional transparency and community communication.",
        "Built a secure, centralized social welfare assistance submission application for the Pekalongan District Social Services Agency to expedite public aid distribution.",
        "Successfully designed and deployed an automated, paperless correspondence system (Incoming and Outgoing Mail Registry) for the Bapperida government body.",
      ],
      id: [
        "Merancang dan menerapkan berbagai website company profile dinamis berbasis CMS kustom yang responsif, modern, dan ramah SEO untuk pelaku usaha.",
        "Membangun sistem pengaduan publik serta inventarisasi sarana prasarana Desa Gandu guna mendorong transparansi, akuntabilitas, dan keterlibatan masyarakat.",
        "Mengembangkan aplikasi web sistem pengajuan bantuan sosial terpadu untuk Dinas Sosial Kab. Pekalongan guna memvalidasi dan mempercepat penyaluran bantuan.",
        "Menginisiasi dan membuat platform digital surat-menyurat (arsip surat masuk & keluar) di instansi Bapperida untuk mewujudkan administrasi nirkertas (paperless) yang efisien.",
      ],
    },
  },
];

export const projectsList: Project[] = [
  {
    id: "proj-1",
    title: {
      en: "School Tuition VA Payment Gateway",
      id: "Portal Pembayaran SPP Sekolah Virtual Account",
    },
    description: {
      en: "Secure school tuition billing portal integrated with corporate Banking Virtual Accounts (VA), enabling student invoice tracking and real-time financial reporting.",
      id: "Portal pembayaran digital SPP sekolah terpadu yang terintegrasi penuh secara realtime dengan jaringan Virtual Account (VA) perbankan dan laporan otomatis.",
    },
    category: "web",
    tags: ["Laravel", "MySQL", "TailwindCSS", "Filament"],
    link: "https://github.com",
    image:
      "https://res.cloudinary.com/dfkf83vh1/image/upload/v1782561687/2_jqtsd0.png",
    images: [
      "https://res.cloudinary.com/dfkf83vh1/image/upload/v1782561442/1_fxzjgn.png",
      "https://res.cloudinary.com/dfkf83vh1/image/upload/v1782561687/2_jqtsd0.png",
      "https://res.cloudinary.com/dfkf83vh1/image/upload/v1782562214/3_kil7ln.png",
      "https://res.cloudinary.com/dfkf83vh1/image/upload/v1782561824/4_zs07tu.png",
    ],
    role: {
      en: "Mid-level Fullstack Developer & Lead Engineer",
      id: "Mid-level Fullstack Developer & Lead Engineer",
    },
    year: "2024",
    featured: true,
  },
  {
    id: "proj-2",
    title: {
      en: "Bapperida Paperless correspondence system",
      id: "Sistem Surat-Menyurat Digital Bapperida",
    },
    description: {
      en: "A high-efficiency enterprise correspondence platform orchestrating incoming and outgoing paperless registries with sub-second document indexing.",
      id: "Platform administrasi surat-menyurat masuk dan keluar nirkertas (paperless) berskala instansi dengan modul indeks pencarian dokumen super cepat.",
    },
    category: "web",
    tags: ["CodeIgniter 4", "Bootstrap", "MySQL", "Responsive Styling"],
    link: "https://github.com",
    image:
      "https://res.cloudinary.com/dfkf83vh1/image/upload/v1782564261/15_t3qml8.png",
    images: [
      "https://res.cloudinary.com/dfkf83vh1/image/upload/v1782564396/20_q5rdmb.png",
      "https://res.cloudinary.com/dfkf83vh1/image/upload/v1782564261/15_t3qml8.png",
      "https://res.cloudinary.com/dfkf83vh1/image/upload/v1782564262/16_zow8fv.png",
      "https://res.cloudinary.com/dfkf83vh1/image/upload/v1782564262/17_ft0uci.png",
      "https://res.cloudinary.com/dfkf83vh1/image/upload/v1782564262/19_obraqv.png",
      "https://res.cloudinary.com/dfkf83vh1/image/upload/v1782564262/18_erxt6t.png",
    ],
    role: {
      en: "Fullstack Architect & Lead",
      id: "Fullstack Architect & Lead",
    },
    year: "2024",
    featured: true,
  },
  {
    id: "proj-3",
    title: {
      en: "Pekalongan Social Aid Submission Portal",
      id: "Sistem Pengajuan Bantuan Sosial Pekalongan",
    },
    description: {
      en: "Dedicated web platform developed for Dinas Sosial Kab. Pekalongan to catalog, validate, and accelerate the distribution of local welfare assistance.",
      id: "Aplikasi web terpadu untuk Dinas Sosial Kab. Pekalongan untuk memasukkan, melakukan verifikasi kelayakan, dan mempercepat pembagian bantuan sosial masyarakat.",
    },
    category: "web",
    tags: ["CodeIgniter 4", "Bootstrap", "MySQL", "Responsive Styling"],
    link: "https://github.com",
    image:
      "https://res.cloudinary.com/dfkf83vh1/image/upload/v1782563552/11_scfvxu.png",
    images: [
      "https://res.cloudinary.com/dfkf83vh1/image/upload/v1782563564/10_kur8kd.png",
      "https://res.cloudinary.com/dfkf83vh1/image/upload/v1782563552/11_scfvxu.png",
      "https://res.cloudinary.com/dfkf83vh1/image/upload/v1782563552/12_jqlppl.png",
      "https://res.cloudinary.com/dfkf83vh1/image/upload/v1782563553/13_ziuvta.png",
      "https://res.cloudinary.com/dfkf83vh1/image/upload/v1782563552/14_qla59p.png",
    ],
    role: {
      en: "Fullstack Web Engineer",
      id: "Fullstack Web Engineer",
    },
    year: "2023",
    featured: true,
  },
  {
    id: "proj-4",
    title: {
      en: "Desa Gandu Civic Grievance & Utility Tracker",
      id: "Sistem Pengaduan Sarpras Desa Gandu",
    },
    description: {
      en: "Public civic reporting dashboard for Gandu Village designed to crowdsource community issue validation and optimize local government task scheduling.",
      id: "Sistem pengaduan interaktif masyarakat Desa Gandu untuk menyampaikan laporan mengenai kondisi sarana prasarana umum demi mempercepat penyelesaian isu warga oleh jajaran kelurahan.",
    },
    category: "web",
    tags: ["CodeIgniter 4", "Bootstrap", "MySQL", "Responsive Styling"],
    link: "https://github.com",
    image:
      "https://res.cloudinary.com/dfkf83vh1/image/upload/v1782562475/5_xneexl.png",
    images: [
      "https://res.cloudinary.com/dfkf83vh1/image/upload/v1782562475/5_xneexl.png",
      "https://res.cloudinary.com/dfkf83vh1/image/upload/v1782562961/6_qituli.png",
      "https://res.cloudinary.com/dfkf83vh1/image/upload/v1782562890/7_v6bymz.png",
      "https://res.cloudinary.com/dfkf83vh1/image/upload/v1782562889/8_cp25az.png",
      "https://res.cloudinary.com/dfkf83vh1/image/upload/v1782562891/9_wam3eg.png",
    ],
    role: {
      en: "Independent Developer",
      id: "Independent Developer",
    },
    year: "2022",
    featured: false,
  },
];

export const testimonialsList: Testimonial[] = [
  {
    id: "test-1",
    name: "Slamet Raharjo",
    role: "Kepala Desa Gandu",
    text: {
      en: "The infrastructure feedback and public grievance platform engineered by Diva Alfahrizy has helped our citizens tremendously. Public administration is now fully transparent and modern.",
      id: "Aplikasi pengaduan sarana prasarana yang dibangun Diva Alfahrizy sangat membantu warga kami. Penanganan keluhan kini berjalan transparan, cepat, dan membuat pelayanan desa menjadi jauh lebih modern.",
    },
  },
  {
    id: "test-2",
    name: "Ahmad Subekti",
    role: "Kasi Data, Dinsos Pekalongan",
    text: {
      en: "The social welfare assistance portal developed by Diva Alfahrizy guarantees that local aid is distributed accurately. The application is secure, fast, and very intuitive for our staff.",
      id: "Website pengisian bantuan sosial yang dikembangkan oleh Diva Alfahrizy membuat penyaluran dana sosial jauh lebih tepat sasaran. Sistemnya sangat aman, cepat, dan mudah dioperasikan oleh staf kami.",
    },
  },
  {
    id: "test-3",
    name: "Budi Santoso",
    role: "Kabid Humas, Bapperida",
    text: {
      en: "The digital paperless correspondence system built by Diva Alfahrizy completely revolutionized our daily work. Document lookups now take seconds and paper footprint went down by 80%.",
      id: "Sistem surat-menyurat digital dari Diva Alfahrizy merevolusi pola kerja di kantor kami. Pencarian dokumen kini hanya hitungan detik, dan anggaran kertas berkurang hingga 80%.",
    },
  },
];
