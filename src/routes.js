const express = require('express');
const authMiddleware = require('./middlewares/auth');

const UserController = require('./controllers/UserController');
const AuthController = require('./controllers/AuthController');

const routes =  express.Router();

routes.get('/users', authMiddleware, UserController.index);
routes.post('/users', UserController.store);

routes.post('/login', AuthController.auth)


module.exports = routes;
