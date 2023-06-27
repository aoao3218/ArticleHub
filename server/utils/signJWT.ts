import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const JWT_KEY = process.env.JWT_KEY || '';
export const EXPIRE_TIME = 60 * 60 * 60;

export default function signJWT(userId: string) {
  return new Promise((resolve, reject) => {
    jwt.sign({ userId }, JWT_KEY, { expiresIn: EXPIRE_TIME }, function (err, token) {
      if (err) {
        reject(err);
      }
      resolve(token);
    });
  });
}
