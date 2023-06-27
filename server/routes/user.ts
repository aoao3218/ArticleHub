import { Router, Response, Request } from 'express';
import branch from '../middleware/branch.js';
import * as validator from '../middleware/validator.js';
import { body } from 'express-validator';
import { signUp, signIn, fbLogin, getProfile } from '../controllers/user.js';
import authenticate from '../middleware/authenticate.js';

const PROVIDER = {
  NATIVE: 'native',
  FACEBOOK: 'facebook',
  GOOGLE: 'google',
};

const router = Router();

router
  .route('/user/signup')
  .post([
    body('email').isEmail().normalizeEmail(),
    body('name').exists().notEmpty().trim(),
    body('password').exists().notEmpty(),
    validator.handleResult,
    signUp,
  ]);

router.route('/user/signin').post([
  branch(
    (req) => req.body.provider === PROVIDER.NATIVE,
    [body('email').isEmail().normalizeEmail(), body('password').exists().notEmpty(), validator.handleResult, signIn]
  ),
  branch((req) => req.body.provider === PROVIDER.FACEBOOK, [body('access_token').exists().notEmpty(), fbLogin]),
  (req: Request, res: Response) => {
    res.status(400).json({ errors: 'invalid provider' });
  },
]);

router.route('/user/profile').get(authenticate, getProfile);

export default router;
