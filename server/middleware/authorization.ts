import { Request, Response, NextFunction } from 'express';
import teams from '../models/team.js';
import projects from '../models/project.js';

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
      (member) => member._id && member._id.toString() === userId && roleNames.includes(member.role)
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

export const articleAuthorization = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = res.locals.userId;
    const branch = req.params.branch;
    const projectId = req.params.projectId;
    const project = await projects.findById(projectId);
    const isOwner = project?.createBy?.toString() === userId;
    if (branch === 'main' && isOwner) {
      res.locals.edit = true;
      next();
      return;
    }

    const hasMatchingBranch = project?.branch.some(
      (branchObj) => branchObj.createBy?.toString() === userId && branchObj.name === branch
    );

    if (hasMatchingBranch) {
      res.locals.edit = true;
      next();
      return;
    }

    res.locals.edit = false;
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
    }
    res.status(403).json({ errors: 'authorization failed' });
  }
};
