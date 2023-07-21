import { NextFunction, Request, Response } from 'express';

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.message = message;
    this.name = 'ValidationError';
  }
}

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  console.error(err);
  if (err instanceof ValidationError) {
    res.status(400).json({ errors: err.message });
    return;
  }
  if (err instanceof Error) {
    res.status(400).json({ errors: err.message });
    return;
  }
  res.status(500).send('Ops, unknown error');
  return;
}
