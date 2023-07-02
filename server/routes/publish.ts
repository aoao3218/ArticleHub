import { Router } from 'express';
import { getAllPublish, getArticleView } from '../controllers/article.js';

const router = Router();

router.route('/publish').get(getAllPublish);

router.route('/view/:url').get(getArticleView);

export default router;
