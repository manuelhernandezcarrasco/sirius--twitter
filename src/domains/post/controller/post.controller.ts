import { Request, Response, Router } from 'express';
import HttpStatus from 'http-status';
import "express-async-errors";

import { db, BodyValidation } from '../../../utils';

import { PostRepositoryImpl } from '../repository';
import { PostService, PostServiceImpl } from '../service';
import { CreatePostInputDTO } from '../dto';


export const postRouter = Router();

// Use dependency injection
const service: PostService = new PostServiceImpl(new PostRepositoryImpl(db));

/**
 * @swagger
 * tags: 
 *  name: Post
 * /api/post:
 *  get:
 *    parameters: 
 *    - in: query
 *      name: limit
 *      schema:
 *        type: integer
 *    - in: query
 *      name: before
 *      schema:
 *        type: string
 *    - in: query
 *      name: after
 *      schema:
 *        type: string
 *    summary: get latest posts
 *    security:
 *      - auth: []
 *    tags: [Post]
 *    responses:
 *      200: 
 *        description: return posts
 *      500:
 *        description: internal server error
 */
postRouter.get('/', async (req: Request, res: Response) => {
  const { userId } = res.locals.context;
  const { limit, before, after } = req.query as Record<string, string>;

  const posts = await service.getLatestPosts(userId, { limit: Number(limit), before, after });

  return res.status(HttpStatus.OK).json(posts);
});

/**
 * @swagger
 * tags: 
 *  name: Post
 * /api/post/{postId}:
 *  get:
 *    parameters: 
 *    - in: path
 *      name: postId
 *      required: true
 *    summary: get post by id
 *    security:
 *      - auth: []
 *    tags: [Post]
 *    responses:
 *      200: 
 *        description: return post
 *      404:
 *        description: post not found
 *      500:
 *        description: internal server error
 */
postRouter.get('/:postId', async (req: Request, res: Response) => {
  const { userId } = res.locals.context;
  const { postId } = req.params;

  const post = await service.getPost(userId, postId);

  return res.status(HttpStatus.OK).json(post);
});

/**
 * @swagger
 * tags: 
 *  name: Post
 * /api/post/by_user/{userId}:
 *  get:
 *    parameters: 
 *    - in: path
 *      name: userId
 *      required: true
 *    - in: query
 *      name: limit
 *      schema:
 *        type: integer
 *    - in: query
 *      name: before
 *      schema:
 *        type: string
 *    - in: query
 *      name: after
 *      schema:
 *        type: string
 *    summary: get posts by user
 *    security:
 *      - auth: [] 
 *    tags: [Post]
 *    responses:
 *      200: 
 *        description: return user posts
 *      404:
 *        description: post not found
 *      500:
 *        description: internal server error
 */
postRouter.get('/by_user/:userId', async (req: Request, res: Response) => {
  const { userId } = res.locals.context;
  const { userId: authorId } = req.params;
  const { limit, before, after } = req.query as Record<string, string>;

  const posts = await service.getPostsByAuthor(userId, authorId, {limit: Number(limit), before, after });

  return res.status(HttpStatus.OK).json(posts);
});

/**
 * @swagger
 * tags: 
 *  name: Post
 * /api/post:
 *  post:
 *    summary: create new post
 *    security:
 *      - auth: []
 *    tags: [Post]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: "#/components/schemas/createPostInputDTO"
 *    responses:
 *      201: 
 *        description: create new post
 *      500:
 *        description: internal server error
 */
postRouter.post('/', BodyValidation(CreatePostInputDTO) ,async (req: Request, res: Response) => {
  const { userId } = res.locals.context;
  const data = req.body;

  const post = await service.createPost(userId, data);

  return res.status(HttpStatus.CREATED).json(post);
});

/**
 * @swagger
 * tags: 
 *  name: Post
 * /api/post/{postId}:
 *  delete:
 *    parameters: 
 *    - in: path
 *      name: postId
 *      required: true
 *    summary: delete post
 *    security:
 *      - auth: []
 *    tags: [Post]
 *    responses:
 *      200: 
 *        description: delete post
 *      500:
 *        description: internal server error
 */
postRouter.delete('/:postId', async (req: Request, res: Response) => {
  const { userId } = res.locals.context;
  const { postId } = req.params;

  await service.deletePost(userId, postId);

  return res.status(HttpStatus.OK);
});

/**
 * @swagger
 * tags: 
 *  name: Post
 * /api/post/comments/{user_id}:
 *  get:
 *    parameters: 
 *    - in: path
 *      name: user_id
 *      required: true
 *    summary: get user comments with post
 *    security:
 *      - auth: []
 *    tags: [Post]
 *    responses:
 *      200: 
 *        description: get user comments
 *      404:
 *        description: comment not found
 *      500:
 *        description: internal server error
 */
postRouter.get('/comment/:user_id', async(req: Request, res: Response) => {
  const { userId } = res.locals.context;
  const {user_id} = req.params;

  const comments = await service.getUserComments(userId, user_id);

  return res.status(HttpStatus.OK).json(comments);
});