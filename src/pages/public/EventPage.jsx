import { useState } from "react";
import { motion } from "framer-motion";
import { CalendarDays, Search } from "lucide-react";
import siteConfig from "@/config/site.config";

export default function EventPage() {
  const [search, setSearch] = useState("");
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
                <CalendarDays size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-black text-white tracking-tight">Event</h1>
                <p className="text-xs text-white/40 font-medium mt-1">Event terbuka dari {siteConfig.name}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 -mt-4 relative z-10 pb-16">
        <div className="relative mb-8">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari event..."
            className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white border border-zinc-200 shadow-lg text-sm placeholder:text-zinc-300 focus:outline-none focus:border-royal-500 focus:ring-2 focus:ring-royal-100 transition-all" />
        </div>

        {/* Empty state */}
        <div className="relative flex flex-col items-center justify-center py-24 bg-white rounded-xl border border-zinc-100 overflow-hidden">
          <div className="absolute inset-0 opacity-[0.025]" style={{
            backgroundImage: "radial-gradient(circle, #4A1FB5 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }} />
          <div className="relative w-20 h-20 rounded-xl bg-gradient-to-br from-emerald-50 to-white flex items-center justify-center mb-4 shadow-sm border border-emerald-100/60">
            <CalendarDays size={32} className="text-emerald-300" />
          </div>
          <h2 className="relative text-base font-black text-zinc-400">Belum ada event</h2>
          <p className="relative text-xs text-zinc-300 mt-1">Event terbuka dari CDA dan HEG akan muncul di sini</p>
        </div>
      </div>
    </div>
  );
}
