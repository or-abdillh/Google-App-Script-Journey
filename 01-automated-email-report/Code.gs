// ============================================================
// 01 - Automated Email Report
// Mengirim laporan otomatis via Gmail dari data Google Sheets
// ============================================================

// --- Konfigurasi ---
var SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE';
var SHEET_NAME = 'Laporan';
var RECIPIENT_EMAIL = 'recipient@example.com';
var EMAIL_SUBJECT = 'Laporan Otomatis - ' + Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'dd MMMM yyyy');

/**
 * Fungsi utama: membaca data dari Sheets dan mengirimkan email laporan.
 * Daftarkan fungsi ini sebagai Time-driven Trigger untuk pengiriman terjadwal.
 */
function sendEmailReport() {
  var spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = spreadsheet.getSheetByName(SHEET_NAME);

  if (!sheet) {
    Logger.log('Sheet "' + SHEET_NAME + '" tidak ditemukan.');
    return;
  }

  var data = sheet.getDataRange().getValues();

  if (data.length <= 1) {
    Logger.log('Tidak ada data untuk dilaporkan.');
    return;
  }

  var headers = data[0];
  var rows = data.slice(1);

  var htmlBody = buildHtmlTable(headers, rows);
  var plainBody = buildPlainTextTable(headers, rows);

  GmailApp.sendEmail(RECIPIENT_EMAIL, EMAIL_SUBJECT, plainBody, {
    htmlBody: htmlBody,
    name: 'Laporan Otomatis'
  });

  Logger.log('Email laporan berhasil dikirim ke ' + RECIPIENT_EMAIL);
}

/**
 * Membangun tabel HTML dari data Sheets untuk isi email.
 * @param {Array} headers - Baris header.
 * @param {Array} rows - Baris data.
 * @return {string} String HTML tabel.
 */
function buildHtmlTable(headers, rows) {
  var style = 'style="border-collapse:collapse;width:100%;font-family:Arial,sans-serif;"';
  var thStyle = 'style="background-color:#4285F4;color:#fff;padding:8px 12px;text-align:left;border:1px solid #ddd;"';
  var tdStyle = 'style="padding:8px 12px;border:1px solid #ddd;"';
  var trEvenStyle = 'style="background-color:#f9f9f9;"';

  var html = '<h2 style="color:#4285F4;">Laporan Data</h2>';
  html += '<p>Berikut adalah laporan data per ' + Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'dd MMMM yyyy HH:mm') + ':</p>';
  html += '<table ' + style + '><thead><tr>';

  headers.forEach(function(header) {
    html += '<th ' + thStyle + '>' + header + '</th>';
  });

  html += '</tr></thead><tbody>';

  rows.forEach(function(row, index) {
    var rowStyle = index % 2 === 1 ? trEvenStyle : '';
    html += '<tr ' + rowStyle + '>';
    row.forEach(function(cell) {
      var value = cell instanceof Date
        ? Utilities.formatDate(cell, Session.getScriptTimeZone(), 'dd/MM/yyyy')
        : cell;
      html += '<td ' + tdStyle + '>' + value + '</td>';
    });
    html += '</tr>';
  });

  html += '</tbody></table>';
  html += '<p style="color:#888;font-size:12px;">Email ini dikirim secara otomatis oleh Google Apps Script.</p>';
  return html;
}

/**
 * Membangun tabel plain text dari data Sheets sebagai fallback email.
 * @param {Array} headers - Baris header.
 * @param {Array} rows - Baris data.
 * @return {string} String tabel plain text.
 */
function buildPlainTextTable(headers, rows) {
  var lines = [];
  lines.push('Laporan Data - ' + Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'dd MMMM yyyy'));
  lines.push(headers.join('\t'));
  rows.forEach(function(row) {
    lines.push(row.map(function(cell) {
      return cell instanceof Date
        ? Utilities.formatDate(cell, Session.getScriptTimeZone(), 'dd/MM/yyyy')
        : cell;
    }).join('\t'));
  });
  return lines.join('\n');
}
