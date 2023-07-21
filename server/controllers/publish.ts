import { Request, Response, NextFunction } from 'express';
import publishes from '../models/publish.js';
import { elastic } from '../elasticSerach.js';
import { ValidationError } from '../utils/errorHandler.js';

export async function getAllPublish(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await publishes.find({}).limit(10);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

export async function getPublishArticle(req: Request, res: Response, next: NextFunction) {
  try {
    const { articleId } = req.params;
    const result = await publishes.findOne({ article_id: articleId });
    if (!result) throw new ValidationError('not fount');
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

export async function getSearch(req: Request, res: Response, next: NextFunction) {
  try {
    const { q } = req.body;
    const data = await elastic.search({
      index: 'search-post',
      body: {
        query: {
          multi_match: {
            query: q,
            fields: ['title', 'story'],
            fuzziness: 2,
          },
        },
      },
    });
    const result = data.body.hits.hits.map((ele: any) => ele._source);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}
