/**
 * =========================================================================
 * KONFIGURASI SISTEM OTOMASI KLAIM REIMBURSEMENT
 * =========================================================================
 * File ini menyimpan variabel penting (konfigurasi) yang digunakan oleh sistem.
 * 
 * Untuk Siswa SMK:
 * - Jurusan IT/RPL: Konfigurasi global diletakkan di satu tempat agar mudah 
 *   diubah tanpa perlu mengutak-atik logika utama program di file lainnya.
 * - Jurusan Akuntansi: Ini seperti menetapkan parameter dasar keuangan, 
 *   seperti menentukan buku besar mana yang akan digunakan untuk pencatatan.
 */

// 1. Kunci Keamanan API Gemini (API Key)
// [IT]: Token otentikasi rahasia untuk memberi tahu server Google bahwa 
// aplikasi kita diizinkan menggunakan model kecerdasan buatan Gemini. Jangan 
// sebarkan kunci ini karena bersifat rahasia seperti password.
const GEMINI_API_KEY = "YOUR_GEMINI_API_KEY";

// 2. Alamat Endpoint API Gemini
// [IT]: URL tujuan (endpoint) untuk mengirimkan request analisis gambar struk. 
// Di sini kita memanggil model 'gemini-flash-latest' yang dioptimalkan untuk 
// kecepatan proses (kecepatan respon tinggi).
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent";

// 3. Nama Sheet Buku Besar (Ledger)
// [Akuntansi]: Buku Besar (Ledger) adalah tempat mencatat akumulasi transaksi.
// [IT]: Nama lembar kerja (sheet) di Google Sheets tempat program akan menulis 
// data hasil ekstraksi struk belanja. Nama ini harus sama persis dengan tab di Sheets.
const LEDGER_SHEET = "Ledger";
