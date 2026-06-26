# E-HANDBOOK

# AUTOMATISASI KLAIM REIMBURSEMENT

## Integrasi Gemini AI Vision dan Google Workspace untuk Pemrosesan Struk Otomatis

---

# Learning Objectives

Setelah mengikuti materi ini peserta mampu:

✅ Memahami arsitektur sistem otomatisasi klaim reimbursement

✅ Membuat dan mengonfigurasi Google Form untuk pengunggahan bukti nota

✅ Menghubungkan Google Form dengan Google Spreadsheet untuk penyimpanan Ledger

✅ Menulis kode Google Apps Script untuk otomatisasi penanganan file bukti transaksi

✅ Mengintegrasikan Google Apps Script dengan API Gemini Vision untuk pembacaan struk belanja

✅ Menyusun instruksi prompt terstruktur untuk ekstraksi data JSON dari gambar nota

✅ Menyetel trigger event-driven (onFormSubmit) di Google Apps Script

---

# 1. ALUR DAN ARSITEKTUR UTAMA

Dalam sistem otomatisasi ini, data mengalir dari pengisian formulir oleh pengguna hingga pencatatan otomatis di dalam Buku Besar (Ledger). Pola alurnya adalah sebagai berikut:

```
User (Submit Form)
↓
Google Form (Formulir Klaim)
↓
Google Drive (Penyimpanan File)
↓
Apps Script Trigger (onFormSubmit)
↓
Gemini Vision (Proses AI)
↓
Google Sheets Ledger (Pencatatan)
```

---

# 2. PERSIAPAN GOOGLE WORKSPACE

Langkah pertama adalah membuat wadah input data dan media penyimpanan:

## Langkah A: Membuat Google Form
Buat sebuah Google Form baru dengan nama **Form Klaim Reimbursement** dan tambahkan kolom (field) berikut:

1. **Nama Karyawan** (Jawaban Singkat / Short Answer)
2. **Departemen** (Pilihan Ganda / Dropdown):
   * IT
   * Finance
   * Marketing
   * HR
3. **Upload Nota** (Upload File):
   * Tipe file diizinkan: Gambar (JPG, JPEG, PNG) dan PDF
   * Jumlah file maksimal: 1 file
   * Ukuran maksimal: 10 MB

> [!NOTE]
> Google Form secara otomatis akan membuat folder khusus di Google Drive untuk menyimpan file nota yang diunggah oleh user.

## Langkah B: Menghubungkan Form ke Google Spreadsheet
1. Pada tab **Responses** di Google Form, klik tombol **Link to Sheets** (Hubungkan ke Spreadsheet).
2. Buat Spreadsheet baru. Secara default, tab responses pertama akan dinamai **Form Responses 1**.

## Langkah C: Membuat Sheet Ledger (Buku Besar)
1. Buka spreadsheet yang baru dibuat.
2. Tambahkan satu lembar kerja (sheet) baru dan beri nama **Ledger**.
3. Buat header kolom di baris pertama pada sheet **Ledger** dengan struktur berikut:
   * **Timestamp**
   * **Nama**
   * **Departemen**
   * **Tanggal Nota**
   * **Nama Toko**
   * **Total**
   * **Kategori**
   * **File URL**

---

# 3. STRUKTUR DATA DAN PERSIAPAN SCRIPT

Saat pengguna mengirimkan Google Form, data jawaban akan masuk ke sheet **Form Responses 1** dengan struktur kolom sebagai berikut:

| Indeks | Kolom | Deskripsi |
| :--- | :--- | :--- |
| `0` | Timestamp | Waktu pengiriman formulir |
| `1` | Nama Karyawan | Nama karyawan pengaju klaim |
| `2` | Departemen | Divisi/Departemen karyawan |
| `3` | Upload Nota | URL file gambar bukti transaksi di Google Drive |

Untuk mulai menulis kode program:
1. Buka Google Spreadsheet Anda.
2. Klik menu **Extensions** -> **Apps Script** untuk membuka Code Editor.
3. Buat tiga file script di dalam editor:
   * `config.js` (untuk file konfigurasi konstanta)
   * `helper.js` (untuk fungsi-fungsi pembantu dan integrasi API)
   * `main.js` (untuk entry point event trigger)

---

# 4. KONFIGURASI SISTEM (config.js)

Tulis kode berikut pada file `config.js` untuk mendefinisikan konstanta konfigurasi global aplikasi:

```javascript
// 1. Kunci Keamanan API Gemini (API Key)
const GEMINI_API_KEY = "YOUR_GEMINI_API_KEY";

// 2. Alamat Endpoint API Gemini
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent";

// 3. Nama Sheet Buku Besar (Ledger)
const LEDGER_SHEET = "Ledger";
```

Penjelasan:
* `GEMINI_API_KEY` adalah kunci akses rahasia (API Key) untuk otentikasi ke Google Gemini API.
* `GEMINI_API_URL` adalah URL endpoint dari model Gemini yang digunakan (disarankan menggunakan model Gemini Flash untuk pemrosesan vision yang cepat dan hemat biaya).
* `LEDGER_SHEET` menentukan nama tab sheet yang digunakan sebagai Buku Besar (Ledger).

---

# 5. ENTRY POINT DAN EVENT TRIGGER (main.js)

Tulis kode berikut pada file `main.js`. Fungsi ini bertindak sebagai pintu masuk pertama yang menerima data dari Google Form:

```javascript
function onFormSubmit(e) {
  // Mengambil nilai baris baru dalam bentuk array
  const row = e.values;

  // Memetakan nilai berdasarkan urutan kolom di Google Form
  const timestamp = row[0];
  const employee = row[1];
  const department = row[2];
  const fileUrl = row[3];

  // Memanggil fungsi pemrosesan utama struk
  processReceipt(
    timestamp,
    employee,
    department,
    fileUrl
  );
}
```

Penjelasan:
* Parameter `e` adalah objek event yang dilewatkan secara otomatis oleh Google Sheets ketika ada baris data baru dari form.
* Properti `e.values` berisi array jawaban yang dimasukkan oleh pengguna.
* Fungsi ini memisahkan setiap kolom jawaban lalu meneruskannya ke fungsi `processReceipt` di `helper.js`.

---

# 6. MENGOLAH FILE DRIVE DARI URL (helper.js)

Google Form menyimpan file bukti transaksi di Google Drive dan menuliskan tautan URL-nya ke spreadsheet. Agar program dapat membaca file tersebut, kita perlu mengambil ID file dari URL tersebut dan memuat file tersebut menggunakan `DriveApp`.

```javascript
function getFileId(url) {
  const patterns = [
    /id=([^&]+)/,
    /\/d\/([^/]+)\//
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return match[1];
    }
  }

  throw new Error("File ID tidak ditemukan pada URL yang diberikan");
}

function getFileFromUrl(url) {
  const fileId = getFileId(url);
  return DriveApp.getFileById(fileId);
}
```

Penjelasan:
* `getFileId(url)` menggunakan regular expression (RegEx) untuk mengekstrak string ID unik file dari URL Google Drive.
* `getFileFromUrl(url)` menggunakan ID file tersebut untuk memanggil `DriveApp.getFileById(fileId)` dan mengembalikan objek file Google Drive.

---

# 7. PROSES EKSTRAKSI DENGAN GEMINI AI VISION (helper.js)

Fungsi berikut mengambil gambar dari Google Drive, mengubahnya menjadi format biner (Base64), dan mengirimkannya ke API Gemini Vision dengan instruksi prompt yang terstruktur.

```javascript
function processReceipt(timestamp, employee, department, fileUrl) {
  // Mengambil objek file dari URL
  const file = getFileFromUrl(fileUrl);
  const blob = file.getBlob();

  // Mengubah data biner file menjadi Base64
  const base64 = Utilities.base64Encode(blob.getBytes());

  // Menyusun payload sesuai spesifikasi API Gemini
  const payload = {
    contents: [
      {
        parts: [
          {
            text: `
              Baca nota ini. Ekstrak informasi penting dan kembalikan hanya dalam format JSON.
              PENTING: Pada kolom "total", hapus semua simbol mata uang (seperti Rp, Rupiah) dan tanda pemisah ribuan (titik atau koma). Kembalikan nilai total belanja hanya sebagai angka bulat (integer) murni. Contoh: jika tertera "Rp 43.500" atau "43.500", kembalikan 43500.

              Return JSON ONLY:
              {
                "store_name": "",
                "date": "",
                "total": "",
                "category": ""
              }
            `
          },
          {
            inline_data: {
              mime_type: blob.getContentType(),
              data: base64
            }
          }
        ]
      }
    ]
  };

  // Mengirim request HTTP POST ke Gemini API
  const response = UrlFetchApp.fetch(
    `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
    {
      method: "post",
      contentType: "application/json",
      payload: JSON.stringify(payload)
    }
  );

  // Mengurai respon JSON dari Gemini
  const result = JSON.parse(response.getContentText());
  const text = result.candidates[0].content.parts[0].text;

  // Menyimpan data hasil analisis ke Ledger
  saveLedger(timestamp, employee, department, fileUrl, text);
}
```

Penjelasan:
* `Utilities.base64Encode` mengubah data biner gambar menjadi string teks agar dapat dikirim di dalam payload JSON.
* Prompt yang dikirimkan memberi instruksi ketat agar AI hanya mengembalikan JSON bersih dan memformat nilai "total" menjadi angka bulat murni untuk memudahkan pemrosesan akuntansi.
* `UrlFetchApp.fetch` digunakan untuk melakukan pemanggilan API eksternal.

---

# 8. MENYIMPAN HASIL EKSTRAKSI KE LEDGER (helper.js)

Setelah mendapatkan respon teks dari AI Gemini, data tersebut harus dibersihkan dari tag pembungkus kode markdown (seperti `` ```json `` dan `` ``` ``) sebelum dikonversi menjadi objek JSON dan ditulis ke sheet Ledger.

```javascript
function saveLedger(timestamp, employee, department, fileUrl, aiText) {
  // Membersihkan tag markdown JSON jika ada
  const clean = aiText
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  // Mengubah teks bersih menjadi objek JavaScript
  const data = JSON.parse(clean);

  // Mengakses sheet Ledger
  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName(LEDGER_SHEET);

  // Menambahkan baris baru ke dalam sheet Ledger
  sheet.appendRow([
    timestamp,
    employee,
    department,
    data.date,
    data.store_name,
    data.total,
    data.category,
    fileUrl
  ]);
}
```

Penjelasan:
* `replace` digunakan untuk menghapus penanda sintaks markdown agar string JSON dapat di-parse secara aman menggunakan `JSON.parse`.
* `sheet.appendRow` menambahkan seluruh baris data transaksi baru ke bagian bawah sheet Buku Besar (Ledger).

---

# 9. PEMASANGAN TRIGGER OTOMATIS (INSTALLABLE TRIGGER)

Agar script otomatis berjalan setiap kali formulir dikirim, Anda perlu memasang trigger manual di Apps Script Editor:
1. Di panel sebelah kiri editor Google Apps Script, klik ikon jam (**Triggers**).
2. Klik tombol **+ Add Trigger** di sudut kanan bawah.
3. Atur konfigurasi pemicu sebagai berikut:
   * **Choose which function to run**: `onFormSubmit`
   * **Choose which deployment should run**: `Head`
   * **Select event source**: `From spreadsheet`
   * **Select event type**: `On form submit`
4. Klik **Save**.
5. Setujui permintaan otorisasi akun Google Anda jika diminta (ikuti petunjuk Advanced -> Go to ... (unsafe) jika muncul peringatan keamanan).

---

# 10. WORKFLOW PENGGUNA DAN DEMO HASIL AKHIR

## Alur Kerja Pengguna (User Flow)
1. Karyawan membuka link Google Form dan mengisi data:
   * Nama Karyawan: `Oka`
   * Departemen: `IT`
   * Upload Nota: (mengunggah foto struk belanja)
2. Karyawan mengklik **Submit**.
3. Sistem secara otomatis mendeteksi submit, mengirimkan gambar struk ke Gemini AI, mengekstrak data keuangan penting, dan menyimpannya secara otomatis ke dalam sheet Ledger.

## Hasil Akhir pada Sheet Ledger
Tabel berikut menunjukkan contoh pencatatan otomatis di dalam sheet **Ledger**:

| Timestamp | Nama | Departemen | Tanggal Nota | Nama Toko | Total | Kategori | File URL |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `26/06/2026 19:30:00` | Oka | IT | `25/06/2026` | Indomaret | `45000` | Konsumsi | `https://drive.google.com/...` |
| `26/06/2026 19:35:00` | Oka | IT | `24/06/2026` | Starbucks | `56000` | Konsumsi | `https://drive.google.com/...` |

---

# 11. REKOMENDASI PENGEMBANGAN SISTEM (BEST PRACTICE)

Untuk meningkatkan keandalan sistem reimbursement di lingkungan kerja nyata, berikut adalah beberapa fitur tambahan yang disarankan untuk dikembangkan lebih lanjut:

1. **Kolom Status AI (Audit Status)**:
   Tambahkan kolom status di sheet Ledger seperti `SUCCESS`, `FAILED`, atau `NEEDS_REVIEW` untuk membantu tim verifikator keuangan memfilter data yang memerlukan peninjauan ulang.
   
2. **Skor Kepercayaan (Confidence Score)**:
   Minta model Gemini mengembalikan estimasi tingkat keyakinan (misalnya dalam skala persentase) terhadap kualitas pembacaan struk yang buram atau robek.

3. **Penanganan Eror (Error Handling)**:
   Bungkus fungsi pemanggilan API dengan blok `try-catch` agar sistem tetap berjalan stabil dan mengirimkan notifikasi peringatan jika API Key tidak valid atau limit kuota harian tercapai.

---

# RINGKASAN

Integrasi Google Workspace dan Gemini AI Vision menunjukkan kekuatan otomasi tanpa server (serverless). Melalui modul ini, Anda telah mempelajari cara:
* Mengatur **Google Form & Sheets** sebagai database input sederhana.
* Membaca media penyimpanan **Google Drive** secara terprogram menggunakan Google Apps Script.
* Menghubungkan platform Workspace dengan **Gemini API** menggunakan payload JSON biner.
* Menggunakan **Installable Trigger** untuk otomatisasi real-time.
