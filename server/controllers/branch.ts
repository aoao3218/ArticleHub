import { NextFunction, Request, Response } from 'express';
import { ValidationError } from '../utils/errorHandler.js';
import teams from '../models/team.js';
import projects from '../models/project.js';
import articles from '../models/article.js';
import versions from '../models/version.js';
import { ObjectId } from 'mongodb';
import { updateStory, mergeStory } from '../utils/diffs.js';

interface Project {
  id: string;
  name: string;
  team_id: {
    _id: string;
    name: string;
    owner: string;
    member: {
      _id: string;
      role: 'admin' | 'user';
    }[];
  };
  main: string;
  createBy: string;
  branch: {
    name: string;
    createBy: string;
    merge_request: boolean;
  }[];
}

export async function createBranch(req: Request, res: Response) {
  try {
    const projectId = req.params.projectId;
    const { name } = req.body;
    const userId = res.locals?.userId;
    const project: Project | null = await projects.findById(projectId).populate('team_id');
    const isOwner = userId === project?.team_id?.owner.toString();

    let isMember = false;
    if (project?.team_id?.member) {
      isMember = project.team_id.member.some((member) => member._id.toString() === userId);
    }

    if (!isOwner && !isMember) {
      throw new ValidationError('No Invitation');
    }
    const filter = { _id: projectId, team_id: project?.team_id._id };
    const update = { $push: { branch: [{ name, createBy: userId }] } };
    const result = await projects.findByIdAndUpdate(filter, update, { new: true });
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
    res.status(500).json({ errors: 'create Branch failed' });
  }
}

export async function getBranch(req: Request, res: Response) {
  try {
    const projectId = req.params.projectId;
    const result = await projects.findById(projectId);
    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    if (err instanceof Error) {
      res.status(500).json({ errors: err.message });
      return;
    }
    res.status(500).json({ errors: 'create Branch failed' });
  }
}

async function updateMergeRequest(req: Request, res: Response, mergeRequestFlag: boolean) {
  try {
    const projectId = req.params.projectId;
    const branch = req.params.branch;
    const filter = { _id: projectId, 'branch.name': branch };
    const update = { $set: { 'branch.$.merge_request': mergeRequestFlag } };
    const options = { new: true };
    const result = await projects.findOneAndUpdate(filter, update, options);
    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    if (err instanceof Error) {
      res.status(500).json({ errors: err.message });
      return;
    }
    res.status(500).json({ errors: 'update request failed' });
  }
}

export async function mergeRequest(req: Request, res: Response) {
  await updateMergeRequest(req, res, true);
}

export async function mergeDismiss(req: Request, res: Response) {
  await updateMergeRequest(req, res, false);
}

export async function getChangeArticleId(req: Request, res: Response) {
  try {
    const projectId = req.params.projectId;
    const branch = req.params.branch;
    const branchArticles = await articles.aggregate([
      {
        $match: {
          project_id: new ObjectId(projectId),
        },
      },
      {
        $lookup: {
          from: 'versions',
          localField: 'article_id',
          foreignField: 'article_id',
          as: 'versions',
        },
      },
      {
        $match: {
          $or: [{ branch }, { 'versions.branch': branch }],
        },
      },
    ]);

    const projectArticles = await articles.aggregate([
      {
        $match: {
          project_id: new ObjectId(projectId),
        },
      },
      {
        $project: {
          _id: 0,
          article_id: 1,
        },
      },
    ]);

    // const change = branchArticles.filter(
    //   (ele) => ele.branch == branch || ele.versions.some((version: any) => version.branch === branch)
    // );
    const changeArticles = branchArticles.map((ele) => ({
      article_id: ele.article_id,
      title: ele.title,
    }));
    res.status(200).json(changeArticles);
  } catch (err) {
    console.log(err);
    if (err instanceof Error) {
      res.status(500).json({ errors: err.message });
      return;
    }
    res.status(500).json({ errors: 'create Branch failed' });
  }
}

export async function updateBranchArticles(req: Request, res: Response) {
  try {
    const projectId = req.params.projectId;
    const branch = req.params.branch;
    const branchArticles = await articles.aggregate([
      {
        $match: {
          project_id: new ObjectId(projectId),
        },
      },
      {
        $lookup: {
          from: 'versions',
          localField: 'article_id',
          foreignField: 'article_id',
          as: 'versions',
        },
      },
      {
        $match: { 'versions.branch': branch },
      },
    ]);
    const updateDiffs = Promise.all(
      branchArticles.map(async (ele) => {
        const diff = await updateStory(ele);
        const update_index = ele.history.length;
        return {
          updateOne: {
            filter: { article_id: ele.article_id },
            update: { $push: { history: diff }, $set: { update_index } },
          },
        };
      })
    );

    const result = await versions.bulkWrite(await updateDiffs);
    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    if (err instanceof Error) {
      res.status(500).json({ errors: err.message });
      return;
    }
    res.status(500).json({ errors: 'create Branch failed' });
  }
}

export async function mergeBranchArticles(req: Request, res: Response) {
  try {
    const projectId = req.params.projectId;
    const branch = req.params.branch;
    const branchArticles = await articles.aggregate([
      {
        $match: {
          project_id: new ObjectId(projectId),
        },
      },
      {
        $lookup: {
          from: 'versions',
          localField: 'article_id',
          foreignField: 'article_id',
          as: 'versions',
        },
      },
      {
        $match: {
          $or: [{ branch }, { 'versions.branch': branch }],
        },
      },
    ]);

    const newArticles = branchArticles.filter((ele) => ele.branch == branch);
    const articleVersions = branchArticles.filter((ele) =>
      ele.versions.some((version: any) => version.branch === branch)
    );

    const checkVersion = articleVersions.map((item) => item.history.length !== item.versions[0].update_index);
    if (checkVersion.includes(true)) {
      throw new ValidationError('some article not update');
    }

    const updateBranch = Promise.all(
      newArticles.map(async (ele) => {
        return {
          updateOne: {
            filter: { article_id: ele.article_id },
            update: { $set: { branch: 'main' } },
          },
        };
      })
    );
    const updateDiffs = Promise.all(
      articleVersions.map(async (ele) => {
        const diff = await mergeStory(ele);
        return {
          updateOne: {
            filter: { article_id: ele.article_id },
            update: { $push: { history: diff } },
          },
        };
      })
    );
    const result = await articles.bulkWrite([...(await updateBranch), ...(await updateDiffs)]);
    const deleteId = articleVersions.map((ele) => ele.article_id);
    await versions.deleteMany({ article_id: deleteId });
    await projects.updateOne({ _id: new ObjectId(projectId) }, { $pull: { branch: { name: branch } } });
    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    if (err instanceof Error) {
      res.status(500).json({ errors: err.message });
      return;
    }
    res.status(500).json({ errors: 'create Branch failed' });
  }
}
