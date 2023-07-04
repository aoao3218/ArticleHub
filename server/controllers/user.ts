import { Request, Response } from 'express';
import * as argon2 from 'argon2';
import signJWT, { EXPIRE_TIME } from '../utils/signJWT.js';
import users from '../models/user.js';
import { ValidationError } from '../utils/errorHandler.js';

const COOKIE_OPTIONS = {
  httpOnly: true,
  path: '/',
  secure: true,
  sameSite: 'strict',
} as const;

export async function signUp(req: Request, res: Response) {
  try {
    const { name, email, password } = req.body;
    const check = await users.find({ email });
    if (check.length >= 1) throw new Error('user exist');
    const hash = await argon2.hash(password);
    const user = await users.create({
      name,
      email,
      password: hash,
      provider: 'native',
    });
    const token = await signJWT(user._id.toString());
    res.status(200).json({ token });
  } catch (err) {
    if (err instanceof Error) {
      res.status(400).json({ errors: err.message });
      return;
    }
    res.status(500).json({ errors: 'sign up failed' });
  }
}

export async function signIn(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    const user = await users.findOne({ email });
    if (!user) {
      throw new Error('Email does not exist.');
    }
    const isValidPassword = await argon2.verify(user.password, password);
    if (!isValidPassword) {
      throw new Error('invalid password');
    }
    const token = await signJWT(user._id.toString());
    // res.cookie('jwtToken', token, COOKIE_OPTIONS);
    res.status(200).json({ token });
  } catch (err) {
    console.log(err);
    if (err instanceof Error) {
      res.status(400).json({ errors: err.message });
      return;
    }
    res.status(500).json({ errors: 'sign in failed' });
  }
}

async function getFbProfileData(userToken: string) {
  const profile = await fetch(
    `https//graph.facebook.com/v16.0/me?fields=id,name,email,picture&access_token=${userToken}`
  )
    .then((res) => res.json())
    .then((data) => data);
  return profile;
}

export async function fbLogin(req: Request, res: Response) {
  try {
    const { access_token: userToken } = req.body;
    const profile = await getFbProfileData(userToken);
    const user = await users.findOne({ email: profile.email });
    if (!user) {
      const user = await users.create({
        name: profile.name,
        email: profile.email,
        password: '',
        provider: 'facebook',
      });
      const token = await signJWT(user._id.toString());
      res.cookie('jwtToken', token, COOKIE_OPTIONS).status(200).json({ token });
      return;
    }
    if (user.provider !== 'facebook') {
      throw new Error('email and provider not match');
    }
    const token = await signJWT(user._id.toString());
    // res.cookie('jwtToken', token, COOKIE_OPTIONS)
    res.status(200).json({ msg: 'sign in success' });
  } catch (err) {
    if (err instanceof Error) {
      res.status(400).json({ errors: err.message });
      return;
    }
    res.status(500).json({ errors: 'fb login failed' });
  }
}

export async function getProfile(req: Request, res: Response) {
  try {
    const userId = res.locals.userId;
    const user = await users.findById(userId);
    res.status(200).json(user);
  } catch (err) {
    if (err instanceof Error) {
      res.status(400).json({ errors: err.message });
      return;
    }
    res.status(500).json({ errors: 'get profile failed' });
  }
}
