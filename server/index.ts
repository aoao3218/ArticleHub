import express, { Router } from 'express';
import cookieParser from 'cookie-parser';
import teamRouter from './routes/team.js';
import projectRouter from './routes/project.js';
import articleRouter from './routes/article.js';
import branchRouter from './routes/branch.js';
import { errorHandler } from './utils/errorHandler.js';
import user from './models/user.js';
import cors from 'cors';

import db from './db.js';

const app = express();
const port = 3000;

db();

// user.insertMany([
//   {
//     name: 'test1',
//     email: '123@gmail.com',
//     token: '',
//     provider: 'native',
//   },
//   {
//     name: 'test2',
//     email: '1234@gmail.com',
//     token: '',
//     provider: 'native',
//   },
// ]);
app.use(cors());
app.use(cookieParser());

app.enable('trust proxy');

app.use(express.json());
app.use('/api', [teamRouter, projectRouter, branchRouter, articleRouter]);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Medium listening on port ${port}`);
});
