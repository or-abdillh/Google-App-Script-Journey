// ============================================================
// 04 - Google Drive File Manager
// Mengelola file dan folder di Google Drive secara otomatis
// ============================================================

// --- Konfigurasi ---
var ROOT_FOLDER_ID = 'YOUR_ROOT_FOLDER_ID_HERE';
var REPORT_SPREADSHEET_ID = 'YOUR_REPORT_SPREADSHEET_ID_HERE';
var REPORT_SHEET_NAME = 'Inventaris File';
var MAX_FILE_AGE_DAYS = 30;

/**
 * Membuat struktur folder baru di dalam folder root.
 * @param {string} folderName - Nama folder yang akan dibuat.
 * @return {Folder} Objek folder yang baru dibuat.
 */
function createFolder(folderName) {
  var rootFolder = DriveApp.getFolderById(ROOT_FOLDER_ID);
  var newFolder = rootFolder.createFolder(folderName);
  Logger.log('Folder "' + folderName + '" berhasil dibuat. ID: ' + newFolder.getId());
  return newFolder;
}

/**
 * Mencari file di seluruh Drive berdasarkan kata kunci pada nama file.
 * @param {string} keyword - Kata kunci pencarian.
 * @return {Array<Object>} Array informasi file yang cocok.
 */
function searchFilesByName(keyword) {
  var results = [];
  var files = DriveApp.searchFiles('title contains "' + keyword + '"');

  while (files.hasNext()) {
    var file = files.next();
    results.push({
      id: file.getId(),
      name: file.getName(),
      mimeType: file.getMimeType(),
      size: file.getSize(),
      createdDate: Utilities.formatDate(file.getDateCreated(), Session.getScriptTimeZone(), 'dd/MM/yyyy'),
      url: file.getUrl()
    });
  }

  Logger.log('Ditemukan ' + results.length + ' file dengan kata kunci "' + keyword + '".');
  return results;
}

/**
 * Memindahkan file ke folder tujuan.
 * @param {string} fileId - ID file yang akan dipindahkan.
 * @param {string} targetFolderId - ID folder tujuan.
 */
function moveFile(fileId, targetFolderId) {
  var file = DriveApp.getFileById(fileId);
  var targetFolder = DriveApp.getFolderById(targetFolderId);

  // Hapus file dari semua folder asal
  var parentFolders = file.getParents();
  while (parentFolders.hasNext()) {
    parentFolders.next().removeFile(file);
  }

  targetFolder.addFile(file);
  Logger.log('File "' + file.getName() + '" berhasil dipindahkan ke "' + targetFolder.getName() + '".');
}

/**
 * Menghasilkan laporan inventaris file di dalam folder root ke Google Sheets.
 * Laporan mencakup nama, tipe, ukuran, dan tanggal file.
 */
function generateFileReport() {
  var spreadsheet = SpreadsheetApp.openById(REPORT_SPREADSHEET_ID);
  var sheet = spreadsheet.getSheetByName(REPORT_SHEET_NAME);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(REPORT_SHEET_NAME);
  }

  sheet.clearContents();

  var headers = ['Nama File', 'Tipe MIME', 'Ukuran (bytes)', 'Tanggal Dibuat', 'URL'];
  sheet.appendRow(headers);

  var rootFolder = DriveApp.getFolderById(ROOT_FOLDER_ID);
  var fileCount = appendFilesFromFolder(sheet, rootFolder, 0);

  // Format header
  var headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setBackground('#4285F4');
  headerRange.setFontColor('#ffffff');
  headerRange.setFontWeight('bold');

  sheet.autoResizeColumns(1, headers.length);
  Logger.log('Laporan inventaris selesai dibuat. Total: ' + fileCount + ' file.');
}

/**
 * Rekursi menambahkan file dari folder (termasuk sub-folder) ke sheet.
 * @param {Sheet} sheet - Sheet tujuan.
 * @param {Folder} folder - Folder yang akan di-scan.
 * @param {number} count - Jumlah file yang sudah diproses.
 * @return {number} Jumlah total file yang diproses.
 */
function appendFilesFromFolder(sheet, folder, count) {
  var files = folder.getFiles();

  while (files.hasNext()) {
    var file = files.next();
    sheet.appendRow([
      file.getName(),
      file.getMimeType(),
      file.getSize(),
      Utilities.formatDate(file.getDateCreated(), Session.getScriptTimeZone(), 'dd/MM/yyyy HH:mm'),
      file.getUrl()
    ]);
    count++;
  }

  var subFolders = folder.getFolders();
  while (subFolders.hasNext()) {
    count = appendFilesFromFolder(sheet, subFolders.next(), count);
  }

  return count;
}

/**
 * Menghapus file-file dalam folder root yang usianya melebihi MAX_FILE_AGE_DAYS.
 * File akan dipindahkan ke Trash, bukan dihapus permanen.
 * Catatan: fungsi ini hanya memproses file di folder root secara langsung
 * (tidak rekursif ke sub-folder). Gunakan secara hati-hati agar tidak
 * menghapus file di sub-folder yang tidak diinginkan.
 */
function cleanOldFiles() {
  var rootFolder = DriveApp.getFolderById(ROOT_FOLDER_ID);
  var files = rootFolder.getFiles();
  var cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - MAX_FILE_AGE_DAYS);
  var deletedCount = 0;

  while (files.hasNext()) {
    var file = files.next();
    if (file.getDateCreated() < cutoffDate) {
      file.setTrashed(true);
      deletedCount++;
      Logger.log('File dipindahkan ke Trash: ' + file.getName());
    }
  }

  Logger.log('Selesai. ' + deletedCount + ' file dipindahkan ke Trash.');
}
