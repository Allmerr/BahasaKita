# Favicon dan PWA BahasaKita

## Menggunakan dan memasang

PWA aktif pada **hasil build produksi**. Jalankan `npm run build`, lalu `npm run preview` untuk memeriksanya di localhost. Worker sengaja tidak didaftarkan pada `npm run dev` agar tidak mengganggu HMR.

Pada situs HTTPS, buka **Pengaturan → BahasaKita di perangkatmu → Pasang BahasaKita** ketika browser menawarkan instalasi. Chrome/Edge juga dapat menyediakan pilihan instalasi pada menu browser. Di iPhone/iPad, gunakan **Safari → Bagikan → Tambahkan ke Layar Utama**. Ketersediaan tombol mengikuti kebijakan browser; aplikasi tidak membuka prompt otomatis. Instalasi biasanya tidak tersedia di mode incognito/private.

Manifest memakai nama **BahasaKita Learn**, identitas `/`, cakupan `/`, halaman awal `/`, dan tampilan `standalone`. Ikon berasal dari simbol pada logo asli, dengan versi 192 px, 512 px, maskable 512 px, Apple 180 px, serta favicon ICO/PNG. Warna brand tetap dipertahankan. Jika logo sumber berubah, jalankan `npm run icons:generate` (memakai Playwright/Chrome yang sudah digunakan tes proyek).

## Batas offline dan pembaruan

- Setelah kunjungan online pertama dan worker selesai aktif, navigasi yang gagal karena jaringan membuka halaman bantuan koneksi. Halaman ini juga bekerja pada URL dalam seperti `/lesson/...`.
- Service worker hanya menyimpan delapan aset publik yang tercantum dalam `scripts/pwa-plugin.mjs`: halaman offline, manifest, favicon, dan ikon. Tidak ada cache runtime atau antrean sinkronisasi jawaban/pesan.
- HTML aplikasi, respons API, autentikasi, foto privat, video, chat, profil, jawaban, dan progres **tidak disimpan oleh service worker**. Permintaan API/auth tetap gagal sebagai kegagalan jaringan saat offline, bukan diganti HTML atau data lama. Permintaan dengan header Authorization juga selalu melewati cache worker.
- Asesmen, pembelajaran/video, chat, dan penyimpanan data tetap memerlukan internet dan integrasi backend yang sudah ada. Perubahan yang belum berhasil dikirim belum tersimpan. Instalasi PWA tidak menambahkan belajar luring atau mengubah penilaian/adaptive learning.
- Build membuat versi worker dari konten aplikasi/aset. Versi baru menunggu tab lama ditutup, atau dapat diterapkan melalui **Pengaturan → Perbarui dan muat ulang**. Selesaikan/simpan aktivitas sebelum menekan tombol. Tab lain tidak dimuat ulang otomatis. Cache publik versi lama dibersihkan saat aktivasi.

## Hosting

Sajikan isi `dist/` pada root origin HTTPS yang sama dengan rute `/api` yang sudah ada. Localhost/127.0.0.1 dapat dipakai untuk pengujian tanpa HTTPS. Pratinjau frontend saja tidak menggantikan routing backend produksi.

Pastikan hosting:

- Mengirim `/sw.js` sebagai JavaScript, `/manifest.webmanifest` sebagai `application/manifest+json`, serta ikon sebagai gambar; file ini harus tersedia langsung, bukan respons fallback SPA.
- Memakai `Cache-Control: no-cache` untuk `/sw.js`, `/index.html` dan manifest agar rilis baru dapat ditemukan. Jangan menambahkan aturan CDN yang menyimpan respons API privat.
- Mengarahkan navigasi halaman aplikasi ke `index.html`, tetapi meneruskan `/api` ke backend; `/api` yang gagal tidak boleh mendapat fallback SPA.

Rujukan platform: [instalasi PWA](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Making_PWAs_installable) dan [siklus service worker](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers).

## Verifikasi

`npm run test:pwa` membangun aplikasi ke direktori sementara dan menguji hasil produksi memakai profil Chromium biasa (bukan incognito), server lokal, dan layanan eksternal yang diblokir/mock. Tidak menggunakan akun atau Supabase asli. Chrome lokal dipakai jika tersedia; selain itu jalankan `npx playwright install chromium`. `CHROME_PATH` dapat menentukan executable.

Pemeriksaan meliputi manifest dan kelayakan instalasi melalui Chrome DevTools Protocol, decoding/ukuran ikon, isi cache publik, kegagalan API/auth saat offline, permintaan Authorization, halaman offline pada rute dalam, pemulihan online, pembaruan tanpa memaksa reload tab lain, pembersihan cache lama, lebar 320–1440 px, dan focus keyboard. `tests/unit/pwa.test.jsx` memeriksa prompt instalasi, pembatalan, status koneksi, pendaftaran gagal, dan keputusan pembaruan. `npm run test:all` menyertakan pemeriksaan PWA pada build produksinya.

Tes ini tidak memasang aplikasi ke sistem operasi, menguji Safari/iOS secara langsung, atau membuktikan konfigurasi HTTPS/cache hosting publik. Periksa instalasi dan pembukaan dari layar utama pada perangkat sasaran setelah deploy.

## Berkas implementasi

| Berkas | Tujuan |
| --- | --- |
| `index.html`, `public/favicon*`, `public/apple-touch-icon.png`, `public/icons/*` | Favicon, ikon aplikasi, metadata Apple, dan tautan manifest |
| `public/manifest.webmanifest` | Nama, identitas, warna, ikon, serta mode aplikasi |
| `public/offline.html` | Halaman bantuan yang tidak bergantung pada API/JavaScript aplikasi |
| `pwa/service-worker.js`, `scripts/pwa-plugin.mjs`, `vite.config.js` | Worker produksi, daftar cache publik yang terbatas, dan versi per build |
| `src/Pwa.jsx`, `src/pwa.css`, `src/main.jsx`, `src/LearningApp.jsx`, `src/components/Icon.jsx` | Pendaftaran, pemberitahuan offline, instalasi/pembaruan, serta kartu Pengaturan |
| `scripts/generate-app-icons.mjs` | Pembuatan ikon secara konsisten dari logo asli |
| `scripts/check-pwa.mjs`, `tests/unit/pwa.test.jsx`, `scripts/run-tests.mjs`, `package.json` | Verifikasi PWA dan integrasi runner tanpa dependency tambahan |
