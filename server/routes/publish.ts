import { Router } from 'express';
import { getAllPublish, getPublishArticle } from '../controllers/article.js';

const router = Router();

router.route('/publish').get(getAllPublish);

router.route('/publish/:articleId').get(getPublishArticle);

export default router;
