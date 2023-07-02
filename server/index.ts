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
import db from './db.js';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { Redis } from 'ioredis';

const redis = new Redis();
const app = express();
const port = 3000;
const dirname = path.resolve('../client/dist/index.html');
const httpServer = createServer(app);
const io = new Server(httpServer, {
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
    console.log(roomId);
    redis.setex(id, 24 * 60 * 60, roomId);
    redis.lpush(roomId, id);
    const visitors = await redis.llen(roomId);
    socket.join(roomId);
    io.to(roomId).emit('visitors', { visitors: visitors - 1 });
  });

  socket.on('disconnect', async () => {
    console.log('leave');
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
  res.locals.io = io;
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

httpServer.listen(port, () => {
  console.log(`Medium listening on port ${port}`);
});
