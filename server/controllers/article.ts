import { NextFunction, Request, Response } from 'express';
import { ValidationError } from '../utils/errorHandler.js';
import { getPatches, getStory, getCompare } from '../utils/diffs.js';
import articles from '../models/article.js';
import versions from '../models/version.js';
import { v4 as uuidv4 } from 'uuid';

export async function saveArticle(req: Request, res: Response) {
  try {
    const articleId = req.params.articleId;
    const projectId = req.params.projectId;
    const branch = req.params.branch;
    const { title, story } = req.body;
    const article = await articles.findOne({ article_id: articleId });
    if (articleId == 'undefined') {
      console.log('a create');
      const result = await articles.create({
        project_id: projectId,
        article_id: uuidv4(),
        title,
        story,
        branch,
        history: [],
        previous_index: null,
      });
      res.status(200).json(result);
      return;
    } else if (article?.branch == branch) {
      console.log('a save');
      const diffs = await getPatches(articleId, branch, story);
      const filter = { article_id: articleId, branch };
      const update = { $push: { history: diffs } };
      const result = await articles.findOneAndUpdate(filter, update, { new: true });
      res.status(200).json(result);
      return;
    }
    const version = await versions.findOne({ article_id: articleId, branch });
    if (!version) {
      console.log('v create');
      const diffs = await getPatches(articleId, branch, story);
      const main = await articles.findOne({ article_id: articleId, branch: 'main' });
      const result = await versions.create({
        article_id: articleId,
        branch,
        history: diffs,
        previous_index: main?.history.length,
        update_index: main?.history.length,
      });
      res.status(200).json(result);
      return;
    }
    console.log('v save');
    const diffs = await getPatches(articleId, branch, story);
    const filter = { article_id: articleId, branch };
    const update = { $push: { history: diffs } };
    const result = await versions.findOneAndUpdate(filter, update, { new: true });
    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    if (err instanceof ValidationError) {
      res.status(400).json({ errors: err.message });
      return;
    }
    if (err instanceof Error) {
      res.status(500).json({ errors: err.message });
      return;
    }
    res.status(500).json({ errors: 'save Article failed' });
  }
}

export async function getAllArticle(req: Request, res: Response) {
  try {
    const projectId = req.params.projectId;
    const branch = req.params.branch;
    const result = await articles
      .find({ project_id: projectId, $or: [{ branch: 'main' }, { branch }] }, { article_id: 1, title: 1 })
      .exec();

    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    if (err instanceof ValidationError) {
      res.status(400).json({ errors: err.message });
      return;
    }
    if (err instanceof Error) {
      res.status(500).json({ errors: err.message });
      return;
    }
    res.status(500).json({ errors: 'get Article failed' });
  }
}

export async function getArticle(req: Request, res: Response) {
  try {
    const edit = res.locals.edit;
    const articleId = req.params.articleId;
    const branch = req.params.branch;
    const number = req.query.number !== undefined ? (req.query.number as string) : '0';
    const result = await getStory(articleId, branch, number);
    res.status(200).json({ ...result, edit });
  } catch (err) {
    console.log(err);
    if (err instanceof ValidationError) {
      res.status(400).json({ errors: err.message });
      return;
    }
    if (err instanceof Error) {
      res.status(500).json({ errors: err.message });
      return;
    }
    res.status(500).json({ errors: 'get Article failed' });
  }
}

export async function compareArticle(req: Request, res: Response) {
  try {
    const articleId = req.params.articleId;
    const branch = req.params.branch;
    if (branch == 'main') {
      throw new ValidationError('main is not comparable');
    }
    const result = await getCompare(articleId, branch);
    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    if (err instanceof ValidationError) {
      res.status(400).json({ errors: err.message });
      return;
    }
    if (err instanceof Error) {
      res.status(500).json({ errors: err.message });
      return;
    }
    res.status(500).json({ errors: 'compare Article failed' });
  }
}