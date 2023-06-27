import { Router } from 'express';
import { getAllPublish } from '../controllers/article.js';

const router = Router();

router.route('/publish').get(getAllPublish);

export default router;
