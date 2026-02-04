import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// API routes
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Stonebridge Trust Server is running',
    timestamp: new Date().toISOString()
  });
});

// Serve static files from client/dist
const clientDistPath = path.join(__dirname, '../client/dist');
app.use(express.static(clientDistPath));

// Handle ALL routes by serving index.html (React Router needs this)
app.get('*', (req, res) => {
  res.sendFile(path.join(clientDistPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🌐 Website: https://stonebridgetrust.onrender.com`);
  console.log(`📊 API: https://stonebridgetrust.onrender.com/api/health`);
});
