# SIMAS – Sistem Informasi Manajemen Aset
### PLN Icon Plus

Aplikasi web untuk mengelola aset infrastruktur telekomunikasi & IT secara digital.

---

## ✨ Fitur
- **Dashboard** – statistik aset + pie chart distribusi status
- **Manajemen Aset** – tambah, edit, hapus, filter aset
- **Kategori & Lokasi** – data master untuk klasifikasi aset
- **Riwayat Otomatis** – log perubahan tercatat otomatis via database trigger

---

## 🛠️ LANGKAH SETUP (Baca dengan teliti!)

### BAGIAN 1: Setup Database di Supabase

**1. Buat akun Supabase**
- Buka https://supabase.com dan klik "Start your project"
- Daftar menggunakan akun GitHub atau email
- Klik "New Project" → isi nama proyek (contoh: `simas-pln`)
- Pilih region terdekat: **Southeast Asia (Singapore)**
- Buat password database (simpan baik-baik!)
- Klik "Create new project" dan tunggu ~2 menit

**2. Jalankan Schema Database**
- Di dashboard Supabase, klik menu **SQL Editor** (ikon di sidebar kiri)
- Klik tombol **"New query"**
- Buka file `database/schema.sql` dari folder proyek ini
- Copy SEMUA isinya, paste ke SQL Editor
- Klik tombol **"Run"** (atau tekan Ctrl+Enter)
- Jika muncul tulisan "Success", database sudah siap! ✅

**3. Ambil Kunci API Supabase**
- Di dashboard Supabase, klik **Settings** (ikon roda gigi)
- Klik **API** di menu settings
- Catat dua nilai ini:
  - **Project URL** → contoh: `https://abcdefgh.supabase.co`
  - **anon public** key → string panjang dimulai dengan `eyJ...`

---

### BAGIAN 2: Setup Proyek di Komputer Lokal

**Syarat:** Pastikan sudah install **Node.js** (download di https://nodejs.org, pilih versi LTS)

**1. Ekstrak file ZIP ini**
```
Ekstrak ke folder pilihan kamu, misalnya: C:\Projects\simas-pln
```

**2. Buka Terminal/Command Prompt**
- Windows: Tekan `Win + R`, ketik `cmd`, Enter
- Mac: Buka aplikasi Terminal

**3. Masuk ke folder proyek**
```bash
cd C:\Projects\simas-pln
```
(Sesuaikan dengan lokasi folder kamu)

**4. Buat file konfigurasi environment**
- Di folder proyek, buat file baru bernama `.env.local` (bukan `.env.local.example`)
- Isi dengan:
```
NEXT_PUBLIC_SUPABASE_URL=https://ID_PROYEKMU.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=KUNCI_ANON_KAMU_DISINI
```
- Ganti dengan nilai yang kamu catat dari Supabase tadi

**5. Install dependencies**
```bash
npm install
```
(Ini akan download semua library yang dibutuhkan, ~2-5 menit)

**6. Jalankan aplikasi**
```bash
npm run dev
```

**7. Buka di browser**
- Buka: http://localhost:3000
- Aplikasi SIMAS sudah berjalan! 🎉

---

### BAGIAN 3: Deployment ke Internet (Vercel)

Agar aplikasi bisa diakses orang lain, deploy ke Vercel (gratis):

**1. Upload kode ke GitHub**
- Buat akun di https://github.com
- Buat repository baru (klik + → New repository)
- Nama: `simas-pln`, pilih Private, klik Create
- Di terminal, jalankan:
```bash
git init
git add .
git commit -m "Initial commit SIMAS PLN Icon Plus"
git remote add origin https://github.com/USERNAME/simas-pln.git
git push -u origin main
```
(Ganti USERNAME dengan username GitHub kamu)

**2. Deploy di Vercel**
- Buka https://vercel.com dan daftar dengan akun GitHub
- Klik **"New Project"**
- Pilih repository `simas-pln` dari daftar
- Klik **"Import"**

**3. Tambahkan Environment Variables di Vercel**
- Sebelum deploy, klik **"Environment Variables"**
- Tambahkan:
  - `NEXT_PUBLIC_SUPABASE_URL` = URL Supabase kamu
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = Anon key Supabase kamu
- Klik **"Deploy"**
- Tunggu 1-2 menit...
- Vercel akan memberi URL seperti: `https://simas-pln.vercel.app` ✅

---

## 🔧 Troubleshooting

**Error: "supabaseUrl is required"**
→ File `.env.local` belum dibuat atau isinya salah

**Error: "relation does not exist"**  
→ Schema SQL belum dijalankan di Supabase

**Data tidak muncul di tabel**
→ Pastikan RLS (Row Level Security) di Supabase sudah dinonaktifkan atau konfigurasi policy-nya

---

## 📁 Struktur Proyek

```
simas-pln/
├── app/
│   ├── page.tsx          ← Halaman Dashboard
│   ├── assets/           ← Halaman Manajemen Aset
│   ├── categories/       ← Halaman Kategori
│   ├── locations/        ← Halaman Lokasi
│   └── history/          ← Halaman Riwayat
├── components/           ← Komponen yang dipakai ulang
├── lib/supabase.ts       ← Koneksi & fungsi database
├── database/schema.sql   ← Skema database (jalankan di Supabase)
└── .env.local.example    ← Contoh konfigurasi environment
```
