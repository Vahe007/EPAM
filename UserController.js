import { UserService } from "./UserService.js";

export class UserController {
    constructor() {
        this.service = new UserService();
    }

    get(req, res, next) {
        const userId = req.params.id;
        if (isNaN(userId)) return next(401);

        const user = this.service.get(userId);
        if (!user) return next(404);

        generateResponse(res, 'application/json', user, 200);
    }

    getAll(req, res) {
        const users = this.service.getAll();
        generateResponse(res, 'application/json', users, 200);
    }

    create(req, res) {
        const newUser = this.service.create(req.body);
        const { name, age, gender, status } = req.body;

        if (!name || !age || !gender || !status) return next(422);

        generateResponse(res, 'application/json', newUser, 201);

    }

    activate(req, res) {
        const activatedUser = this.service.activate(req.params.id);
        if (!activatedUser) next(404);
        generateResponse(res, 'application/json', activatedUser, 201);
    }

    delete(req, res) {
        const removed = this.service.delete(req.params.id);
        if (!activatedUser) next(404);
        generateResponse(res, 'application/json', removed, 204);
    }
}


function generateResponse(res, contentType, payload, status) {
    res.setHeader('Content-Type', contentType);
    res.status(status).send(payload);
}
