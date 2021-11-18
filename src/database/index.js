const Sequelize = require('sequelize');
const dbConfig = require('../config/database');

const User = require('../app/models/User');
const Barbershop = require('../app/models/Barbershops');
const Product = require('../app/models/Product');

const connection = new Sequelize(dbConfig)

User.init(connection);
Barbershop.init(connection);
Product.init(connection);

User.associate(connection.models);
Barbershop.associate(connection.models);
Product.associate(connection.models);

module.exports = connection