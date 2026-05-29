import { motion } from "framer-motion";
import { CalendarDays, Search } from "lucide-react";
import { useState } from "react";

export default function MyEventPage() {
  const [search, setSearch] = useState("");

  return (
    <div className="p-4 sm:p-6 ">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
          <CalendarDays size={18} className="text-white" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-zinc-900">My Event</h1>
          <p className="text-[11px] text-zinc-400">Event yang kamu ikuti</p>
        </div>
      </div>

      <div className="relative mb-5">
        <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari event..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-zinc-200 text-xs placeholder:text-zinc-300 focus:outline-none focus:border-royal-300 focus:ring-4 focus:ring-royal-100/50 transition-all"
        />
      </div>

      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-zinc-100">
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mb-3">
          <CalendarDays size={24} className="text-emerald-200" />
        </div>
        <p className="text-sm font-semibold text-zinc-300">Belum ada event</p>
        <p className="text-[11px] text-zinc-300 mt-1">Event yang kamu daftar akan muncul di sini</p>
      </div>
    </div>
  );
}
