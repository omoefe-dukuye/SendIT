/** class for providing html snippets */
class HtmlProvider {
  /**
   *
   * @param {String} id parcel id
   * @param {String} status new status
   * @returns {String} string containing HTML
   */
  static changeStatus(id, status) {
    return `
      Parcel ID: <strong>${id}</strong><br>
      Status: <strong>${status}</strong>
    `;
  }

  /**
   *
   * @param {object} param0 object with properties to be displayed as HTML
   * @returns {String} string containing HTML
   */
  static changeLocation({ id, currentLocation: location }) {
    return `
      Parcel ID: <strong>${id}</strong> <br>
      Location:<strong> ${location}</strong> <br>
    `;
  }

  /**
   *
   * @param {object} param0 object with properties to be displayed as HTML
   * @returns {String} string containing HTML
   */
  static details({
    id, placed_by: owner, pickup_location: from, destination: to, current_location: location,
    weight: parcelWeight, distance, price, sent_on: createdOn,
  }) {
    return `
      <strong>ID:</strong> ${id} <br>
      <strong>Owner ID:</strong> ${owner} <br>
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
  static getAllByUser({
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

  /**
   *
   * @param {Object} param0 object with properties to be displayed as HTML
   * @returns {String} string containing HTML
   */
  static getAll({
    id, placed_by: owner, weight, pickup_location: from, destination: to, distance,
    price, status, sent_on: created, delivered_on: delivered,
  }) {
    return `
    <table>
      <tr>
        <th>ID</th><td>${id}</td>
      </tr><tr>
        <th>Owner ID</th><td>${owner}</td>
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
