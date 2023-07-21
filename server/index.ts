import express, { Router } from 'express';
import cookieParser from 'cookie-parser';
import teamRouter from './routes/team.js';
import projectRouter from './routes/project.js';
import articleRouter from './routes/article.js';
import userRouter from './routes/user.js';
import branchRouter from './routes/branch.js';
import publishRouter from './routes/publish.js';
import { errorHandler } from './utils/errorHandler.js';
import authenticate from './middleware/authenticate.js';
import path from 'path';
import cors from 'cors';
import fs from 'fs';
import db from './db.js';
import { createServer } from 'https';
import { Server } from 'socket.io';
import { Redis } from 'ioredis';
import dotenv from 'dotenv';
dotenv.config();

const redis = new Redis({
  port: 6379,
  host: process.env.REDIS_HOST,
});
const app = express();
const port = 3000;
const dirname = path.resolve(process.env.CLIENT_HTML ?? '');
const keyDir = path.resolve(process.env.PRIVATE_KEY ?? '');
const certDir = path.resolve(process.env.CRT ?? '');
const httpsServer = createServer(
  {
    key: fs.readFileSync(keyDir),
    cert: fs.readFileSync(certDir),
  },
  app
);
const io = new Server(httpsServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['my-custom-header'],
    credentials: true,
  },
  allowEIO3: true,
});

io.on('connection', (socket) => {
  socket.on('join', async ({ projectId, articleId, branch }) => {
    const id = socket.id;
    const roomId = `${projectId}-${branch}-${articleId}`;
    redis.setex(id, 24 * 60 * 60, roomId);
    redis.lpush(roomId, id);
    const visitors = await redis.llen(roomId);
    socket.join(roomId);
    io.to(roomId).emit('visitors', { visitors: visitors - 1 });
  });

  socket.on('disconnect', async () => {
    const id = socket.id;
    const roomId = await redis.get(id);
    if (roomId) {
      await redis.lrem(roomId, 1, id);
      const visitors = await redis.llen(roomId);
      io.to(roomId).emit('leave', { visitors: visitors - 1 });
    }
  });
});
db();

app.use(cors());
app.use(cookieParser());
app.enable('trust proxy');

app.use((req, res, next) => {
  next();
});

app.use(express.json());
app.use('/api', [userRouter, publishRouter, articleRouter]);
app.use('/api', authenticate, [teamRouter, projectRouter, branchRouter]);
app.use(express.static('../client/dist'));
app.get('*', (req, res) => {
  res.sendFile(dirname);
});
app.use(errorHandler);

httpsServer.listen(port, () => {
  console.log(`Medium listening on port ${port}`);
});
