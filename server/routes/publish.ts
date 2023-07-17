import { Router } from 'express';
import { getSearch, getAllPublish, getPublishArticle } from '../controllers/publish.js';

const router = Router();

router.route('/search').post(getSearch);

router.route('/publish').get(getAllPublish);

router.route('/publish/:articleId').get(getPublishArticle);

export default router;
