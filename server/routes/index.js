import { Router } from 'express';
import verifyToken from '../middleware/authUser';
import ParcelController from '../controller/ParcelController';
import UserController from '../controller/UserController';
import checkOrder from '../middleware/validators/createOrder';
import checkDest from '../middleware/validators/changeDestination';
import checkLoc from '../middleware/validators/changeLocation';
import checkUser from '../middleware/validators/createUser';
import checkStatus from '../middleware/validators/changeStatus';
import addDistance from '../middleware/addDistance';
import addPrice from '../middleware/addPrice';

const router = Router();

// set endpoint callbacks to their respective methods

router.post('/api/v1/parcels', verifyToken, ...checkOrder, addDistance, addPrice, ParcelController.createOrder); // create order
router.get('/api/v1/parcels', verifyToken, ParcelController.fetchAllOrdersForUser); // fetch all orders
router.get('/api/v1/parcels/:parcelId', verifyToken, ParcelController.fetchParcelById); // fetch specific order
router.patch('/api/v1/parcels/:parcelId/cancel', verifyToken, ParcelController.cancelOrder); // cancel order
router.get('/api/v1/users/:userId/parcels', verifyToken, ParcelController.adminFetchByUser); // fetch orders by specific user
router.post('/api/v1/auth/signup', checkUser, UserController.createUser); // sign up
router.post('/api/v1/auth/login', UserController.loginUser);
router.get('/api/v1/admin/parcels/', verifyToken, ParcelController.fetchAllOrdersInApp);
router.patch('/api/v1/parcels/:parcelId/destination', verifyToken, ...checkDest, addDistance, addPrice, ParcelController.changeDestination);
router.patch('/api/v1/parcels/:parcelId/currentlocation', verifyToken, ...checkLoc, addDistance, ParcelController.changeLocation);
router.patch('/api/v1/parcels/:parcelId/status', verifyToken, checkStatus, ParcelController.changeOrderStatus);

export default router;
