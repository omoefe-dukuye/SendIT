/* eslint-disable import/extensions */
import Utility from './UtilityFunctions.js';
import HtmlProvider from './HtmlProvider.js';

const { token } = localStorage;

/** class for event-handler functions */
class EventHanders {
  /**
   *
   * @param {object} param0
   */
  static async orderCreation({
    location: { value: location }, destination: { value: destination }, weight: { value: weight }
  }) {
    const json = JSON.stringify({ location, destination, weight });
    const createOrderButton = document.querySelector('.createOrderButton');
    createOrderButton.disabled = true;
    Utility.loaderStart();
    try {
      const res = await fetch('/api/v1/parcels', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth': token,
        },
        body: json,
      });
      createOrderButton.disabled = false;
      Utility.loaderStop();
      const body = await res.json();
      console.log(body);
      if (res.status !== 201) {
        throw body;
      }
      Utility.modalController(HtmlProvider.orderCreation(body.parcel), 'green');
    } catch ({ error }) {
      Utility.modalController(error, 'red');
    }
  }

  /**
   *
   * @param {object} param0
   */
  static async changeDest({ id: { value: id }, destination: { value: destination } }) {
    const changeDestButton = document.querySelector('.changeDestButton');
    changeDestButton.disabled = true;
    Utility.loaderStart();
    const json = JSON.stringify({ destination });
    try {
      const res = await fetch(`/api/v1/parcels/${id}/destination`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-auth': token,
        },
        body: json,
      });
      changeDestButton.disabled = false;
      Utility.loaderStop();
      const body = await res.json();
      console.log(body);
      if (res.status !== 200) {
        throw body;
      }
      Utility.modalController(HtmlProvider.changeDest(body), 'green');
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
      const res = await fetch(`/api/v1/parcels/${parcelId}`, {
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
  static async cancel({ id: { value: id } }) {
    const changeDestButton = document.querySelector('.changeDestButton');
    changeDestButton.disabled = true;
    Utility.loaderStart();
    try {
      const res = await fetch(`/api/v1/parcels/${id}/cancel`, {
        method: 'PATCH',
        headers: { 'x-auth': token },
      });
      changeDestButton.disabled = false;
      Utility.loaderStop();
      const body = await res.json();
      console.log(body);
      if (res.status !== 200) {
        throw body;
      }
      const modalText = `Parcel with ID '<strong>${id}</strong>' has been cancelled`;
      Utility.modalController(modalText, 'green');
    } catch ({ error }) {
      Utility.modalController(error, 'red');
    }
  }

  /**
   * method for handling 'get all' form
   */
  static async getAll() {
    const parcelList = document.querySelector('.parcels');
    parcelList.textContent = '';
    Utility.loaderStart();
    const res = await fetch('/api/v1/parcels', {
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
