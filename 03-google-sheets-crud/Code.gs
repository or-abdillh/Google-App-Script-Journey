// ============================================================
// 03 - Google Sheets CRUD Operations
// Operasi Create, Read, Update, Delete pada Google Sheets
// ============================================================

// --- Konfigurasi ---
var SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE';
var SHEET_NAME = 'Data';
var HEADER_ROW = 1;

// Kolom header yang digunakan (sesuaikan dengan Spreadsheet Anda)
var COLUMNS = {
  ID: 1,
  NAMA: 2,
  EMAIL: 3,
  TANGGAL: 4
};

/**
 * Mendapatkan sheet target.
 * @return {Sheet} Objek sheet Google Sheets.
 */
function getSheet() {
  var spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = spreadsheet.getSheetByName(SHEET_NAME);
  if (!sheet) {
    throw new Error('Sheet "' + SHEET_NAME + '" tidak ditemukan.');
  }
  return sheet;
}

/**
 * Membuat baris data baru di sheet.
 * @param {string} nama - Nama.
 * @param {string} email - Alamat email.
 * @return {string} ID unik yang dibuat untuk baris baru.
 */
function createRow(nama, email) {
  var sheet = getSheet();
  var newId = generateId();
  var tanggal = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'dd/MM/yyyy HH:mm:ss');

  sheet.appendRow([newId, nama, email, tanggal]);
  Logger.log('Baris baru dibuat dengan ID: ' + newId);
  return newId;
}

/**
 * Membaca seluruh data dari sheet (kecuali baris header).
 * @return {Array<Object>} Array of object yang merepresentasikan setiap baris data.
 */
function readAllRows() {
  var sheet = getSheet();
  var lastRow = sheet.getLastRow();

  if (lastRow <= HEADER_ROW) {
    Logger.log('Tidak ada data di sheet.');
    return [];
  }

  var dataRange = sheet.getRange(HEADER_ROW + 1, 1, lastRow - HEADER_ROW, sheet.getLastColumn());
  var values = dataRange.getValues();

  return values.map(function(row) {
    return {
      id: row[COLUMNS.ID - 1],
      nama: row[COLUMNS.NAMA - 1],
      email: row[COLUMNS.EMAIL - 1],
      tanggal: row[COLUMNS.TANGGAL - 1]
    };
  });
}

/**
 * Mencari baris berdasarkan ID.
 * @param {string} id - ID baris yang dicari.
 * @return {Object|null} Objek data baris atau null jika tidak ditemukan.
 */
function findRowById(id) {
  var sheet = getSheet();
  var idColumn = sheet.getRange(1, COLUMNS.ID, sheet.getLastRow(), 1).getValues();

  for (var i = HEADER_ROW; i < idColumn.length; i++) {
    if (String(idColumn[i][0]) === String(id)) {
      var rowNumber = i + 1;
      var rowData = sheet.getRange(rowNumber, 1, 1, sheet.getLastColumn()).getValues()[0];
      return {
        rowNumber: rowNumber,
        id: rowData[COLUMNS.ID - 1],
        nama: rowData[COLUMNS.NAMA - 1],
        email: rowData[COLUMNS.EMAIL - 1],
        tanggal: rowData[COLUMNS.TANGGAL - 1]
      };
    }
  }

  return null;
}

/**
 * Memperbarui data baris berdasarkan ID.
 * @param {string} id - ID baris yang akan diperbarui.
 * @param {string} newNama - Nama baru.
 * @param {string} newEmail - Email baru.
 * @return {boolean} true jika berhasil, false jika ID tidak ditemukan.
 */
function updateRow(id, newNama, newEmail) {
  var found = findRowById(id);

  if (!found) {
    Logger.log('ID ' + id + ' tidak ditemukan.');
    return false;
  }

  var sheet = getSheet();
  sheet.getRange(found.rowNumber, COLUMNS.NAMA).setValue(newNama);
  sheet.getRange(found.rowNumber, COLUMNS.EMAIL).setValue(newEmail);
  Logger.log('Baris dengan ID ' + id + ' berhasil diperbarui.');
  return true;
}

/**
 * Menghapus baris berdasarkan ID.
 * @param {string} id - ID baris yang akan dihapus.
 * @return {boolean} true jika berhasil, false jika ID tidak ditemukan.
 */
function deleteRow(id) {
  var found = findRowById(id);

  if (!found) {
    Logger.log('ID ' + id + ' tidak ditemukan.');
    return false;
  }

  getSheet().deleteRow(found.rowNumber);
  Logger.log('Baris dengan ID ' + id + ' berhasil dihapus.');
  return true;
}

/**
 * Membuat ID unik berbasis timestamp dan bilangan acak.
 * @return {string} ID unik sebagai string.
 */
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 7);
}

// --- Fungsi pengujian manual ---

/** Contoh penggunaan: tambah data baru */
function testCreate() {
  var id = createRow('Budi Santoso', 'budi@example.com');
  Logger.log('ID baru: ' + id);
}

/** Contoh penggunaan: baca semua data */
function testReadAll() {
  var rows = readAllRows();
  Logger.log(JSON.stringify(rows, null, 2));
}

/** Contoh penggunaan: update data (ganti dengan ID yang valid) */
function testUpdate() {
  updateRow('GANTI_DENGAN_ID_VALID', 'Budi S. (Updated)', 'budi.updated@example.com');
}

/** Contoh penggunaan: hapus data (ganti dengan ID yang valid) */
function testDelete() {
  deleteRow('GANTI_DENGAN_ID_VALID');
}
