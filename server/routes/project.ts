import { Router } from 'express';
import { createProject, getProject } from '../controllers/project.js';
import { authorization } from '../middleware/authorization.js';
import * as validator from '../middleware/validator.js';
import { body, param } from 'express-validator';

const router = Router();

router.route('/project/:teamId').post(
  body('name')
    .exists()
    .notEmpty()
    .matches(/[^?\\/]/g)
    .withMessage('should not have special characters'),
  param('teamId').exists().notEmpty().trim(),
  validator.handleResult,
  authorization(['owner']),
  createProject
);

router.route('/project/:teamId').get(param('teamId').exists().notEmpty().trim(), validator.handleResult, getProject);

export default router;
