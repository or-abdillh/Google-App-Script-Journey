# 05 - Google Calendar Automation 📅

Studi kasus ini mendemonstrasikan cara membuat dan mengelola event Google Calendar secara otomatis menggunakan Google App Script.

## 📌 Deskripsi

Script ini mengotomatiskan pembuatan event di Google Calendar berdasarkan data dari Google Sheets, serta mengirimkan pengingat dan notifikasi kepada peserta event.

## ✨ Fitur

- Membuat event Calendar secara massal dari data di Google Sheets.
- Menambahkan peserta (guests) secara otomatis ke setiap event.
- Mengirimkan notifikasi email pengingat sebelum event berlangsung.
- Memperbarui atau membatalkan event yang sudah ada.
- Menyinkronkan perubahan jadwal dari Spreadsheet ke Calendar.

## ⚙️ Konfigurasi

Sebelum menjalankan script, sesuaikan konstanta berikut di `Code.gs`:

| Konstanta | Keterangan |
|-----------|------------|
| `CALENDAR_ID` | ID Google Calendar tujuan (gunakan `'primary'` untuk kalender utama) |
| `SPREADSHEET_ID` | ID Google Spreadsheet sumber data jadwal |
| `SHEET_NAME` | Nama sheet yang berisi data jadwal |
| `REMINDER_MINUTES` | Menit sebelum event untuk mengirim pengingat |

## 🚀 Cara Menjalankan

1. Siapkan Google Spreadsheet dengan kolom: `Judul`, `Deskripsi`, `Tanggal Mulai`, `Tanggal Selesai`, `Peserta`.
2. Buka Apps Script dari Spreadsheet (Extensions → Apps Script).
3. Salin isi `Code.gs` ke editor.
4. Sesuaikan nilai konstanta konfigurasi.
5. Jalankan fungsi `createEventsFromSheet()` untuk membuat event dari data Spreadsheet.

## 📁 File

- `Code.gs` — Script utama Google App Script.
