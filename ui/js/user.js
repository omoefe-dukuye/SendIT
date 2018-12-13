/* eslint-disable-next-line import/extensions */
import utility from './UtilityFunctions.js';

const createOrder = document.querySelector('.createOrder');
const changeDest = document.querySelector('.changeDest');
const fetchById = document.querySelector('.fetchById');
const cancelOrder = document.querySelector('.cancel');
const getAll = document.querySelector('#getAll');
const parcelList = document.querySelector('.parcels');
const { token } = localStorage;

const orderCreationHandler = async ({
  location: { value: location }, destination: { value: destination }, weight: { value: weight }
}) => {
  const json = JSON.stringify({ location, destination, weight });
  const createOrderButton = document.querySelector('.createOrderButton');
  createOrderButton.disabled = true;
  utility.loaderStart();
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
    utility.loaderStop();
    const body = await res.json();
    console.log(body);
    if (res.status !== 201) {
      throw body;
    }
    const {
      id, pickup_location: pickupLocation, destination: parcelDestination,
      weight: parcelWeight, distance, price, sent_on: createdOn,
    } = body.parcel;
    const modalText = `<strong>New parcel delivery order created.</strong><br>
      <strong>ID:</strong> ${id} <br>
      <strong>Pickup Location:</strong> ${pickupLocation} <br>
      <strong>Destination:</strong> ${parcelDestination} <br>
      <strong>Weight:</strong> ${parcelWeight} <br>
      <strong>Distance:</strong> ${distance} <br>
      <strong>Price:</strong> ${price} <br>
      <strong>Created On:</strong> ${createdOn}`;
    utility.modalController(modalText, 'green');
  } catch ({ error }) {
    utility.modalController(error, 'red');
  }
};

const changeDestHandler = async ({ id: { value: id }, destination: { value: destination } }) => {
  const changeDestButton = document.querySelector('.changeDestButton');
  changeDestButton.disabled = true;
  utility.loaderStart();
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
    utility.loaderStop();
    const body = await res.json();
    console.log(body);
    if (res.status !== 200) {
      throw body;
    }
    const { newDistance, newDestination, additionalPrice } = body;
    const modalText = `Parcel with ID '<strong>${id}</strong>' will now head to <strong>${newDestination}</strong>. <br>
      <strong>New Distance:</strong> ${newDistance} <br>
      <strong>Additional Price:</strong> ${additionalPrice}`;
    utility.modalController(modalText, 'green');
  } catch ({ error }) {
    utility.modalController(error, 'red');
  }
};

const cancelHandler = async ({ id: { value: id } }) => {
  const changeDestButton = document.querySelector('.changeDestButton');
  changeDestButton.disabled = true;
  utility.loaderStart();
  try {
    const res = await fetch(`/api/v1/parcels/${id}/cancel`, {
      method: 'PATCH',
      headers: { 'x-auth': token },
    });
    changeDestButton.disabled = false;
    utility.loaderStop();
    const body = await res.json();
    console.log(body);
    if (res.status !== 200) {
      throw body;
    }
    const modalText = `Parcel with ID '<strong>${id}</strong>' has been cancelled`;
    utility.modalController(modalText, 'green');
  } catch ({ error }) {
    utility.modalController(error, 'red');
  }
};

const getAllHandler = async () => {
  parcelList.textContent = '';
  utility.loaderStart();
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
    const {
      id, weight, current_location: currentLocation, destination, distance,
      price, status, sent_on: sentOn, delivered_on: deliveredOn,
    } = order;
    const parcelListItem = document.createElement('li');
    const parcelTable = document.createElement('table');

    const tableRow1 = document.createElement('tr');
    const tableRow1Col1 = document.createElement('th');
    tableRow1Col1.textContent = 'ID';
    tableRow1.appendChild(tableRow1Col1);
    const tableRow1Col2 = document.createElement('td');
    tableRow1Col2.textContent = id;
    tableRow1.appendChild(tableRow1Col2);
    parcelTable.appendChild(tableRow1);

    const tableRow2 = document.createElement('tr');
    const tableRow2Col1 = document.createElement('th');
    tableRow2Col1.textContent = 'Weight';
    tableRow2.appendChild(tableRow2Col1);
    const tableRow2Col2 = document.createElement('td');
    tableRow2Col2.textContent = `${weight} kg`;
    tableRow2.appendChild(tableRow2Col2);
    parcelTable.appendChild(tableRow2);

    const tableRow3 = document.createElement('tr');
    const tableRow3Col1 = document.createElement('th');
    tableRow3Col1.textContent = 'Location';
    tableRow3.appendChild(tableRow3Col1);
    const tableRow3Col2 = document.createElement('td');
    tableRow3Col2.textContent = currentLocation;
    tableRow3.appendChild(tableRow3Col2);
    parcelTable.appendChild(tableRow3);

    const tableRow4 = document.createElement('tr');
    const tableRow4Col1 = document.createElement('th');
    tableRow4Col1.textContent = 'Destination';
    tableRow4.appendChild(tableRow4Col1);
    const tableRow4Col2 = document.createElement('td');
    tableRow4Col2.textContent = destination;
    tableRow4.appendChild(tableRow4Col2);
    parcelTable.appendChild(tableRow4);

    const tableRow5 = document.createElement('tr');
    const tableRow5Col1 = document.createElement('th');
    tableRow5Col1.textContent = 'Distance';
    tableRow5.appendChild(tableRow5Col1);
    const tableRow5Col2 = document.createElement('td');
    tableRow5Col2.textContent = `${distance} km`;
    tableRow5.appendChild(tableRow5Col2);
    parcelTable.appendChild(tableRow5);

    const tableRow6 = document.createElement('tr');
    const tableRow6Col1 = document.createElement('th');
    tableRow6Col1.textContent = 'Price';
    tableRow6.appendChild(tableRow6Col1);
    const tableRow6Col2 = document.createElement('td');
    tableRow6Col2.textContent = price;
    tableRow6.appendChild(tableRow6Col2);
    parcelTable.appendChild(tableRow6);

    const tableRow7 = document.createElement('tr');
    const tableRow7Col1 = document.createElement('th');
    tableRow7Col1.textContent = 'Status';
    tableRow7.appendChild(tableRow7Col1);
    const tableRow7Col2 = document.createElement('td');
    tableRow7Col2.textContent = status;
    tableRow7.appendChild(tableRow7Col2);
    parcelTable.appendChild(tableRow7);

    const tableRow8 = document.createElement('tr');
    const tableRow8Col1 = document.createElement('th');
    tableRow8Col1.textContent = 'Sent On';
    tableRow8.appendChild(tableRow8Col1);
    const tableRow8Col2 = document.createElement('td');
    tableRow8Col2.textContent = sentOn;
    tableRow8.appendChild(tableRow8Col2);
    parcelTable.appendChild(tableRow8);

    const tableRow9 = document.createElement('tr');
    const tableRow9Col1 = document.createElement('th');
    tableRow9Col1.textContent = 'Delivered On';
    tableRow9.appendChild(tableRow9Col1);
    const tableRow9Col2 = document.createElement('td');
    tableRow9Col2.textContent = deliveredOn;
    tableRow9.appendChild(tableRow9Col2);
    parcelTable.appendChild(tableRow9);

    parcelListItem.appendChild(parcelTable);
    parcelList.appendChild(parcelListItem);
  });
  utility.loaderStop();
  return false;
};

const navbar = document.querySelector('nav');
const sticky = navbar.offsetTop;

window.addEventListener('scroll', () => {
  const mq = window.matchMedia('(max-width: 720px)');
  if (window.pageYOffset > sticky && mq.matches) {
    navbar.classList.add('sticky');
  } else {
    navbar.classList.remove('sticky');
  }
});

createOrder.addEventListener('submit', (e) => {
  e.preventDefault();
  orderCreationHandler(createOrder);
  return false;
});

changeDest.addEventListener('submit', (e) => {
  e.preventDefault();
  changeDestHandler(changeDest);
  return false;
});

cancelOrder.addEventListener('submit', (e) => {
  e.preventDefault();
  cancelHandler(cancelOrder);
  return false;
});

getAll.addEventListener('click', getAllHandler);
