import { Router } from 'express';
import { createTeam, inviteMember } from '../controllers/team.js';
const router = Router();

router.route('/team').post(createTeam);

router.route('/team/:teamId/member').post(inviteMember);

router.route('/team/:teamId/member').put();

router.route('/team/:teamId/member').delete();

export default router;
