Arsitektur Final

User
 │
 ▼
Google Form
 │
 ├─ Nama Karyawan
 ├─ Departemen
 ├─ Foto Nota
 │
 ▼
Google Drive
(Folder Upload Form)
 │
 ▼
Apps Script Trigger
(onFormSubmit)
 │
 ▼
Gemini Vision
 │
 ▼
Extract:
- Nama Toko
- Tanggal
- Total
- Kategori
 │
 ▼
Google Sheets Ledger

STEP 1 — Buat Google Form

Buat form:

Form Klaim Reimbursement

Tambahkan field:

Nama Karyawan

Short Answer

Departemen

Dropdown

- IT
- Finance
- Marketing
- HR

Upload Nota

File Upload

Format:

jpg
jpeg
png
pdf

Limit:

1 file

Google Form otomatis membuat folder Drive.

STEP 2 — Hubungkan ke Spreadsheet

Form

Responses
→ Link to Sheets

Misal sheet bernama:

Form Responses 1

STEP 3 — Tambahkan Sheet Ledger

Buat sheet kedua:

Ledger

Header:

TimestampNamaDepartemenTanggal NotaNama TokoTotalKategoriFile URL

STEP 4 — Struktur Data Form

Saat form disubmit biasanya hasilnya:

TimestampNama KaryawanDepartemenUpload Nota20/06/2026OkaIThttps://drive.google.com/...

Yang kita perlukan adalah URL file tersebut.

STEP 5 — Apps Script

Buka:

Spreadsheet
→ Extensions
→ Apps Script

STEP 6 — Config

const GEMINI_API_KEY = "YOUR_KEY";
const LEDGER_SHEET = "Ledger";

STEP 7 — Trigger onFormSubmit

Ini bagian yang berbeda dengan pendekatan folder polling.

Kita langsung merespon event submit.

function onFormSubmit(e) {

  const row = e.values;

  const timestamp = row[0];
  const employee = row[1];
  const department = row[2];

  const fileUrl = row[3];

  processReceipt(
    timestamp,
    employee,
    department,
    fileUrl
  );

}

STEP 8 — Ambil File Dari URL Drive

Google Form menyimpan URL file.

Contoh:

https://drive.google.com/open?id=123ABC

atau

https://drive.google.com/file/d/123ABC/view

Helper:

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

  throw new Error(
    "File ID tidak ditemukan"
  );

}

STEP 9 — Ambil File Drive

function getFileFromUrl(url) {

  const fileId =
    getFileId(url);

  return DriveApp.getFileById(
    fileId
  );

}

STEP 10 — Kirim ke Gemini Vision

function processReceipt(
  timestamp,
  employee,
  department,
  fileUrl
) {

  const file =
    getFileFromUrl(fileUrl);

  const blob =
    file.getBlob();

  const base64 =
    Utilities.base64Encode(
      blob.getBytes()
    );

  const payload = {

    contents: [
      {
        parts: [
          {
            text: `
Baca nota ini.

Return JSON ONLY:

{
  "store_name":"",
  "date":"",
  "total":"",
  "category":""
}
`
          },
          {
            inline_data: {
              mime_type:
                blob.getContentType(),
              data: base64
            }
          }
        ]
      }
    ]

  };

  const response =
    UrlFetchApp.fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "post",
        contentType:
          "application/json",
        payload:
          JSON.stringify(payload)
      }
    );

  const result =
    JSON.parse(
      response.getContentText()
    );

  const text =
    result.candidates[0]
      .content.parts[0].text;

  saveLedger(
    timestamp,
    employee,
    department,
    fileUrl,
    text
  );

}

STEP 11 — Simpan ke Ledger

function saveLedger(
  timestamp,
  employee,
  department,
  fileUrl,
  aiText
) {

  const clean = aiText
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  const data =
    JSON.parse(clean);

  const sheet =
    SpreadsheetApp
      .getActiveSpreadsheet()
      .getSheetByName(
        LEDGER_SHEET
      );

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

STEP 12 — Pasang Trigger

Apps Script:

Triggers
→ Add Trigger

Pilih:

onFormSubmit

Event:

From Spreadsheet

Type:

On Form Submit

Workflow yang Dilihat Peserta

User

Buka Form

Nama:
Oka

Departemen:
IT

Upload:
foto struk.jpg

Klik:

Submit

Otomatis

Google Form
↓
Google Drive
↓
Apps Script Trigger
↓
Gemini Vision
↓
Ekstrak Data
↓
Google Sheets Ledger

Hasil Akhir di Ledger

NamaDepartemenTokoTotalKategoriOkaITIndomaret45000KonsumsiOkaITStarbucks56000Konsumsi

Untuk materi workshop, saya juga menyarankan menambahkan satu kolom "Status AI" (SUCCESS, FAILED, NEEDS_REVIEW) dan meminta Gemini mengembalikan confidence score. Ini membuat demo terlihat lebih realistis seperti sistem reimbursement perusahaan yang sesungguhnya.
