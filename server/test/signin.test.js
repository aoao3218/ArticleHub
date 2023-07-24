import request from 'supertest';
import app from '../dist/index.js';
import { expect } from 'chai';

describe('sigIn', () => {
  it('success', async () => {
    const user = {
      email: '123@gmail.com',
      password: '123',
      provider: 'native',
    };
    const res = await request(app).post('/api/user/signin').send(user);
    const data = res.body;
    expect(res.status).to.equal(200);
    expect(data.token).to.be.a('string');
  });

  it('email not exist', async () => {
    const user = {
      email: 'kfvjrlkv@gmail.com',
      password: '123',
      provider: 'native',
    };
    const res = await request(app).post('/api/user/signin').send(user);

    expect(res.status).to.equal(400);
    expect(res.body.errors).to.equal('Email does not exist.');
  });

  it('invalid password', async () => {
    const user = {
      email: '123@gmail.com',
      password: '111111',
      provider: 'native',
    };
    const res = await request(app).post('/api/user/signin').send(user);

    expect(res.status).to.equal(400);
    expect(res.body.errors).to.equal('invalid password');
  });
});
