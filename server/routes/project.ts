import { Router } from 'express';
import { createProject, getProject } from '../controllers/project.js';
import { authorization } from '../middleware/authorization.js';

const router = Router();

router.route('/project/:teamId').post(authorization(['owner']), createProject);

router.route('/project/:teamId').get(getProject);

export default router;
