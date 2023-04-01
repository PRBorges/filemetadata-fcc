const express = require("express");
const cors = require("cors");
const multer = require("multer");
require("dotenv").config();

const app = express();

app.use(cors());
app.use("/public", express.static(process.cwd() + "/public"));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

const upload = multer({ limits: { fileSize: 5000000 } }).single("upfile");

// Analyze the uploaded file
// The file is kept in memory and limited to 5MB.
// It could be saved in disk and then deleted.
app.post("/api/fileanalyse", (req, res) => {
  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      res.status(500).json({ error: "Error loading file" });
      console.log("Multer error: ", err);
      return;
    }

    if (err) {
      res.status(500).json({ error: "Unknown error" });
      console.log("Unknown error: ", err);
      return;
    }

    if (!req.file) {
      res.status(400).json({ error: "No file to upload" });
      console.log("Bad request: no file to upload");
      return;
    }

    res.status(200).json({
      name: req.file.originalname,
      type: req.file.mimetype,
      size: req.file.size,
    });
  });
});

const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log("Your app is listening on port " + port);
});
