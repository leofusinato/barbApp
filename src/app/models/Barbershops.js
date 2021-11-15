const { Model, DataTypes } = require('sequelize');

class Barbershop extends Model {
    static init(sequelize){
        super.init({
            name: DataTypes.STRING,
            phone: DataTypes.STRING,
            address: DataTypes.STRING,
        }, {
            sequelize
        })
    }
    static associate(models) {
        this.belongsTo(models.User, { foreignKey: 'user_id', as: 'owner' });
    }
}

module.exports = Barbershop;