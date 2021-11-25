const { Model, DataTypes } = require('sequelize');

class Reserve extends Model {
    static init(sequelize){
        super.init({
            schedule: DataTypes.DATE,
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

module.exports = Reserve;