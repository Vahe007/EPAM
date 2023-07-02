import express from 'express';
import { UserController } from "./UserController.js";
import { Request, Response, NextFunction } from 'express';


export const router = express.Router();
const controller = new UserController();

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authKey = req.get('api-key');
    if (authKey !== 'secret key') return next(401);
    next()
}

function errorHandler(error: Number, req: Request, res: Response, next: NextFunction) {
    switch (error) {
        case 401:
            res.status(401).send('401 Unauthorized');
            break;
        case 400:
            res.status(400).send('400 Bad Request');
            break;
        case 404:
            res.status(404).send('400 Bad Request');
            break;
        case 422:
            res.status(422).send('422 Unprocessable Entity');
            break;
        default:
            res.status(500).send('500 server error');
    }
}


router.use(express.json())
router.use(authMiddleware)


router.get('/users', (req: Request, res: Response) => {
    controller.getAll(req, res);
})

router.get('/users/:id', (req: Request, res: Response, next: NextFunction) => {
    controller.get(req, res, next);
})

router.post('/create', (req: Request, res: Response, next: NextFunction) => {
    controller.create(req, res, next);
})

router.patch('/activate/:id', (req: Request, res: Response, next: NextFunction) => {
    controller.activate(req, res, next);
})

router.delete('/users/:id', (req: Request, res: Response, next: NextFunction) => {
    controller.delete(req, res, next);
})
