import { Request, Response, Router } from 'express';
import HttpStatus from 'http-status';
import "express-async-errors";

export const healthRouter = Router();

/**
 * @swagger
 * tags: 
 *  name: Health
 * /api/health:
 *  get:
 *    summary: app health
 *    tags: [Health]
 *    responses:
 *      200: 
 *        description: ok
 */
healthRouter.get('/', (req: Request, res: Response) => {
  return res.status(HttpStatus.OK).send();
});
