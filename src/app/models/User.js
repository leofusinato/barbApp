const { Model, DataTypes } = require('sequelize');

class User extends Model {
    static init(sequelize){
        super.init({
            name: DataTypes.STRING,
            email: DataTypes.STRING,
            password: DataTypes.STRING,
            is_barber: DataTypes.BOOLEAN,
            passwordResetToken: DataTypes.STRING,
            passwordResetExpires: DataTypes.DATE,
        }, {
            sequelize
        })
    }
    static associate(models) {
        this.hasMany(models.Barbershop, { foreignKey: 'user_id', as: 'barbershops' });
        this.hasMany(models.Reserve, { foreignKey: 'user_id', as: 'user' });
        this.hasMany(models.Reserve, { foreignKey: 'barber_id', as: 'barber' });
        this.belongsToMany(models.Barbershop, { foreignKey: 'user_id', through: 'barber_barbershop', as: 'barbershop'})
    }
}

module.exports = User;