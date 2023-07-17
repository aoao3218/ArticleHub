import { Request, Response } from 'express';
import publishes from '../models/publish.js';
import { elastic } from '../elasticSerach.js';
import { ValidationError } from '../utils/errorHandler.js';

export async function getAllPublish(req: Request, res: Response) {
  try {
    const result = await publishes.find({});
    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    if (err instanceof Error) {
      res.status(500).json({ errors: err.message });
      return;
    }
    res.status(500).json({ errors: 'get publish failed' });
  }
}

export async function getPublishArticle(req: Request, res: Response) {
  try {
    const { articleId } = req.params;
    const result = await publishes.findOne({ article_id: articleId });
    if (!result) throw new ValidationError('not fount');
    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    if (err instanceof ValidationError) {
      res.status(400).json({ errors: err.message });
      return;
    }
    if (err instanceof Error) {
      res.status(400).json({ errors: err.message });
      return;
    }
    res.status(500).json({ errors: 'get Article failed' });
  }
}

export async function getSearch(req: Request, res: Response) {
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
    console.log(err);
    if (err instanceof Error) {
      res.status(400).json({ errors: err.message });
      return;
    }
    res.status(500).json({ errors: 'create Project failed' });
  }
}
