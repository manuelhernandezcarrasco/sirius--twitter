import { db } from '@utils';
import { Request, Response, Router } from 'express';
import HttpStatus from 'http-status';
import { FollowerRepositoryImpl } from '../repository';
import { FollowerService, FollowerServiceImpl } from '../service';

export const followerRouter = Router();

const service: FollowerService = new FollowerServiceImpl(new FollowerRepositoryImpl(db));

/**
 * @swagger
 * tags: 
 *  name: Follow
 * /api/follow/{user_id}:
 *  post:
 *    parameters: 
 *    - in: path
 *      name: user_id
 *      required: true
 *    summary: follow user
 *    security:
 *      - auth: []
 *    tags: [Follow]
 *    responses:
 *      201: 
 *        description: followed user
 *      400:
 *        description: already following
 *      500:
 *        description: internal server error
 */
followerRouter.post('/follow/:user_id', async (req: Request, res: Response) => {
    const { userId } = res.locals.context;
    const { user_id } = req.params;

    const follow = await service.followUser(userId, user_id);

    return res.status(HttpStatus.CREATED).json(follow);
});

/**
 * @swagger
 * tags: 
 *  name: Follow
 * /api/unfollow/{user_id}:
 *  post:
 *    parameters: 
 *    - in: path
 *      name: user_id
 *      required: true
 *    summary: unfollow user
 *    security:
 *      - auth: []
 *    tags: [Follow]
 *    responses:
 *      201: 
 *        description: unfollowed user
 *      400:
 *        description: not following user
 *      500:
 *        description: internal server error
 */
followerRouter.post('/unfollow/:user_id', async (req: Request, res: Response) => {
    const { userId } = res.locals.context;
    const { user_id } = req.params;

    const follow = await service.unfollowUser(userId, user_id);

    return res.status(HttpStatus.CREATED).json(follow);
});