import express, { Router } from 'express';
import cookieParser from 'cookie-parser';
import teamRouter from './routes/team.js';
import projectRouter from './routes/project.js';
import articleRouter from './routes/article.js';
import userRouter from './routes/user.js';
import branchRouter from './routes/branch.js';
import { errorHandler } from './utils/errorHandler.js';
import authenticate from './middleware/authenticate.js';
import path from 'path';
import cors from 'cors';
import db from './db.js';
import { createServer } from 'http';
import { Server } from 'socket.io';

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
db();

app.use(cors());
app.use(cookieParser());
app.enable('trust proxy');

app.use((req, res, next) => {
  res.locals.io = io;
  next();
});

app.use(express.json());
app.use('/api', userRouter);
app.use('/api', authenticate, [teamRouter, projectRouter, branchRouter, articleRouter]);
app.use(express.static('../client/dist'));
app.get('*', (req, res) => {
  res.sendFile(dirname);
});
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Medium listening on port ${port}`);
});
