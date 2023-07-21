import { NextFunction, Request, Response } from 'express';
import { ValidationError } from '../utils/errorHandler.js';
import users from '../models/user.js';
import teams from '../models/team.js';
interface Team {
  toObject(): unknown;
  _id: string;
  name: string;
  owner: string;
  member: { id: string; name: string }[];
  own?: boolean;
}

export async function getTeam(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = res.locals?.userId;
    const team = await teams.find({ $or: [{ owner: userId }, { 'member._id': userId }] });
    const result = team.map((team) => {
      const teamObj: Team = team.toObject();
      teamObj.own = team.owner.toString() === userId;
      return teamObj;
    });
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

export async function createTeam(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, emails } = req.body;
    const userId = res.locals?.userId;
    const owner = await users.findById(userId);
    if (!owner) throw new ValidationError('No such account');
    const member = emails[0] !== '' ? await users.find({ email: { $in: emails } }) : [];
    if (emails[0] !== '' && emails.length !== member.length) throw new ValidationError('some email is invalid');
    const result = await teams.create({
      name: name,
      owner: owner,
      member: member,
    });
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

export async function inviteMember(req: Request, res: Response, next: NextFunction) {
  try {
    const { emails } = req.body;
    const teamId = req.params.teamId;
    const userId = res.locals?.userId ?? false;
    const member = await users.find({ email: { $in: emails } });
    if (emails.length !== member.length) throw new ValidationError('some email is invalid');
    const filter = { _id: teamId, owner: userId };
    if (!filter) throw new ValidationError('team not found or not owner');
    const update = { $push: { member: { $each: member } } };
    const result = await teams.updateOne(filter, update);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

export async function getMember(req: Request, res: Response, next: NextFunction) {
  try {
    const teamId = req.params.teamId;
    const result = await teams.findById(teamId).select('member');
    const memberIds = result?.member.map((member) => member._id?.toString());
    const memberEmails = await users.find({ _id: { $in: memberIds } }).select('email');
    res.status(200).json(memberEmails);
  } catch (err) {
    next(err);
  }
}
