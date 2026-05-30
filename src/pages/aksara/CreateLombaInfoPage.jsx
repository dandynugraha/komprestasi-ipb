import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trophy, ChevronLeft, ChevronDown } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";

const BIDANG_OPTIONS = [
  "Karya Tulis Ilmiah", "Paper Competition", "Business Plan", "Case Competition",
  "Data Science", "Hackathon", "UI/UX Design", "Poster", "Infografis",
  "Debat", "Olimpiade Sains", "Essay", "Short Movie", "Fotografi", "Lainnya",
];

export default function CreateLombaInfoPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [form, setForm] = useState({
    judul: "",
    penyelenggara: "",
    bidang: "",
    deadline: "",
    link_info: "",
    link_daftar: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (!form.judul.trim() || !form.penyelenggara.trim() || !form.bidang || !form.deadline || !form.link_info.trim()) {
      setError("Lengkapi semua field wajib.");
      return;
    }

    setLoading(true);
    try {
      const description = JSON.stringify({
        penyelenggara: form.penyelenggara.trim(),
        bidang: form.bidang,
        link_info: form.link_info.trim(),
        link_daftar: form.link_daftar.trim() || null,
      });

      const { error: insertError } = await supabase.from("events").insert({
        title: form.judul.trim(),
        date: form.deadline,
        description,
        visibility: "lomba_info",
        created_by: user?.id ?? null,
      });

      if (insertError) throw insertError;
      navigate(-1);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const inputClass = "w-full text-sm text-zinc-900 placeholder:text-zinc-300 bg-zinc-50 rounded-lg px-3 py-2.5 border border-zinc-100 focus:outline-none focus:border-royal-400 focus:ring-1 focus:ring-royal-400 transition";

  return (
    <div className="p-4 sm:p-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center hover:bg-zinc-200 transition-colors"
        >
          <ChevronLeft size={16} className="text-zinc-600" />
        </button>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
            <Trophy size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-lg font-black text-zinc-900">Upload Info Lomba</h1>
            <p className="text-[11px] text-zinc-400">Info lomba akan muncul di halaman publik Lomba</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-white rounded-xl border border-zinc-100 p-4">
          <label className="block text-xs font-bold text-zinc-700 mb-2">
            Judul Lomba <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="judul"
            value={form.judul}
            onChange={handleChange}
            placeholder="Nama lomba..."
            className={inputClass}
          />
        </div>

        <div className="bg-white rounded-xl border border-zinc-100 p-4">
          <label className="block text-xs font-bold text-zinc-700 mb-2">
            Penyelenggara <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="penyelenggara"
            value={form.penyelenggara}
            onChange={handleChange}
            placeholder="Nama penyelenggara lomba"
            className={inputClass}
          />
        </div>

        <div className="bg-white rounded-xl border border-zinc-100 p-4">
          <label className="block text-xs font-bold text-zinc-700 mb-2">
            Bidang <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select
              name="bidang"
              value={form.bidang}
              onChange={handleChange}
              className={`${inputClass} appearance-none pr-8`}
            >
              <option value="">Pilih bidang...</option>
              {BIDANG_OPTIONS.map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-zinc-100 p-4">
          <label className="block text-xs font-bold text-zinc-700 mb-2">
            Deadline <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            name="deadline"
            value={form.deadline}
            onChange={handleChange}
            className={inputClass}
          />
        </div>

        <div className="bg-white rounded-xl border border-zinc-100 p-4">
          <label className="block text-xs font-bold text-zinc-700 mb-2">
            Info Lebih Lanjut <span className="text-red-500">*</span>
          </label>
          <input
            type="url"
            name="link_info"
            value={form.link_info}
            onChange={handleChange}
            placeholder="https://..."
            className={inputClass}
          />
        </div>

        <div className="bg-white rounded-xl border border-zinc-100 p-4">
          <label className="block text-xs font-bold text-zinc-700 mb-2">
            Link Daftar (opsional)
          </label>
          <input
            type="url"
            name="link_daftar"
            value={form.link_daftar}
            onChange={handleChange}
            placeholder="https://... (opsional)"
            className={inputClass}
          />
        </div>

        {error && (
          <div className="px-4 py-3 rounded-lg bg-red-50 border border-red-100">
            <p className="text-xs font-semibold text-red-600">{error}</p>
          </div>
        )}

        <div className="flex gap-2 pt-1">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex-1 py-3 rounded-xl border border-zinc-200 text-sm font-bold text-zinc-500 hover:bg-zinc-50 transition-colors"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-3 rounded-xl bg-royal-600 text-white text-sm font-black hover:bg-royal-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Menyimpan..." : "Upload Info Lomba"}
          </button>
        </div>
      </form>
    </div>
  );
}
