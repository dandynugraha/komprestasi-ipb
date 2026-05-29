import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Link as LinkIcon, ExternalLink } from "lucide-react";

export default function MyJadwalPage() {
  const [connected, setConnected] = useState(false);

  return (
    <div className="p-4 sm:p-6 ">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
          <Calendar size={18} className="text-white" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-zinc-900">My Jadwal</h1>
          <p className="text-[11px] text-zinc-400">Sinkronisasi dengan Google Calendar</p>
        </div>
      </div>

      {!connected ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-zinc-100">
          <div className="w-20 h-20 rounded-xl bg-blue-50 flex items-center justify-center mb-4">
            <Calendar size={32} className="text-blue-200" />
          </div>
          <h2 className="text-base font-bold text-zinc-400">Belum terhubung</h2>
          <p className="text-xs text-zinc-300 mt-1 text-center max-w-xs mb-4">
            Hubungkan Google Calendar untuk melihat jadwal lomba dan event kamu
          </p>
          <button
            onClick={() => setConnected(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-all hover:shadow-lg hover:shadow-blue-600/20"
          >
            <LinkIcon size={14} />
            Connect Google Calendar
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-zinc-100">
          <Calendar size={28} className="text-zinc-200 mb-2" />
          <p className="text-xs text-zinc-400">Jadwal kosong — belum ada event terdaftar</p>
        </div>
      )}
    </div>
  );
}
