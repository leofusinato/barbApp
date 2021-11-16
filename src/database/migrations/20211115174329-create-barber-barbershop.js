'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
     await queryInterface.createTable('barber_barbershop', { 
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
       barbershop_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {model: 'barbershops', key: 'id'},
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
       },
       user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {model: 'users', key: 'id'},
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
     });
  },

  down: async (queryInterface, Sequelize) => {
     await queryInterface.dropTable('barber_barbershop');
  }
};
