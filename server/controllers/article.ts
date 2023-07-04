import { NextFunction, Request, Response } from 'express';
import { ValidationError } from '../utils/errorHandler.js';
import { getPatches, getStory, getCompare } from '../utils/diffs.js';
import articles from '../models/article.js';
import versions from '../models/version.js';
import { v4 as uuidv4 } from 'uuid';
import publishes from '../models/publish.js';
import dotenv from 'dotenv';
dotenv.config();

const secretKey = process.env.Secret_Key || '';

export async function saveArticle(req: Request, res: Response) {
  try {
    const articleId = req.params.articleId;
    const projectId = req.params.projectId;
    const branch = req.params.branch;
    const { title, story } = req.body;
    if (!title) throw new ValidationError('title should not be empty');
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
      if (diffs.length == 0) throw new ValidationError('no change');
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
      if (diffs.length == 0) throw new ValidationError('no change');
      const main = await articles.findOne({ article_id: articleId, branch: 'main' });
      const result = await versions.create({
        article_id: articleId,
        branch,
        history: [diffs],
        previous_index: main?.history.length,
        update_index: main?.history.length,
      });
      res.status(200).json(result);
      return;
    }
    console.log('v save');
    const diffs = await getPatches(articleId, branch, story);
    if (diffs.length == 0) throw new ValidationError('no change');
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
    const number = req.query.number !== undefined ? (req.query.number as string) : undefined;
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

export async function getArticleView(req: Request, res: Response) {
  try {
    const { url } = req.params;
    // const data = CryptoJS.AES.decrypt(url, secretKey);
    // const dataString = data.toString(CryptoJS.enc.Utf8);
    // const dataObject = JSON.parse(dataString);
    // const { articleId, branch, number } = dataObject;
    // const result = await getStory(articleId, branch, number);
    const data = atob(url);
    const dataObject = JSON.parse(data);
    const { team, project, articleId, branch } = dataObject;
    const result = `/article/${team}/${project}/${branch}/${articleId}`;
    res.status(200).redirect(result);
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
    const { version } = req.params;
    if (branch == 'main') {
      throw new ValidationError('main is not comparable');
    }
    const result = await getCompare(articleId, branch, version);
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

export async function publishArticle(req: Request, res: Response) {
  try {
    const userId = res.locals.userId;
    const projectId = req.params.projectId;
    const articleId = req.params.articleId;
    const article = await publishes.findOne({ project_id: projectId, article_id: articleId });
    const { title, story } = await getStory(articleId, 'main', 'undefined');

    if (article) {
      console.log('update');
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
    console.log(result);
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
    res.status(500).json({ errors: 'article publish failed' });
  }
}

export async function getProjectPublish(req: Request, res: Response) {
  try {
    const userId = res.locals.userId;
    const projectId = req.params.projectId;
    console.log(projectId);
    const result = await publishes.find({ project_id: projectId, author: userId });
    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    if (err instanceof Error) {
      res.status(500).json({ errors: err.message });
      return;
    }
    res.status(500).json({ errors: 'get article publish failed' });
  }
}

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

export async function getShortUrl(req: Request, res: Response) {
  try {
    const data = req.body;
    const jsonString = JSON.stringify(data);
    const url = btoa(jsonString);
    res.status(200).json(url);
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
