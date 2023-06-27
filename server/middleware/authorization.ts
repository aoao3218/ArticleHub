import { Request, Response, NextFunction } from 'express';
import teams from '../models/team.js';
import articles from '../models/article.js';
import { Types } from 'mongoose';

export const authorization = (roleNames: string[]) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = res.locals.userId;
    const teamId = req.params.teamId || req.body.teamId;
    const team = await teams.findById(teamId);
    if (team?.owner.toString() === userId) {
      next();
      return;
    }
    const checkMemberRole = team?.member.some(
      (member) => member.id && member.id.toString() === userId && roleNames.includes(member.role)
    );
    if (checkMemberRole) {
      next();
      return;
    }

    res.status(403).json({ errors: 'authorization failed' });
  } catch (err) {
    if (err instanceof Error) {
      res.status(403).json({ errors: err.message });
      return;
    }
    res.status(403).json({ errors: 'authorization failed' });
  }
};

interface article {
  id: Types.ObjectId;
  project_id: {
    id: Types.ObjectId;
    name: string;
    team_id: Types.ObjectId;
    main: String;
    createBy: Types.ObjectId;
    branch: [
      {
        name: String;
        createBy: Types.ObjectId;
        merge_request: boolean;
      }
    ];
  };
  article_id: string;
  title: string;
  story: string;
  branch: string;
  history: HistoryEntry[][];
  previous_index: number | null;
}

interface HistoryEntry {
  diffs: [number, string][];
  start1: number;
  start2: number;
  length1: number;
  length2: number;
}

export const articleAuthorization = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = res.locals.userId;
    const branch = req.params.branch;
    const articleId = req.params.articleId;
    const article: article | null = await articles.findOne({ article_id: articleId }).populate('project_id');
    const isOwner = article?.project_id?.createBy?.toString() === userId;

    if (branch === 'main' && isOwner) {
      console.log('owner');
      res.locals.edit = true;
      next();
      return;
    }

    const hasMatchingBranch = article?.project_id?.branch.some(
      (branchObj) => branchObj.createBy?.toString() === userId && branchObj.name === branch
    );

    if (hasMatchingBranch) {
      console.log('member');
      res.locals.edit = true;
      next();
      return;
    }

    res.locals.edit = false;
    console.log('false');
    next();
  } catch (err) {
    console.log(err);
    if (err instanceof Error) {
      res.status(403).json({ errors: err.message });
    } else {
      res.status(403).json({ errors: 'authorization failed' });
    }
  }
};
