# 02 - Form Response Handler 📝

Studi kasus ini mendemonstrasikan cara memproses respons Google Form secara otomatis dan mengorganisirnya ke dalam Google Sheets.

## 📌 Deskripsi

Setiap kali seseorang mengisi Google Form, script ini akan terpicu secara otomatis untuk memvalidasi, memformat, dan menyimpan data respons ke sheet yang tepat. Script juga mengirim email konfirmasi ke responden.

## ✨ Fitur

- Memproses respons Google Form secara otomatis saat form disubmit.
- Memvalidasi dan membersihkan data yang masuk.
- Mengategorikan respons ke sheet yang berbeda berdasarkan kondisi tertentu.
- Mengirimkan email konfirmasi otomatis ke responden.
- Mencatat timestamp setiap respons.

## ⚙️ Konfigurasi

Sebelum menjalankan script, sesuaikan konstanta berikut di `Code.gs`:

| Konstanta | Keterangan |
|-----------|------------|
| `SPREADSHEET_ID` | ID Google Spreadsheet tujuan |
| `MAIN_SHEET_NAME` | Nama sheet utama untuk menyimpan semua respons |
| `CONFIRMATION_SUBJECT` | Subjek email konfirmasi |

## 🚀 Cara Menjalankan

1. Buat Google Form dan Google Spreadsheet baru.
2. Buka Apps Script dari Google Form (Extensions → Apps Script).
3. Salin isi `Code.gs` ke editor.
4. Sesuaikan nilai konstanta konfigurasi.
5. Buat trigger **On Form Submit** untuk fungsi `onFormSubmit()`.
6. Isi form untuk menguji alur kerja.

## 📁 File

- `Code.gs` — Script utama Google App Script.
