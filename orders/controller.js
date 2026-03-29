const sequelize = require('../common/database');
const defineOrder = require('../common/models/Order');
const Order = defineOrder(sequelize);

exports.getOrder = async (req, res) => {
    const order = await Order.findByPk(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json({ success: true, data: order });
};

exports.getAllOrders = async (req, res) => {
    const orders = await Order.findAll();
    res.json({ success: true, data: orders });
};

exports.createOrder = async (req, res) => {
    try {
        const { customerId, status, subtotal, taxAmount, shippingAmount, shippingMethod, paymentMethod } = req.body;
        const order = await Order.create({
            customerId,
            createdAt: new Date(),
            updatedAt: new Date(),
            status,
            subtotal,
            taxAmount,
            shippingAmount,
            totalAmount: subtotal + taxAmount + shippingAmount,
            shippingMethod,
            paymentMethod
        });
        await new Promise(resolve => setTimeout(resolve, 2000));
        res.status(201).json({
            success: true,
            data: order
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

exports.updateOrder = async (req, res) => {
    const order = await Order.findByPk(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    const updatableFields = ["status", "subtotal", "taxAmount", "shippingAmount", "shippingMethod", "paymentMethod"];
    for (const field of updatableFields) {
        const value = req.body[field];
        if (value !== undefined) {
            order[field] = value;
        }
    }
    order.totalAmount = order.subtotal + order.taxAmount + order.shippingAmount
    order.updatedAt = new Date();
    await order.save();

    res.status(200).json({
        success: true,
        data: order
    });
}

exports.deleteOrder = async (req, res) => {
    const order = await Order.findByPk(req.params.id);
    if (!order) return res.status(404).json({ error: 'No orders found for the provided `id`' });
    await order.destroy();

    res.status(204).send();
}