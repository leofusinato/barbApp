const { Model, DataTypes } = require('sequelize');

class User extends Model {
    static init(sequelize){
        super.init({
            name: DataTypes.STRING,
            email: DataTypes.STRING,
            password: DataTypes.STRING,
            passwordResetToken: DataTypes.STRING,
            passwordResetExpires: DataTypes.DATE,
        }, {
            sequelize
        })
    }
    static associate(models) {
        this.hasMany(models.Barbershop, { foreignKey: 'user_id', as: 'barbershops' });
        this.belongsToMany(models.Barbershop, { foreignKey: 'user_id', through: 'barber_barbershop', as: 'barbershop'})
    }
}

module.exports = User;