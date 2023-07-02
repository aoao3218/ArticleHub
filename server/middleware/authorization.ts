import { Request, Response, NextFunction } from 'express';
import teams from '../models/team.js';
import articles from '../models/article.js';
import { Types } from 'mongoose';
import projects from '../models/project.js';
import { object } from 'zod';

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
    const projectId = req.params.projectId;
    const project = await projects.findById(projectId);
    const isOwner = project?.createBy?.toString() === userId;
    if (branch === 'main' && isOwner) {
      console.log('owner');
      res.locals.edit = true;
      next();
      return;
    }

    const hasMatchingBranch = project?.branch.some(
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

export const branchAuthorization = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = res.locals.userId;
    const { branch } = req.params;
    const { projectId } = req.params;
    const project = await projects.findById(projectId);
    const result = project?.branch.find((obj) => obj.name === branch && obj.createBy.toString() === userId);
    if (!result) {
      return res.status(403).json({ errors: 'authorization failed' });
    }

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
