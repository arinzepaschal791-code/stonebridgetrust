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

// Check if client build exists
const clientDistPath = path.join(__dirname, '../client/dist');
const clientIndexPath = path.join(clientDistPath, 'index.html');

// Serve static files from client/dist if it exists
if (fs.existsSync(clientDistPath)) {
  console.log(`📁 Serving React app from: ${clientDistPath}`);
  app.use(express.static(clientDistPath));
  
  // Handle all other routes by serving React app
  app.get('*', (req, res) => {
    if (fs.existsSync(clientIndexPath)) {
      res.sendFile(clientIndexPath);
    } else {
      res.json({ 
        message: 'React app not built yet. Run: cd client && npm run build',
        api: 'API is working at /api/health'
      });
    }
  });
} else {
  console.log('⚠️  Client dist folder not found. Serving API only.');
  
  // If no React app, show API info
  app.get('*', (req, res) => {
    res.json({
      message: 'Stonebridge Trust API',
      note: 'React app not built. Build with: cd client && npm install && npm run build',
      api_endpoints: ['GET /api/health']
    });
  });
}

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🌐 API: http://localhost:${PORT}/api/health`);
  if (fs.existsSync(clientDistPath)) {
    console.log(`📱 React app: http://localhost:${PORT}/`);
  }
});
