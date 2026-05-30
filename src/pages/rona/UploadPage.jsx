import { useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Upload, Image, X, FileText, ChevronDown, ArrowLeft, CheckCircle,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import siteConfig from "@/config/site.config";
import { supabase } from "@/lib/supabase";

const typeConfig = {
  prestasi: {
    title: "Upload Prestasi",
    sub: "Bagikan pencapaian kamu beserta foto & storytelling",
    table: "prestasi",
    fields: ["title", "storytelling", "photo", "cabang", "status"],
  },
  kegiatan: {
    title: "Upload Kegiatan",
    sub: "Ceritakan kegiatan yang kamu ikuti",
    table: "kegiatan",
    fields: ["title", "storytelling", "photo"],
  },
  project: {
    title: "Upload Project",
    sub: "Showcase project atau karya yang sudah kamu buat",
    table: "projects",
    fields: ["title", "storytelling", "photo", "link"],
  },
};

export default function UploadPage() {
  const { type } = useParams(); // prestasi | kegiatan | project
  const config = typeConfig[type] || typeConfig.prestasi;
  const navigate = useNavigate();
  const { profile } = useAuth();
  const fileRef = useRef(null);

  const [form, setForm] = useState({
    title: "",
    storytelling: "",
    cabang: "",
    status: "",
    link: "",
  });
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  function handleFile(file) {
    if (!file) return;
    if (!file.type.startsWith("image/")) return;
    setPhoto(file);
    setPreview(URL.createObjectURL(file));
  }

  function onDrop(e) {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  }

  function removePhoto() {
    setPhoto(null);
    setPreview(null);
  }

  async function handleSubmit() {
    if (!form.title || !form.storytelling || !photo) return;
    if (siteConfig.supabase.url.includes("YOUR_PROJECT")) {
      alert("Supabase belum dikonfigurasi");
      return;
    }
    setLoading(true);

    try {
      // Upload photo to Supabase Storage
      const ext = photo.name.split(".").pop();
      const fileName = `${type}/${Date.now()}.${ext}`;
      const { error: uploadErr } = await supabase.storage
        .from("uploads")
        .upload(fileName, photo);
      if (uploadErr) throw uploadErr;

      const { data: urlData } = supabase.storage
        .from("uploads")
        .getPublicUrl(fileName);

      // Insert record
      const record = {
        user_id: profile.id,
        title: form.title,
        storytelling: form.storytelling,
        photo_url: urlData.publicUrl,
        cluster: profile.cluster,
        lokasi: profile.lokasi,
        is_published: true,
      };

      if (type === "prestasi") {
        record.cabang = form.cabang;
        record.status = form.status;
      }
      if (type === "project") {
        record.link = form.link;
      }

      const { error: insertErr } = await supabase
        .from(config.table)
        .insert(record);
      if (insertErr) throw insertErr;

      setSuccess(true);
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (err) {
      console.error("Upload error:", err);
      alert("Gagal upload. Coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <motion.div
          className="text-center"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <CheckCircle size={48} className="text-emerald-500 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-zinc-900">Upload berhasil!</h2>
          <p className="text-sm text-zinc-400 mt-1">Redirecting ke dashboard...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 ">
      {/* Header */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 text-xs text-zinc-400 hover:text-zinc-600 mb-4"
      >
        <ArrowLeft size={14} /> Kembali
      </button>

      <h1 className="text-lg font-bold text-zinc-900">{config.title}</h1>
      <p className="text-xs text-zinc-400 mt-0.5 mb-6">{config.sub}</p>

      {/* Photo upload area */}
      <div className="mb-5">
        <label className="block text-xs font-medium text-zinc-600 mb-2">
          Foto <span className="text-red-400">*</span>
        </label>
        {preview ? (
          <div className="relative rounded-xl overflow-hidden border border-zinc-100">
            <img src={preview} alt="Preview" className="w-full h-48 object-cover" />
            <button
              onClick={removePhoto}
              className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/40 flex items-center justify-center text-white hover:bg-black/60"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
            onClick={() => fileRef.current?.click()}
            className={`border-2 border-dashed rounded-xl h-40 flex flex-col items-center justify-center cursor-pointer transition-colors ${
              dragOver
                ? "border-royal-400 bg-royal-50"
                : "border-zinc-200 hover:border-royal-300 hover:bg-royal-50/30"
            }`}
          >
            <Image size={28} className="text-zinc-300 mb-2" />
            <p className="text-xs text-zinc-400">
              Drag & drop foto, atau <span className="text-royal-600 font-medium">browse</span>
            </p>
            <p className="text-[10px] text-zinc-300 mt-1">JPG, PNG, max 5MB</p>
          </div>
        )}
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFile(e.target.files[0])}
        />
      </div>

      {/* Title */}
      <div className="mb-4">
        <label className="block text-xs font-medium text-zinc-600 mb-1.5">
          Judul <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder={`Judul ${type}...`}
          className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-sm text-zinc-900 placeholder:text-zinc-300 focus:outline-none focus:border-royal-300 focus:ring-2 focus:ring-royal-100 transition-all"
        />
      </div>

      {/* Storytelling */}
      <div className="mb-4">
        <label className="block text-xs font-medium text-zinc-600 mb-1.5">
          Storytelling <span className="text-red-400">*</span>
        </label>
        <textarea
          value={form.storytelling}
          onChange={(e) => setForm({ ...form, storytelling: e.target.value })}
          rows={6}
          placeholder="Ceritakan pengalaman kamu secara detail... Apa yang kamu pelajari? Apa tantangan terbesar? Tips untuk yang lain?"
          className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-sm text-zinc-900 placeholder:text-zinc-300 focus:outline-none focus:border-royal-300 focus:ring-2 focus:ring-royal-100 transition-all resize-none"
        />
        <p className="text-[10px] text-zinc-300 mt-1">
          {form.storytelling.length} karakter — tulis minimal 100 karakter
        </p>
      </div>

      {/* Conditional fields */}
      {type === "prestasi" && (
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <label className="block text-xs font-medium text-zinc-600 mb-1.5">Cabang lomba</label>
            <div className="relative">
              <select
                value={form.cabang}
                onChange={(e) => setForm({ ...form, cabang: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-sm text-zinc-900 focus:outline-none focus:border-royal-300 focus:ring-2 focus:ring-royal-100 transition-all appearance-none bg-white"
              >
                <option value="">Pilih...</option>
                {siteConfig.lombaCabang.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-600 mb-1.5">Status</label>
            <div className="relative">
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-sm text-zinc-900 focus:outline-none focus:border-royal-300 focus:ring-2 focus:ring-royal-100 transition-all appearance-none bg-white"
              >
                <option value="">Pilih...</option>
                {siteConfig.lombaStatuses.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
            </div>
          </div>
        </div>
      )}

      {type === "project" && (
        <div className="mb-4">
          <label className="block text-xs font-medium text-zinc-600 mb-1.5">Link project (opsional)</label>
          <input
            type="url"
            value={form.link}
            onChange={(e) => setForm({ ...form, link: e.target.value })}
            placeholder="https://..."
            className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-sm text-zinc-900 placeholder:text-zinc-300 focus:outline-none focus:border-royal-300 focus:ring-2 focus:ring-royal-100 transition-all"
          />
        </div>
      )}

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={loading || !form.title || !form.storytelling || !photo}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-royal-600 text-white text-sm font-semibold hover:bg-royal-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? (
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <>
            <Upload size={15} />
            Publish {type}
          </>
        )}
      </button>
    </div>
  );
}
