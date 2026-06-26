// ============================================================
// 02 - Form Response Handler
// Memproses respons Google Form dan menyimpannya ke Sheets
// ============================================================

// --- Konfigurasi ---
var SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE';
var MAIN_SHEET_NAME = 'Respons';
var CONFIRMATION_SUBJECT = 'Konfirmasi: Form Anda Telah Diterima';

/**
 * Trigger utama yang dijalankan setiap kali ada respons baru pada Google Form.
 * Daftarkan fungsi ini sebagai trigger "On Form Submit".
 * @param {Object} e - Event object dari form submit.
 */
function onFormSubmit(e) {
  var responses = e.response;
  var itemResponses = responses.getItemResponses();
  var respondentEmail = responses.getRespondentEmail();
  var timestamp = responses.getTimestamp();

  var rowData = buildRowData(itemResponses, timestamp);
  saveToSheet(rowData);

  if (respondentEmail) {
    sendConfirmationEmail(respondentEmail, itemResponses);
  }

  Logger.log('Respons dari ' + (respondentEmail || 'anonim') + ' berhasil diproses.');
}

/**
 * Membangun array data baris dari item respons form.
 * @param {Array} itemResponses - Array respons item form.
 * @param {Date} timestamp - Waktu pengisian form.
 * @return {Array} Array berisi data untuk satu baris di Sheets.
 */
function buildRowData(itemResponses, timestamp) {
  var row = [Utilities.formatDate(timestamp, Session.getScriptTimeZone(), 'dd/MM/yyyy HH:mm:ss')];
  itemResponses.forEach(function(item) {
    var answer = item.getResponse();
    if (Array.isArray(answer)) {
      row.push(answer.join(', '));
    } else {
      row.push(answer || '');
    }
  });
  return row;
}

/**
 * Menyimpan data baris ke sheet tujuan di Spreadsheet.
 * Jika header belum ada, otomatis membuat baris header.
 * @param {Array} rowData - Data baris yang akan disimpan.
 */
function saveToSheet(rowData) {
  var spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = spreadsheet.getSheetByName(MAIN_SHEET_NAME);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(MAIN_SHEET_NAME);
  }

  sheet.appendRow(rowData);
  Logger.log('Data berhasil disimpan ke sheet "' + MAIN_SHEET_NAME + '".');
}

/**
 * Mengirimkan email konfirmasi kepada responden setelah mengisi form.
 * @param {string} email - Alamat email responden.
 * @param {Array} itemResponses - Array respons item untuk disertakan di email.
 */
function sendConfirmationEmail(email, itemResponses) {
  var summaryLines = itemResponses.map(function(item) {
    var answer = item.getResponse();
    var displayAnswer = Array.isArray(answer) ? answer.join(', ') : (answer || '-');
    return '<li><strong>' + item.getItem().getTitle() + ':</strong> ' + displayAnswer + '</li>';
  });

  var htmlBody = '<p>Terima kasih! Respons Anda telah kami terima.</p>'
    + '<p>Berikut ringkasan jawaban Anda:</p>'
    + '<ul>' + summaryLines.join('') + '</ul>'
    + '<p style="color:#888;font-size:12px;">Email ini dikirim secara otomatis oleh Google Apps Script.</p>';

  var plainBody = 'Terima kasih! Respons Anda telah kami terima.\n\n'
    + itemResponses.map(function(item) {
        var answer = item.getResponse();
        return item.getItem().getTitle() + ': ' + (Array.isArray(answer) ? answer.join(', ') : (answer || '-'));
      }).join('\n');

  GmailApp.sendEmail(email, CONFIRMATION_SUBJECT, plainBody, {
    htmlBody: htmlBody,
    name: 'Form Handler'
  });

  Logger.log('Email konfirmasi dikirim ke ' + email);
}
