# E-HANDBOOK

# FUNDAMENTAL GEMINI API

## Memahami Cara Kerja AI melalui REST API, JavaScript, dan Google Apps Script

---

# Learning Objectives

Setelah mengikuti materi ini peserta mampu:

✅ Memahami apa itu AI API

✅ Memahami alur Request dan Response

✅ Memahami struktur Prompt

✅ Melakukan request ke Gemini menggunakan:

* REST API
* JavaScript
* Google Apps Script

✅ Memahami struktur response Gemini

---

# 1. APA ITU GEMINI API?

Gemini API adalah layanan Artificial Intelligence dari Google yang memungkinkan aplikasi kita "berkomunikasi" dengan model AI.

Tanpa Gemini API:

```
Aplikasi
↓

Tidak bisa memahami bahasa manusia
```

Dengan Gemini API:

```
Aplikasi

↓

Gemini AI

↓

Jawaban AI
```

---

# Analogi Sederhana

Bayangkan Gemini adalah seorang asisten yang sangat pintar.

Kita tidak berbicara langsung.

Kita mengirim surat.

```
Program Kita

↓

Surat (Request)

↓

Gemini

↓

Balasan (Response)
```

Dalam dunia software:

Surat disebut:

HTTP Request

Balasan disebut:

HTTP Response

---

# 2. ARSITEKTUR GEMINI API

```
User

↓

Website / Apps Script

↓

HTTP Request

↓

Gemini API

↓

AI Processing

↓

HTTP Response

↓

Program Kita
```

---

# 3. KONSEP REQUEST & RESPONSE

Semua AI API bekerja menggunakan pola yang sama.

```
Request

↓

Processing

↓

Response
```

Contoh:

Request

```
"Halo Gemini,
jelaskan AI dalam 1 kalimat."
```

Response

```
"AI adalah teknologi yang memungkinkan komputer belajar dan mengambil keputusan berdasarkan data."
```

---

# 4. STRUKTUR REQUEST GEMINI

Request terdiri dari beberapa bagian penting.

| Bagian | Fungsi             |
| ------ | ------------------ |
| URL    | Alamat API         |
| Method | Jenis Request      |
| Header | Informasi Tambahan |
| Body   | Isi Permintaan     |

---

# URL

```
https://generativelanguage.googleapis.com
```

ibarat:

Alamat Rumah Gemini

---

# Method

Gemini menggunakan

```
POST
```

karena kita mengirim data.

---

# Header

Header berisi identitas request.

Contoh:

```
Content-Type

application/json
```

dan

```
x-goog-api-key
```

sebagai identitas pengguna API.

---

# Body

Body adalah isi pertanyaan.

Contoh:

```
Explain AI
```

atau

```
Ringkas artikel berikut
```

atau

```
Baca nota ini
```

---

# 5. MENGENAL PROMPT

Prompt adalah instruksi yang diberikan kepada AI.

Semakin jelas prompt,

semakin baik jawaban AI.

Contoh Prompt Buruk

```
Jelaskan AI
```

Contoh Prompt Baik

```
Jelaskan AI kepada siswa SMK
menggunakan bahasa sederhana
maksimal 3 kalimat.
```

---

# 6. CONTOH REQUEST (REST API)

```bash
curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
-H "x-goog-api-key: YOUR_API_KEY" \
-H "Content-Type: application/json" \
-d '{
  "model":"gemini-3.5-flash",
  "input":"Explain AI"
}'
```

Penjelasan:

curl

→ Program untuk mengirim HTTP Request

POST

→ Mengirim data

API Key

→ Identitas pengguna

model

→ Model AI yang digunakan

input

→ Prompt yang dikirim

---

# 7. CONTOH RESPONSE

```json
{
  "candidates": [
    {
      "content": {
        "parts": [
          {
            "text": "Artificial Intelligence adalah..."
          }
        ]
      }
    }
  ]
}
```

Struktur sederhananya:

```
Response

↓

Candidates

↓

Content

↓

Parts

↓

Text
```

Bagian yang paling sering digunakan adalah:

```
text
```

---

# 8. IMPLEMENTASI MENGGUNAKAN JAVASCRIPT (Browser / Node.js)

```javascript
async function askGemini() {

  // Endpoint Gemini API
  const url =
    "https://generativelanguage.googleapis.com/v1beta/interactions";

  // Mengirim request ke Gemini
  const response = await fetch(url, {

    // Method POST digunakan untuk mengirim data
    method: "POST",

    // Header berisi API Key dan tipe data
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": "YOUR_API_KEY"
    },

    // Body berisi model dan prompt
    body: JSON.stringify({

      model: "gemini-3.5-flash",

      input:
        "Jelaskan Artificial Intelligence."

    })

  });

  // Mengubah response menjadi object JavaScript
  const result =
    await response.json();

  console.log(result);

}
```

---

# 9. IMPLEMENTASI MENGGUNAKAN GOOGLE APPS SCRIPT

```javascript
function askGemini() {

  // URL endpoint Gemini API
  const url =
    "https://generativelanguage.googleapis.com/v1beta/interactions";

  // Konfigurasi request HTTP
  const options = {

    method: "post",

    contentType:
      "application/json",

    headers: {

      // API Key sebagai autentikasi
      "x-goog-api-key":
      "YOUR_API_KEY"

    },

    payload:
      JSON.stringify({

        model:
        "gemini-3.5-flash",

        input:
        "Apa itu AI?"

      })

  };

  // Mengirim request ke Gemini
  const response =
    UrlFetchApp.fetch(
      url,
      options
    );

  // Mengubah response menjadi object
  const json =
    JSON.parse(
      response.getContentText()
    );

  Logger.log(json);

}
```

---

# 10. PERBANDINGAN REST, JAVASCRIPT, DAN GAS

| Teknologi          | Digunakan Untuk             |
| ------------------ | --------------------------- |
| REST               | Testing API                 |
| JavaScript         | Website                     |
| Google Apps Script | Google Workspace Automation |

---

# 11. ALUR INTEGRASI AI

```
User

↓

Prompt

↓

HTTP Request

↓

Gemini API

↓

AI Processing

↓

HTTP Response

↓

Program
```

Semua integrasi AI bekerja menggunakan pola ini.

---

# CHEAT SHEET

## HTTP Method

| Method | Fungsi         |
| ------ | -------------- |
| GET    | Mengambil Data |
| POST   | Mengirim Data  |
| PUT    | Update Data    |
| DELETE | Menghapus Data |

---

## Header

| Header         | Fungsi         |
| -------------- | -------------- |
| Content-Type   | Format Data    |
| Authorization  | Token Login    |
| x-goog-api-key | API Key Gemini |

---

## Content Type

| Type                | Digunakan Untuk |
| ------------------- | --------------- |
| application/json    | JSON            |
| multipart/form-data | Upload File     |
| text/plain          | Text            |

---

## HTTP Status

| Status | Arti                 |
| ------ | -------------------- |
| 200    | Berhasil             |
| 400    | Request Salah        |
| 401    | API Key Salah        |
| 403    | Tidak Memiliki Akses |
| 404    | Endpoint Tidak Ada   |
| 500    | Server Error         |

---

## Model Gemini (Contoh)

| Model            | Kegunaan                                         |
| ---------------- | ------------------------------------------------ |
| gemini-3.5-flash | Cepat dan hemat biaya                            |
| gemini-3.5-pro   | Analisis kompleks                                |
| gemini-2.5-flash | Vision dan multimodal untuk workflow seperti OCR |

---

## Istilah Penting

| Istilah  | Penjelasan              |
| -------- | ----------------------- |
| Prompt   | Instruksi ke AI         |
| Model    | Mesin AI yang digunakan |
| Token    | Satuan pemrosesan teks  |
| API Key  | Identitas aplikasi      |
| Endpoint | Alamat layanan API      |
| Request  | Permintaan ke server    |
| Response | Jawaban dari server     |
| JSON     | Format pertukaran data  |

---

# Kesimpulan

Saat menggunakan Gemini API, ada tiga konsep yang harus selalu diingat:

1. **Prompt** menentukan kualitas jawaban AI.
2. **Request** adalah cara aplikasi mengirim instruksi ke Gemini.
3. **Response** adalah data yang dikembalikan Gemini untuk diproses oleh aplikasi.

Dengan memahami tiga konsep tersebut, peserta akan lebih mudah mengikuti materi lanjutan seperti integrasi Gemini Vision untuk membaca nota, ekstraksi data dokumen, pembuatan chatbot, hingga otomatisasi proses bisnis menggunakan Google Apps Script.
