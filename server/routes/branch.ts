import { Router } from 'express';
import {
  createBranch,
  mergeRequest,
  getChangeArticleId,
  updateBranchArticles,
  mergeBranchArticles,
  getBranch,
} from '../controllers/branch.js';
import { authorization, branchAuthorization } from '../middleware/authorization.js';
import * as validator from '../middleware/validator.js';
import { body, param } from 'express-validator';

const router = Router();

router.route('/branch/:projectId').post(
  body('name')
    .exists()
    .notEmpty()
    .matches(/[^?\\/]/g)
    .withMessage('should not have special characters'),
  validator.handleResult,
  createBranch
);

router.route('/branch/:projectId').get(getBranch);

router.route('/branch/merge_request/:projectId/:branch').get(branchAuthorization, mergeRequest);

router.route('/branch/compare/:projectId/:branch').get(getChangeArticleId);

router.route('/branch/update/:projectId/:branch').get(branchAuthorization, updateBranchArticles);

router.route('/branch/merge/:projectId/:branch').post(authorization(['owner', 'admin']), mergeBranchArticles);

export default router;
