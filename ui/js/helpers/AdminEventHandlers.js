/* eslint-disable import/extensions */
import Utility from './UtilityFunctions.js';
import HtmlProvider from './AdminHtmlProvider.js';

const { token } = localStorage;

/** class for event-handler functions */
class EventHanders {
  /**
   *
   * @param {object} param0
   */
  static async changeStatus({ id: { value: id }, status: { value: status } }) {
    const changeStatusButton = document.querySelector('.change_status_button');
    changeStatusButton.disabled = true;
    Utility.loaderStart();
    const json = JSON.stringify({ status });
    try {
      const res = await fetch(`/api/v1/parcels/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-auth': token,
        },
        body: json,
      });
      changeStatusButton.disabled = false;
      Utility.loaderStop();
      const body = await res.json();
      console.log(body);
      if (res.status !== 200) {
        throw body;
      }
      Utility.modalController(HtmlProvider.changeStatus(id, status), 'green');
    } catch ({ error }) {
      Utility.modalController(error, 'red');
    }
  }

  /**
   *
   * @param {object} param0
   */
  static async changeLocation({ id: { value: id }, location: { value: location } }) {
    const changeLocationButton = document.querySelector('.change_location_button');
    changeLocationButton.disabled = true;
    Utility.loaderStart();
    const json = JSON.stringify({ location });
    try {
      const res = await fetch(`/api/v1/parcels/${id}/currentlocation`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-auth': token,
        },
        body: json,
      });
      changeLocationButton.disabled = false;
      Utility.loaderStop();
      const body = await res.json();
      console.log(body);
      if (res.status !== 200) {
        throw body;
      }
      Utility.modalController(HtmlProvider.changeLocation(body), 'green');
    } catch ({ error }) {
      Utility.modalController(error, 'red');
    }
  }

  /**
   *
   * @param {object} param0
   */
  static async details({ id: { value: parcelId } }) {
    const detailsSpace = document.querySelector('.results_text');
    const detailsButton = document.querySelector('.details_button');
    const googleMapScript = document.querySelector('.map_script');
    if (googleMapScript) googleMapScript.parentNode.removeChild(googleMapScript);
    detailsSpace.innerHTML = '';
    detailsButton.disabled = true;
    Utility.loaderStart();
    try {
      const res = await fetch(`/api/v1/admin/parcels/${parcelId}`, {
        method: 'GET',
        headers: {
          'x-auth': token,
        },
      });
      detailsButton.disabled = false;
      Utility.loaderStop();
      const body = await res.json();
      console.log(body);
      if (res.status !== 200) {
        throw body;
      }
      const { parcel, parcel: { coords } } = body;
      detailsSpace.innerHTML = HtmlProvider.details(parcel);
      window.coords = coords;
      const script = document.createElement('script');
      script.setAttribute('class', 'map_script');
      script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyA2UEF_jKSFV1x1xLcA3Z8HNoBEBzGErM8&callback=myMap';
      document.body.appendChild(script);
    } catch ({ error }) {
      Utility.modalController(error, 'red');
    }
  }

  /**
   *
   * @param {object} param0
   */
  static async getAllByUser({ id: { value: id } }) {
    const userButton = document.querySelector('.fetch_by_user_button');
    const parcelList = document.querySelector('.user_parcels');
    parcelList.textContent = '';
    userButton.disabled = true;
    Utility.loaderStart();
    const res = await fetch(`/api/v1/users/${id}/parcels`, {
      method: 'GET',
      headers: {
        'x-auth': token,
      },
    });
    const body = await res.json();
    const { orders } = body;
    console.log(body);
    orders.forEach((order) => {
      const parcelListItem = document.createElement('li');
      parcelListItem.innerHTML = HtmlProvider.getAllByUser(order);
      parcelList.appendChild(parcelListItem);
    });
    Utility.loaderStop();
    userButton.disabled = false;
    return false;
  }

  /**
   * method for handling 'get all' form
   */
  static async getAll() {
    const parcelList = document.querySelector('.parcels');
    parcelList.textContent = '';
    Utility.loaderStart();
    const res = await fetch('/api/v1/admin/parcels', {
      method: 'GET',
      headers: {
        'x-auth': token,
      },
    });
    const body = await res.json();
    const { orders } = body;
    console.log(body);
    orders.forEach((order) => {
      const parcelListItem = document.createElement('li');
      parcelListItem.innerHTML = HtmlProvider.getAll(order);
      parcelList.appendChild(parcelListItem);
    });
    Utility.loaderStop();
    return false;
  }
}

export default EventHanders;
