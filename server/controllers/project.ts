import { NextFunction, Request, Response } from 'express';
import { ValidationError } from '../utils/errorHandler.js';
import teams from '../models/team.js';
import projects from '../models/project.js';

export async function createProject(req: Request, res: Response) {
  try {
    const { name } = req.body;
    const teamId = req.params.teamId;
    const userId = res.locals?.userId ?? false;
    if (!userId) {
      throw new ValidationError('No userId');
    }
    const team = await teams.findOne({ _id: teamId, owner: userId });
    if (!team) {
      throw new ValidationError('Not owner');
    }

    const result = await projects.create({
      name,
      team_id: team,
      main: 'main',
      branch: [],
    });

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
    res.status(500).json({ errors: 'create Project failed' });
  }
}
