const createUser = `INSERT INTO
    users(first_name, last_name, other_names, email, username, password, registered)
    VALUES($1, $2, $3, $4, $5, $6, $7)
    RETURNING *`;

const selectById = 'SELECT * FROM users WHERE id = $1';

const upgradeToAdmin = 'UPDATE users SET is_admin=$1 WHERE id=$2';

const selectByUsername = 'SELECT * FROM users WHERE username = $1';

const selectByPlacedby = 'SELECT * FROM parcels WHERE placed_by = $1';

const createOrder = `INSERT INTO
  parcels(
    placed_by,
    weight,
    sent_on,
    pickup_location,
    current_location,
    destination,
    distance,
    price
  ) VALUES($1, $2, $3, $4, $5, $6, $7, $8)
  RETURNING *`;

const changeDestination = 'UPDATE parcels SET destination=$1, distance=$2 WHERE id=$3';

const changeLocation = 'UPDATE parcels SET current_location=$1, distance=$2 WHERE id=$3 RETURNING *';

const selectAllParcels = 'SELECT * FROM parcels';

const updateToDelivered = 'UPDATE parcels SET status=$1, delivered_on=$3 WHERE id=$2';

const updateStatus = 'UPDATE parcels SET status=$1 WHERE id=$2';

export {
  createUser, selectById, upgradeToAdmin, selectByUsername, createOrder, updateToDelivered,
  selectByPlacedby, changeDestination, changeLocation, selectAllParcels, updateStatus,
};
