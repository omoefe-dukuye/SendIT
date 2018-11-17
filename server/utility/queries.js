export default {
  createOrder: `INSERT INTO
  parcels(
    id,
    pickup_location,
    current_location,
    destination,
    description,
    distance,
    status,
    sender,
    recipient_email,
    created_date,
    modified_date
  ) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
  returning *`,

};
