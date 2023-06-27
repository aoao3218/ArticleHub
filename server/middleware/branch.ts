import { Request, Response, NextFunction } from 'express';

type Middleware = (req: Request, res: Response, next: NextFunction) => void;
type TestFn = (req: Request, res: Response) => boolean;

const branch = (testFn: TestFn, left: Middleware | Middleware[], right?: Middleware | Middleware[]) =>
  function middleware(req: Request, res: Response, next: NextFunction) {
    const execution = testFn(req, res) ? left : right;

    if (typeof execution === 'undefined') {
      next();
      return;
    }

    if (typeof execution === 'function') {
      execution(req, res, next);
      return;
    }

    const execute = (targetIndex: number) => {
      const done = () => {
        if (targetIndex === execution.length - 1) {
          next();
        } else {
          execute(targetIndex + 1);
        }
      };
      execution[targetIndex](req, res, done);
    };
    execute(0);
  };

export default branch;
