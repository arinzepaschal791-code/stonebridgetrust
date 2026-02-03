import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

app.get('*', (req, res) => {
  res.json({ message: 'Stonebridge Trust API' });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
