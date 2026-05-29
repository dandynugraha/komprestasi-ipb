import { useState } from "react";
import { motion } from "framer-motion";
import { Trophy, Plus, Search, ArrowRight, ChevronDown } from "lucide-react";
import siteConfig from "@/config/site.config";

export default function MyLombaPage() {
  const [showAdd, setShowAdd] = useState(false);
  const [search, setSearch] = useState("");

  return (
    <div className="p-4 sm:p-6 ">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-royal-500 to-royal-600 flex items-center justify-center">
            <Trophy size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-zinc-900">My Lomba</h1>
            <p className="text-[11px] text-zinc-400">Tracking status lomba kamu</p>
          </div>
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-royal-600 text-white text-xs font-semibold hover:bg-royal-700 transition-all hover:shadow-lg hover:shadow-royal-600/20"
        >
          <Plus size={14} />
          Tambah Lomba
        </button>
      </div>

      {/* Add form (collapsed by default) */}
      {showAdd && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mb-6 p-5 bg-white rounded-2xl border border-zinc-100"
        >
          <h3 className="text-xs font-bold text-zinc-900 mb-4">Tambah lomba baru</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              placeholder="Nama lomba"
              className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs placeholder:text-zinc-300 focus:outline-none focus:border-royal-300 focus:ring-4 focus:ring-royal-100/50 transition-all"
            />
            <input
              placeholder="Cabang"
              className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs placeholder:text-zinc-300 focus:outline-none focus:border-royal-300 focus:ring-4 focus:ring-royal-100/50 transition-all"
            />
            <select className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-500 focus:outline-none focus:border-royal-300 focus:ring-4 focus:ring-royal-100/50 transition-all">
              {siteConfig.lombaStatuses.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <input
              type="date"
              placeholder="Deadline"
              className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-500 focus:outline-none focus:border-royal-300 focus:ring-4 focus:ring-royal-100/50 transition-all"
            />
          </div>
          <div className="flex gap-2 mt-4">
            <button className="px-4 py-2 rounded-xl bg-royal-600 text-white text-xs font-semibold hover:bg-royal-700 transition-all">
              Simpan
            </button>
            <button
              onClick={() => setShowAdd(false)}
              className="px-4 py-2 rounded-xl bg-zinc-100 text-zinc-600 text-xs font-semibold hover:bg-zinc-200 transition-all"
            >
              Batal
            </button>
          </div>
        </motion.div>
      )}

      {/* Search */}
      <div className="relative mb-5">
        <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari lomba..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-zinc-200 text-xs placeholder:text-zinc-300 focus:outline-none focus:border-royal-300 focus:ring-4 focus:ring-royal-100/50 transition-all"
        />
      </div>

      {/* Empty state */}
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-zinc-100">
        <div className="w-16 h-16 rounded-2xl bg-royal-50 flex items-center justify-center mb-3">
          <Trophy size={24} className="text-royal-200" />
        </div>
        <p className="text-sm font-semibold text-zinc-300">Belum ada lomba</p>
        <p className="text-[11px] text-zinc-300 mt-1">Tekan "Tambah Lomba" untuk mulai tracking</p>
      </div>

      {/* Info: status updates go to CDA */}
      <div className="mt-4 p-4 rounded-2xl bg-royal-50 border border-royal-100">
        <p className="text-[11px] text-royal-700">
          Status lomba kamu (Peserta → Finalis → Juara) akan terlihat di <strong>CDA cluster kamu</strong>, bukan di halaman Home publik. Hanya yang berstatus <strong>Juara</strong> yang muncul di Home.
        </p>
      </div>
    </div>
  );
}
