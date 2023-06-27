import { Router } from 'express';
import {
  saveArticle,
  getArticle,
  compareArticle,
  getAllArticle,
  getProjectPublish,
  publishArticle,
  getAllPublish,
} from '../controllers/article.js';
import { articleAuthorization } from '../middleware/authorization.js';
const router = Router();

router.route('/article/publish/:projectId').get(getProjectPublish);

router.route('/article/publish/:projectId/:articleId').post(publishArticle);

router.route('/article/compare/:branch/:articleId').get(compareArticle);

router.route('/article/:projectId/:branch').get(getAllArticle);

router.route('/article/:projectId/:branch/:articleId').post(saveArticle);

router.route('/article/:projectId/:branch/:articleId').get(articleAuthorization, getArticle);

export default router;
