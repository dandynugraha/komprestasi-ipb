import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarDays, Clock, MapPin, Users, Eye, FileText, ChevronLeft } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";

const VISIBILITY_OPTIONS = [
  { value: "internal", label: "Internal", desc: "Hanya anggota Komprestasi" },
  { value: "eksternal", label: "Eksternal", desc: "Terbuka untuk umum" },
];

export default function CreateEventPage() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();

  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    time_start: "",
    time_end: "",
    location: "",
    visibility: "internal",
    spots: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (!form.title.trim() || !form.date || !form.time_start || !form.time_end || !form.location.trim()) {
      setError("Lengkapi semua field wajib.");
      return;
    }

    setLoading(true);
    const { error: insertError } = await supabase.from("events").insert({
      title: form.title.trim(),
      description: form.description.trim() || null,
      date: form.date,
      time_start: form.time_start,
      time_end: form.time_end,
      location: form.location.trim(),
      visibility: form.visibility,
      spots: form.spots ? parseInt(form.spots, 10) : null,
      created_by: user?.id ?? null,
      divisi: profile?.divisi ?? null,
    });
    setLoading(false);

    if (insertError) {
      setError(insertError.message);
      return;
    }

    navigate("/dashboard/heg");
  }

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
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
            <CalendarDays size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-lg font-black text-zinc-900">Buat Event</h1>
            <p className="text-[11px] text-zinc-400">Isi detail event yang akan dibuat</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div className="bg-white rounded-xl border border-zinc-100 p-4">
          <label className="block text-xs font-bold text-zinc-700 mb-2">
            Judul Event <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Nama event..."
            className="w-full text-sm text-zinc-900 placeholder:text-zinc-300 bg-zinc-50 rounded-lg px-3 py-2.5 border border-zinc-100 focus:outline-none focus:border-royal-400 focus:ring-1 focus:ring-royal-400 transition"
          />
        </div>

        {/* Description */}
        <div className="bg-white rounded-xl border border-zinc-100 p-4">
          <label className="block text-xs font-bold text-zinc-700 mb-2 flex items-center gap-1.5">
            <FileText size={12} className="text-zinc-400" />
            Deskripsi
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Deskripsi singkat event..."
            rows={3}
            className="w-full text-sm text-zinc-900 placeholder:text-zinc-300 bg-zinc-50 rounded-lg px-3 py-2.5 border border-zinc-100 focus:outline-none focus:border-royal-400 focus:ring-1 focus:ring-royal-400 transition resize-none"
          />
        </div>

        {/* Date & Time */}
        <div className="bg-white rounded-xl border border-zinc-100 p-4 space-y-3">
          <p className="text-xs font-bold text-zinc-700 flex items-center gap-1.5">
            <Clock size={12} className="text-zinc-400" />
            Waktu <span className="text-red-500">*</span>
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[10px] font-semibold text-zinc-400 mb-1">Tanggal</label>
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                className="w-full text-sm text-zinc-900 bg-zinc-50 rounded-lg px-3 py-2.5 border border-zinc-100 focus:outline-none focus:border-royal-400 focus:ring-1 focus:ring-royal-400 transition"
              />
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-zinc-400 mb-1">Mulai</label>
              <input
                type="time"
                name="time_start"
                value={form.time_start}
                onChange={handleChange}
                className="w-full text-sm text-zinc-900 bg-zinc-50 rounded-lg px-3 py-2.5 border border-zinc-100 focus:outline-none focus:border-royal-400 focus:ring-1 focus:ring-royal-400 transition"
              />
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-zinc-400 mb-1">Selesai</label>
              <input
                type="time"
                name="time_end"
                value={form.time_end}
                onChange={handleChange}
                className="w-full text-sm text-zinc-900 bg-zinc-50 rounded-lg px-3 py-2.5 border border-zinc-100 focus:outline-none focus:border-royal-400 focus:ring-1 focus:ring-royal-400 transition"
              />
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="bg-white rounded-xl border border-zinc-100 p-4">
          <label className="block text-xs font-bold text-zinc-700 mb-2 flex items-center gap-1.5">
            <MapPin size={12} className="text-zinc-400" />
            Lokasi <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="Nama tempat / link online..."
            className="w-full text-sm text-zinc-900 placeholder:text-zinc-300 bg-zinc-50 rounded-lg px-3 py-2.5 border border-zinc-100 focus:outline-none focus:border-royal-400 focus:ring-1 focus:ring-royal-400 transition"
          />
        </div>

        {/* Visibility & Spots */}
        <div className="bg-white rounded-xl border border-zinc-100 p-4 space-y-3">
          <div>
            <label className="block text-xs font-bold text-zinc-700 mb-2 flex items-center gap-1.5">
              <Eye size={12} className="text-zinc-400" />
              Visibilitas
            </label>
            <div className="flex gap-2">
              {VISIBILITY_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, visibility: opt.value }))}
                  className={`flex-1 px-3 py-2.5 rounded-lg border text-left transition-all ${
                    form.visibility === opt.value
                      ? "border-royal-400 bg-royal-50"
                      : "border-zinc-100 bg-zinc-50 hover:bg-zinc-100"
                  }`}
                >
                  <p className={`text-xs font-bold ${form.visibility === opt.value ? "text-royal-700" : "text-zinc-700"}`}>
                    {opt.label}
                  </p>
                  <p className="text-[10px] text-zinc-400 mt-0.5">{opt.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-700 mb-2 flex items-center gap-1.5">
              <Users size={12} className="text-zinc-400" />
              Kapasitas (opsional)
            </label>
            <input
              type="number"
              name="spots"
              value={form.spots}
              onChange={handleChange}
              placeholder="Jumlah slot tersedia..."
              min="1"
              className="w-full text-sm text-zinc-900 placeholder:text-zinc-300 bg-zinc-50 rounded-lg px-3 py-2.5 border border-zinc-100 focus:outline-none focus:border-royal-400 focus:ring-1 focus:ring-royal-400 transition"
            />
          </div>
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
            {loading ? "Menyimpan..." : "Buat Event"}
          </button>
        </div>
      </form>
    </div>
  );
}
