'use strict';
/* =========================================================
   LXNDR — bola partikel di pembuka
   Ribuan titik di permukaan bola yang "bernapas" pelan dengan
   gelombang, berputar sendiri, dan ikut berputar saat di-scroll.
   Tidak mengikuti kursor.
   ========================================================= */
(function () {
  const kanvas = document.getElementById('orb');
  if (!kanvas || typeof THREE === 'undefined') return; // library gagal dimuat: halaman tetap jalan tanpa bola

  const kurangiGerak = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hero = kanvas.parentElement;

  const renderer = new THREE.WebGLRenderer({ canvas: kanvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  const scene = new THREE.Scene();
  const kamera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
  kamera.position.z = 6.2;

  // Titik-titik tersebar rata di permukaan bola (spiral Fibonacci)
  const jumlah = window.innerWidth < 700 ? 5000 : 9000;
  const posisi = new Float32Array(jumlah * 3);
  const acak = new Float32Array(jumlah);
  const emas = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < jumlah; i++) {
    const y = 1 - (i / (jumlah - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const t = emas * i;
    posisi[i * 3] = Math.cos(t) * r;
    posisi[i * 3 + 1] = y;
    posisi[i * 3 + 2] = Math.sin(t) * r;
    acak[i] = Math.random();
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(posisi, 3));
  geo.setAttribute('aAcak', new THREE.BufferAttribute(acak, 1));

  const bahan = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.NormalBlending,
    uniforms: {
      uWaktu: { value: 0 },
      uSkala: { value: 1.55 },
      uUkuran: { value: 2.6 * renderer.getPixelRatio() },
      uWarnaA: { value: new THREE.Color('#9a7642') },
      uWarnaB: { value: new THREE.Color('#121a2b') },
    },
    vertexShader: `
      uniform float uWaktu, uSkala, uUkuran;
      attribute float aAcak;
      varying float vTerang;
      void main() {
        vec3 p = position;
        // gelombang pelan di permukaan bola
        float g = sin(p.x * 3.1 + uWaktu * .9) * sin(p.y * 2.7 + uWaktu * .7) * sin(p.z * 3.3 + uWaktu * .8);
        float denyut = 1.0 + g * .16 + sin(uWaktu * .6 + aAcak * 6.28) * .015;
        p *= uSkala * denyut;
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        gl_Position = projectionMatrix * mv;
        gl_PointSize = uUkuran * (0.55 + aAcak * .8) * (6.0 / -mv.z);
        vTerang = clamp(g * 1.6 + .55, 0.0, 1.0);
      }`,
    fragmentShader: `
      uniform vec3 uWarnaA, uWarnaB;
      varying float vTerang;
      void main() {
        float d = length(gl_PointCoord - .5);
        if (d > .5) discard;
        float a = smoothstep(.5, .0, d);
        gl_FragColor = vec4(mix(uWarnaA, uWarnaB, vTerang * .35), a * (.28 + vTerang * .5));
      }`,
  });
  const bola = new THREE.Points(geo, bahan);
  scene.add(bola);

  function ukur() {
    const w = hero.clientWidth, h = hero.clientHeight;
    renderer.setSize(w, h, false);
    kamera.aspect = w / h;
    // di layar sempit, bola diperkecil supaya tetap muat
    bahan.uniforms.uSkala.value = w < 700 ? 1.15 : 1.55;
    kamera.updateProjectionMatrix();
  }
  ukur();
  window.addEventListener('resize', ukur);

  // Hanya menggambar saat pembuka terlihat (hemat baterai)
  let terlihat = true;
  new IntersectionObserver(([e]) => { terlihat = e.isIntersecting; }, { threshold: 0 }).observe(hero);

  const jam = new THREE.Clock();
  function gambar() {
    requestAnimationFrame(gambar);
    if (!terlihat) return;
    const t = jam.getElapsedTime();
    const scroll = Math.min(1, window.scrollY / window.innerHeight);
    bahan.uniforms.uWaktu.value = t;
    bola.rotation.y = t * 0.12 + scroll * 1.6;
    bola.rotation.x = 0.35 + scroll * 0.6;
    bola.position.y = scroll * 0.8;
    renderer.render(scene, kamera);
  }

  if (kurangiGerak) {
    bahan.uniforms.uWaktu.value = 2;
    bola.rotation.set(0.35, 0.6, 0);
    renderer.render(scene, kamera);
  } else {
    gambar();
  }
})();
