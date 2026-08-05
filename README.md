# Zahra's Special Day - Romantic Premium Website

Website ulang tahun romantis premium dengan desain gaya Apple dan Pinterest, dioptimasi penuh untuk perangkat mobile (Android) dengan sentuhan *glassmorphism*, animasi 60FPS yang mulus, dan fitur interaktif.

## Fitur
1. **PIN Protection Screen**: Menggunakan kode `090812` dengan animasi keypad realistis.
2. **Apple-style UI/UX**: Glassmorphism, shadow lembut, border radius konsisten, blur overlay.
3. **Responsive Mobile-First**: Sempurna ditampilkan di layar 9:16.
4. **Music Player**: Floating player (Play/Pause, Mute, Progress).
5. **Realtime Clocks**: WIB, WITA, WIT selalu ter-update setiap detik.
6. **3D CSS Cake**: Animasi 3D murni menggunakan CSS, ringan dan aesthetic.
7. **Canvas Fireworks & Particle Decor**: Floating SVG tanpa menggunakan emoji.
8. **Make A Wish**: Animasi interaktif merubah teks doa menjadi bintang yang terbang ke langit.
9. **Secret Box Finale**: Animasi garis SVG membentuk hati (LOVE), membuka Secret Box menuju WhatsApp.
10. **PWA Ready**: Mendukung manifest dan bisa diakses offline (Service Worker).

## Struktur Folder
```text
birthday-website/
│
├── index.html       (Struktur utama, Semantic HTML)
├── style.css        (Semua desain, animasi, Apple/Pinterest style)
├── script.js        (Logika SPA, musik, PIN, jam, efek interaktif)
├── README.md        (Panduan lengkap)
├── manifest.json    (Opsional: File konfigurasi PWA jika ingin diinstall)
├── sw.js            (Opsional: Service Worker untuk offline support)
│
└── assets/
    │
    ├── images/
    │   ├── photo1.jpg   (Rasio 9:16 disarankan)
    │   ├── photo2.jpg
    │   ├── photo3.jpg
    │   ├── photo4.jpg
    │   └── hadiah.jpg   (Rasio 16:9 disarankan)
    │
    ├── videos/
    │   ├── video1.mp4   (Rasio 9:16, no sound)
    │   ├── video2.mp4
    │   ├── video3.mp4
    │   └── video4.mp4
    │
    └── audio/
        └── song.mp3     ("Merry Christmas, I Miss You")
