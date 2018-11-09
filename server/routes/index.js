import { Router } from 'express';
import routes from '../controller/route-methods';

const router = Router();

router.post('/api/v1/parcels', routes.createOrder);
router.get('/api/v1/parcels', routes.fetchAll);
router.get('/api/v1/parcels/:parcelId', routes.fetchById);
router.put('/api/v1/parcels/:parcelId/cancel', routes.cancel);
router.get('/api/v1/users/:userId/parcels', routes.fetchByUser);

export default router;
