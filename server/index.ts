import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const isProduction = process.env.NODE_ENV === 'production';
const PORT = Number(process.env.PORT) || (isProduction ? 5000 : 3001);

app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// API routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Import and use routes (add error handling for missing routes)
try {
  // You need to create these route files or comment them out
  // import authRoutes from './routes/auth';
  // import accountRoutes from './routes/accounts';
  // import loanRoutes from './routes/loans';
  // import housingRoutes from './routes/housing';
  
  // app.use('/api/auth', authRoutes);
  // app.use('/api', accountRoutes);
  // app.use('/api', loanRoutes);
  // app.use('/api', housingRoutes);
} catch (error) {
  console.log('Note: Some routes are not yet implemented');
}

// Serve client build in production
if (isProduction) {
  // Correct path for Vite build output
  const clientDistPath = path.resolve(__dirname, '../../client/dist');
  
  console.log(`Serving static files from: ${clientDistPath}`);
  
  // Check if client dist exists
  import('fs').then(fs => {
    if (!fs.existsSync(clientDistPath)) {
      console.warn(`Warning: Client dist folder not found at ${clientDistPath}`);
      console.warn('Make sure client build runs before server start');
    }
  });
  
  app.use(express.static(clientDistPath));
  
  // Handle SPA routing
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

// Fix: Removed the extra closing parenthesis that was causing syntax error
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT} in ${isProduction ? 'production' : 'development'} mode`);
});
