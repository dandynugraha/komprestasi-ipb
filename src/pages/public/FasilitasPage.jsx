import { motion } from "framer-motion";
import { Camera, Link as LinkIcon, BookOpen, ArrowUpRight } from "lucide-react";
import siteConfig from "@/config/site.config";
const typeIcon = { instagram: Camera, link: LinkIcon };

export default function FasilitasPage() {
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
                <BookOpen size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-black text-white tracking-tight">Fasilitas</h1>
                <p className="text-xs text-white/40 font-medium mt-1">Panduan & info penting untuk anggota</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 -mt-4 relative z-10 pb-16 space-y-3">
        {siteConfig.fasilitas.map((item, i) => {
          const Icon = typeIcon[item.type] || LinkIcon;
          return (
            <motion.a key={item.id} href={item.url} target="_blank" rel="noopener noreferrer"
              className="group flex items-start gap-4 p-5 bg-white rounded-xl border border-zinc-100 card-lift shadow-sm hover:shadow-md"
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
              <div className="w-11 h-11 rounded-lg bg-royal-50 flex items-center justify-center flex-shrink-0 group-hover:bg-royal-100 transition-colors">
                <Icon size={18} className="text-royal-500" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-zinc-900 group-hover:text-royal-600 transition-colors">{item.title}</h3>
                <p className="text-xs text-zinc-400 mt-0.5">{item.description}</p>
              </div>
              <ArrowUpRight size={16} className="text-zinc-200 group-hover:text-royal-400 transition-all mt-1 flex-shrink-0 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </motion.a>
          );
        })}
      </div>
    </div>
  );
}
