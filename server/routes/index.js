import { Router } from 'express';
import routes from '../controller/route-methods';
import check from '../middleware/validator';
import addDistance from '../middleware/distance';

const router = Router();

// set endpoint callbacks to their respective methods

router.post('/api/v1/parcels', check.isComplete, check.general, check.location, check.destination, addDistance, routes.createOrder); // create order
router.get('/api/v1/parcels', routes.fetchAll); // fetch all orders
router.get('/api/v1/parcels/:parcelId', routes.fetchById); // fetch specific order
router.put('/api/v1/parcels/:parcelId/cancel', routes.cancel); // cancel order
router.get('/api/v1/users/:userId/parcels', routes.fetchByUser); // fetch orders by specific user

export default router;
