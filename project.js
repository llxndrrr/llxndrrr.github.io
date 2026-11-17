'use strict';
/* =========================================================
   LXNDR — menampilkan daftar project dari projects.js
   - Unggulan (maks. 3): kartu besar bergantian kiri-kanan
   - Semua project lainnya: grid kartu kecil dengan filter kategori,
     pencarian, dan tombol "Tampilkan semua" (awalnya 6 kartu)
   Semua elemen dibuat dengan createElement/textContent (bukan HTML
   mentah) supaya teks project tidak bisa disalahgunakan jadi kode.
   ========================================================= */
(function () {
  const MAKS_UNGGULAN = 3;
  const AWAL_TAMPIL = 6;
  const PANAH = 'M7 17L17 7M9 7h8v8';

  // ---------- pembantu kecil ----------
  function el(tag, kelas, teks) {
    const e = document.createElement(tag);
    if (kelas) e.className = kelas;
    if (teks != null) e.textContent = teks;
    return e;
  }
  function ikonPanah() {
    const ns = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('aria-hidden', 'true');
    const p = document.createElementNS(ns, 'path');
    p.setAttribute('d', PANAH);
    svg.append(p);
    return svg;
  }
  function tautan(kelas, teks, href, labelLengkap) {
    const a = el('a', kelas, teks);
    a.href = href;
    if (/^https?:/.test(href)) { a.target = '_blank'; a.rel = 'noopener'; }
    if (labelLengkap) a.setAttribute('aria-label', labelLengkap);
    a.append(' ', ikonPanah());
    return a;
  }
  function daftarTag(tag) {
    const ul = el('ul', 'tag mono');
    ul.setAttribute('aria-label', 'Teknologi');
    for (const t of tag || []) ul.append(el('li', '', t));
    return ul;
  }
  function gambar(g, kelas) {
    const img = el('img', kelas || '');
    img.src = g.src; img.alt = g.alt || '';
    img.width = 1600; img.height = 1000; img.loading = 'lazy'; img.decoding = 'async';
    return img;
  }
  // Sampul huruf untuk project yang belum punya screenshot
  function sampul(judul) {
    const d = el('div', 'sampul');
    d.setAttribute('aria-hidden', 'true');
    const inisial = judul.split(/\s+/).map(k => k[0]).join('').slice(0, 2).toUpperCase();
    d.append(el('span', '', inisial));
    return d;
  }
  const amati = node => (window.amatiReveal ? window.amatiReveal(node) : node.classList.add('terlihat'));
  const nomor = i => String(i + 1).padStart(2, '0');

  // ---------- kartu besar (unggulan) ----------
  function kartuBesar(p, i) {
    const art = el('article', 'kartu reveal' + (i % 2 ? ' kartu-balik' : ''));
    const g = el('div', 'kartu-gambar');
    if (p.gambar) g.append(gambar(p.gambar));
    else g.append(sampul(p.judul));
    if (p.gambarKedua) g.append(gambar(p.gambarKedua, 'gambar-kedua'));
    const isi = el('div', 'kartu-isi');
    isi.append(
      el('p', 'kartu-no mono', `${nomor(i)} — ${p.kategori}`),
      el('h3', '', p.judul),
      el('p', '', p.deskripsi || p.ringkas),
      daftarTag(p.tag),
    );
    const tombol = el('div', 'tombol');
    if (p.demo) tombol.append(tautan('btn', 'Coba langsung', p.demo, `Coba langsung ${p.judul}`));
    if (p.kode) tombol.append(tautan('btn btn-garis', 'Lihat kode', p.kode, `Lihat kode ${p.judul}`));
    isi.append(tombol);
    art.append(g, isi);
    return art;
  }

  // ---------- kartu kecil (grid) ----------
  function kartuKecil(p) {
    const li = el('li', 'mini');
    const g = el('div', 'mini-gambar');
    if (p.gambar) g.append(gambar(p.gambar)); else g.append(sampul(p.judul));
    const isi = el('div', 'mini-isi');
    isi.append(el('p', 'kartu-no mono', p.kategori), el('h3', '', p.judul), el('p', 'mini-ringkas', p.ringkas || p.deskripsi || ''), daftarTag(p.tag));
    const link = el('div', 'mini-link');
    if (p.demo) link.append(tautan('mini-a', 'Coba', p.demo, `Coba ${p.judul}`));
    if (p.kode) link.append(tautan('mini-a', 'Kode', p.kode, `Lihat kode ${p.judul}`));
    isi.append(link);
    li.append(g, isi);
    return li;
  }

  // ---------- susun seluruh bagian project ----------
  function tampilkan() {
    const semua = (window.PROJECTS || []).filter(p => p && p.judul);
    const unggulan = semua.filter(p => p.unggulan).slice(0, MAKS_UNGGULAN);
    const lainnya = semua.filter(p => !unggulan.includes(p));

    // angka "project sudah online" di bagian Tentang
    const angka = document.getElementById('jumlah-project');
    if (angka) angka.dataset.hitung = String(semua.length);

    const wadahUnggulan = document.getElementById('project-unggulan');
    wadahUnggulan.replaceChildren(...unggulan.map(kartuBesar));
    wadahUnggulan.querySelectorAll('.reveal').forEach(amati);
    document.getElementById('label-unggulan').hidden = !lainnya.length;

    const bagianSemua = document.getElementById('project-semua');
    bagianSemua.hidden = !lainnya.length;
    if (!lainnya.length) return;
    document.getElementById('mode-contoh').hidden = !modeContoh;

    // filter & pencarian
    const kategori = ['Semua', ...new Set(lainnya.map(p => p.kategori).filter(Boolean))];
    const keadaan = { kategori: 'Semua', cari: '', semua: false };
    const wadahChip = document.getElementById('saring-kategori');
    const inputCari = document.getElementById('cari-project');
    const grid = document.getElementById('grid-project');
    const info = document.getElementById('info-project');
    const tombolLagi = document.getElementById('tombol-lagi');
    const kosong = document.getElementById('project-kosong');

    wadahChip.replaceChildren(...kategori.map(k => {
      const b = el('button', 'chip', k);
      b.type = 'button';
      b.dataset.kategori = k;
      return b;
    }));

    function perbarui() {
      const q = keadaan.cari.trim().toLowerCase();
      const cocok = lainnya.filter(p =>
        (keadaan.kategori === 'Semua' || p.kategori === keadaan.kategori) &&
        (!q || [p.judul, p.ringkas, p.deskripsi, p.kategori, ...(p.tag || [])].join(' ').toLowerCase().includes(q)));
      const terlihat = keadaan.semua || q ? cocok : cocok.slice(0, AWAL_TAMPIL);
      grid.replaceChildren(...terlihat.map(kartuKecil));
      wadahChip.querySelectorAll('.chip').forEach(b => {
        const on = b.dataset.kategori === keadaan.kategori;
        b.classList.toggle('on', on);
        b.setAttribute('aria-pressed', on);
      });
      kosong.hidden = cocok.length > 0;
      info.textContent = cocok.length ? `Menampilkan ${terlihat.length} dari ${cocok.length} project` : '';
      const sisa = cocok.length - terlihat.length;
      tombolLagi.hidden = !(sisa > 0 || (keadaan.semua && cocok.length > AWAL_TAMPIL && !q));
      tombolLagi.textContent = sisa > 0 ? `Tampilkan semua (${cocok.length})` : 'Tampilkan lebih sedikit';
    }

    wadahChip.addEventListener('click', e => {
      const b = e.target.closest('[data-kategori]');
      if (!b) return;
      keadaan.kategori = b.dataset.kategori;
      keadaan.semua = false;
      perbarui();
    });
    inputCari.addEventListener('input', () => { keadaan.cari = inputCari.value; perbarui(); });
    tombolLagi.addEventListener('click', () => {
      const tadiSemua = keadaan.semua;
      keadaan.semua = !keadaan.semua;
      perbarui();
      if (tadiSemua) bagianSemua.scrollIntoView({ block: 'start' }); // saat diciutkan, kembali ke atas grid
    });
    perbarui();
  }

  // Mode contoh: hanya di laptop sendiri, dengan alamat ...?contoh
  const modeContoh = /^(localhost|127\.0\.0\.1)$/.test(location.hostname) && new URLSearchParams(location.search).has('contoh');
  if (modeContoh) {
    const s = document.createElement('script');
    s.src = 'projects-contoh.js';
    s.onload = tampilkan;
    s.onerror = tampilkan;
    document.body.append(s);
  } else {
    tampilkan();
  }
})();
