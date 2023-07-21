import { NextFunction, Request, Response } from 'express';
import { ValidationError } from '../utils/errorHandler.js';
import teams from '../models/team.js';
import projects from '../models/project.js';

export async function createProject(req: Request, res: Response, next: NextFunction) {
  try {
    const { name } = req.body;
    const teamId = req.params.teamId;
    const userId = res.locals?.userId;
    const team = await teams.findOne({ _id: teamId, owner: userId });

    if (!team) throw new ValidationError('Not owner');

    const result = await projects.create({
      name,
      team_id: team,
      main: 'main',
      createBy: userId,
      branch: [],
    });

    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

export async function getProject(req: Request, res: Response, next: NextFunction) {
  try {
    const teamId = req.params.teamId;
    const result = await projects.find({ team_id: teamId });
    if (!result) throw new ValidationError('not found');
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}
