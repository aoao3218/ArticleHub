import dotenv from 'dotenv';
import { Client } from '@elastic/elasticsearch';
dotenv.config();

export const elastic = new Client({
  cloud: {
    id: process.env.cloudID || '',
  },
  auth: {
    username: process.env.ESusername || '',
    password: process.env.ESpassword || '',
  },
});

// elastic
//   .info()
//   .then((res) => console.log('connection success', res))
//   .catch((err) => console.error('wrong connection', err));
