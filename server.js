// server.js
const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const UPLOAD_DIR = path.join(__dirname, "uploads");
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR);

const storage = multer.memoryStorage();
const upload = multer({ storage });

const app = express();

app.use(express.static(path.join(__dirname, "public"))); // put scan.html in public/

app.post("/api/upload", upload.single("photo"), (req, res) => {
  try {
    const id = crypto.randomBytes(12).toString("hex");
    const timestamp = new Date().toISOString();
    const meta = req.body.metadata ? JSON.parse(req.body.metadata) : {};
    const filename = `${id}.jpg`;
    const filepath = path.join(UPLOAD_DIR, filename);

    fs.writeFileSync(filepath, req.file.buffer);

    // Save an entry record (in production, use DB)
    const record = {
      id,
      filename,
      filepath,
      timestamp,
      metadata: meta,
    };
    const dbFile = path.join(UPLOAD_DIR, "records.json");
    const records = fs.existsSync(dbFile)
      ? JSON.parse(fs.readFileSync(dbFile))
      : [];
    records.push(record);
    fs.writeFileSync(dbFile, JSON.stringify(records, null, 2));

    // respond
    res.json({ ok: true, id });
  } catch (err) {
    console.error(err);
    res.status(500).send("Upload failed");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
