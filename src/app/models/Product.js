const { Model, DataTypes } = require('sequelize');

class Product extends Model {
    static init(sequelize){
        super.init({
            name: DataTypes.STRING,
            value: DataTypes.DECIMAL
        }, {
            sequelize,
            tableName: 'barbershop_products'
        })
    }
    static associate(models) {
        this.belongsTo(models.Barbershop, { foreignKey: 'barbershop_id', as: 'barbershop' });
    }
}

module.exports = Product;