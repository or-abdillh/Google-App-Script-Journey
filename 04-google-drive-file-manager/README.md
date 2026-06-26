# 04 - Google Drive File Manager 📁

Studi kasus ini mendemonstrasikan cara mengelola file dan folder di Google Drive secara otomatis menggunakan Google App Script.

## 📌 Deskripsi

Script ini menyediakan berbagai fungsi untuk mengotomatiskan pengelolaan file di Google Drive, seperti membuat struktur folder, memindahkan file, dan membuat laporan inventaris file.

## ✨ Fitur

- Membuat struktur folder secara otomatis.
- Memindahkan file berdasarkan nama, tipe, atau tanggal.
- Mencari file dan folder berdasarkan kata kunci.
- Membuat laporan daftar file ke Google Sheets.
- Menghapus file lama yang melebihi batas usia tertentu.

## ⚙️ Konfigurasi

Sebelum menjalankan script, sesuaikan konstanta berikut di `Code.gs`:

| Konstanta | Keterangan |
|-----------|------------|
| `ROOT_FOLDER_ID` | ID folder root Google Drive yang dikelola |
| `REPORT_SPREADSHEET_ID` | ID Spreadsheet untuk laporan inventaris file |
| `REPORT_SHEET_NAME` | Nama sheet dalam Spreadsheet laporan |
| `MAX_FILE_AGE_DAYS` | Usia maksimal file sebelum dianggap kedaluwarsa |

## 🚀 Cara Menjalankan

1. Siapkan folder di Google Drive yang ingin dikelola.
2. Buat project baru di [Apps Script](https://script.google.com/).
3. Salin isi `Code.gs` ke editor.
4. Sesuaikan nilai konstanta konfigurasi.
5. Jalankan fungsi yang diinginkan, misalnya `generateFileReport()` untuk membuat laporan.

## 📁 File

- `Code.gs` — Script utama Google App Script.
