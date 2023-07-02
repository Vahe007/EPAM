import { UserService } from "./UserService";
import { Request, Response, NextFunction } from "express";
import { IUser } from "./UserService";

export class UserController {
    service: UserService;
    constructor() {
        this.service = new UserService();
    }

    get(req: Request, res: Response, next: NextFunction) {
        const userId = req.params.id;
        if (isNaN(+userId)) return next(401);

        const user: IUser | undefined = this.service.get(userId);
        if (!user) return next(404);

        generateResponse(res, 'application/json', user, 200);
    }

    getAll(req: Request, res: Response) {
        const users: IUser[] | string = this.service.getAll();
        generateResponse(res, 'application/json', users, 200);
    }

    create(req: Request, res: Response, next: NextFunction) {
        const newUser: IUser = this.service.create(req.body);
        const { name, age, gender, status } = req.body;

        if (!name || !age || !gender || !status) return next(422);

        generateResponse(res, 'application/json', newUser, 201);
    }

    activate(req: Request, res: Response, next: NextFunction) {
        const activatedUser: IUser | undefined = this.service.activate(req.params.id);
        if (!activatedUser) next(404);
        generateResponse(res, 'application/json', activatedUser, 201);
    }

    delete(req: Request, res: Response, next: NextFunction) {
        const removed: IUser | undefined = this.service.delete(req.params.id);
        if (!removed) next(404);
        generateResponse(res, 'application/json', removed, 204);
    }
}

function generateResponse(res: Response, contentType: string, payload: IUser | IUser[] | string | undefined, status: number) {
    res.setHeader('Content-Type', contentType);
    res.status(status).send(payload);
}
