'use strict';
/* =========================================================
   DAFTAR PROJECT
   Untuk menambah project baru, cukup salin satu blok { ... }
   di bawah, tempel di paling atas daftar, lalu ganti isinya.

   judul      : nama project
   kategori   : dipakai untuk tombol filter, misalnya "Web App", "Game", "Data"
   ringkas    : satu kalimat pendek untuk kartu kecil
   deskripsi  : penjelasan lebih panjang untuk kartu besar (project unggulan)
   tag        : teknologi yang dipakai
   gambar     : screenshot di folder assets/ (boleh dikosongkan: null)
   gambarKedua: screenshot kedua yang muncul saat kartu disorot (boleh dihapus)
   demo       : link untuk mencoba
   kode       : link GitHub
   unggulan   : true = tampil besar di atas (maksimal 3 project)
   ========================================================= */
window.PROJECTS = [
  {
    judul: 'Catatan Uang',
    kategori: 'Web App',
    ringkas: 'Catat pengeluaran, tabungan, dana dingin, dan emas.',
    deskripsi: 'Aplikasi untuk mencatat pengeluaran bulanan, tabungan reksa dana, dana dingin, dan emas. Harga emasnya diperbarui otomatis setiap 3 jam, dengan latar animasi partikel 3D.',
    tag: ['JavaScript', 'Three.js', 'localStorage', 'API publik'],
    gambar: { src: 'assets/1-catatan-uang.webp', alt: 'Tampilan aplikasi Catatan Uang: sisa uang bulan ini, daftar pengeluaran, dan cincin partikel di latar' },
    gambarKedua: { src: 'assets/2-dana-dingin.webp', alt: 'Tab Dana dingin di Catatan Uang dengan target dan progress bar' },
    demo: 'https://llxndrrr.github.io/catatan-uang/',
    kode: 'https://github.com/llxndrrr/catatan-uang',
    unggulan: true,
  },
  {
    judul: 'Tugasku',
    kategori: 'Web App',
    ringkas: 'Atur tugas, ulangan, dan jadwal belajar mingguan.',
    deskripsi: 'Pengatur tugas, ulangan, dan jadwal belajar mingguan. Langsung menampilkan sesi yang sedang berjalan, tugas yang mepet deadline, dan hitung mundur menuju ulangan.',
    tag: ['JavaScript', 'SVG', 'localStorage', 'Responsif'],
    gambar: { src: 'assets/3-tugasku.webp', alt: 'Tampilan aplikasi Tugasku: sesi yang sedang berjalan, jadwal hari ini, dan daftar tugas dengan deadline' },
    demo: 'https://llxndrrr.github.io/jadwal-tugas/',
    kode: 'https://github.com/llxndrrr/jadwal-tugas',
    unggulan: true,
  },
];
