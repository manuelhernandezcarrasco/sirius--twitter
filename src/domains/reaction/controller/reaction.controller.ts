import { BodyValidation, db } from "@utils";
import { Request, Response, Router } from "express";
import httpStatus from "http-status";
import { ManageReactionDTO } from "../dto";
import { ReactionRepositoryImpl } from "../repository";
import { ReactionService, ReactionServiceImpl } from "../service";

export const reactionRouter = Router();

const service: ReactionService = new ReactionServiceImpl(new ReactionRepositoryImpl(db));

/**
 * @swagger
 * tags: 
 *  name: Reaction
 * /api/reaction/{post_id}:
 *  post:
 *    parameters: 
 *    - in: path
 *      name: post_id
 *      required: true
 *    summary: delete reaction
 *    security:
 *      - auth: []
 *    tags: [Reaction]
 *    requestBody:
 *      required: true
 *      content: 
 *        application/json:
 *          schema:
 *            $ref: "#/components/schemas/manageReactionDTO"
 *    responses:
 *      204: 
 *        description: react to post
 *      400:
 *        description: reaction already exists
 *      500:
 *        description: internal server error
 */
reactionRouter.post('/:post_id', BodyValidation(ManageReactionDTO), async(req:Request, res: Response) => {
    const {userId} = res.locals.context;
    const {post_id} = req.params;
    const {type} = req.body;

    const reaction = await service.createReaction(userId, post_id, type);
    
    return res.status(httpStatus.CREATED).json(reaction);
});

/**
 * @swagger
 * tags: 
 *  name: Reaction
 * /api/reaction/{post_id}:
 *  delete:
 *    parameters: 
 *    - in: path
 *      name: post_id
 *      required: true
 *    summary: delete reaction
 *    security:
 *      - auth: []
 *    tags: [Reaction]
 *    requestBody:
 *      required: true
 *      content: 
 *        application/json:
 *          schema:
 *            $ref: "#/components/schemas/manageReactionDTO"
 *    responses:
 *      204: 
 *        description: reaction deleted
 *      404:
 *        description: reaction not found
 *      500:
 *        description: internal server error
 */
reactionRouter.delete('/:post_id', BodyValidation(ManageReactionDTO), async(req: Request, res: Response) => {
    const {userId} = res.locals.context;
    const {post_id} = req.params;
    const {type} = req.body;

    const reaction = await service.deleteReaction(userId, post_id, type);
    
    return res.status(httpStatus.NO_CONTENT);
});