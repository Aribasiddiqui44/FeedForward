import express from 'express';
import {
    getDonorOrders,
    getReceiverOrders,
    getOrderDetails,
    updateOrderStatus,
    assignRiderToOrder,
    markOrderDelivered,
    cancelOrderByReceiver

} from '../controllers/order.controller.js';
import { verifyJWT } from '../middlewares/authentication.middleware.js';
import { checkRole } from '../middlewares/checkRole.middleware.js';

const router = express.Router();

// Donor routes
router.get('/donor',
    verifyJWT,
    checkRole('donor'),
    getDonorOrders
);

router.patch('/:orderId/status',
    verifyJWT,
    checkRole('donor'),
    updateOrderStatus
);

router.patch('/:orderId/assign-rider',
    verifyJWT,
    checkRole('donor'),
    assignRiderToOrder
);

// Receiver routes
router.get('/receiver',
    verifyJWT,
    checkRole('receiver'),
    getReceiverOrders
);

// Rider routes
router.patch('/:orderId/delivered',
    verifyJWT,
    checkRole('rider'),
    markOrderDelivered
);

// Shared route (donor, receiver, or rider)
router.get('/:orderId',
    verifyJWT,
    checkRole(['donor', 'receiver', 'rider']),
    getOrderDetails
);
router.patch(
    '/receiver/cancel/:orderId',
    verifyJWT,
    checkRole('receiver'),
    cancelOrderByReceiver
);
export default router;