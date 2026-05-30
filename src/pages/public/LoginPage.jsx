import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LogIn, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import siteConfig from "@/config/site.config";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e?.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signIn(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError("Email atau password salah. Coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex relative overflow-hidden">
      {/* Left — purple panel */}
      <div className="hidden lg:flex lg:w-1/2 hero-gradient items-center justify-center relative overflow-hidden">
        {/* Dot grid */}
        <div className="absolute inset-0 opacity-[0.06]" style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.65) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }} />

        {/* Lime blob — top right */}
        <div className="absolute pointer-events-none" style={{
          top: "-96px", right: "-96px", width: "380px", height: "380px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(198,255,0,0.22) 0%, transparent 62%)",
        }} />
        {/* Purple blob — bottom left */}
        <div className="absolute pointer-events-none" style={{
          bottom: "-80px", left: "-80px", width: "300px", height: "300px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(123,77,255,0.32) 0%, transparent 62%)",
        }} />

        {/* Large centered decorative ring */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[440px] h-[440px] rounded-full spin-slow" style={{ border: "1px solid rgba(255,255,255,0.07)" }} />
        </div>
        {/* Small ring — top right area */}
        <div className="absolute w-56 h-56 rounded-full spin-slow-r pointer-events-none" style={{
          top: "8%", right: "4%",
          border: "1px solid rgba(198,255,0,0.12)",
        }} />

        {/* Floating square */}
        <motion.div
          className="absolute w-14 h-14 rounded-xl pointer-events-none"
          style={{ bottom: "22%", right: "14%", border: "1px solid rgba(255,255,255,0.12)" }}
          animate={{ y: [0, -14, 0], rotate: [8, 16, 8] }}
          transition={{ duration: 5.5, ease: "easeInOut", repeat: Infinity }}
        />
        {/* Floating dot */}
        <motion.div
          className="absolute w-5 h-5 rounded-full pointer-events-none"
          style={{ top: "22%", left: "14%", border: "2px solid rgba(198,255,0,0.35)" }}
          animate={{ y: [0, -10, 0], opacity: [0.4, 0.9, 0.4] }}
          transition={{ duration: 3.5, ease: "easeInOut", repeat: Infinity, delay: 1 }}
        />

        <div className="relative z-10 px-16 max-w-md">
          <img
            src={siteConfig.logos.splash}
            alt=""
            className="w-20 h-20 object-contain mb-8"
            style={{ filter: "drop-shadow(0 0 22px rgba(198,255,0,0.32))" }}
            onError={(e) => { e.target.style.display = "none"; }}
          />
          <span className="inline-block text-[10px] font-black text-accent uppercase tracking-[0.2em] mb-3">
            Komprestasi IPB
          </span>
          <h2 className="text-3xl font-black text-white leading-tight">
            Selamat datang di <span className="text-gradient">Komprestasi</span> IPB
          </h2>
          <p className="text-sm text-white/40 mt-4 leading-relaxed">
            {siteConfig.tagline}
          </p>
          <div className="mt-8 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)" }} />
          <div className="mt-6 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{
              background: "rgba(198,255,0,0.12)",
              border: "1px solid rgba(198,255,0,0.22)",
            }}>
              <span className="text-xs font-black" style={{ color: "#C6FF00" }}>62</span>
            </div>
            <p className="text-xs text-white/35">Angkatan 62 · Komprestasi IPB</p>
          </div>
        </div>
      </div>

      {/* Right — form */}
      <div className="flex-1 flex flex-col lg:items-center lg:justify-center bg-white">
        {/* Mobile purple hero header */}
        <div
          className="lg:hidden relative overflow-hidden rounded-b-3xl flex-shrink-0"
          style={{ background: "linear-gradient(135deg, #0D0520 0%, #1A0A3E 50%, #2E1065 100%)", minHeight: "200px" }}
        >
          <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
          <div className="absolute pointer-events-none" style={{ top: "-50px", right: "-50px", width: "200px", height: "200px", borderRadius: "50%", background: "radial-gradient(circle, rgba(198,255,0,0.2) 0%, transparent 65%)" }} />
          <div className="absolute pointer-events-none" style={{ bottom: "-30px", left: "-30px", width: "130px", height: "130px", borderRadius: "50%", background: "radial-gradient(circle, rgba(123,77,255,0.25) 0%, transparent 65%)" }} />
          <div className="relative px-8 pt-12 pb-12">
            <img
              src={siteConfig.logos.splash}
              alt=""
              className="w-12 h-12 object-contain mb-4"
              style={{ filter: "drop-shadow(0 0 16px rgba(198,255,0,0.32))" }}
              onError={(e) => { e.target.style.display = "none"; }}
            />
            <h2 className="text-2xl font-black text-white leading-tight">Komprestasi IPB</h2>
            <p className="text-sm text-white/45 mt-1.5 leading-relaxed max-w-xs">{siteConfig.tagline}</p>
          </div>
        </div>

        <motion.div
          className="w-full max-w-sm mx-auto px-6 py-8 lg:py-0"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-2xl font-black text-zinc-900">Masuk</h1>
          <p className="text-sm text-zinc-400 mt-1 mb-8">Login ke dashboard {siteConfig.shortName}</p>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-bold"
            >
              {error}
            </motion.div>
          )}

          <div className="space-y-5">
            <div>
              <label className="block text-[11px] font-bold text-zinc-500 mb-2 uppercase tracking-wider">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                className="w-full px-4 py-3 rounded-lg bg-zinc-50 border border-zinc-200 text-sm focus:outline-none focus:bg-white focus:border-royal-500 focus:ring-2 focus:ring-royal-100 transition-all"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-zinc-500 mb-2 uppercase tracking-wider">Password</label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  placeholder="Masukkan password"
                  className="w-full px-4 py-3 rounded-lg bg-zinc-50 border border-zinc-200 text-sm focus:outline-none focus:bg-white focus:border-royal-500 focus:ring-2 focus:ring-royal-100 transition-all pr-12"
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded text-zinc-400 hover:text-zinc-600">
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <button
              onClick={handleSubmit}
              disabled={loading || !email || !password}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-lg bg-royal-600 text-white text-sm font-black hover:bg-royal-700 disabled:opacity-40 transition-all active:scale-[0.98] shadow-md shadow-royal-600/25 hover:shadow-lg hover:shadow-royal-600/30 hover:-translate-y-0.5"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <><LogIn size={15} /> Masuk</>
              )}
            </button>
          </div>

          <p className="text-center text-xs text-zinc-400 mt-8">
            Belum punya akun? <a href={siteConfig.social.whatsapp.url} target="_blank" rel="noopener noreferrer" className="text-royal-600 font-bold hover:underline">Hubungi admin</a>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
