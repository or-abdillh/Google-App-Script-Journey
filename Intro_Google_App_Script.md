# FUNDAMENTAL GOOGLE APPS SCRIPT FOR SPREADSHEET AUTOMATION

## Workshop Objective

Setelah mengikuti sesi ini peserta mampu:

✓ Memahami apa itu Google Apps Script

✓ Memahami konsep Action dan Event

✓ Membuat otomatisasi sederhana pada Google Spreadsheet

✓ Mengenali trigger yang paling sering digunakan dalam dunia kerja

---

# 1. APA ITU GOOGLE APPS SCRIPT?

Google Apps Script adalah platform pemrograman berbasis JavaScript yang digunakan untuk mengotomatisasi produk Google Workspace seperti:

* Google Spreadsheet
* Google Form
* Google Drive
* Gmail
* Google Docs
* Google Calendar

Tanpa Apps Script:

User bekerja secara manual.

Dengan Apps Script:

Komputer bekerja secara otomatis.

---

# ANALOGI SEDERHANA

Spreadsheet adalah mobil.

Apps Script adalah mesin.

Tanpa mesin:

Mobil tidak bisa bergerak.

Tanpa Apps Script:

Spreadsheet hanya menjadi tempat menyimpan data.

---

# 2. KONSEP UTAMA

Google Apps Script bekerja menggunakan dua hal:

1. Action
2. Event

---

## Action

Action adalah sesuatu yang dilakukan oleh script.

Contoh:

* Menulis data
* Membaca data
* Menghapus data
* Mengirim email
* Membuat folder

Formula sederhana:

Action = Perintah

---

## Event

Event adalah sesuatu yang memicu script berjalan.

Contoh:

* User membuka spreadsheet
* User mengubah isi cell
* User submit Google Form

Formula sederhana:

Event = Pemicu

---

# HUBUNGAN ACTION DAN EVENT

Event:
User mengubah data

↓

Script berjalan

↓

Action:
Menulis status "Updated"

---

# 3. ACTION PALING SERING DIGUNAKAN

## Membaca Spreadsheet

```javascript
function readData() {

  const sheet =
    SpreadsheetApp
      .getActiveSpreadsheet()
      .getActiveSheet();

  const values =
    sheet.getDataRange().getValues();

  Logger.log(values);

}
```

Penjelasan:

getValues()

digunakan untuk mengambil seluruh isi spreadsheet.

---

## Menulis Data

```javascript
function writeData() {

  const sheet =
    SpreadsheetApp
      .getActiveSpreadsheet()
      .getActiveSheet();

  sheet.getRange("A1")
    .setValue("Hello Apps Script");

}
```

Penjelasan:

setValue()

digunakan untuk menulis data ke cell.

---

## Menambahkan Baris Baru

```javascript
function appendRow() {

  const sheet =
    SpreadsheetApp
      .getActiveSpreadsheet()
      .getActiveSheet();

  sheet.appendRow([
    "INV-001",
    "Laptop",
    15000000
  ]);

}
```

Penjelasan:

appendRow()

digunakan untuk menambah data baru di bagian bawah tabel.

---

## Menghapus Isi Cell

```javascript
function clearCell() {

  const sheet =
    SpreadsheetApp
      .getActiveSpreadsheet()
      .getActiveSheet();

  sheet.getRange("A1")
    .clearContent();

}
```

Penjelasan:

clearContent()

menghapus isi tanpa menghapus format.

---

# 4. EVENT PALING SERING DIGUNAKAN

## onOpen()

Berjalan saat spreadsheet dibuka.

```javascript
function onOpen() {

  SpreadsheetApp
    .getUi()
    .alert(
      "Selamat datang!"
    );

}
```

Use Case:

* Menampilkan informasi
* Membuat custom menu

---

## onEdit()

Berjalan saat user mengubah cell.

```javascript
function onEdit(e) {

  const sheet =
    e.source.getActiveSheet();

  sheet.getRange("D1")
    .setValue(
      "Terakhir update"
    );

}
```

Use Case:

* Audit log
* Status otomatis
* Validasi data

---

## onFormSubmit()

Berjalan saat Google Form disubmit.

```javascript
function onFormSubmit(e) {

  const data =
    e.values;

  Logger.log(data);

}
```

Use Case:

* Approval workflow
* AI automation
* Receipt Scanner

---

# 5. DEMO 2 MENIT

Buat spreadsheet:

| Nama | Status |
| ---- | ------ |

Script:

```javascript
function onEdit(e) {

  const row =
    e.range.getRow();

  const sheet =
    e.source.getActiveSheet();

  sheet
    .getRange(row,2)
    .setValue("Updated");

}
```

Hasil:

Saat user mengetik:

A2 = Oka

Maka:

B2 = Updated

otomatis terisi.

Inilah konsep dasar automation.

---

# 6. KONSEP PENTING DUNIA KERJA

Sebagian besar sistem enterprise bekerja seperti ini:

Event
↓

Automation
↓

Action

Contoh:

Customer Checkout
↓

Event

↓

Generate Invoice

↓

Action

Contoh lain:

Submit Reimbursement
↓

Event

↓

AI Membaca Nota

↓

Action

---

# CHEAT SHEET

# ACTION

SpreadsheetApp

| Function         | Kegunaan             |
| ---------------- | -------------------- |
| getValue()       | Ambil 1 cell         |
| getValues()      | Ambil banyak cell    |
| setValue()       | Isi 1 cell           |
| setValues()      | Isi banyak cell      |
| appendRow()      | Tambah baris         |
| clearContent()   | Hapus isi            |
| deleteRow()      | Hapus baris          |
| getRange()       | Ambil range          |
| getSheetByName() | Ambil sheet tertentu |

---

# CHEAT SHEET

# GOOGLE DRIVE

| Function        | Kegunaan     |
| --------------- | ------------ |
| getFileById()   | Ambil file   |
| createFile()    | Buat file    |
| getFolderById() | Ambil folder |
| createFolder()  | Buat folder  |

---

# CHEAT SHEET

# GMAIL

| Function      | Kegunaan    |
| ------------- | ----------- |
| sendEmail()   | Kirim email |
| createDraft() | Draft email |

---

# CHEAT SHEET

# EVENT

| Event             | Kapan Berjalan     |
| ----------------- | ------------------ |
| onOpen            | Spreadsheet dibuka |
| onEdit            | Cell diubah        |
| onInstall         | Add-on diinstall   |
| onSelectionChange | Cell dipilih       |
| onFormSubmit      | Form disubmit      |

---

# CHEAT SHEET

# TRIGGER

| Trigger          | Jenis             |
| ---------------- | ----------------- |
| Time Driven      | Berdasarkan waktu |
| Form Submit      | Submit form       |
| Spreadsheet Open | Buka spreadsheet  |
| Spreadsheet Edit | Edit spreadsheet  |

---

# RINGKASAN

Google Apps Script selalu terdiri dari:

Event
↓

Trigger Script

↓

Action

Jika memahami konsep ini, maka peserta sudah memiliki fondasi untuk membangun:

✓ Approval Workflow

✓ Reminder Otomatis

✓ Dashboard

✓ Integrasi AI Gemini

✓ Sistem Reimbursement

✓ CRM Sederhana

✓ ERP Sederhana

Menguasai Apps Script berarti mengubah Google Workspace dari alat administrasi menjadi platform otomasi bisnis.
