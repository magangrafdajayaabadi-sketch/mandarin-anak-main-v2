# Panduan Deploy ke Vercel

Panduan lengkap menaikkan Arena Mandarin ke internet, dari nol sampai bisa
dibuka orang lain. Gratis — paket Hobby Vercel cukup.

Project ini **situs statis tanpa build**, jadi prosesnya ringan: Vercel tinggal
menyajikan isi folder `public/`.

---

## Sebelum mulai

Yang perlu disiapkan:

| Butuh | Keterangan |
|---|---|
| Akun [vercel.com](https://vercel.com) | Gratis. Daftar pakai GitHub biar gampang. |
| Git terpasang | Cek: `git --version`. Belum ada → [git-scm.com](https://git-scm.com) |
| Akun GitHub | Hanya untuk **Cara A** (disarankan). |
| Node.js | Hanya kalau mau tes lokal / pakai CLI. |

> **Catatan:** folder ini **belum jadi repo Git**. Langkah 1 di Cara A mengurus itu
> — jangan dilewat.

### Tes dulu di komputer (opsional tapi disarankan)

```bash
npm run dev
```

Buka http://localhost:3000. Kalau di sini normal, di Vercel juga normal.

---

## Cara A — Lewat GitHub (disarankan)

Kelebihannya: sekali sambung, setiap kali Anda `git push`, Vercel **deploy ulang
otomatis**.

### 1. Jadikan folder ini repo Git

Buka terminal di folder `d:\mandarin-anak`, lalu:

```bash
git init
git add .
git commit -m "Arena Mandarin: 18 mini-game + panel admin"
```

> File `.gitignore` sudah ada, jadi `node_modules/` tidak ikut ter-commit.

### 2. Buat repo kosong di GitHub

Buka [github.com/new](https://github.com/new):

- **Repository name**: `arena-mandarin` (bebas)
- Pilih **Private** kalau tidak ingin dilihat umum
- **JANGAN** centang "Add a README" / "Add .gitignore" — biar tidak bentrok
- Klik **Create repository**

### 3. Hubungkan & kirim

Salin perintah dari GitHub, atau pakai ini (ganti `USERNAME` dan nama repo):

```bash
git remote add origin https://github.com/USERNAME/arena-mandarin.git
git branch -M main
git push -u origin main
```

### 4. Import ke Vercel

1. Buka [vercel.com/new](https://vercel.com/new)
2. Klik **Import** di sebelah repo `arena-mandarin`
   (kalau repo tidak muncul → **Adjust GitHub App Permissions**, beri akses)
3. Di halaman konfigurasi: **biarkan semua apa adanya**
   - Framework Preset: `Other` ← biarkan
   - Build Command: kosong ← biarkan
   - Output Directory: kosong ← biarkan
4. Klik **Deploy**

**Kenapa dibiarkan kosong?** Karena [`vercel.json`](vercel.json) sudah mengatur
`outputDirectory: "public"`. Mengisinya manual malah bisa bentrok.

Tunggu ±30 detik → muncul layar confetti dan URL seperti
`https://arena-mandarin.vercel.app`. **Selesai.**

### 5. Update ke depannya

Cukup:

```bash
git add .
git commit -m "perbarui materi"
git push
```

Vercel deploy ulang otomatis.

---

## Cara B — Lewat Vercel CLI (tanpa GitHub)

Cocok kalau tidak mau pakai GitHub. Kekurangannya: tidak ada deploy otomatis,
harus jalankan perintah tiap kali update.

```bash
npm i -g vercel     # pasang sekali saja
vercel login        # ikuti instruksi di browser
```

Lalu di folder `d:\mandarin-anak`:

```bash
vercel              # deploy pratinjau (URL sementara)
vercel --prod       # deploy produksi (URL utama)
```

Saat pertama kali `vercel` akan bertanya beberapa hal — **tekan Enter saja**
untuk semua (jawaban default sudah benar):

```
? Set up and deploy? yes
? Which scope? (akun Anda)
? Link to existing project? no
? What's your project's name? arena-mandarin
? In which directory is your code located? ./
```

---

## Sesudah deploy

### Cek hasilnya

Buka URL Anda dan pastikan:

| Cek | Harusnya |
|---|---|
| `https://xxx.vercel.app` | Layar "Halo, teman kecil!" + pilihan avatar |
| Warna & tata letak | Rapi (kalau polos tanpa warna → lihat Masalah Umum) |
| `https://xxx.vercel.app/admin` | Layar PIN admin |
| Coba main 1 game | Soal muncul, bintang bertambah |

### Ganti PIN admin

**Lakukan ini sebelum dibagikan.** PIN bawaan `1234` diketahui umum.

Buka `/admin` → PIN `1234` → bagian **Data & keamanan** → ubah **PIN admin**.

> ⚠️ Ingat: PIN ini **bukan keamanan sungguhan** — situs statis tanpa server,
> jadi PIN bisa dilihat siapa pun lewat *view-source*. Anggap ini pengaman agar
> anak tidak asal mengubah setelan. Detail: lihat [README](README.md#dua-peran-pemain--admin).

### Pakai domain sendiri (opsional)

Vercel → pilih project → **Settings → Domains → Add** → masukkan domain Anda,
lalu ikuti instruksi DNS yang ditampilkan.

---

## Menerapkan whitelabel ke semua pengunjung

Ini bagian yang paling sering membingungkan, jadi baca pelan-pelan.

Perubahan di panel `/admin` **hanya tersimpan di perangkat Anda** (localStorage).
Pengunjung lain tetap melihat tampilan bawaan. Untuk berlaku global:

1. Buka `/admin`, atur nama, logo, warna sesuai keinginan
2. Bagian **Data & keamanan** → klik **⬇ Ekspor config.json**
3. Timpa file `public/config.json` di project dengan file hasil unduhan
4. Deploy ulang:
   ```bash
   git add public/config.json
   git commit -m "perbarui branding"
   git push
   ```

Sekarang semua pengunjung melihat merek baru Anda.

---

## Masalah umum

### Halaman tampil polos, tanpa warna, judul besar hitam-putih

Anda membuka **file-nya langsung** (`file:///D:/...`), bukan lewat server. Bisa
juga terjadi kalau `outputDirectory` diisi salah di dashboard.

- **Solusi:** buka lewat URL Vercel, atau `npm run dev` untuk lokal.
- Kalau di Vercel juga begini: Settings → General → **Output Directory** →
  kosongkan (biarkan `vercel.json` yang mengatur) → Redeploy.

### `/admin` jadi 404

Pastikan `"cleanUrls": true` masih ada di `vercel.json`. Alternatif: buka
`/admin.html`.

### Sudah deploy, tapi perubahan tidak muncul

Ini **service worker** menyajikan versi lama dari cache (memang sengaja, supaya
bisa offline).

- **Cepat:** tekan `Ctrl+Shift+R` (hard refresh).
- **Untuk semua pengguna:** naikkan versi cache di [`public/sw.js`](public/sw.js):
  ```js
  const CACHE = "mandarin-v6";   // dari v5 → v6
  ```
  Lakukan ini **setiap kali** isi `public/assets/` berubah.

> Khusus `config.json` tidak kena masalah ini — sudah diatur *network-first*,
> jadi perubahan branding langsung tersebar.

### Deploy gagal / "No Output Directory named public found"

Pastikan folder `public/` benar-benar ikut ter-commit:

```bash
git ls-files public | head
```

Kalau kosong, berarti tidak ter-commit → `git add public && git commit && git push`.

### Repo tidak muncul di daftar import Vercel

Di [vercel.com/new](https://vercel.com/new) → **Adjust GitHub App Permissions** →
beri akses ke repo tersebut.

---

## Yang perlu diingat

- **Gratis** untuk paket Hobby, tapi jangan dipakai komersial di paket itu.
- Situs ini **tidak mengirim data ke mana pun** — semua (nama, bintang, papan)
  tersimpan di perangkat masing-masing. Tidak ada database, tidak ada pelacakan.
- **Papan bintang tidak lintas perangkat.** Skor anak di tablet tidak muncul di
  HP. Itu batas situs statis; butuh server untuk skor bersama.
