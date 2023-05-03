import { Request, Response, Router } from 'express';
import HttpStatus from 'http-status';
import "express-async-errors";

import { db, BodyValidation } from '../../../utils';
import { UserRepositoryImpl } from '../../../domains/user/repository';

import { AuthService, AuthServiceImpl } from '../service';
import { LoginInputDTO, SignupInputDTO } from '../dto';

export const authRouter = Router();

// Use dependency injection
const service: AuthService = new AuthServiceImpl(new UserRepositoryImpl(db));

/**
 * @swagger
 * tags: 
 *  name: Auth
 * /api/auth/signup:
 *  post:
 *    summary: create new user
 *    tags: [Auth]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: "#/components/schemas/signUpInputDTO"
 *    responses:
 *      201: 
 *        description: user created
 *      409:
 *        description: user already exists
 *      500:
 *        description: internal server error
 */
authRouter.post('/signup', BodyValidation(SignupInputDTO), async (req: Request, res: Response) => {
  const data = req.body;

  const token = await service.signup(data);

  return res.status(HttpStatus.CREATED).json(token);
});

/**
 * @swagger
 * tags: 
 *  name: Auth
 * /api/auth/login:
 *  post:
 *    summary: login user
 *    tags: [Auth]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: "#/components/schemas/loginInputDTO"
 *    responses:
 *      201: 
 *        description: user logged in
 *      401:
 *        description: incorrect password
 *      500:
 *        description: internal server error
 */

authRouter.post('/login', BodyValidation(LoginInputDTO), async (req: Request, res: Response) => {
  const data = req.body;

  const token = await service.login(data);

  return res.status(HttpStatus.OK).json(token);
});
