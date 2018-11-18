import { Router } from 'express';
import verifyToken from '../middleware/authUser';
import routes from '../controller/parcels';
import user from '../controller/users';
import checkOrder from '../middleware/validators/create-order';
import checkDest from '../middleware/validators/change-dest';
import checkUser from '../middleware/validators/create-user';
import checkStatus from '../middleware/validators/change-status';
import addDistance from '../middleware/add-distance';

const router = Router();

// set endpoint callbacks to their respective methods

router.post('/api/v1/parcels', verifyToken, ...checkOrder, addDistance, routes.createOrder); // create order
router.get('/api/v1/parcels', verifyToken, routes.fetchAll); // fetch all orders
router.get('/api/v1/parcels/:parcelId', verifyToken, routes.fetchById); // fetch specific order
router.put('/api/v1/parcels/:parcelId/cancel', verifyToken, routes.cancel); // cancel order
router.get('/api/v1/users/:userId/parcels', routes.fetchByUser); // fetch orders by specific user
router.post('/api/v1/auth/signup', checkUser, user.create);
router.post('/api/v1/auth/login', checkUser, user.login);
router.get('/api/v1/admin/parcels/', verifyToken, routes.adminFetchAll);
router.put('/api/v1/parcels/:parcelId/destination', verifyToken, ...checkDest, addDistance, routes.changeDest);
router.put('/api/v1/parcels/:parcelId/status', verifyToken, checkStatus, routes.status);

export default router;
