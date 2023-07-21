import { NextFunction, Request, Response } from 'express';
import { ValidationError } from '../utils/errorHandler.js';
import { getPatches, getStory, getCompare } from '../utils/diffs.js';
import articles from '../models/article.js';
import versions from '../models/version.js';
import { v4 as uuidv4 } from 'uuid';
import publishes from '../models/publish.js';
import dotenv from 'dotenv';
dotenv.config();

async function createNewArticle(projectId: string, title: string, story: string, branch: string) {
  const result = await articles.create({
    project_id: projectId,
    article_id: uuidv4(),
    title,
    story,
    branch,
    history: [],
    previous_index: null,
  });
  return result;
}

async function saveArticleChanges(articleId: string, branch: string, story: string) {
  const diffs = await getPatches(articleId, branch, story);
  if (diffs.length == 0) throw new ValidationError('no change');
  const filter = { article_id: articleId, branch };
  const update = { $push: { history: diffs } };
  const result = await articles.findOneAndUpdate(filter, update, { new: true });
  return result;
}

async function createNewVersion(articleId: string, branch: string, story: string) {
  const diffs = await getPatches(articleId, branch, story);
  if (diffs.length == 0) throw new ValidationError('no change');
  const main = await articles.findOne({ article_id: articleId, branch: 'main' });
  const result = await versions.create({
    article_id: articleId,
    branch,
    history: [diffs],
    previous_index: main?.history.length,
    update_index: main?.history.length,
  });
  return result;
}

async function saveVersionChange(articleId: string, branch: string, story: string) {
  const diffs = await getPatches(articleId, branch, story);
  if (diffs.length == 0) throw new ValidationError('no change');
  const filter = { article_id: articleId, branch };
  const update = { $push: { history: diffs } };
  const result = await versions.findOneAndUpdate(filter, update, { new: true });
  return result;
}

export async function saveArticle(req: Request, res: Response, next: NextFunction) {
  try {
    const articleId = req.params.articleId;
    const projectId = req.params.projectId;
    const branch = req.params.branch;
    const { title, story } = req.body;
    const content = await story.replace(/<p>/g, '/n').replace(/<\/p>/g, '');

    if (articleId == 'undefined') {
      const result = await createNewArticle(projectId, title, content, branch);
      res.status(200).json(result);
      return;
    }

    const article = await articles.findOne({ article_id: articleId });
    if (article?.branch == branch) {
      const result = await saveArticleChanges(articleId, branch, content);
      res.status(200).json(result);
      return;
    }

    const version = await versions.findOne({ article_id: articleId, branch });
    if (!version) {
      const result = await createNewVersion(articleId, branch, content);
      res.status(200).json(result);
      return;
    }

    const result = await saveVersionChange(articleId, branch, content);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

export async function getAllArticle(req: Request, res: Response, next: NextFunction) {
  try {
    const projectId = req.params.projectId;
    const branch = req.params.branch;
    const result = await articles.find(
      { project_id: projectId, $or: [{ branch: 'main' }, { branch }] },
      { article_id: 1, title: 1 }
    );
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

export async function getArticle(req: Request, res: Response, next: NextFunction) {
  try {
    const edit = res.locals.edit;
    const articleId = req.params.articleId;
    const branch = req.params.branch;
    const number = req.query.number !== undefined ? (req.query.number as string) : undefined;
    const result = await getStory(articleId, branch, number);
    const { title, story, version, noUpdate } = result;
    const content = story.replace(/\/n/g, '<p>');
    res.status(200).json({ title, story: content, version, noUpdate, edit });
  } catch (err) {
    next(err);
  }
}

export async function compareArticle(req: Request, res: Response, next: NextFunction) {
  try {
    const articleId = req.params.articleId;
    const branch = req.params.branch;
    const { version } = req.params;
    if (branch == 'main') throw new ValidationError('main is not comparable');

    const result = await getCompare(articleId, branch, version);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

export async function publishArticle(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = res.locals.userId;
    const projectId = req.params.projectId;
    const articleId = req.params.articleId;
    const { title, story } = req.body;
    const article = await publishes.findOne({ project_id: projectId, article_id: articleId });
    if (article) {
      const result = await publishes.updateOne({ project_id: projectId, article_id: articleId }, { $set: { story } });
      return res.status(200).json(result);
    }
    const result = await publishes.create({
      article_id: articleId,
      title,
      story,
      project_id: projectId,
      author: userId,
    });
    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    next(err);
  }
}

export async function getProjectPublish(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = res.locals.userId;
    const projectId = req.params.projectId;
    const result = await publishes.find({ project_id: projectId, author: userId });
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}
