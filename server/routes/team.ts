import { Router } from 'express';
import { createTeam, inviteMember, getTeam, getMember } from '../controllers/team.js';
import { authorization } from '../middleware/authorization.js';

const router = Router();

router.route('/team').get(getTeam);

router.route('/team').post(createTeam);

router.route('/team/member/:teamId').get(getMember);

router.route('/team/:teamId/member').post(authorization(['owner', 'admin']), inviteMember);

// router.route('/team/:teamId/member').put(authorization(['owner', 'admin']));

// router.route('/team/:teamId/member').delete(authorization(['owner', 'admin']));

export default router;
