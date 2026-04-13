const { expect } = require('chai');
const sinon = require('sinon');
const orderController = require('../orders/controller');
const Order = orderController._Order;
const mockReq = (body = {}) => ({ body });
const mockRes = () => {
    const res = {};
    res.status = sinon.stub().returns(res);
    res.json = sinon.stub().returns(res);
    res.send = sinon.stub().returns(res);
    return res;
};

describe('Orders Controller', () => {
    describe('Create Order', () => {
        let orderCreateStub;
        let clock;

        beforeEach(() => {
            orderCreateStub = sinon.stub(Order, 'create');
            clock = sinon.useFakeTimers();
        });

        afterEach(() => {
            sinon.restore();
        });

        it('should return 201 and the created order', async () => {
            const fakeOrderData = {
                id: 1,
                customerId: 42,
                status: 'Pending',
                subtotal: 100,
                taxAmount: 8,
                shippingAmount: 5,
                totalAmount: 113,
                shippingMethod: 'Ground',
                paymentMethod: 'Credit Card',
                createdAt: new Date(),
                updatedAt: new Date()
            };

            orderCreateStub.resolves(fakeOrderData);

            const req = mockReq({
                customerId: 42,
                status: 'Pending',
                subtotal: 100,
                taxAmount: 8,
                shippingAmount: 5,
                shippingMethod: 'Ground',
                paymentMethod: 'Credit Card'
            });
            const res = mockRes();

            const controllerPromise = orderController.createOrder(req, res);
            await clock.tickAsync(2000);
            await controllerPromise;

            expect(orderCreateStub.calledOnce).to.be.true;
            expect(res.status.calledWith(201)).to.be.true;
            expect(res.json.calledOnce).to.be.true;

            const callArgs = orderCreateStub.firstCall.args[0];

            expect(callArgs.customerId).to.equal(fakeOrderData.customerId);
            expect(callArgs.status).to.equal(fakeOrderData.status);
            expect(callArgs.paymentMethod).to.equal(fakeOrderData.paymentMethod);
            expect(callArgs.totalAmount).to.equal(fakeOrderData.totalAmount);
        });

        it('should return 500 with an error message when Order.create throws', async () => {
            orderCreateStub.rejects(new Error('Database connection failed'));

            const req = mockReq({
                customerId: 99,
                status: 'Pending',
                subtotal: 50,
                taxAmount: 4,
                shippingAmount: 3,
                shippingMethod: 'Priority',
                paymentMethod: 'Cash'
            });
            const res = mockRes();

            await orderController.createOrder(req, res);

            expect(res.status.calledWith(500)).to.be.true;
            expect(res.json.calledOnce).to.be.true;
            expect(res.json.firstCall.args[0]).to.deep.equal({
                success: false,
                error: 'Database connection failed'
            });
        });
    });
    describe('Get Order', () => {
        let orderGetStub;
        let clock;

        beforeEach(() => {
            orderGetStub = sinon.stub(Order, 'findByPk');
            clock = sinon.useFakeTimers();
        });

        afterEach(() => {
            sinon.restore();
        });

        it('should return 200 and the matching order', async () => {
            const fakeOrderData = {
                id: 1,
                customerId: 42,
                status: 'Pending',
                subtotal: 100,
                taxAmount: 8,
                shippingAmount: 5,
                totalAmount: 113,
                shippingMethod: 'Ground',
                paymentMethod: 'Credit Card',
                createdAt: new Date(),
                updatedAt: new Date()
            };

            orderGetStub.resolves(fakeOrderData);

            const req = { params: { id: 1 } };
            const res = mockRes();

            await orderController.getOrder(req, res);
            expect(orderGetStub.calledWith(1)).to.be.true;
            expect(res.json.firstCall.args[0]).to.deep.equal({ success: true, data: fakeOrderData });
        });

        it('should return 404 when order is not found', async () => {
            orderGetStub.resolves(null);

            const req = { params: { id: 999 } };
            const res = mockRes();

            await orderController.getOrder(req, res);

            expect(orderGetStub.calledWith(999)).to.be.true;
            expect(res.status.calledWith(404)).to.be.true;
            expect(res.json.firstCall.args[0]).to.deep.equal({ error: 'Order not found' });
        });
    });

    describe('Get All Orders', () => {
        let orderGetStub;
        let clock;

        beforeEach(() => {
            orderGetStub = sinon.stub(Order, 'findAll');
            clock = sinon.useFakeTimers();
        });

        afterEach(() => {
            sinon.restore();
        });

        it('should return 200 and a list of orders', async () => {
            const fakeOrderData = [{
                id: 1,
                customerId: 42,
                status: 'Pending',
                subtotal: 100,
                taxAmount: 8,
                shippingAmount: 5,
                totalAmount: 113,
                shippingMethod: 'Ground',
                paymentMethod: 'Credit Card',
                createdAt: new Date(),
                updatedAt: new Date()
            }];

            orderGetStub.resolves(fakeOrderData);

            const req =  {};
            const res = mockRes();

            await orderController.getAllOrders(req, res);

            expect(orderGetStub.calledOnce).to.be.true;
            expect(res.json.firstCall.args[0]).to.deep.equal({ success: true, date: new Date(), data: fakeOrderData });
        });

        it('should return an empty list when no orders found', async () => {
            orderGetStub.resolves([]);

            const req = {};
            const res = mockRes();

            await orderController.getAllOrders(req, res);

            expect(orderGetStub.calledOnce).to.be.true;
            expect(res.json.firstCall.args[0]).to.deep.equal({ success: true, date: new Date(), data: [] });
        });
    });

    describe('Update Order', () => {
        let orderFindByPkStub;
        let clock;

        beforeEach(() => {
            orderFindByPkStub = sinon.stub(Order, 'findByPk');
            clock = sinon.useFakeTimers(new Date('2026-01-01'));
        });

        afterEach(() => {
            sinon.restore();
        });

        it('should update the order and return 200', async () => {
            const fakeOrder = {
                id: 1,
                customerId: 42,
                status: 'pending',
                subtotal: 100,
                taxAmount: 8,
                shippingAmount: 5,
                totalAmount: 113,
                shippingMethod: 'ground',
                paymentMethod: 'credit_card',
                save: sinon.stub().resolves()
            };

            orderFindByPkStub.resolves(fakeOrder);

            const req = {
                params: { id: 1 },
                body: { status: 'shipped', subtotal: 200 }
            };
            const res = mockRes();

            await orderController.updateOrder(req, res);

            expect(orderFindByPkStub.calledWith(1)).to.be.true;
            expect(fakeOrder.save.calledOnce).to.be.true;
            expect(fakeOrder.status).to.equal('shipped');
            expect(fakeOrder.subtotal).to.equal(200);
            expect(fakeOrder.totalAmount).to.equal(200 + 8 + 5); // recomputed totalAmount
            expect(fakeOrder.updatedAt).to.deep.equal(new Date('2026-01-01'));
            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.firstCall.args[0]).to.deep.equal({ success: true, data: fakeOrder });
        });

        it('should return 404 when order is not found', async () => {
            orderFindByPkStub.resolves(null);

            const req = { params: { id: 999 }, body: { status: 'shipped' } };
            const res = mockRes();

            await orderController.updateOrder(req, res);

            expect(orderFindByPkStub.calledWith(999)).to.be.true;
            expect(res.status.calledWith(404)).to.be.true;
            expect(res.json.firstCall.args[0]).to.deep.equal({ error: 'Order not found' });
        });
    });

    describe('Delete Order', () => {
        let orderFindByPkStub;

        beforeEach(() => {
            orderFindByPkStub = sinon.stub(Order, 'findByPk');
        });

        afterEach(() => {
            sinon.restore();
        });

        it('should delete the order and return 204', async () => {
            const fakeOrder = {
                id: 1,
                destroy: sinon.stub().resolves()
            };

            orderFindByPkStub.resolves(fakeOrder);

            const req = { params: { id: 1 } };
            const res = mockRes();

            await orderController.deleteOrder(req, res);

            expect(orderFindByPkStub.calledWith(1)).to.be.true;
            expect(fakeOrder.destroy.calledOnce).to.be.true;
            expect(res.status.calledWith(204)).to.be.true;
        });

        it('should return 404 when order is not found', async () => {
            orderFindByPkStub.resolves(null);

            const req = { params: { id: 999 } };
            const res = mockRes();

            await orderController.deleteOrder(req, res);

            expect(orderFindByPkStub.calledWith(999)).to.be.true;
            expect(res.status.calledWith(404)).to.be.true;
            expect(res.json.firstCall.args[0]).to.deep.equal({ error: 'No orders found for the provided `id`' });
        });
    });
});