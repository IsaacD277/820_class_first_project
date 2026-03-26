const router = require('express').Router();
const OrderController = require('./controller');

router.post('/', OrderController.createOrder);
router.get('/', OrderController.getAllOrders);
router.get('/:id', OrderController.getOrder);
router.patch('/:id', OrderController.updateOrder);
router.delete('/:id', OrderController.deleteOrder);

module.exports = router;