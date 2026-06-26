# 03 - Google Sheets CRUD Operations 📊

Studi kasus ini mendemonstrasikan operasi Create, Read, Update, dan Delete (CRUD) pada Google Sheets menggunakan Google App Script.

## 📌 Deskripsi

Script ini menyediakan fungsi-fungsi utilitas untuk melakukan operasi dasar pada Google Sheets. Dapat digunakan sebagai fondasi untuk membangun aplikasi data sederhana berbasis Spreadsheet.

## ✨ Fitur

- **Create**: Menambahkan baris data baru ke Spreadsheet.
- **Read**: Membaca seluruh data atau mencari data berdasarkan kriteria tertentu.
- **Update**: Memperbarui data pada baris tertentu berdasarkan ID.
- **Delete**: Menghapus baris data berdasarkan ID.
- Validasi data sebelum operasi tulis.

## ⚙️ Konfigurasi

Sebelum menjalankan script, sesuaikan konstanta berikut di `Code.gs`:

| Konstanta | Keterangan |
|-----------|------------|
| `SPREADSHEET_ID` | ID Google Spreadsheet yang digunakan |
| `SHEET_NAME` | Nama sheet target |
| `HEADER_ROW` | Nomor baris header (biasanya 1) |

## 🚀 Cara Menjalankan

1. Buat Google Spreadsheet baru dengan header pada baris pertama (misal: `ID`, `Nama`, `Email`, `Tanggal`).
2. Buka Apps Script (Extensions → Apps Script).
3. Salin isi `Code.gs` ke editor.
4. Sesuaikan nilai konstanta konfigurasi.
5. Jalankan masing-masing fungsi (`createRow`, `readAllRows`, `updateRow`, `deleteRow`) untuk pengujian.

## 📁 File

- `Code.gs` — Script utama Google App Script.
