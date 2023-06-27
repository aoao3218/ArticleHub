import { Router } from 'express';
import { saveArticle, getArticle, compareArticle, getAllArticle } from '../controllers/article.js';
import { articleAuthorization } from '../middleware/authorization.js';
const router = Router();

router.route('/article/publish').post();

router.route('/article/compare/:branch/:articleId').post(compareArticle);

router.route('/article/:projectId/:branch').get(getAllArticle);

router.route('/article/:projectId/:branch/:articleId').post(saveArticle);

router.route('/article/:projectId/:branch/:articleId').get(articleAuthorization, getArticle);

export default router;
