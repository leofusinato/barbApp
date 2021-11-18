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
        this.hasMany(models.Product, { foreignKey: 'barbershop_id', as: 'barbershop' });
        this.belongsToMany(models.User, { foreignKey: 'barbershop_id', through: 'barber_barbershop', as: 'users'})
    }
}

module.exports = Barbershop;