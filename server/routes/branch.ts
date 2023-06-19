import { Router } from 'express';
import {
  createBranch,
  mergeRequest,
  getChangeArticleId,
  updateBranchArticles,
  mergeBranchArticles,
} from '../controllers/branch.js';

const router = Router();

router.route('/branch/:projectId').post(createBranch);

router.route('/branch/merge_request/:projectId/:branch').post(mergeRequest);

router.route('/branch/compare/:projectId/:branch').post(getChangeArticleId);

router.route('/branch/update/:projectId/:branch').post(updateBranchArticles);

router.route('/branch/merge/:projectId/:branch').post(mergeBranchArticles);

export default router;
