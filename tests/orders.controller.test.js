const mockOrderMethods = {
    create: jest.fn(),
    findByPk: jest.fn(),
    findAll: jest.fn(),
    save: jest.fn()
};

jest.mock('../common/models/Order', () => {
    return jest.fn(() => mockOrderMethods);
});

const orderController = require('../orders/controller');
const e = require("express");
const {updateOrder} = require("../orders/controller");


describe('Order Controller', () => {
    it('should return 201 and create a new order', async () => {
        const currentDate = new Date();
        const mockOrder = {
            id: 1,
            customerId: 42,
            status: 'Pending',
            subtotal: 100,
            taxAmount: 8,
            shippingAmount: 5,
            totalAmount: 113,
            shippingMethod: 'Ground',
            paymentMethod: 'Credit Card',
            createdAt: currentDate,
            updatedAt: currentDate
        };

        mockOrderMethods.create.mockResolvedValue(mockOrder);

        const req = { body: { customerId: 42, status: 'Pending', subtotal: 100, taxAmount: 8, shippingAmount: 5, shippingMethod: 'Ground', paymentMethod: 'Credit Card' }}
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await orderController.createOrder(req, res);

        expect(mockOrderMethods.create).toHaveBeenCalledWith(expect.objectContaining({ totalAmount: 113 }));
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            data: mockOrder
        });
    });

    describe('should return 400 Error status code and specify the error in the response body', () => {
        it('should return 400 Error status code and specify the invalid customerId', async () => {
            const currentDate = new Date();
            const mockOrder = {
                id: 1,
                customerId: 42,
                status: 'Pending',
                subtotal: 100,
                taxAmount: 8,
                shippingAmount: 5,
                totalAmount: 113,
                shippingMethod: 'Ground',
                paymentMethod: 'Credit Card',
                createdAt: currentDate,
                updatedAt: currentDate
            };

            mockOrderMethods.create.mockResolvedValue(mockOrder);

            const req = { body: { customerId: '42', status: 'Pending', subtotal: 100, taxAmount: 8, shippingAmount: 5, shippingMethod: 'Ground', paymentMethod: 'Credit Card' }}
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            await orderController.createOrder(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'CustomerId must be a number'}))
        });

        it('should return 400 Error status code and specify the invalid status', async () => {
            const currentDate = new Date();
            const mockOrder = {
                id: 1,
                customerId: 42,
                status: 'Pending',
                subtotal: 100,
                taxAmount: 8,
                shippingAmount: 5,
                totalAmount: 113,
                shippingMethod: 'Ground',
                paymentMethod: 'Credit Card',
                createdAt: currentDate,
                updatedAt: currentDate
            };

            mockOrderMethods.create.mockResolvedValue(mockOrder);

            const req = { body: { customerId: 42, status: 'New Order', subtotal: 100, taxAmount: 8, shippingAmount: 5, shippingMethod: 'Ground', paymentMethod: 'Credit Card' }}
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            await orderController.createOrder(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'Status must be a string'}))
        });

        it('should return 400 Error status code and specify the invalid subtotal', async () => {
            const currentDate = new Date();
            const mockOrder = {
                id: 1,
                customerId: 42,
                status: 'Pending',
                subtotal: 100,
                taxAmount: 8,
                shippingAmount: 5,
                totalAmount: 113,
                shippingMethod: 'Ground',
                paymentMethod: 'Credit Card',
                createdAt: currentDate,
                updatedAt: currentDate
            };

            mockOrderMethods.create.mockResolvedValue(mockOrder);

            const req = { body: { customerId: 42, status: 'Pending', subtotal: "100", taxAmount: 8, shippingAmount: 5, shippingMethod: 'Ground', paymentMethod: 'Credit Card' }}
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            await orderController.createOrder(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'Subtotal must be a number'}))
        });

        it('should return 400 Error status code and specify the invalid taxAmount', async () => {
            const currentDate = new Date();
            const mockOrder = {
                id: 1,
                customerId: 42,
                status: 'Pending',
                subtotal: 100,
                taxAmount: 8,
                shippingAmount: 5,
                totalAmount: 113,
                shippingMethod: 'Ground',
                paymentMethod: 'Credit Card',
                createdAt: currentDate,
                updatedAt: currentDate
            };

            mockOrderMethods.create.mockResolvedValue(mockOrder);

            const req = { body: { customerId: 42, status: 'Pending', subtotal: 100, taxAmount: [8], shippingAmount: 5, shippingMethod: 'Ground', paymentMethod: 'Credit Card' }}
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            await orderController.createOrder(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'TaxAmount must be a number'}))
        });

        it('should return 400 Error status code and specify the invalid shippingAmount', async () => {
            const currentDate = new Date();
            const mockOrder = {
                id: 1,
                customerId: 42,
                status: 'Pending',
                subtotal: 100,
                taxAmount: 8,
                shippingAmount: 5,
                totalAmount: 113,
                shippingMethod: 'Ground',
                paymentMethod: 'Credit Card',
                createdAt: currentDate,
                updatedAt: currentDate
            };

            mockOrderMethods.create.mockResolvedValue(mockOrder);

            const req = { body: { customerId: 42, status: 'Pending', subtotal: 100, taxAmount: 8, shippingAmount: true, shippingMethod: 'Ground', paymentMethod: 'Credit Card' }}
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            await orderController.createOrder(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'ShippingAmount must be a number'}))
        });

        it('should return 400 Error status code and specify the invalid shippingMethod', async () => {
            const currentDate = new Date();
            const mockOrder = {
                id: 1,
                customerId: 42,
                status: 'Pending',
                subtotal: 100,
                taxAmount: 8,
                shippingAmount: 5,
                totalAmount: 113,
                shippingMethod: 'Ground',
                paymentMethod: 'Credit Card',
                createdAt: currentDate,
                updatedAt: currentDate
            };

            mockOrderMethods.create.mockResolvedValue(mockOrder);

            const req = { body: { customerId: 42, status: 'Pending', subtotal: 100, taxAmount: 8, shippingAmount: 5, shippingMethod: ['Ground', 'Overnight'], paymentMethod: 'Credit Card' }}
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            await orderController.createOrder(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'ShippingMethod must be a string'}))
        });

        it('should return 400 Error status code and specify the invalid paymentMethod', async () => {
            const currentDate = new Date();
            const mockOrder = {
                id: 1,
                customerId: 42,
                status: 'Pending',
                subtotal: 100,
                taxAmount: 8,
                shippingAmount: 5,
                totalAmount: 113,
                shippingMethod: 'Ground',
                paymentMethod: 'Credit Card',
                createdAt: currentDate,
                updatedAt: currentDate
            };

            mockOrderMethods.create.mockResolvedValue(mockOrder);

            const req = { body: { customerId: 42, status: 'Pending', subtotal: 100, taxAmount: 8, shippingAmount: 5, shippingMethod: 'Ground', paymentMethod: 3 }}
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            await orderController.createOrder(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'PaymentMethod must be a string'}))
        });
    });



    it('should return 200 and a matching order when given a valid ID', async () => {
        const currentDate = new Date();
        const mockOrder = {
            id: 1,
            customerId: 42,
            status: 'Pending',
            subtotal: 100,
            taxAmount: 8,
            shippingAmount: 5,
            totalAmount: 113,
            shippingMethod: 'Ground',
            paymentMethod: 'Credit Card',
            createdAt: currentDate,
            updatedAt: currentDate
        };

        mockOrderMethods.findByPk.mockResolvedValue(mockOrder);

        const req = { params: { id: 1 } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await orderController.getOrder(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ data: expect.objectContaining({ id: 1, customerId: 42, status: 'Pending' })}));
    });

    it('should return 404 when no order matches the provided ID', async () => {
        mockOrderMethods.findByPk.mockResolvedValue(null);

        const req = { params: { id: 999 } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await orderController.getOrder(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'Order not found'}))
    });

    it('should return 200 and a list of all orders', async () => {
        const currentDate = new Date();
        const mockOrders = [
            {
                id: 1,
                customerId: 42,
                status: 'Pending',
                subtotal: 100,
                taxAmount: 8,
                shippingAmount: 5,
                totalAmount: 113,
                shippingMethod: 'Ground',
                paymentMethod: 'Credit Card',
                createdAt: currentDate,
                updatedAt: currentDate
            },
            {
                id: 2,
                customerId: 42,
                status: 'Shipped',
                subtotal: 100,
                taxAmount: 8,
                shippingAmount: 5,
                totalAmount: 113,
                shippingMethod: 'Ground',
                paymentMethod: 'Credit Card',
                createdAt: currentDate,
                updatedAt: currentDate
            }
        ];
        mockOrderMethods.findAll.mockResolvedValue(mockOrders);

        const req = {};
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await orderController.getAllOrders(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ data: expect.arrayContaining(mockOrders) }));
    });

    it('should return 200 and an empty list when no orders exist', async () => {
        const mockOrders = [];
        mockOrderMethods.findAll.mockResolvedValue(mockOrders);

        const req = {};
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await orderController.getAllOrders(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ data: expect.arrayContaining([]) }));
    });

    it('should return 200 and update the correct fields', async () => {
        const currentDate = new Date();
        const mockOrder = {
            id: 1,
            customerId: 42,
            status: 'Pending',
            subtotal: 100,
            taxAmount: 8,
            shippingAmount: 5,
            totalAmount: 113,
            shippingMethod: 'Ground',
            paymentMethod: 'Credit Card',
            createdAt: currentDate,
            updatedAt: currentDate,
            save: jest.fn().mockResolvedValue(true)
        };
        const saveSpy = jest.spyOn(mockOrder, 'save');
        mockOrderMethods.findByPk.mockResolvedValue(mockOrder);

        const req = { params: { id: 1 }, body: { status: 'Shipped', subtotal: 200 } }
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await orderController.updateOrder(req, res);

        expect(saveSpy).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ data: expect.objectContaining({ totalAmount: 213, status: 'Shipped' }) }));
    });

    describe('should return 400 Error status code and specify the error in the response body', () => {
        it('should return 400 Error status code and specify the invalid customerId', async () => {
            const currentDate = new Date();
            const mockOrder = {
                id: 1,
                customerId: 42,
                status: "Pending",
                subtotal: 100,
                taxAmount: 8,
                shippingAmount: 5,
                totalAmount: 113,
                shippingMethod: 'Ground',
                paymentMethod: 'Credit Card',
                createdAt: currentDate,
                updatedAt: currentDate,
                save: jest.fn().mockResolvedValue(true)
            };

            mockOrderMethods.findByPk.mockResolvedValue(mockOrder);

            const req = { params: { id: 1 }, body: { customerId: "3", subtotal: 200 } }
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            await orderController.updateOrder(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'CustomerId must be a number'}))
        });

        it('should return 400 Error status code and specify the invalid status', async () => {
            const currentDate = new Date();
            const mockOrder = {
                id: 1,
                customerId: 42,
                status: "Pending",
                subtotal: 100,
                taxAmount: 8,
                shippingAmount: 5,
                totalAmount: 113,
                shippingMethod: 'Ground',
                paymentMethod: 'Credit Card',
                createdAt: currentDate,
                updatedAt: currentDate,
                save: jest.fn().mockResolvedValue(true)
            };

            mockOrderMethods.findByPk.mockResolvedValue(mockOrder);

            const req = { params: { id: 1 }, body: { status: 3, subtotal: 200 } }
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            await orderController.updateOrder(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'Status must be a string'}))
        });

        it('should return 400 Error status code and specify the invalid subtotal', async () => {
            const currentDate = new Date();
            const mockOrder = {
                id: 1,
                customerId: 42,
                status: "Pending",
                subtotal: 100,
                taxAmount: 8,
                shippingAmount: 5,
                totalAmount: 113,
                shippingMethod: 'Ground',
                paymentMethod: 'Credit Card',
                createdAt: currentDate,
                updatedAt: currentDate,
                save: jest.fn().mockResolvedValue(true)
            };

            mockOrderMethods.findByPk.mockResolvedValue(mockOrder);

            const req = { params: { id: 1 }, body: { subtotal: false } }
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            await orderController.updateOrder(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'Subtotal must be a number'}))
        });

        it('should return 400 Error status code and specify the invalid taxAmount', async () => {
            const currentDate = new Date();
            const mockOrder = {
                id: 1,
                customerId: 42,
                status: "Pending",
                subtotal: 100,
                taxAmount: 8,
                shippingAmount: 5,
                totalAmount: 113,
                shippingMethod: 'Ground',
                paymentMethod: 'Credit Card',
                createdAt: currentDate,
                updatedAt: currentDate,
                save: jest.fn().mockResolvedValue(true)
            };

            mockOrderMethods.findByPk.mockResolvedValue(mockOrder);

            const req = { params: { id: 1 }, body: { taxAmount: [3] } }
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            await orderController.updateOrder(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'TaxAmount must be a number'}))
        });

        it('should return 400 Error status code and specify the invalid shippingAmount', async () => {
            const currentDate = new Date();
            const mockOrder = {
                id: 1,
                customerId: 42,
                status: "Pending",
                subtotal: 100,
                taxAmount: 8,
                shippingAmount: 5,
                totalAmount: 113,
                shippingMethod: 'Ground',
                paymentMethod: 'Credit Card',
                createdAt: currentDate,
                updatedAt: currentDate,
                save: jest.fn().mockResolvedValue(true)
            };

            mockOrderMethods.findByPk.mockResolvedValue(mockOrder);

            const req = { params: { id: 1 }, body: { shippingAmount: "three dollars" } }
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            await orderController.updateOrder(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'ShippingAmount must be a number'}))
        });

        it('should return 400 Error status code and specify the invalid shippingMethod', async () => {
            const currentDate = new Date();
            const mockOrder = {
                id: 1,
                customerId: 42,
                status: "Pending",
                subtotal: 100,
                taxAmount: 8,
                shippingAmount: 5,
                totalAmount: 113,
                shippingMethod: 'Ground',
                paymentMethod: 'Credit Card',
                createdAt: currentDate,
                updatedAt: currentDate,
                save: jest.fn().mockResolvedValue(true)
            };

            mockOrderMethods.findByPk.mockResolvedValue(mockOrder);

            const req = { params: { id: 1 }, body: { shippingMethod: ["Ground", "Overnight"] } }
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            await orderController.updateOrder(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'ShippingMethod must be a string'}))
        });

        it('should return 400 Error status code and specify the invalid paymentMethod', async () => {
            const currentDate = new Date();
            const mockOrder = {
                id: 1,
                customerId: 42,
                status: "Pending",
                subtotal: 100,
                taxAmount: 8,
                shippingAmount: 5,
                totalAmount: 113,
                shippingMethod: 'Ground',
                paymentMethod: 'Credit Card',
                createdAt: currentDate,
                updatedAt: currentDate,
                save: jest.fn().mockResolvedValue(true)
            };

            mockOrderMethods.findByPk.mockResolvedValue(mockOrder);

            const req = { params: { id: 1 }, body: { paymentMethod: 200 } }
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            await orderController.updateOrder(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'PaymentMethod must be a string'}))
        });
    });

    it('should return 404 when no order matches the provided ID', async () => {
        mockOrderMethods.findByPk.mockResolvedValue(null);

        const req = { params: { id: 999 }, body: { status: 3, subtotal: 200 } }
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await orderController.updateOrder(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'Order not found' }));
    });

    it('should return 204 and delete the order', async () => {
        const currentDate = new Date();
        const mockOrder = {
            id: 1,
            customerId: 42,
            status: 'Pending',
            subtotal: 100,
            taxAmount: 8,
            shippingAmount: 5,
            totalAmount: 113,
            shippingMethod: 'Ground',
            paymentMethod: 'Credit Card',
            createdAt: currentDate,
            updatedAt: currentDate,
            destroy: jest.fn().mockResolvedValue(true)
        };
        const destroySpy = jest.spyOn(mockOrder, 'destroy');
        mockOrderMethods.findByPk.mockResolvedValue(mockOrder);

        const req = { params: { id: 1 } }
        const res = {
            status: jest.fn().mockReturnThis()
        };

        await orderController.deleteOrder(req, res);

        expect(destroySpy).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(204);
    });

    it('should return 404 when no order matches the provided ID', async () => {
        mockOrderMethods.findByPk.mockResolvedValue(null);

        const req = { params: { id: 999 } }
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await orderController.deleteOrder(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'No orders found for the provided `id`' }));
    });
});