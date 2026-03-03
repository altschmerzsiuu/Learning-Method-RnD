# 📊 Panduan Setup Google Sheets untuk xplay Quiz

## Langkah 1: Buat Google Spreadsheet

1. Buka [Google Sheets](https://sheets.google.com)
2. Klik **"+ Blank"** untuk buat spreadsheet baru
3. Beri nama: **"xplay Quiz Data"**

## Langkah 2: Setup Sheet "Data Siswa"

1. Klik kanan pada tab **"Sheet1"** di bawah
2. Pilih **"Rename"** → ganti nama jadi **"Data Siswa"**
3. Di baris pertama (header), ketik:

| A         | B            | C     | D       | E     | F     | G     |
| --------- | ------------ | ----- | ------- | ----- | ----- | ----- |
| Timestamp | Nama Lengkap | Kelas | Sekolah | Nilai | Benar | Total |

## Langkah 3: Buat Google Apps Script

1. Di spreadsheet, klik menu **Extensions** → **Apps Script**
2. Akan terbuka tab baru (Apps Script Editor)
3. **Hapus** semua code default yang ada
4. **Copy-paste** semua code dari file:
   ```
   my-template/docs/google-apps-script.js
   ```
5. Klik **💾 Save** (Ctrl+S)
6. Beri nama project: **"xplay Quiz API"**

## Langkah 4: Deploy Web App

1. Klik tombol **"Deploy"** (pojok kanan atas)
2. Pilih **"New deployment"**
3. Klik ⚙️ icon di sebelah "Select type"
4. Pilih **"Web app"**
5. Isi form:
   - **Description**: xplay Quiz API
   - **Execute as**: **Me**
   - **Who has access**: **Anyone**
6. Klik **"Deploy"**
7. Klik **"Authorize access"** → pilih akun Google kamu
8. Jika muncul warning "Google hasn't verified this app":
   - Klik **"Advanced"**
   - Klik **"Go to xplay Quiz API (unsafe)"**
   - Klik **"Allow"**
9. **COPY** URL yang muncul (simpan baik-baik!)

## Langkah 5: Pasang URL di Website

1. Buka file: `my-template/js/latihan.js`
2. Cari baris ini (sekitar baris 14):
   ```javascript
   GOOGLE_SCRIPT_URL: "YOUR_GOOGLE_SCRIPT_URL_HERE";
   ```
3. Ganti `YOUR_GOOGLE_SCRIPT_URL_HERE` dengan URL yang kamu copy tadi
4. Contoh hasilnya:
   ```javascript
   GOOGLE_SCRIPT_URL: "https://script.google.com/macros/s/AKfycbx.../exec";
   ```
5. **Save** file

## ✅ Selesai!

Sekarang coba test:

1. Buka `latihan.html` di browser
2. Isi form data siswa → klik "Mulai Ujian"
3. Cek Google Spreadsheet → harusnya ada row baru dengan data siswa
4. Kerjakan soal → klik "Selesai & Lihat Nilai"
5. Cek Google Spreadsheet → kolom Nilai, Benar, Total harusnya terisi

---

## ❓ Troubleshooting

**Data tidak masuk ke spreadsheet?**

- Pastikan URL sudah benar di `latihan.js`
- Buka browser console (F12) → cek ada error atau tidak
- Pastikan sheet bernama persis **"Data Siswa"** (case sensitive)

**Error "Google hasn't verified this app"?**

- Ini normal untuk Apps Script pribadi
- Ikuti langkah di atas untuk bypass warning

**Mau redeploy setelah edit script?**

- Klik Deploy → Manage deployments → Edit (pensil)
- Ganti version ke "New version"
- Klik Deploy
