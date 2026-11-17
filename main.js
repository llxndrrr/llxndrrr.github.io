'use strict';
/* =========================================================
   LXNDR — interaksi halaman
   0. Warna latar berganti per bagian
   1. Navigasi berlatar saat di-scroll
   2. Elemen muncul saat masuk layar
   3. Kata-kata di "Tentang" menyala satu per satu saat di-scroll
   4. Angka menghitung naik
   ========================================================= */
const kurangiGerak = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// 0. Warna latar berganti mulus saat sebuah bagian melewati tengah layar.
//    Tiap bagian punya data-tema="terang" (ivory) atau "gelap" (navy);
//    CSS menganimasikan warnanya (lihat @property di style.css).
const pengamatTema = new IntersectionObserver(entri => {
  for (const e of entri) if (e.isIntersecting) document.body.dataset.tema = e.target.dataset.tema;
}, { rootMargin: '-50% 0px -50% 0px' });
document.querySelectorAll('[data-tema]').forEach(el => pengamatTema.observe(el));

// 1. Navigasi
const nav = document.getElementById('nav');
const cekNav = () => nav.classList.toggle('terscroll', window.scrollY > 20);
cekNav();
window.addEventListener('scroll', cekNav, { passive: true });

// 2. Muncul saat masuk layar
const pengamat = new IntersectionObserver(entri => {
  for (const e of entri) {
    if (!e.isIntersecting) continue;
    e.target.classList.add('terlihat');
    pengamat.unobserve(e.target);
  }
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach(el => pengamat.observe(el));
// dipakai project.js untuk kartu yang dibuat belakangan
window.amatiReveal = el => pengamat.observe(el);

// 3. Kata menyala saat di-scroll
const pernyataan = document.getElementById('pernyataan');
const kata = pernyataan.textContent.trim().split(/\s+/);
pernyataan.textContent = '';
for (const k of kata) {           // dibuat sebagai elemen teks (bukan HTML) supaya aman
  const s = document.createElement('span');
  s.className = 'kata';
  s.textContent = k;
  pernyataan.append(s, ' ');
}
const semuaKata = pernyataan.querySelectorAll('.kata');
function nyalakanKata() {
  if (kurangiGerak) { semuaKata.forEach(k => k.classList.add('nyala')); return; }
  const r = pernyataan.getBoundingClientRect();
  const tinggi = window.innerHeight;
  // 0 saat paragraf baru masuk dari bawah, 1 saat sudah di sepertiga atas layar
  const kemajuan = Math.min(1, Math.max(0, (tinggi * 0.85 - r.top) / (r.height + tinggi * 0.35)));
  const jumlah = Math.round(kemajuan * semuaKata.length);
  semuaKata.forEach((k, i) => k.classList.toggle('nyala', i < jumlah));
}
nyalakanKata();
window.addEventListener('scroll', nyalakanKata, { passive: true });
window.addEventListener('resize', nyalakanKata);

// 4. Angka menghitung naik
const pengamatAngka = new IntersectionObserver(entri => {
  for (const e of entri) {
    if (!e.isIntersecting) continue;
    const el = e.target;
    const target = Number(el.dataset.hitung);
    const akhir = el.dataset.akhir || '';
    pengamatAngka.unobserve(el);
    if (kurangiGerak || target === 0) { el.textContent = target + akhir; continue; }
    const mulai = performance.now();
    const durasi = 1200;
    const langkah = t => {
      const p = Math.min(1, (t - mulai) / durasi);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))) + akhir;
      if (p < 1) requestAnimationFrame(langkah);
    };
    requestAnimationFrame(langkah);
  }
}, { threshold: 0.6 });
document.querySelectorAll('[data-hitung]').forEach(el => pengamatAngka.observe(el));
