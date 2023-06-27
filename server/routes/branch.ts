import { Router } from 'express';
import {
  createBranch,
  mergeRequest,
  getChangeArticleId,
  updateBranchArticles,
  mergeBranchArticles,
  getBranch,
} from '../controllers/branch.js';
import { authorization } from '../middleware/authorization.js';

const router = Router();

router.route('/branch/:projectId').post(createBranch);

router.route('/branch/:projectId').get(getBranch);

router.route('/branch/merge_request/:projectId/:branch').get(mergeRequest);

router.route('/branch/compare/:projectId/:branch').get(getChangeArticleId);

router.route('/branch/update/:projectId/:branch').post(updateBranchArticles);

router.route('/branch/merge/:projectId/:branch').post(authorization(['owner', 'admin']), mergeBranchArticles);

export default router;
