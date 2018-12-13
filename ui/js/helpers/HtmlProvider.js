/** class for providing html snippets */
class HtmlProvider {
  /**
   *
   * @param {object} param0 object with properties to be displayed as HTML
   * @returns {String} string containing HTML
   */
  static orderCreation({
    id, pickup_location: pickupLocation, destination: parcelDestination,
    weight: parcelWeight, distance, price, sent_on: createdOn,
  }) {
    return `
      <strong>New parcel delivery order created.</strong><br>
      <strong>ID:</strong> ${id} <br>
      <strong>Pickup Location:</strong> ${pickupLocation} <br>
      <strong>Destination:</strong> ${parcelDestination} <br>
      <strong>Weight:</strong> ${parcelWeight} <br>
      <strong>Distance:</strong> ${distance} <br>
      <strong>Price:</strong> ${price} <br>
      <strong>Created On:</strong> ${createdOn}
    `;
  }

  /**
   *
   * @param {object} param0 object with properties to be displayed as HTML
   * @returns {String} string containing HTML
   */
  static changeDest({
    id, newDistance, newDestination, additionalPrice
  }) {
    return `
      Parcel with ID '<strong>${id}</strong>' will now head to <strong>${newDestination}</strong>. <br>
      <strong>New Distance:</strong> ${newDistance} <br>
      <strong>Additional Price:</strong> ${additionalPrice}
    `;
  }

  /**
   *
   * @param {object} param0 object with properties to be displayed as HTML
   * @returns {String} string containing HTML
   */
  static details({
    id, pickup_location: from, destination: to, current_location: location,
    weight: parcelWeight, distance, price, sent_on: createdOn,
  }) {
    return `
      <strong>ID:</strong> ${id} <br>
      <strong>From:</strong> ${from} <br>
      <strong>To:</strong> ${to} <br>
      <strong>Location:</strong> ${location} <br>
      <strong>Weight:</strong> ${parcelWeight} kg <br>
      <strong>Total Distance:</strong> ${distance} km<br>
      <strong>Price:</strong> ${price} <br>
      <strong>Created On:</strong> ${createdOn}
    `;
  }

  /**
   *
   * @param {Object} param0 object with properties to be displayed as HTML
   * @returns {String} string containing HTML
   */
  static getAll({
    id, weight, pickup_location: from, destination: to, distance,
    price, status, sent_on: created, delivered_on: delivered,
  }) {
    return `
    <table>
      <tr>
        <th>ID</th><td>${id}</td>
      </tr><tr>
        <th>Weight</th><td>${weight} kg</td>
      </tr><tr>
        <th>From</th><td>${from}</td>
      </tr><tr>
        <th>To</th><td>${to}</td>
      </tr><tr>
        <th>Distance</th><td>${distance} km</td>
      </tr><tr>
        <th>Price</th><td>${price}</td>
      </tr><tr>
        <th>Status</th><td>${status}</td>
      </tr><tr>
        <th>Created</th><td>${created}</td>
      </tr><tr>
        <th>Delivered</th><td>${delivered}</td>
      </tr>
    </table>
  `;
  }
}

export default HtmlProvider;
