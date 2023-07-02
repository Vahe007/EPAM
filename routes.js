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
        return next('Invalid key')
    }
    next()
}

function errorHandler(error, req, res, next) {
    if (error) {
        return req.status(200).send(error);
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
