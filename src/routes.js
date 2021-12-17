const express = require('express');
const authMiddleware = require('./app/middlewares/auth');

const UserController = require('./app/controllers/UserController');
const AuthController = require('./app/controllers/AuthController');
const BarbershopController = require('./app/controllers/BarbershopController');
const BarbershopBarberController = require('./app/controllers/BarbershopBarberController');
const ProductController = require('./app/controllers/ProductController');
const ReserveController = require('./app/controllers/ReserveController');

const routes =  express.Router();

/* Usuário */
routes.get('/users', authMiddleware, UserController.index);
routes.post('/users', UserController.store);

/* Login */
routes.post('/login', AuthController.auth)
routes.post('/forgot_password', AuthController.forgotPassword);
routes.post('/reset_password', AuthController.resetPassword);

/* Barbearia */
routes.get('/users/:user_id/barbershop', authMiddleware, BarbershopController.indexFromUser)
routes.post('/users/:user_id/barbershop', authMiddleware, BarbershopController.store)
routes.delete('/barbershop/:barbershop_id', authMiddleware, BarbershopController.remove)
routes.put('/barbershop/:barbershop_id', authMiddleware, BarbershopController.update)
routes.get('/barbershop', authMiddleware, BarbershopController.index)
routes.get('/barbershop/:barbershop_id', authMiddleware, BarbershopController.indexFromId)

/* Barbeiros da barbearia */
routes.get('/barbershop/:barbershop_id/barber/', authMiddleware, BarbershopBarberController.index)
routes.get('/barbershop/:barbershop_id/barber/:user_id', authMiddleware, BarbershopBarberController.indexFromUser)
routes.delete('/barbershop/:barbershop_id/barber/:user_id', authMiddleware, BarbershopBarberController.removeBarber)
routes.post('/barbershop/:barbershop_id/barber/:user_id', authMiddleware, BarbershopBarberController.store)

/* Produtos da conveniência da barbearia */
routes.post('/barbershop/:barbershop_id/products/', authMiddleware, ProductController.store)
routes.get('/barbershop/:barbershop_id/products/', authMiddleware, ProductController.index)
routes.get('/products/:product_id', authMiddleware, ProductController.indexFromId)
routes.put('/products/:product_id', authMiddleware, ProductController.update)
routes.delete('/products/:product_id', authMiddleware, ProductController.remove)

/* Reservas */
routes.post('/reserve/', authMiddleware, ReserveController.store)
routes.get('/reserve/', authMiddleware, ReserveController.index)
routes.get('/reserve/barber/:barber_id', authMiddleware, ReserveController.indexFromBarber)
routes.get('/reserve/barbershop/:barbershop_id', authMiddleware, ReserveController.indexFromBarbershop)
routes.get('/reserve/user/:user_id', authMiddleware, ReserveController.indexFromUser)
routes.put('/reserve/:reserve_id', authMiddleware, ReserveController.update)
routes.delete('/reserve/:reserve_id', authMiddleware, ReserveController.remove)

module.exports = routes;