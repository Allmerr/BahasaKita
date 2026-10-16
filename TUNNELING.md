# Tunneling BahasaKita untuk demo

Panduan ini untuk membagikan aplikasi yang berjalan di komputer lokal melalui URL HTTPS sementara. Tunnel bukan hosting produksi: komputer, server lokal, dan koneksi internet harus tetap aktif selama demo.

## Cara kerja

Jalankan API pada `127.0.0.1:3001` dan frontend hasil build pada `127.0.0.1:4173`. Vite Preview meneruskan permintaan `/api` ke API lokal. Karena itu, tunnel hanya perlu mengarah ke port `4173`; jangan membuka port API `3001` secara langsung. Gunakan Preview untuk mencoba pemasangan PWA di HP: service worker memang tidak aktif pada server development Vite di port `5173`.

```text
Browser peserta → URL HTTPS tunnel → Vite Preview :4173 → API :3001
                                       └────→ Supabase
```

## Persiapan

1. Pasang dependensi proyek: `npm install` dan `npm --prefix server install`.
2. Isi `VITE_SUPABASE_URL` dan `VITE_SUPABASE_PUBLISHABLE_KEY` pada `.env` di folder utama.
3. Isi `SUPABASE_URL` dan `SUPABASE_PUBLISHABLE_KEY` pada `server/.env`. Keduanya harus menunjuk ke proyek Supabase yang sama.
4. Pastikan skema dan konfigurasi Supabase telah disiapkan mengikuti [SETUP-SUPABASE.md](SETUP-SUPABASE.md).
5. Pasang dan autentikasi klien tunnel, misalnya [ngrok](https://ngrok.com/download). Perintah tunnel di bawah menganggap `ngrok` sudah tersedia di terminal.

Gunakan publishable/anon key untuk frontend dan API. Jangan masukkan `SUPABASE_SERVICE_ROLE_KEY` ke frontend atau membagikan isi berkas `.env`.

## Menjalankan tunnel dengan ngrok

Buka tiga terminal dari folder proyek.

**Terminal 1 — API:**

```powershell
npm run dev:api
```

API mendengarkan hanya pada loopback (`127.0.0.1`), sesuai kebutuhan proxy lokal.

**Terminal 2 — build dan frontend produksi:**

```powershell
npm run build
npm run preview -- --host 0.0.0.0
```

Preview memakai port `4173` dan sudah meneruskan `/api` ke backend lokal.

**Terminal 3 — tunnel:**

```powershell
ngrok http --host-header=rewrite 4173
```

Opsi `--host-header=rewrite` membuat Vite menerima permintaan dengan host lokal. Gunakan URL `https://...` yang ditampilkan ngrok untuk membagikan demo. Biarkan ketiga terminal tetap berjalan.

## Mengizinkan URL pada Supabase Auth

Autentikasi email mengarahkan kembali ke origin browser saat ini. Untuk setiap URL tunnel baru, buka **Supabase Dashboard → Authentication → URL Configuration**, lalu tambahkan URL publik persisnya ke **Redirect URLs** (misalnya `https://nama-random.ngrok-free.app/**`). Untuk pengujian, set **Site URL** ke URL tunnel yang sedang dipakai bila alur konfirmasi email kembali ke URL yang salah. Kembalikan Site URL ke alamat aplikasi tetap setelah demo. URL tunnel acak biasanya berubah setiap kali tunnel dimulai.

## Pemeriksaan cepat

- Buka `https://<domain-tunnel>/api/health`. Respons yang diharapkan: `{"status":"ok"}`.
- Buka halaman utama melalui URL HTTPS tunnel di Chrome Android. Jika ngrok menampilkan peringatan, ketuk **Visit Site**, lalu muat ulang halaman satu kali agar manifest dan ikon PWA terbaca. Gunakan menu Chrome → **Instal aplikasi** atau **Tambahkan ke layar utama**. Di iPhone/iPad, buka dengan Safari lalu pilih **Bagikan → Tambahkan ke Layar Utama**.
- Pastikan `https://<domain-tunnel>/sw.js` menampilkan JavaScript service worker dan `https://<domain-tunnel>/manifest.webmanifest` menampilkan manifest. Jika baru mengubah kode, jalankan kembali `npm run build` lalu mulai ulang Preview.
- Jika sebelumnya situs dibuka lewat Vite dev (`5173`), pindah ke Preview (`4173`) dan muat ulang. Hapus pemasangan lama dari layar utama bila perlu agar browser mengambil metadata aplikasi yang baru.
- Jika pilihan instalasi tetap tidak muncul, buka URL tunnel langsung di Chrome (bukan browser di dalam WhatsApp/Instagram), lalu muat ulang. Pastikan menu Chrome bukan mode Samaran.
- Jika login kembali ke alamat yang salah, periksa **Redirect URLs** dan **Site URL** di Supabase.
- Jika halaman gagal dimuat, pastikan API dan Vite masih berjalan, lalu periksa keluaran ketiga terminal.
- Video eksternal, Supabase, dan fitur yang memerlukan internet tetap perlu koneksi internet.

## Menghentikan demo

Tekan `Ctrl+C` pada terminal ngrok, Vite, dan API. URL publik tidak lagi aktif setelah tunnel dihentikan. Hapus URL sementara dari daftar **Redirect URLs** Supabase jika sudah tidak dibutuhkan.

## Catatan keamanan

- Bagikan URL hanya kepada peserta demo yang dituju; siapa pun yang memiliki URL dapat membuka aplikasi selama tunnel aktif.
- Jangan gunakan akun atau data produksi yang tidak boleh terlihat peserta demo.
- Jangan menonaktifkan autentikasi atau aturan akses Supabase untuk membuat demo lebih mudah.
- Jangan menjalankan backend development dengan service-role key kecuali fitur server yang memerlukannya memang sedang diuji. Simpan key itu hanya di `server/.env` dan jangan pernah membagikannya.
- Tunnel lokal cocok untuk demo singkat. Untuk penggunaan publik, deploy frontend dan API ke hosting HTTPS dengan konfigurasi produksi.
