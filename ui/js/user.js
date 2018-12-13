/* eslint-disable-next-line import/extensions */
import EventHandlers from './helpers/EventHandlers.js';

const createOrder = document.querySelector('.createOrder');
const changeDest = document.querySelector('.changeDest');
const fetchById = document.querySelector('.fetch_by_id');
const cancelOrder = document.querySelector('.cancel');
const getAll = document.querySelector('#getAll');
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
  EventHandlers.orderCreation(createOrder);
  return false;
});

changeDest.addEventListener('submit', (e) => {
  e.preventDefault();
  EventHandlers.changeDest(changeDest);
  return false;
});

fetchById.addEventListener('submit', (e) => {
  e.preventDefault();
  EventHandlers.details(fetchById);
  return false;
});

cancelOrder.addEventListener('submit', (e) => {
  e.preventDefault();
  EventHandlers.cancel(cancelOrder);
  return false;
});

getAll.addEventListener('click', EventHandlers.getAll);
