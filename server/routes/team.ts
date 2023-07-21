import { Router } from 'express';
import { createTeam, inviteMember, getTeam, getMember } from '../controllers/team.js';
import { authorization } from '../middleware/authorization.js';
import * as validator from '../middleware/validator.js';
import { body, param } from 'express-validator';

const router = Router();

router.route('/team').get(getTeam);

router.route('/team').post(
  body('name')
    .exists()
    .notEmpty()
    .matches(/[^?\\/]/g)
    .withMessage('should not have special characters'),
  validator.handleResult,
  createTeam
);

router.route('/team/member/:teamId').get(getMember);

router.route('/team/:teamId/member').post(authorization(['owner', 'admin']), inviteMember);

export default router;
