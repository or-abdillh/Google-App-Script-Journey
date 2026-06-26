/**
 * =========================================================================
 * ALUR UTAMA: TRIGGER GOOGLE FORM SUBMIT
 * =========================================================================
 * File ini bertindak sebagai gerbang masuk pertama (entry point) ketika karyawan
 * mengirimkan formulir klaim reimbursement melalui Google Forms.
 * 
 * Hubungan Akuntansi & IT:
 * - [Akuntansi]: Ini mewakili proses penyerahan formulir klaim fisik oleh karyawan
 *   ke bagian keuangan/administrasi, namun kini diotomatiskan secara digital.
 * - [IT]: Fungsi onFormSubmit adalah fungsi khusus (Trigger) yang otomatis
 *   dieksekusi oleh sistem Google Apps Script setiap kali ada event submit form.
 */

/**
 * Fungsi pemicu (Trigger) ketika form diserahkan oleh pengguna.
 * @param {Object} e - Event Object yang disediakan oleh Google Sheets secara otomatis.
 *                     Objek ini menyimpan semua data jawaban dari Google Form yang baru disubmit.
 */
function onFormSubmit(e) {

  // [IT]: Mengambil seluruh nilai baris (row) baru dalam bentuk Array.
  // Setiap kolom jawaban dari formulir akan disimpan dalam elemen array ini.
  const row = e.values;

  // [IT]: Membaca elemen array berdasarkan indeks-nya (dimulai dari 0).
  // [Akuntansi]: Menyimpan data dasar administrasi penyerahan klaim.
  
  // Indeks 0: Tanggal & Waktu penyerahan (Timestamp) dibuat otomatis oleh Google Form.
  const timestamp = row[0];
  
  // Indeks 1: Nama Karyawan yang mengajukan reimbursement.
  const employee = row[1];
  
  // Indeks 2: Divisi/Departemen tempat karyawan bekerja (IT, Marketing, Finance, dll).
  const department = row[2];

  // Indeks 3: URL/Link file foto struk belanja yang telah diunggah ke Google Drive.
  const fileUrl = row[3];

  // [IT]: Memanggil fungsi utama untuk memproses struk belanja menggunakan AI Gemini.
  // Kita meneruskan semua parameter penting ini ke fungsi processReceipt yang didefinisikan di helper.gs.
  processReceipt(
    timestamp,
    employee,
    department,
    fileUrl
  );

}

