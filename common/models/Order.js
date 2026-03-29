const { DataTypes } = require('sequelize');

const OrderModel = {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    customerId: { type: DataTypes.INTEGER, foreignKey: true },
    createdAt: { type: DataTypes.DATE, allowNull: false },
    updatedAt: { type: DataTypes.DATE, allowNull: false },
    status: { type: DataTypes.STRING, allowNull: false },
    subtotal: { type: DataTypes.DECIMAL, allowNull: false },
    taxAmount: { type: DataTypes.DECIMAL, allowNull: false },
    shippingAmount: { type: DataTypes.DECIMAL, allowNull: false },
    totalAmount: { type: DataTypes.DECIMAL, allowNull: false },
    shippingMethod: { type: DataTypes.STRING, allowNull: false },
    paymentMethod: { type: DataTypes.STRING, allowNull: false }
};

module.exports = (sequelize) => sequelize.define('order', OrderModel);