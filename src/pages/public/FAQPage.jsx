import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle, ChevronDown } from "lucide-react";

const faqs = [
  { q: "Apa itu Komprestasi IPB?", a: "Komunitas Prestasi IPB adalah wadah bagi mahasiswa IPB University yang berfokus pada pengembangan prestasi akademik dan non-akademik, termasuk lomba ilmiah, olimpiade, bisnis, dan desain kreatif." },
  { q: "Siapa saja yang bisa bergabung?", a: "Seluruh mahasiswa aktif IPB University dari kampus Dramaga maupun Vokasi dapat bergabung dengan Komprestasi IPB." },
  { q: "Apa itu Rona dan Aksara?", a: "Rona adalah anggota umum Komprestasi IPB yang mengikuti kegiatan dan lomba. Aksara adalah pengurus yang mengelola organisasi, terdiri dari CDA, HEG, MBD, Korvoks, dan BPH." },
  { q: "Apa saja cluster yang ada?", a: "Ada 3 cluster: Penulisan Ilmiah dan Olimpiade Sains, Bisnis dan Analisis Strategi, dan Desain dan Visual Kreatif." },
  { q: "Bagaimana cara tracking lomba?", a: "Login ke dashboard, lalu buka menu My Lomba. Kamu bisa menambah lomba yang diikuti dan update statusnya. Status lomba akan terlihat di dashboard CDA cluster kamu." },
  { q: "Apa itu Pesen Desain?", a: "Fitur untuk divisi CDA, HEG, dan Korvoks untuk meminta bantuan desain dari tim MBD. Request akan masuk ke kanban MBD dan diproses sesuai antrian." },
  { q: "Siapa yang mengelola website ini?", a: "Website ini dikelola oleh divisi MBD (Media, Branding, dan Dokumentasi) Komprestasi IPB." },
];

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-zinc-100 last:border-0">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between py-5 text-left group">
        <span className="text-sm font-bold text-zinc-900 group-hover:text-royal-600 transition-colors pr-4">{q}</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={16} className={`flex-shrink-0 transition-colors ${open ? "text-royal-500" : "text-zinc-400"}`} />
        </motion.div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <p className="text-xs text-zinc-500 leading-relaxed pb-5">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQPage() {
  return (
    <div>
      {/* Header */}
      <div className="hero-gradient wave-bottom relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.05]" style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }} />
        {/* Lime blob */}
        <div className="absolute pointer-events-none" style={{
          top: "-80px", right: "-80px", width: "380px", height: "380px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(198,255,0,0.18) 0%, transparent 65%)",
        }} />
        {/* Purple blob */}
        <div className="absolute pointer-events-none" style={{
          bottom: "-60px", left: "-60px", width: "260px", height: "260px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(123,77,255,0.22) 0%, transparent 65%)",
        }} />

        <div className="max-w-7xl mx-auto px-5 sm:px-8 pt-28 pb-28">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="inline-block text-[10px] font-black uppercase tracking-[0.2em] mb-4" style={{ color: "#C6FF00" }}>
              Komprestasi IPB
            </span>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/15 shadow-xl shadow-black/10 flex-shrink-0">
                <HelpCircle size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-black text-white tracking-tight">FAQ</h1>
                <p className="text-xs text-white/40 font-medium mt-1">Pertanyaan yang sering ditanyakan</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-5 sm:px-8 -mt-4 relative z-10 pb-16">
        <div className="bg-white rounded-xl border border-zinc-100 p-6 sm:p-8 shadow-sm">
          {faqs.map((f, i) => <FAQItem key={i} q={f.q} a={f.a} />)}
        </div>
      </div>
    </div>
  );
}
