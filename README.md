# Arena Mandarin

Game belajar bahasa Mandarin untuk anak — **18 mini-game**, 3 tingkat kesulitan,
situs statis tanpa build step, siap di-deploy ke Vercel.

### 📖 Panduan

| | Untuk siapa |
|---|---|
| **[Panduan Bermain →](PANDUAN-MAIN.md)** | Anak, orang tua, guru — cara main 18 game, level, bintang |
| **[Panduan Deploy ke Vercel →](PANDUAN-DEPLOY.md)** | Menaikkan ke internet, dari `git init` sampai domain sendiri |

README ini sisanya untuk **developer**: arsitektur, cara menambah materi & game.

## Menjalankan di komputer

```bash
npm run dev       # buka http://localhost:3000
```

Atau buka `public/index.html` langsung di browser. (Service worker hanya aktif
lewat `http://localhost` atau HTTPS, jadi mode offline tidak jalan kalau file
dibuka pakai `file://`.)

## Deploy ke Vercel

Ringkasnya — langkah lengkap + solusi masalah ada di
**[PANDUAN-DEPLOY.md](PANDUAN-DEPLOY.md)**.

Tidak perlu konfigurasi tambahan; `vercel.json` sudah mengatur `outputDirectory`,
`cleanUrls`, cache, dan security headers.

```bash
git init && git add . && git commit -m "init"   # folder ini belum repo git
# lalu push ke GitHub → import di vercel.com/new → Deploy (biarkan semua default)
```

Atau lewat CLI:

```bash
npm i -g vercel
vercel          # deploy pratinjau
vercel --prod   # deploy produksi
```

Situs ini murni statis (tanpa framework, tanpa build), jadi Vercel langsung
menyajikan isi folder `public/`.

## Cara main

1. Anak memilih **avatar** dan menulis namanya di layar pertama.
2. Pilih **level** dan **fokus belajar**.
3. Pilih game — **satu ronde = 30 soal**. Setiap jawaban benar = 1 bintang.
4. Hasil ronde muncul di modal, bintang masuk ke papan bintang.

Jumlah soal bisa diubah admin (5–50) lewat **Setelan awal → Jumlah soal per game**.

Sentuhan yang membuatnya seru untuk anak:

- **Avatar** tampil di header, papan bintang, dan modal hasil.
- Jawaban benar memunculkan **semburan bintang** dan bunyi; jawaban salah
  bergetar halus.
- **Lencana beruntun** (🔥) muncul setelah 2 jawaban benar berturut-turut.
- Skor sempurna (3 bintang) dirayakan dengan **confetti**.
- **Pintasan keyboard**: tekan `1`–`9` untuk memilih jawaban, `Enter` untuk
  lanjut — angka pintasannya tampil di setiap opsi.
- Semua animasi otomatis mati bila perangkat menyetel *reduce motion*.

## Level

Level bukan sekadar label — ia mengubah isi permainan:

| | Beginner | Intermediate | Advanced |
|---|---|---|---|
| Pilihan jawaban | 3 | 4 | 5 |
| Kosakata | 1 hanzi | semua | 2+ hanzi |
| Angka | 1–10 | 6–50 | 31–100 |
| Panjang kalimat | 2–3 kata | 2–4 kata | 4+ kata |
| Kartu memori | 12 kartu | 12 kartu | 16 kartu |

**Tebak nada** selalu 4 pilihan karena nada Mandarin ada 4. Game lain mengikuti
jumlah pilihan sesuai level; **Kata ukur** kini mengambil pengecoh dari daftar
kata ukur yang lebih lengkap.

## 30 soal per ronde — dan soal ulangan

Setiap game menyajikan tepat **30 soal**. Sebagian materi memang **tidak punya
30 soal unik**, dan itu bukan kekurangan yang bisa ditambal dengan menulis data
lebih banyak — misalnya *Cocokkan angka* level Beginner hanya mencakup angka
1–10, jadi maksimalnya 10 soal unik.

Untuk itu `series()` di `app.js` **mendaur kolam soal**: kolam diacak ulang tiap
putaran dan batas antar-putaran ditukar, sehingga **tak pernah ada soal yang sama
berturut-turut**. Pengulangan berjarak seperti ini justru membantu anak menghafal.

Variasi per ronde (jumlah soal unik dari 30), sudah diverifikasi otomatis:

| Game | Beginner | Intermediate | Advanced |
|---|---|---|---|
| Tebak kata / pinyin / arti-hanzi / ketik / dengar | 30 | 30 | 30 |
| Tebak nada, Kata ukur, Hari & waktu, Jam berapa, Matematika | 30 | 30 | 30 |
| Susun kalimat | 18 | 30 | 18 |
| Lawan kata | ~26 | ~26 | ~26 |
| Salam sopan, Lengkapi dialog | 20 | 20 | 20 |
| Cocokkan angka | 10 | 15 | 20 |

Angka di bawah 30 berarti soal berulang (berjarak). Ingin variasi lebih? Tambah
entri di `data.js` — lihat *Menambah materi*.

## Daftar game

Game dikelompokkan dalam 6 kategori, dan tombol **Fokus belajar** menyaringnya:

| Kategori | Game |
|---|---|
| Kosakata | Tebak kata, Tebak pinyin, Arti ke hanzi, Kartu memori |
| Dengar & Ucap | Tebak nada, Dengar & tebak, Ketik pinyin |
| Angka & Waktu | Cocokkan angka, Matematika, Hari & waktu, Jam berapa |
| Tata Bahasa | Kata ukur, Lawan kata, Susun kalimat |
| Percakapan | Salam sopan, Lengkapi dialog |
| Tantangan | Lomba cepat, Kuis campuran |

## Dua peran: pemain & admin

| | Pemain (user) | Admin |
|---|---|---|
| Halaman | `/` (index.html) | `/admin` (admin.html) |
| Masuk | tanpa login, cukup nama + avatar | PIN (awal: `1234`) |
| Bisa apa | main game, kumpulkan bintang | whitelabel, setelan awal, aktif/nonaktif game, ekspor config |

> ### ⚠️ Batas keamanan — baca ini
> Situs ini **statis, tanpa server**. Artinya **tidak ada login yang benar-benar
> aman**: PIN admin disimpan apa adanya di `config.json`/localStorage dan bisa
> dilihat siapa pun yang membuka *view-source* atau DevTools. Halaman `/admin`
> juga tetap bisa dibuka siapa saja (hanya `noindex`, tidak diblokir).
>
> Anggap PIN sebagai **penghalang ringan** supaya anak tidak asal mengubah
> setelan — **bukan** kontrol akses. Panel admin hanya mengubah tampilan &
> setelan; tidak ada data pribadi di dalamnya.
>
> Kalau butuh admin sungguhan (akun, peran, audit), perlu backend — misalnya
> Vercel Serverless Function + database + sesi ber-token. Itu di luar cakupan
> versi statis ini.

## Whitelabel

Di `/admin` → **Tampilan (Whitelabel)**: ubah nama aplikasi, tagline, logo
(emoji), warna utama & warna kedua — lengkap dengan pratinjau langsung. Tersedia
6 palet siap pakai (Teal, Biru, Ungu, Rose, Hijau, Oranye).

**Warna kustom tetap aman dibaca.** Satu warna merek dipakai untuk banyak peran
(latar appbar, teks judul, garis tepi, tombol) yang syarat kontrasnya berbeda —
dan berbeda pula antara tema terang dan gelap. Karena itu `config.js` tidak
memakai warna Anda mentah-mentah, tapi **menurunkan** satu set variabel per tema:
digelapkan otomatis saat jadi latar teks putih, dicerahkan saat jadi teks di atas
permukaan gelap, sampai kontras ≥ 4.5 (WCAG AA). Semua palet sudah diverifikasi
lolos AA di kedua tema.

### Cakupan perubahan: lokal vs global

Ini yang paling sering bikin bingung, jadi perhatikan:

- Perubahan di panel admin tersimpan di **localStorage perangkat itu saja** →
  langsung terlihat, tapi **hanya di perangkat Anda**.
- Supaya berlaku untuk **semua pengunjung**: klik **Ekspor config.json**, taruh
  file hasilnya di folder `public/`, lalu **deploy ulang**. File
  [`public/config.json`](public/config.json) inilah sumber merek global.

Urutan prioritas: bawaan di `config.js` → `config.json` → override lokal admin.

## Struktur

```
public/
  index.html              aplikasi pemain
  admin.html              panel admin
  config.json             merek & setelan global (hasil "Ekspor config.json")
  sw.js                   service worker (offline)
  manifest.webmanifest    PWA
  assets/
    css/style.css         design system, tema terang & gelap
    css/admin.css         gaya panel admin
    js/config.js          config + color-kit (turunan warna aman-kontras)
    js/data.js            semua materi pelajaran
    js/app.js             mesin game
    js/admin.js           logika panel admin
vercel.json               output dir, cache, security headers
```

## Menambah materi

Semua materi ada di [`public/assets/js/data.js`](public/assets/js/data.js) dan
otomatis terpakai di game yang relevan. Menambah kosakata cukup satu baris:

```js
const VOCAB = [
  ["猫", "māo", "kucing", "hewan"],
  // [hanzi, pinyin, arti, kategori]
];
```

Kolam Beginner hanya berisi hanzi **satu karakter**, jadi kalau ingin menambah
variasi untuk pemula, tambahkan kata satu karakter (人, 山, 火, …).

Satu aturan penting: **jangan sampai dua kata punya arti Indonesia yang sama
persis.** Pengecoh soal pilihan ganda diambil dari daftar yang sama, jadi arti
kembar bisa membuat satu soal punya dua jawaban benar. Kalau memang ada dua
hanzi yang mirip artinya, bedakan glosanya — misalnya `矮` = "pendek (badan)"
dan `短` = "pendek (benda)". Mesin game juga menyaring pengecoh yang seartinya
dengan jawaban, tapi glosa yang jelas tetap lebih baik untuk anak.

## Menambah game baru

Sebagian besar game hanyalah pembuat soal pilihan ganda. Tambahkan satu entri di
objek `QUIZ` dalam `app.js`, lalu daftarkan di array `GAMES` dan di kategori
yang sesuai pada array `FOCUS`:

```js
QUIZ.namaGame = {
  build: () => pick(DATA, 8),          // daftar soal
  make: (q) => ({                      // satu soal
    prompt: "Pertanyaannya?",
    big: q[0],
    layout: "list",                    // "list" atau "grid"
    options: shuf(distractors(q, nOpt() - 1).concat([q]))
      .map((v) => opt(esc(v[2]), v[2] === q[2])),
    explain: `Jawabannya: ${q[2]}.`
  })
};
```

Pakai `nOpt()` untuk jumlah pilihan supaya game ikut mengikuti level. Papan
skor, bintang, progres, modal hasil, dan tombol lanjut ditangani mesin game.

## Catatan teknis

- **Warna:** `--teal` dan `--coral` dipakai sebagai latar di belakang teks
  putih, jadi nilainya sengaja gelap agar lolos WCAG AA. Untuk hiasan yang
  tidak menanggung teks (garis tepi, bar progres) pakai `--teal-bright` /
  `--coral-bright`. Semua teks di kedua tema sudah diverifikasi lolos AA.
- **Service worker:** cache-first, jadi naikkan `CACHE` di
  [`public/sw.js`](public/sw.js) setiap kali isi `/assets` berubah — kalau tidak,
  pengguna lama akan terus melihat versi lama. Pengecualian: `config.json`
  memakai *network-first* supaya perubahan merek cepat tersebar.
- **Path aset relatif**, jadi `public/index.html` bisa dibuka langsung lewat
  klik-dobel (`file://`). Manifest PWA & service worker hanya dimuat di
  `http/https` karena browser memblokirnya di `file://`.
- **Popup pasang aplikasi:** isinya menyesuaikan browser (Chromium pakai tombol
  asli `beforeinstallprompt`; Safari iOS, Samsung Internet, Firefox, browser
  dalam aplikasi, dan desktop dituntun lewat menunya masing-masing). Popup baru
  muncul sendiri setelah anak menyelesaikan satu ronde, lalu dijeda 3 hari dan 10
  hari tiap kali ditutup, dan berhenti total setelah itu atau saat pengguna
  memilih *Jangan tampilkan lagi*. Tombol **Install** di bilah atas tetap bisa
  membukanya kapan saja.
- **Penyimpanan:** nama pemain, bintang, papan, level, fokus, tema, dan setelan
  suara disimpan di `localStorage`. Papan bintang bersifat lokal per perangkat —
  tidak ada server, jadi tidak ada skor lintas perangkat.
- **Dengar & tebak** memakai Web Speech API. Kalau browser tidak punya suara
  Mandarin (`zh-CN`), kartunya otomatis dinonaktifkan.
- Tidak ada koneksi keluar sama sekali; CSP di `vercel.json` mengunci
  `default-src 'self'`.
