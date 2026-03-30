// ═══════════════════════════════════════════════════════
// Google Apps Script — Deploy this as a Web App
// Saves lead brief MD files to Google Drive
// ═══════════════════════════════════════════════════════
//
// SETUP (one time, ~2 minutes):
// 1. Go to https://script.google.com
// 2. Click "New Project"
// 3. Paste this entire file
// 4. Click Deploy > New Deployment
// 5. Type = "Web app"
// 6. Execute as = "Me"
// 7. Who has access = "Anyone"
// 8. Click Deploy and authorize when prompted
// 9. Copy the Web App URL — paste it into the dashboard
//
// The folder "Client Cold Calling - Marketing Role Play"
// will be auto-created in your Drive on first use.
// ═══════════════════════════════════════════════════════

var FOLDER_NAME = 'Client Cold Calling - Marketing Role Play';

function getOrCreateFolder() {
  var folders = DriveApp.getFoldersByName(FOLDER_NAME);
  if (folders.hasNext()) {
    return folders.next();
  }
  return DriveApp.createFolder(FOLDER_NAME);
}

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var filename = data.filename || 'lead-brief.md';
    var content = data.content || '';

    var folder = getOrCreateFolder();

    // Check if file already exists — update it if so
    var existingFiles = folder.getFilesByName(filename);
    if (existingFiles.hasNext()) {
      var existing = existingFiles.next();
      existing.setContent(content);
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        fileId: existing.getId(),
        filename: filename,
        action: 'updated'
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // Create new file
    var file = folder.createFile(filename, content, 'text/markdown');

    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      fileId: file.getId(),
      filename: filename,
      action: 'created'
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// Allow GET for testing
function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: 'ok',
    message: 'Opterra Lead Brief Upload endpoint is running. Use POST to upload files.',
    folder: FOLDER_NAME
  })).setMimeType(ContentService.MimeType.JSON);
}
