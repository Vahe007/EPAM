import express from "express";
// import { Request, Response } from 'express';
import { appendFile } from "fs";
import fs from 'fs';
import { UserController } from "./UserController.js";


export const router = express.Router();
const controller = new UserController();

const authMiddleware = (req, res, next) => {
    const authKey = req.get('api-key');
    if (authKey !== 'secret key') {
        return next(401)
    }
    next()
}

function errorHandler(error, req, res, next) {
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


router.get('/users', (req, res) => {
    controller.getAll(req, res);
})

router.get('/users/:id', (req, res, next) => {
    controller.get(req, res, next);
})

router.post('/create', (req, res) => {
    controller.create(req, res);
})

router.patch('/activate/:id', (req, res) => {
    controller.activate(req, res);
})

router.delete('/users/:id', (req, res, next) => {
    controller.delete(req, res);
})
