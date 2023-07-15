import { Router } from 'express';
import { Request, Response, NextFunction } from 'express';

import {
  saveArticle,
  getArticle,
  compareArticle,
  getAllArticle,
  getProjectPublish,
  publishArticle,
} from '../controllers/article.js';
import { articleAuthorization } from '../middleware/authorization.js';
import authenticate from '../middleware/authenticate.js';
import branch from '../middleware/branch.js';

function visitors(req: Request, res: Response, next: NextFunction) {
  res.locals.edit = false;
  next();
}

const router = Router();

router.route('/article/publish/:projectId').get(authenticate, getProjectPublish);

router.route('/article/publish/:projectId/:articleId').post(authenticate, publishArticle);

router.route('/article/compare/:branch/:articleId/:version').get(compareArticle);

router.route('/article/all/:projectId/:branch').get(authenticate, getAllArticle);

router.route('/article/:projectId/:branch/:articleId').post(authenticate, saveArticle);

router
  .route('/article/:projectId/:branch/:articleId')
  .get(
    branch((req) => !req.get('Authorization'), [visitors, getArticle], [authenticate, articleAuthorization, getArticle])
  );

export default router;
