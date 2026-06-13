const SHEET_NAME = "data";

function doGet(e) {
  const phone = e.parameter.phone;
  if (!phone) return send({ found: false });

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  if (!sheet) return send({ found: false });

  const rows = sheet.getDataRange().getValues();
  // scan newest → oldest (row 0 is header)
  for (let i = rows.length - 1; i >= 1; i--) {
    if (String(rows[i][2]) === String(phone)) {
      return send({ found: true, fullName: rows[i][1], email: rows[i][3] });
    }
  }
  return send({ found: false });
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.getActiveSpreadsheet()
                    .getSheetByName(SHEET_NAME);

    if (!sheet) {
      throw new Error("Sheet tab '" + SHEET_NAME + "' not found");
    }

    // Write the row immediately — don't let signature block it
    sheet.appendRow([
      new Date(data.timestamp || Date.now()),
      data.fullName  || "",
      data.phone     || "",
      data.email     || "",
      new Date(data.date || Date.now()).toLocaleDateString("en-IN"),
      "pending...",
    ]);

    // Save signature to Drive and backfill the cell
    const lastRow = sheet.getLastRow();
    try {
      if (data.signature) {
        const base64 = data.signature.replace(/^data:image\/\w+;base64,/, "");
        const blob = Utilities.newBlob(
          Utilities.base64Decode(base64),
          "image/png",
          "sig_" + (data.phone || "anon") + "_" + Date.now() + ".png"
        );
        const folders = DriveApp.getFoldersByName("OPA Signatures");
        const folder  = folders.hasNext()
          ? folders.next()
          : DriveApp.createFolder("OPA Signatures");
        const file = folder.createFile(blob);
        file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
        sheet.getRange(lastRow, 6).setValue(file.getUrl());
      }
    } catch (sigErr) {
      Logger.log("Signature error: " + sigErr.message);
      sheet.getRange(lastRow, 6).setValue("signature error: " + sigErr.message);
    }

    return send({ success: true });

  } catch (err) {
    Logger.log("doPost error: " + err.message);
    return send({ success: false, error: err.message });
  }
}

function send(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
