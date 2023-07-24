import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();
// const url: string =
//   process.env.NODE_ENV === 'production' ? process.env.MONGODB ?? '' : 'mongodb://127.0.0.1:27017/ArticleHub';
const url: string = process.env.MONGODB || '';

const db = () => {
  mongoose
    .connect(url, { maxPoolSize: 20 })
    .then(() => {
      console.log('MongoDB 連線成功！');
    })
    .catch((error) => {
      console.error('MongoDB 連線失敗：', error);
    });
};

export default db;
