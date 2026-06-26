// ============================================================
// 05 - Google Calendar Automation
// Membuat dan mengelola event Google Calendar dari Google Sheets
// ============================================================

// --- Konfigurasi ---
var CALENDAR_ID = 'primary';
var SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE';
var SHEET_NAME = 'Jadwal';
var REMINDER_MINUTES = 30;

// Indeks kolom di Spreadsheet (mulai dari 0)
var COL = {
  JUDUL: 0,
  DESKRIPSI: 1,
  TANGGAL_MULAI: 2,
  TANGGAL_SELESAI: 3,
  PESERTA: 4,
  EVENT_ID: 5  // Kolom ini akan diisi otomatis oleh script
};

/**
 * Membuat event Calendar secara massal dari data di Google Sheets.
 * Setiap baris (kecuali header) yang belum memiliki Event ID akan diproses.
 */
function createEventsFromSheet() {
  var sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);

  if (!sheet) {
    Logger.log('Sheet "' + SHEET_NAME + '" tidak ditemukan.');
    return;
  }

  var lastRow = sheet.getLastRow();
  if (lastRow <= 1) {
    Logger.log('Tidak ada data jadwal untuk diproses.');
    return;
  }

  var data = sheet.getRange(2, 1, lastRow - 1, 6).getValues();
  var calendar = CalendarApp.getCalendarById(CALENDAR_ID);
  var createdCount = 0;

  data.forEach(function(row, index) {
    var existingEventId = row[COL.EVENT_ID];
    if (existingEventId) return; // Sudah dibuat sebelumnya

    var judul = row[COL.JUDUL];
    var deskripsi = row[COL.DESKRIPSI] || '';
    var tanggalMulai = new Date(row[COL.TANGGAL_MULAI]);
    var tanggalSelesai = new Date(row[COL.TANGGAL_SELESAI]);
    var peserta = row[COL.PESERTA] ? String(row[COL.PESERTA]).split(',').map(function(e) { return e.trim(); }) : [];

    if (!judul || isNaN(tanggalMulai) || isNaN(tanggalSelesai)) {
      Logger.log('Baris ' + (index + 2) + ' dilewati karena data tidak lengkap.');
      return;
    }

    var event = calendar.createEvent(judul, tanggalMulai, tanggalSelesai, {
      description: deskripsi,
      guests: peserta.join(','),
      sendInvites: true
    });

    event.addEmailReminder(REMINDER_MINUTES);

    // Simpan Event ID kembali ke Spreadsheet
    sheet.getRange(index + 2, COL.EVENT_ID + 1).setValue(event.getId());
    createdCount++;
    Logger.log('Event dibuat: "' + judul + '" (' + event.getId() + ')');
  });

  Logger.log('Selesai. ' + createdCount + ' event berhasil dibuat.');
}

/**
 * Memperbarui event Calendar yang sudah ada berdasarkan perubahan data di Sheets.
 * Hanya baris yang sudah memiliki Event ID yang akan diperbarui.
 */
function updateEventsFromSheet() {
  var sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);

  if (!sheet) {
    Logger.log('Sheet "' + SHEET_NAME + '" tidak ditemukan.');
    return;
  }

  var lastRow = sheet.getLastRow();
  if (lastRow <= 1) return;

  var data = sheet.getRange(2, 1, lastRow - 1, 6).getValues();
  var calendar = CalendarApp.getCalendarById(CALENDAR_ID);
  var updatedCount = 0;

  data.forEach(function(row, index) {
    var eventId = row[COL.EVENT_ID];
    if (!eventId) return;

    try {
      var event = calendar.getEventById(eventId);
      if (!event) {
        Logger.log('Event ID ' + eventId + ' tidak ditemukan di Calendar.');
        return;
      }

      event.setTitle(row[COL.JUDUL]);
      event.setDescription(row[COL.DESKRIPSI] || '');
      event.setTime(new Date(row[COL.TANGGAL_MULAI]), new Date(row[COL.TANGGAL_SELESAI]));
      updatedCount++;
      Logger.log('Event diperbarui: "' + row[COL.JUDUL] + '"');
    } catch (e) {
      Logger.log('Gagal memperbarui event di baris ' + (index + 2) + ': ' + e.message);
    }
  });

  Logger.log('Selesai. ' + updatedCount + ' event berhasil diperbarui.');
}

/**
 * Membatalkan (menghapus) event Calendar berdasarkan Event ID di Sheets.
 * Event ID pada Spreadsheet akan dikosongkan setelah penghapusan.
 */
function cancelEventsFromSheet() {
  var sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);

  if (!sheet) {
    Logger.log('Sheet "' + SHEET_NAME + '" tidak ditemukan.');
    return;
  }

  var lastRow = sheet.getLastRow();
  if (lastRow <= 1) return;

  var data = sheet.getRange(2, 1, lastRow - 1, 6).getValues();
  var calendar = CalendarApp.getCalendarById(CALENDAR_ID);
  var cancelledCount = 0;

  data.forEach(function(row, index) {
    var eventId = row[COL.EVENT_ID];
    if (!eventId) return;

    try {
      var event = calendar.getEventById(eventId);
      if (event) {
        event.deleteEvent();
        sheet.getRange(index + 2, COL.EVENT_ID + 1).clearContent();
        cancelledCount++;
        Logger.log('Event dibatalkan: "' + row[COL.JUDUL] + '"');
      }
    } catch (e) {
      Logger.log('Gagal membatalkan event di baris ' + (index + 2) + ': ' + e.message);
    }
  });

  Logger.log('Selesai. ' + cancelledCount + ' event berhasil dibatalkan.');
}

/**
 * Mengirimkan pengingat manual via email kepada peserta event yang akan berlangsung
 * dalam waktu 24 jam ke depan.
 */
function sendUpcomingEventReminders() {
  var calendar = CalendarApp.getCalendarById(CALENDAR_ID);
  var now = new Date();
  var tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  var events = calendar.getEvents(now, tomorrow);
  Logger.log('Ditemukan ' + events.length + ' event dalam 24 jam ke depan.');

  events.forEach(function(event) {
    var guests = event.getGuestList();
    var startTime = Utilities.formatDate(event.getStartTime(), Session.getScriptTimeZone(), 'dd MMMM yyyy HH:mm');

    guests.forEach(function(guest) {
      var email = guest.getEmail();
      var subject = 'Pengingat: ' + event.getTitle() + ' - ' + startTime;
      var body = 'Halo,\n\nIni adalah pengingat bahwa event berikut akan segera berlangsung:\n\n'
        + 'Judul  : ' + event.getTitle() + '\n'
        + 'Waktu  : ' + startTime + '\n'
        + 'Lokasi : ' + (event.getLocation() || '-') + '\n\n'
        + event.getDescription() + '\n\n'
        + 'Salam,\nGoogle Calendar Automation';

      GmailApp.sendEmail(email, subject, body);
      Logger.log('Pengingat dikirim ke ' + email + ' untuk event "' + event.getTitle() + '".');
    });
  });
}
