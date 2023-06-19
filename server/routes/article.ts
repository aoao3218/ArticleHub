import { Router } from 'express';
import { saveArticle, getArticle, compareArticle } from '../controllers/article.js';
const router = Router();

router.route('/article/publish').post();

router.route('/article/compare/:branch/:articleId').post(compareArticle);

router.route('/article/:projectId/:branch/:articleId').post(saveArticle);

router.route('/article/:projectId/:branch/:articleId').get(getArticle);

export default router;
