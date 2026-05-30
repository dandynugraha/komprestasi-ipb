File: src/pages/public/AboutPage.jsx

HANYA ubah styling foto pengurus. JANGAN ubah data, layout, atau fitur lain.

Masalah: Foto pengurus (Ketua, Wakil, Kadiv, Staff, Supervisor) sekarang pakai rounded-full (lingkaran) yang memotong foto. Foto-foto ini adalah PNG dengan background transparan, jadi seharusnya ditampilkan TANPA crop lingkaran supaya seluruh figur orang terlihat.

TAPI tetap PERTAHANKAN efek bayangan/shadow/glow di belakang foto — itu bagus. Yang dihilangkan HANYA frame lingkarannya.

Fix untuk SEMUA foto pengurus di halaman About Us:

1. HAPUS: rounded-full dan overflow-hidden dari tag <img> foto
2. GANTI: rounded-full jadi rounded-none atau hapus rounded sama sekali pada img
3. PERTAHANKAN: shadow, glow, border-color, dan decorative accent di belakang foto
4. Foto sekarang tampil full (tidak di-crop lingkaran), background transparan terlihat
5. Container foto tetap punya ukuran (w-36 h-36 untuk Kadiv/BPH, w-24 h-24 untuk Staff) tapi pakai object-contain BUKAN object-cover, supaya foto tidak terpotong
6. Bayangan/glow di belakang foto: TETAP ada. Kalau sekarang shadow ada di img langsung, pindahkan ke div wrapper di belakang img. Contoh:

SEBELUM (crop lingkaran):
```jsx
<img src={foto} className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-xl" />
```

SESUDAH (tanpa crop, tetap ada bayangan):
```jsx
<div className="relative flex items-end justify-center w-36 h-36 mx-auto">
  {/* Shadow/glow di belakang */}
  <div className="absolute bottom-0 w-24 h-6 bg-gradient-to-t from-zinc-200/50 to-transparent rounded-full blur-md" />
  {/* Foto tanpa crop */}
  <img src={foto} className="relative w-full h-full object-contain drop-shadow-lg" onError={...fallback} />
</div>
```

7. Untuk FALLBACK (kalau foto gagal load): tetap pakai rounded-full karena itu cuma inisial huruf, bukan foto orang

8. Sesuaikan ukuran per jabatan:
   - Supervisor: w-36 h-44
   - BPH (Ketua): w-40 h-48 (paling besar, prominent)
   - BPH (Wakil, Sekre, Bendahara): w-36 h-44
   - Kadiv: w-36 h-44
   - Staff: w-28 h-36

9. Accent shadow warna per divisi:
   - BPH/Supervisor: from-zinc-300/50 (abu)
   - CDA: from-royal-300/30 (ungu muda)
   - HEG: from-pink-300/30
   - MBD: from-violet-300/30
   - Korvoks: from-teal-300/30

JANGAN ubah apapun selain styling foto. Data, nama, jabatan, layout section, rona section, visi misi — SEMUA tetap.

Test: npm run build HARUS sukses.