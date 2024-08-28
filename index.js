const express = require('express');
const multer = require('multer');
const path = require('path');

// Initialize Express app
const app = express();

// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Specify the destination directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Set file name with timestamp
  }
});

// Initialize multer with the storage configuration
const upload = multer({ storage: storage });

// Create an uploads directory if it doesn't exist
const fs = require('fs');
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Root route
app.get('/', (req, res) => {
    res.send(
        `Welcome to the file upload server!
        <br/><a href="/upload">Upload file</a>`
    );
});

// Serve HTML form at /upload
app.get('/upload', (req, res) => {
  res.send(`
    <h2>Upload a File</h2>
    <form action="/upload" method="POST" enctype="multipart/form-data">
      <input type="file" name="file" />
      <button type="submit">Upload</button>
    </form>
  `);
});

// Handle file upload via POST
app.post('/upload', upload.single('file'), (req, res) => {
  try {
    res.send({
      message: 'File uploaded successfully',
      fileName: req.file.filename,
      path: req.file.path
    });
  } catch (err) {
    res.status(500).send(err);
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port http://127.0.0.1:${PORT}`);
});
