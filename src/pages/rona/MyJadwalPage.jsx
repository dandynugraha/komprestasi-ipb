import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Copy, ExternalLink, Check } from "lucide-react";
import siteConfig from "@/config/site.config";

const STEPS = [
  {
    num: 1,
    title: "Buka Google Calendar",
    desc: "Buka Google Calendar di browser atau HP kamu",
  },
  {
    num: 2,
    title: "Subscribe ke kalender bersama",
    desc: 'Klik tombol + di samping "Other calendars" → pilih "Subscribe to calendar"',
  },
  {
    num: 3,
    title: "Masukkan email kalender Komprestasi",
    desc: "Copy email di bawah ini, paste ke kolom pencarian, lalu tekan Enter",
    emailInput: true,
  },
  {
    num: 4,
    title: "Selesai",
    desc: "Event dari Komprestasi IPB akan otomatis muncul di Google Calendar kamu — tanpa perlu login apapun",
  },
];

export default function MyJadwalPage() {
  const email = siteConfig.google?.sharedCalendarEmail || "komprestasi.ipb@gmail.com";
  const [copied, setCopied] = useState(false);

  function copyEmail() {
    navigator.clipboard.writeText(email).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
          <Calendar size={18} className="text-white" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-zinc-900">My Jadwal</h1>
          <p className="text-[11px] text-zinc-400">Sinkronisasi dengan Google Calendar</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-zinc-100 p-6 mb-4">
        <h2 className="text-sm font-black text-zinc-900 mb-1">Cara subscribe ke kalender Komprestasi</h2>
        <p className="text-xs text-zinc-400 mb-6">Tidak perlu install apapun — cukup ikuti 4 langkah ini</p>

        <div className="space-y-6">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.num}
              className="flex items-start gap-4"
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08, duration: 0.3 }}
            >
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ background: "linear-gradient(135deg, #3B82F6, #1D4ED8)", boxShadow: "0 4px 10px rgba(59,130,246,0.3)" }}
              >
                <span className="text-[11px] font-black text-white">{step.num}</span>
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-zinc-900">{step.title}</p>
                <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">{step.desc}</p>
                {step.emailInput && (
                  <div className="mt-2.5 flex items-center gap-2 px-3 py-2.5 rounded-xl bg-blue-50 border border-blue-100">
                    <code className="text-xs font-bold text-blue-700 flex-1 truncate">{email}</code>
                    <button
                      onClick={copyEmail}
                      className="flex items-center gap-1 text-[10px] font-bold text-blue-600 hover:text-blue-800 transition-colors flex-shrink-0"
                    >
                      {copied ? <Check size={11} className="text-emerald-500" /> : <Copy size={11} />}
                      {copied ? "Tersalin!" : "Salin"}
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        <a
          href="https://calendar.google.com"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-7 flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition-colors"
        >
          <ExternalLink size={14} /> Buka Google Calendar
        </a>
      </div>

      <div className="p-4 rounded-xl bg-blue-50 border border-blue-100">
        <p className="text-xs text-blue-700 leading-relaxed">
          Setelah subscribe, perubahan event yang dilakukan admin Komprestasi akan langsung sinkron ke Google Calendar kamu — tanpa perlu melakukan apapun lagi.
        </p>
      </div>
    </div>
  );
}
