import { useState, useEffect } from "react";
import { Trophy, Activity, Folder, Upload, Search } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";

function formatDate(d) {
  return new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

const TYPE_CONFIG = {
  prestasi: { label: "Prestasi", color: "bg-amber-100 text-amber-700",   icon: Trophy,   bg: "bg-amber-50",   iconColor: "text-amber-300"   },
  kegiatan: { label: "Kegiatan", color: "bg-emerald-100 text-emerald-700",icon: Activity, bg: "bg-emerald-50", iconColor: "text-emerald-300" },
  project:  { label: "Project",  color: "bg-blue-100 text-blue-700",     icon: Folder,   bg: "bg-blue-50",    iconColor: "text-blue-300"    },
};

const FILTERS = [
  { id: "all",      label: "Semua"    },
  { id: "prestasi", label: "Prestasi" },
  { id: "kegiatan", label: "Kegiatan" },
  { id: "project",  label: "Project"  },
];

export default function MyUploadsPage() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchUploads();
  }, [user?.id]);

  async function fetchUploads() {
    setLoading(true);
    try {
      const [
        { data: prestasiData },
        { data: kegiatanData },
        { data: projectData },
      ] = await Promise.all([
        supabase.from("prestasi").select("id, title, storytelling, photo_url, status, cabang, created_at")
          .eq("user_id", user.id).order("created_at", { ascending: false }),
        supabase.from("kegiatan").select("id, title, storytelling, photo_url, created_at")
          .eq("user_id", user.id).order("created_at", { ascending: false }),
        supabase.from("projects").select("id, title, storytelling, photo_url, created_at")
          .eq("user_id", user.id).order("created_at", { ascending: false }),
      ]);

      const merged = [
        ...(prestasiData || []).map(i => ({ ...i, _type: "prestasi" })),
        ...(kegiatanData || []).map(i => ({ ...i, _type: "kegiatan" })),
        ...(projectData  || []).map(i => ({ ...i, _type: "project"  })),
      ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

      setItems(merged);
    } catch (err) {
      console.error("fetchUploads error:", err);
    } finally {
      setLoading(false);
    }
  }

  const displayed = items.filter(i => {
    if (filter !== "all" && i._type !== filter) return false;
    if (search && !(i.title || "").toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="p-4 sm:p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-royal-500 to-royal-600 flex items-center justify-center">
          <Upload size={18} className="text-white" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-zinc-900">Upload Saya</h1>
          <p className="text-[11px] text-zinc-400">Semua prestasi, kegiatan, dan project kamu</p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-2 mb-4 overflow-x-auto hide-scrollbar">
        {FILTERS.map(f => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
              filter === f.id
                ? "bg-royal-600 text-white shadow-sm shadow-royal-600/20"
                : "bg-white text-zinc-500 border border-zinc-200 hover:bg-zinc-50"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari upload..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-zinc-200 text-xs placeholder:text-zinc-300 focus:outline-none focus:border-royal-300 focus:ring-4 focus:ring-royal-100/50 transition-all"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-5 h-5 rounded-full border-2 border-royal-200 border-t-royal-600 animate-spin" />
        </div>
      ) : displayed.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-zinc-100">
          <div className="w-16 h-16 rounded-2xl bg-royal-50 flex items-center justify-center mb-3">
            <Upload size={24} className="text-royal-200" />
          </div>
          <p className="text-sm font-semibold text-zinc-300">Belum ada upload</p>
          <p className="text-[11px] text-zinc-300 mt-1">Upload prestasi, kegiatan, atau project dulu</p>
        </div>
      ) : (
        <div className="space-y-3">
          {displayed.map(item => {
            const cfg = TYPE_CONFIG[item._type] || TYPE_CONFIG.prestasi;
            const Icon = cfg.icon;
            return (
              <div key={`${item._type}-${item.id}`} className="bg-white rounded-xl border border-zinc-200 p-4 flex items-start gap-3">
                {item.photo_url ? (
                  <img src={item.photo_url} alt="" className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
                ) : (
                  <div className={`w-16 h-16 rounded-lg ${cfg.bg} flex items-center justify-center flex-shrink-0`}>
                    <Icon size={22} className={cfg.iconColor} />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${cfg.color}`}>{cfg.label}</span>
                    {item.status && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-zinc-100 text-zinc-600">{item.status}</span>
                    )}
                  </div>
                  <p className="text-sm font-bold text-zinc-900 leading-snug">{item.title}</p>
                  {item.cabang && <p className="text-xs text-zinc-400 mt-0.5">{item.cabang}</p>}
                  {item.storytelling && (
                    <p className="text-xs text-zinc-400 mt-1 line-clamp-2">
                      {item.storytelling.slice(0, 90)}{item.storytelling.length > 90 ? "…" : ""}
                    </p>
                  )}
                  <p className="text-[10px] text-zinc-300 mt-1.5">{formatDate(item.created_at)}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
