const Sequelize = require('sequelize');
const dbConfig = require('../config/database');

const User = require('../app/models/User');
const Barbershop = require('../app/models/Barbershops');

const connection = new Sequelize(dbConfig)

User.init(connection);
Barbershop.init(connection);

User.associate(connection.models);
Barbershop.associate(connection.models);

module.exports = connection