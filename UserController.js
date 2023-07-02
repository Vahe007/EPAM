import { UserService } from "./UserService.js";

export class UserController {
    constructor() {
        this.service = new UserService();
    }

    get(req, res) {
        const userId = req.params.id;
        const user = this.service.get(userId);
        res.setHeader('Content-Type', 'application/json');
        res.status(201).json(user);
    }

    getAll(req, res) {
        const users = this.service.getAll();
        res.setHeader('Content-Type', 'application/json');
        res.status(201).json(users);
    }

    create(req, res) {
        const newUser = this.service.create(req.body);
        res.setHeader('Content-Type', 'application/json');
        res.send(newUser);
    }

    activate(req, res) {
        const activatedUser = this.service.activate(req.params.id);
        console.log('activatedUser', activatedUser)
        res.setHeader('Content-Type', 'application/json');
        res.send(activatedUser);
    }

    delete(req, res) {
        const removed = this.service.delete(req.params.id);
        res.setHeader('Content-Type', 'application/json');
        res.send(removed);
    }
}
