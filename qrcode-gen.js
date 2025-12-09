// qrcode-gen.js
const QRCode = require("qrcode");
const fs = require("fs");

const url = "https://qr-va7d.onrender.com/scan.html"; // replace with your hosted page
QRCode.toFile("qrcode.png", url, { errorCorrectionLevel: "H" }, function (err) {
  if (err) throw err;
  console.log("Saved qrcode.png for", url);
});
