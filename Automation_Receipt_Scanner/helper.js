/**
 * =========================================================================
 * FUNGSI HELPER & LOGIKA PROSES (GEMINI VISION & SPREADSHEET)
 * =========================================================================
 * File ini berisi fungsi-fungsi pembantu (helper) untuk mengolah data struk,
 * mengirimkannya ke AI Gemini Vision untuk dianalisis, lalu menyimpan hasilnya
 * ke dalam lembar kerja Buku Besar (Ledger).
 */

/**
 * 1. FUNGSI UNTUK MENGEKSTRAK ID FILE DARI URL GOOGLE DRIVE
 * [IT]: Fungsi ini menerima URL Google Drive dan mengembalikan ID unik dari file tersebut.
 * ID file ini diperlukan karena Google Apps Script membutuhkan ID (bukan URL lengkap)
 * untuk bisa membuka atau memodifikasi file di Google Drive.
 *
 * @param {string} url - URL lengkap dari file di Google Drive.
 * @returns {string} ID unik file Google Drive.
 */
function getFileId(url) {
  // [IT]: Regular Expression (RegEx) patterns untuk mencocokkan pola URL Google Drive.
  // Ada 2 pola umum URL file Drive:
  // - Pola 1: URL dengan parameter query "id=" (misal: ...?id=XXXXX)
  // - Pola 2: URL dengan struktur path "/d/XXXXX/" (misal: .../d/XXXXX/view)
  const patterns = [/id=([^&]+)/, /\/d\/([^/]+)\//];

  // [IT]: Melakukan perulangan (loop) untuk memeriksa pola satu per satu.
  for (const pattern of patterns) {
    // [IT]: Mencoba mencocokkan URL dengan pola regex saat ini.
    const match = url.match(pattern);

    // [IT]: Jika cocok (match ditemukan), kembalikan grup tangkapan pertama (ID file).
    if (match) {
      return match[1];
    }
  }

  // [IT]: Jika tidak ada pola yang cocok, lemparkan Error (exception) agar sistem tahu ada masalah.
  throw new Error("File ID tidak ditemukan pada URL yang diberikan");
}

/**
 * 2. FUNGSI UNTUK MENGAMBIL OBJEK FILE DARI DRIVE BERDASARKAN URL
 * [IT]: Fungsi ini menjembatani URL teks menjadi Objek File aktual yang bisa dibaca datanya.
 *
 * @param {string} url - URL lengkap dari file di Google Drive.
 * @returns {DriveApp.File} Objek File Google Drive.
 */
function getFileFromUrl(url) {
  // [IT]: Ekstrak ID file dari URL menggunakan fungsi getFileId yang telah dibuat di atas.
  const fileId = getFileId(url);

  // [IT]: Menggunakan layanan bawaan Google Apps Script 'DriveApp' untuk mengambil
  // file dari Google Drive berdasarkan ID-nya.
  return DriveApp.getFileById(fileId);
}

/**
 * 3. FUNGSI UTAMA UNTUK MEMPROSES STRUK BELANJA DENGAN GEMINI AI VISION
 * [IT]: Fungsi ini mengambil file gambar dari Drive, mengubahnya menjadi format biner (Base64),
 * menyusun instruksi (prompt), mengirimkannya ke server Google Gemini AI via HTTP POST Request,
 * lalu meneruskan hasilnya untuk disimpan.
 *
 * [Akuntansi]: Fungsi ini mewakili proses "Membaca, memeriksa, dan mengklasifikasikan nota belanja"
 * yang biasanya dilakukan secara manual oleh staff akuntan/keuangan.
 */
function processReceipt(timestamp, employee, department, fileUrl) {
  // [IT]: Ambil objek file dari URL menggunakan fungsi pembantu kita.
  const file = getFileFromUrl(fileUrl);

  // [IT]: Ambil data file sebagai 'Blob' (Binary Large Object - tipe data untuk menyimpan data biner file).
  const blob = file.getBlob();

  // [IT]: Ubah data biner file gambar menjadi teks berformat Base64.
  // Hal ini wajib dilakukan karena kita mengirim data gambar melalui format JSON (yang berupa teks).
  const base64 = Utilities.base64Encode(blob.getBytes());

  // [IT]: Menyusun Payload JSON (data kiriman) sesuai spesifikasi API Gemini.
  const payload = {
    model: GEMINI_MODEL,
    input: [
      {
        // [IT/Akuntansi]: Menyusun instruksi (prompt) dalam bahasa alami agar AI
        // mengembalikan data dalam format terstruktur (JSON) dengan kolom-kolom akuntansi penting.
        // [PENTING]: Kita menginstruksikan AI untuk menghapus tanda pemisah ribuan (titik) agar nominal
        // tidak disalahartikan sebagai desimal global (misal Rp 43.500 menjadi 43.5), dan
        // mengembalikannya sebagai angka bulat murni (integer).
        type: "text",
        text: `
          Baca nota ini. Ekstrak informasi penting dan kembalikan hanya dalam format JSON.
          PENTING: Pada kolom "total", hapus semua simbol mata uang (seperti Rp, Rupiah) dan tanda pemisah ribuan (titik atau koma). Kembalikan nilai total belanja hanya sebagai angka bulat (integer) murni. Contoh: jika tertera "Rp 43.500" atau "43.500", kembalikan 43500.

          Return JSON ONLY:

          {
            "store_name":"",
            "date":"",
            "total":"",
            "category":""
          }
        `,
      },
      {
        // [IT]: Menyisipkan data gambar struk yang sudah di-encode ke Base64 beserta tipe MIME-nya (misal: image/jpeg, image/png).
        type: "image",
        mime_type: blob.getContentType(),
        data: base64,
      },
    ],
  };

  // [IT]: Melakukan HTTP POST request ke API Gemini menggunakan 'UrlFetchApp'.
  // Kita menyertakan API Key dalam Header permintaan sebagai metode otentikasi.
  const response = UrlFetchApp.fetch(GEMINI_API_URL, {
    method: "post",
    contentType: "application/json",
    headers: {
      "X-goog-api-key": GEMINI_API_KEY,
    },
    payload: JSON.stringify(payload), // Mengubah objek Javascript menjadi teks JSON agar bisa dikirim melalui jaringan.
  });

  // [IT]: Mengurai (parse) respon teks dari server API Gemini kembali menjadi Objek Javascript.
  const result = JSON.parse(response.getContentText());

  // [IT]: Mengambil teks hasil jawaban AI dari struktur objek respon Gemini yang berlapis.
  const text = result.steps[1].content[0].text;

  Logger.log(text);

  // [IT/Akuntansi]: Mengirimkan data dasar dan teks hasil analisis AI ke fungsi saveLedger untuk dicatat.
  saveLedger(timestamp, employee, department, fileUrl, text);
}

/**
 * 4. FUNGSI UNTUK MENYIMPAN HASIL EKSTRAKSI KE BUKU BESAR (LEDGER) SPREADSHEET
 * [Akuntansi]: Fungsi ini mewakili proses penjurnalan / pencatatan akhir transaksi ke dalam Buku Besar (Ledger).
 * Setiap kolom mewakili detail transaksi penting: Kapan diajukan, Siapa, Departemen, Tanggal Nota,
 * Nama Toko, Jumlah Nominal (Total), Kategori Pengeluaran, dan Bukti Fisik (File URL).
 *
 * [IT]: Fungsi ini membersihkan format teks respon dari AI (menghapus tag markdown),
 * mengonversinya menjadi objek JSON, dan menuliskan data tersebut ke baris baru di Google Sheets.
 */
function saveLedger(timestamp, employee, department, fileUrl, aiText) {
  // [IT]: Membersihkan tag pembuka ```json dan penutup ``` yang sering disertakan oleh model AI
  // agar teks murni berupa JSON yang valid untuk di-parse.
  const clean = aiText
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  // [IT]: Mengonversi string JSON bersih menjadi Objek Javascript agar propertinya bisa diakses langsung (seperti data.date, data.total, dll).
  const data = JSON.parse(clean);

  // [IT]: Mengakses Spreadsheet aktif saat ini dan memilih lembar kerja (sheet) berdasarkan nama konstanta LEDGER_SHEET ("Ledger").
  const sheet =
    SpreadsheetApp.getActiveSpreadsheet().getSheetByName(LEDGER_SHEET);

  // [Akuntansi/IT]: Menambahkan baris baru di bagian bawah sheet Buku Besar (Ledger).
  // Kolom diisi berurutan sesuai struktur Ledger yang direncanakan:
  // Kolom 1: Waktu Pengajuan Form (Timestamp)
  // Kolom 2: Nama Karyawan
  // Kolom 3: Departemen
  // Kolom 4: Tanggal yang tertera pada Struk Belanja (Hasil Ekstraksi AI)
  // Kolom 5: Nama Toko/Vendor tempat belanja (Hasil Ekstraksi AI)
  // Kolom 6: Total nominal pengeluaran/belanja (Hasil Ekstraksi AI)
  // Kolom 7: Kategori pengeluaran, misal Konsumsi, Transportasi (Hasil Ekstraksi AI)
  // Kolom 8: URL Bukti Transaksi di Google Drive
  sheet.appendRow([
    timestamp,
    employee,
    department,
    data.date,
    data.store_name,
    data.total,
    data.category,
    fileUrl,
  ]);
}
