const express = require('express');
const authMiddleware = require('./app/middlewares/auth');

const UserController = require('./app/controllers/UserController');
const AuthController = require('./app/controllers/AuthController');

const routes =  express.Router();

routes.get('/users', authMiddleware, UserController.index);
routes.post('/users', UserController.store);

routes.post('/login', AuthController.auth)
routes.post('/forgot_password', AuthController.forgotPassword);
routes.post('/reset_password', AuthController.resetPassword);


module.exports = routes;
