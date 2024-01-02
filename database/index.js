const express = require('express');
const multer = require('multer');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = 5000;
app.use(cors());

// PostgreSQL database configuration
const pool = new Pool({
  user: 'saro',
  host: 'localhost',
  database: 'gallery_app',
  password: 'Sarorosy@12',
  port: 5432,
});

// Multer configuration for handling image uploads
const storage = multer.memoryStorage();
const upload = multer();

pool.connect()
  .then(() => {
    console.log('PostgreSQL connected');
  })
  .catch((err) => {
    console.error('Error connecting to PostgreSQL:', err);
  });

// API endpoint for uploading multiple images
app.post('/upload', upload.any(), async (req, res) => {
    try {
      // Validation
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: 'No images uploaded' });
      }
  
      const imagePromises = req.files.map(async (file, index) => {
        // Additional validation checks can be added here
  
        const result = await pool.query('INSERT INTO images(data) VALUES($1) RETURNING *', [file.buffer]);
        return { id: result.rows[0].id, fieldname: `image${index + 1}` };
      });
  
      const uploadedImages = await Promise.all(imagePromises);
  
      res.json({
        message: 'Images uploaded successfully',
        images: uploadedImages,
      });
    } catch (error) {
      console.error('Error uploading images:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
// API endpoint for fetching an image by ID
app.get('/images', async (req, res) => {
    try {
      const result = await pool.query('SELECT id FROM images');
      const imageIds = result.rows.map((row) => row.id);
      res.json(imageIds);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  // Modify the existing /image/:id endpoint to only return image data
  app.get('/image/:id', async (req, res) => {
    const id = req.params.id;
  
    try {
      const result = await pool.query('SELECT data FROM images WHERE id = $1', [id]);
  
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Image not found' });
      }
  
      const imageData = result.rows[0].data;
      res.writeHead(200, { 'Content-Type': 'image/jpeg' });
      res.end(imageData);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  app.delete('/delete/:id', async (req, res) => {
    const imageIdToDelete = parseInt(req.params.id);
  
    if (isNaN(imageIdToDelete)) {
      return res.status(400).json({ error: 'Invalid image ID' });
    }
  
    try {
      // Implement the logic to delete the image file or perform any other necessary cleanup
      // Here, we assume you have a table named 'images' in your database
      // and you want to delete the corresponding record based on the image ID
      const result = await pool.query('DELETE FROM images WHERE id = $1 RETURNING *', [imageIdToDelete]);
  
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Image not found' });
      }
  
      res.json({ message: 'Image deleted successfully' });
    } catch (error) {
      console.error('Error deleting image:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
