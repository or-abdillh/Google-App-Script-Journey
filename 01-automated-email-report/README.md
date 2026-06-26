# 01 - Automated Email Report 📧

Studi kasus ini mendemonstrasikan cara mengirimkan laporan otomatis via Gmail menggunakan data yang ada di Google Sheets.

## 📌 Deskripsi

Script ini akan membaca data dari Google Sheets dan mengirimkannya sebagai laporan email secara terjadwal. Cocok digunakan untuk laporan harian, mingguan, atau bulanan.

## ✨ Fitur

- Membaca data dari Google Sheets secara otomatis.
- Memformat data menjadi tabel HTML yang rapi di dalam email.
- Mengirimkan email ke satu atau beberapa penerima.
- Dapat dijadwalkan menggunakan **Time-driven Trigger** di Apps Script.

## ⚙️ Konfigurasi

Sebelum menjalankan script, sesuaikan konstanta berikut di `Code.gs`:

| Konstanta | Keterangan |
|-----------|------------|
| `SPREADSHEET_ID` | ID Google Spreadsheet yang menjadi sumber data |
| `SHEET_NAME` | Nama sheet yang berisi data laporan |
| `RECIPIENT_EMAIL` | Alamat email penerima laporan |
| `EMAIL_SUBJECT` | Subjek email yang akan dikirim |

## 🚀 Cara Menjalankan

1. Buka [Google Apps Script](https://script.google.com/) dan buat project baru.
2. Salin isi `Code.gs` ke editor.
3. Sesuaikan nilai konstanta konfigurasi di bagian atas file.
4. Jalankan fungsi `sendEmailReport()` secara manual untuk pengujian pertama.
5. Atur **Time-driven Trigger** untuk menjalankan `sendEmailReport()` secara terjadwal.

## 📁 File

- `Code.gs` — Script utama Google App Script.
