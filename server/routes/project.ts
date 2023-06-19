import { Router } from 'express';
import { createProject } from '../controllers/project.js';
const router = Router();

router.route('/project/:teamId').post(createProject);

router.route('/project/:teamId/:projectId').get();

export default router;
