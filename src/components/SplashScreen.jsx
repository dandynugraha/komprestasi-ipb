import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import siteConfig from "@/config/site.config";

const particles = [
  { left: "calc(50% + 130px)", top: "calc(50% - 72px)", size: 5, lime: true,  delay: 0.72 },
  { left: "calc(50% - 112px)", top: "calc(50% - 86px)", size: 3, lime: false, delay: 0.85 },
  { left: "calc(50% + 92px)",  top: "calc(50% + 118px)",size: 4, lime: true,  delay: 0.78 },
  { left: "calc(50% - 148px)", top: "calc(50% + 56px)", size: 6, lime: false, delay: 0.92 },
  { left: "calc(50% + 168px)", top: "calc(50% + 24px)", size: 3, lime: false, delay: 0.65 },
  { left: "calc(50% - 64px)",  top: "calc(50% + 144px)",size: 5, lime: true,  delay: 0.82 },
  { left: "calc(50% + 48px)",  top: "calc(50% - 154px)",size: 3, lime: false, delay: 0.68 },
];

export default function SplashScreen({ onFinish }) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => {
      setShow(false);
      setTimeout(onFinish, 600);
    }, 3800);
    return () => clearTimeout(t);
  }, [onFinish]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center hero-gradient overflow-hidden"
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.6 }}
        >
          {/* Grid */}
          <div className="absolute inset-0 opacity-[0.05]" style={{
            backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }} />

          {/* Lime radial blob — top right */}
          <div className="absolute pointer-events-none" style={{
            top: "-130px", right: "-130px", width: "480px", height: "480px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(198,255,0,0.15) 0%, transparent 65%)",
          }} />
          {/* Purple blob — bottom left */}
          <div className="absolute pointer-events-none" style={{
            bottom: "-100px", left: "-100px", width: "360px", height: "360px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(123,77,255,0.28) 0%, transparent 65%)",
          }} />

          {/* Orbiting rings */}
          {[
            { size: 210, color: "rgba(255,255,255,0.10)", dur: 12, dir: 1  },
            { size: 340, color: "rgba(198,255,0,0.07)",   dur: 22, dir: -1 },
            { size: 480, color: "rgba(255,255,255,0.04)", dur: 34, dir: 1  },
          ].map((ring, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{ width: ring.size, height: ring.size, border: `1px solid ${ring.color}` }}
              initial={{ scale: 0.3, opacity: 0 }}
              animate={{ scale: 1, opacity: 1, rotate: ring.dir * 360 }}
              transition={{ duration: ring.dur, delay: 0.2 + i * 0.15, ease: "linear", repeat: Infinity }}
            />
          ))}

          {/* Scatter particles */}
          {particles.map((p, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full pointer-events-none"
              style={{
                width: p.size, height: p.size,
                left: p.left, top: p.top,
                background: p.lime ? "#C6FF00" : "rgba(255,255,255,0.7)",
                boxShadow: p.lime ? "0 0 10px rgba(198,255,0,0.85)" : "none",
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0, 2.2, 1], opacity: [0, 1, 0.55] }}
              transition={{ delay: p.delay, duration: 0.5, ease: "backOut" }}
            />
          ))}

          {/* Central glow pulse */}
          <motion.div
            className="absolute rounded-full pointer-events-none"
            style={{
              width: 270, height: 270,
              background: "radial-gradient(circle, rgba(198,255,0,0.12) 0%, transparent 70%)",
            }}
            animate={{ scale: [1, 1.6, 1], opacity: [0.45, 0.9, 0.45] }}
            transition={{ duration: 2.5, ease: "easeInOut", repeat: Infinity }}
          />

          {/* Logo */}
          <motion.div
            className="relative z-10"
            initial={{ scale: 0, rotate: -15 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 220, damping: 14, delay: 0.3 }}
          >
            {/* Glow halo */}
            <motion.div
              className="absolute pointer-events-none"
              style={{
                inset: "-14px", borderRadius: "22px",
                background: "rgba(198,255,0,0.15)", filter: "blur(16px)",
              }}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
            <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-white/10 backdrop-blur flex items-center justify-center border border-white/20 shadow-2xl">
              <img
                src={siteConfig.logos.splash}
                alt={siteConfig.name}
                className="w-16 h-16 object-contain"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.nextSibling.style.display = "flex";
                }}
              />
              <div className="w-16 h-16 items-center justify-center text-white text-3xl font-black" style={{ display: "none" }}>
                KP
              </div>
            </div>
          </motion.div>

          {/* Text */}
          <motion.div
            className="relative z-10 mt-7 text-center"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.5 }}
          >
            <p className="text-white text-sm font-black tracking-[0.28em] uppercase text-flicker">
              {siteConfig.shortName}
            </p>
            <motion.div
              className="mt-3 mx-auto rounded-full"
              style={{ height: "1px", background: "linear-gradient(90deg, transparent, #C6FF00, transparent)" }}
              initial={{ width: 0 }}
              animate={{ width: 155 }}
              transition={{ delay: 1.5, duration: 0.7 }}
            />
          </motion.div>

          {/* Loading bar */}
          <motion.div
            className="relative z-10 mt-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8 }}
          >
            <div className="w-52 rounded-full overflow-hidden" style={{ height: "3px", background: "rgba(255,255,255,0.1)" }}>
              <motion.div
                className="h-full rounded-full"
                style={{
                  background: "linear-gradient(90deg, #7B4DFF, #C6FF00)",
                  boxShadow: "0 0 14px rgba(198,255,0,0.6)",
                }}
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ delay: 2, duration: 1.6, ease: "easeInOut" }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
