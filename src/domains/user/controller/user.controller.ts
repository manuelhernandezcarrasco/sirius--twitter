import { Request, Response, Router } from 'express';
import HttpStatus from 'http-status';
import "express-async-errors";

import { db } from '@utils';

import { UserRepositoryImpl } from '../repository';
import { UserService, UserServiceImpl } from '../service';

export const userRouter = Router();

// Use dependency injection
export const userService: UserService = new UserServiceImpl(new UserRepositoryImpl(db));

/**
 * @swagger
 * tags: 
 *  name: User
 * /api/user:
 *  get:
 *    parameters: 
 *    - in: query
 *      name: limit
 *      schema:
 *        type: integer
 *    - in: query
 *      name: skip
 *      schema:
 *        type: string
 *    summary: get user recommendations
 *    security:
 *      - auth: []
 *    tags: [User]
 *    responses:
 *      200: 
 *        description: get user recommendations
 *      500:
 *        description: internal server error
 */
userRouter.get('/', async (req: Request, res: Response) => {
  const { userId } = res.locals.context;
  const { limit, skip } = req.query as Record<string, string>;

  const users = await userService.getUserRecommendations(userId, { limit: Number(limit), skip: Number(skip) });

  return res.status(HttpStatus.OK).json(users);
});

/**
 * @swagger
 * tags: 
 *  name: User
 * /api/user/me:
 *  get:
 *    summary: get personal profile
 *    security:
 *      - auth: []
 *    tags: [User]
 *    responses:
 *      200: 
 *        description: get personal profile
 *      500:
 *        description: internal server error
 */
userRouter.get('/me', async (req: Request, res: Response) => {
  const { userId } = res.locals.context;

  const user = await userService.getUser(userId);

  return res.status(HttpStatus.OK).json(user);
});

/**
 * @swagger
 * tags: 
 *  name: User
 * /api/user/{userId}:
 *  get:
 *    parameters:
 *    - in: path
 *      name: userId
 *      required: true
 *    summary: get personal profile
 *    security:
 *      - auth: []
 *    tags: [User]
 *    responses:
 *      200: 
 *        description: get personal profile
 *      500:
 *        description: internal server error
 */
userRouter.get('/:userId', async (req: Request, res: Response) => {
  const { userId: otherUserId } = req.params;

  const user = await userService.getUser(otherUserId);

  return res.status(HttpStatus.OK).json(user);
});

/**
 * @swagger
 * tags: 
 *  name: User
 * /api/user:
 *  delete:
 *    summary: delete profile
 *    security:
 *      - auth: []
 *    tags: [User]
 *    responses:
 *      200: 
 *        description: delete personal profile
 *      500:
 *        description: internal server error
 */
userRouter.delete('/', async (req: Request, res: Response) => {
  const { userId } = res.locals.context;

  await userService.deleteUser(userId);

  return res.status(HttpStatus.OK);
});
