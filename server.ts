import express from 'express';
import path from 'path';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';

import { connectDB } from './server/db';
import authRoutes from './server/routes/authRoutes';
import blogRoutes from './server/routes/blogRoutes';

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // DB connect
  await connectDB();

  // 🔥 CORS (FINAL FIX)
  app.use(cors({
    origin: "https://vibeblog-frontend.onrender.com",
    credentials: true
  }));

  // Middleware
  app.use(express.json());
  app.use(cookieParser());
  app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

  // Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/blogs', blogRoutes);

  // Health
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
    });
  });

  // ✅ ROOT (NO DIST, NO VITE)
  app.get('/', (req, res) => {
    res.send('API is running...');
  });

  // ❌ REMOVE VITE + DIST COMPLETELY

  // Error handler
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({
      message: 'Something went wrong!',
      error: err.message
    });
  });

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();