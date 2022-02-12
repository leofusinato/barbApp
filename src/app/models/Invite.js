const { Model, DataTypes } = require('sequelize');

class Invite extends Model {
    static init(sequelize){
        super.init({
            schedule: DataTypes.DATE,
            /**
             * 1 - pendente
             * 2 - confirmado
             * 3 - cancelado
             */
            situation: DataTypes.INTEGER,
        }, {
            sequelize
        })
    }
    static associate(models) {
        this.belongsTo(models.Barbershop, { foreignKey: 'barbershop_id', as: 'barbershop' });
        this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
        this.belongsTo(models.User, { foreignKey: 'barber_id', as: 'barber' });
    }
}

module.exports = Invite;