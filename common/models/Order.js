const { DataTypes } = require('sequelize');

const OrderModel = {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    customerId: { type: DataTypes.INTEGER, foreignKey: true },
    createdAt: { type: DataTypes.DATE, allowNull: false },
    updatedAt: { type: DataTypes.DATE, allowNull: false },
    status: { type: DataTypes.STRING, allowNull: false },
    subtotal: { type: DataTypes.FLOAT, allowNull: false },
    taxAmount: { type: DataTypes.FLOAT, allowNull: false },
    shippingAmount: { type: DataTypes.FLOAT, allowNull: false },
    totalAmount: { type: DataTypes.FLOAT, allowNull: false },
    shippingMethod: { type: DataTypes.STRING, allowNull: false },
    paymentMethod: { type: DataTypes.STRING, allowNull: false }
};

module.exports = (sequelize) => sequelize.define('order', OrderModel);