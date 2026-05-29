const base = import.meta.env.BASE_URL || "/";

const siteConfig = {
  name: "Komunitas Prestasi IPB",
  shortName: "Komprestasi IPB",
  tagline: "Wadah kreativitas, kolaborasi, dan prestasi mahasiswa IPB",
  copyright: "\u00a9 2026 MBD",
  managedBy: "Managed by MBD",

  logos: {
    splash: `${base}assets/logos/logo-splash.png`,
    navbar: `${base}assets/logos/logo-navbar.png`,
  },

  social: {
    instagram: {
      label: "Instagram",
      url: "https://www.instagram.com/komprestasi.ipb?igsh=azQwNG52cm4xY3Fh",
      handle: "@komprestasi.ipb",
    },
    whatsapp: {
      label: "WhatsApp Channel",
      url: "https://whatsapp.com/channel/0029Vb6xzHWG3R3mf8x0ol0O",
    },
  },

  fasilitas: [
    { id: "tatacara-student-portal", title: "Tatacara Pengisian Aktivitas Student Portal", description: "Panduan lengkap pengisian aktivitas di Student Portal IPB", url: "https://ipb.link/tatacarapengisianaktivitas-studentportal", type: "link" },
    { id: "panduan-fasilitasi", title: "Panduan Fasilitasi Lomba", description: "Panduan lengkap proses fasilitasi lomba di IPB", url: "https://www.instagram.com/p/DUSPEpjD2L1/?img_index=1", type: "instagram" },
    { id: "insentif-lomba-mandiri", title: "Panduan Insentif Lomba Mandiri", description: "Informasi insentif untuk lomba yang diikuti secara mandiri", url: "https://www.instagram.com/p/DUK1P6qj_Ne/?img_index=1", type: "instagram" },
    { id: "skpi-kemahasiswaan", title: "Panduan SKPI Kemahasiswaan", description: "Panduan Surat Keterangan Pendamping Ijazah bidang kemahasiswaan", url: "https://ipb.link/panduan-skpi-kemahasiswaan", type: "link" },
    { id: "kompetisi-mandiri", title: "Fasilitas Kompetisi Mandiri", description: "Informasi fasilitas yang tersedia untuk kompetisi mandiri", url: "https://www.instagram.com/p/DUSPEpjD2L1/?igsh=MjVwOTFtaXZrNjNq", type: "instagram" },
    { id: "prosedur-jas-bendera", title: "Prosedur Fasilitasi Jas dan Bendera", description: "Tata cara peminjaman jas almamater dan bendera untuk lomba", url: "https://www.instagram.com/p/DYwtrPqjw-q/?igsh=bWU0ODlyZmh5dTN5", type: "instagram" },
  ],

  about: { status: "coming-soon" },

  supabase: {
    url: "https://pgbuhqqrpqzydhsrxxbe.supabase.co",
    anonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBnYnVocXFycHF6eWRoc3J4eGJlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk5NzMzNjAsImV4cCI6MjA5NTU0OTM2MH0.AL0_LNYA_OBFDajwmJCbDdCEY07NmIc4_Sn9B7YtABU",
  },

  google: { clientId: "YOUR_GOOGLE_CLIENT_ID", calendarScopes: "https://www.googleapis.com/auth/calendar" },
  sps: { baseUrl: "YOUR_SPS_API_URL", clientId: "YOUR_SPS_CLIENT_ID" },

  publicNav: [
    { label: "Home", path: "/" },
    { label: "Lomba", path: "/lomba" },
    { label: "Event", path: "/event" },
    { label: "Fasilitas", path: "/fasilitas" },
    { label: "About Us", path: "/about" },
    { label: "FAQ", path: "/faq" },
  ],

  clusters: [
    "Penulisan Ilmiah dan Olimpiade Sains",
    "Bisnis dan Analisis Strategi",
    "Desain dan Visual Kreatif",
  ],
  clusterShort: {
    "Penulisan Ilmiah dan Olimpiade Sains": "Penulisan",
    "Bisnis dan Analisis Strategi": "Bisnis",
    "Desain dan Visual Kreatif": "Desain",
  },
  locations: ["Dramaga", "Vokasi"],
  cdaDivisions: ["penulisan", "bisnis", "desain", "olimpiade"],
  mbdRoles: ["ilustrator", "desain grafis", "video editor", "multimedia"],

  // Fix: tambah lombaCabang yang missing
  lombaCabang: [
    "Karya Tulis Ilmiah", "Paper Competition", "Business Plan", "Case Competition",
    "Data Science", "Hackathon", "UI/UX Design", "Poster", "Infografis",
    "Debat", "Olimpiade Sains", "Essay", "Short Movie", "Fotografi", "Lainnya",
  ],
  lombaStatuses: ["Peserta", "Finalis", "Juara 1", "Juara 2", "Juara 3", "Honorable Mention"],
  homeVisibleStatuses: ["Juara 1", "Juara 2", "Juara 3"],
  desainStatuses: ["Pending", "In Progress", "Revision", "Done"],
  pengeluaranCategories: ["Makan & Minum", "Transportasi", "Akademik", "Hiburan", "Belanja", "Lainnya"],
};

export default siteConfig;
