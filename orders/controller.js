const sequelize = require('../common/database');
const defineOrder = require('../common/models/Order');
const Order = defineOrder(sequelize);

exports.getOrder = async (req, res) => {
    const order = await Order.findByPk(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.status(200).json({ success: true, data: order });
};

exports.getAllOrders = async (req, res) => {
    const orders = await Order.findAll();
    res.status(200).json({ success: true, date: new Date(), data: orders });
};

exports.createOrder = async (req, res) => {
    try {
        const { customerId, status, subtotal, taxAmount, shippingAmount, shippingMethod, paymentMethod } = req.body;
        if (typeof customerId !== 'number') {
            throw new Error("CustomerId must be a number");
        } else if (!(["Pending", "Shipped", "Complete"].includes(status.trim()))) {
            throw new Error("Status must be a string");
        } else if (typeof subtotal !== 'number') {
            throw new Error("Subtotal must be a number");
        } else if (typeof taxAmount !== 'number') {
            throw new Error("TaxAmount must be a number");
        } else if (typeof shippingAmount !== 'number') {
            throw new Error("ShippingAmount must be a number");
        } else if (typeof shippingMethod !== 'string') {
            throw new Error("ShippingMethod must be a string");
        } else if (typeof paymentMethod !== 'string') {
            throw new Error("PaymentMethod must be a string");
        }

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
        if (err.message !== null) {
            res.status(400).json({ success: false, error: err.message});
        }
        res.status(500).json({ success: false, error: err.message });
    }
};

exports.updateOrder = async (req, res) => {
    try {
        const order = await Order.findByPk(req.params.id);
        if (!order) return res.status(404).json({error: 'Order not found'});
        if ('customerId' in req.body) {
            if (typeof req.body["customerId"] !== 'number') {
                throw new Error("CustomerId must be a number");
            }
        } else if ('status' in req.body) {
            if (!(["Pending", "Shipped", "Complete"].includes(req.body["status"]))) {
                throw new Error("Status must be a string");
            }
        } else if ('subtotal' in req.body) {
            if (typeof req.body["subtotal"] !== 'number') {
                throw new Error("Subtotal must be a number");
            }
        } else if ('taxAmount' in req.body) {
            if (typeof req.body["taxAmount"] !== 'number') {
                throw new Error("TaxAmount must be a number");
            }
        } else if ('shippingAmount' in req.body) {
            if (typeof req.body["shippingAmount"] !== 'number') {
                throw new Error("ShippingAmount must be a number");
            }
        } else if ('shippingMethod' in req.body) {
            if (typeof req.body["shippingMethod"] !== 'string') {
                throw new Error("ShippingMethod must be a string");
            }
        } else if ('paymentMethod' in req.body) {
            if (typeof req.body["paymentMethod"] !== 'string') {
                throw new Error("PaymentMethod must be a string");
            }
        }
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
    } catch (err) {
        if (err.message !== null) {
            res.status(400).json({ success: false, error: err.message});
        }
        res.status(500).json({ success: false, error: err.message });
    }
}

exports.deleteOrder = async (req, res) => {
    const order = await Order.findByPk(req.params.id);
    if (!order) return res.status(404).json({ error: 'No orders found for the provided `id`' });
    await order.destroy();

    res.status(204);
}

module.exports._Order = Order;