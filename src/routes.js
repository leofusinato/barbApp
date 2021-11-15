const express = require('express');
const authMiddleware = require('./app/middlewares/auth');

const UserController = require('./app/controllers/UserController');
const AuthController = require('./app/controllers/AuthController');
const BarbershopController = require('./app/controllers/BarbershopController');

const routes =  express.Router();

routes.get('/users', authMiddleware, UserController.index);
routes.post('/users', UserController.store);

routes.post('/login', AuthController.auth)
routes.post('/forgot_password', AuthController.forgotPassword);
routes.post('/reset_password', AuthController.resetPassword);

routes.get('/users/:user_id/barbershop', authMiddleware, BarbershopController.indexFromUser)
routes.post('/users/:user_id/barbershop', authMiddleware, BarbershopController.store)
routes.delete('/barbershop/:barbershop_id', authMiddleware, BarbershopController.remove)
routes.put('/barbershop/:barbershop_id', authMiddleware, BarbershopController.update)
routes.get('/barbershop', authMiddleware, BarbershopController.index)

module.exports = routes;