/* eslint-disable-next-line import/extensions */
import EventHandlers from './helpers/AdminEventHandlers.js';

const changeStatus = document.querySelector('.change_status');
const changeLocation = document.querySelector('.change_location');
const fetchById = document.querySelector('.fetch_by_id');
const fetchByUserId = document.querySelector('.fetch_by_user_id');
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

changeStatus.addEventListener('submit', (e) => {
  e.preventDefault();
  EventHandlers.changeStatus(changeStatus);
  return false;
});

changeLocation.addEventListener('submit', (e) => {
  e.preventDefault();
  EventHandlers.changeLocation(changeLocation);
  return false;
});

fetchById.addEventListener('submit', (e) => {
  e.preventDefault();
  EventHandlers.details(fetchById);
  return false;
});

fetchByUserId.addEventListener('submit', (e) => {
  e.preventDefault();
  EventHandlers.getAllByUser(fetchByUserId);
  return false;
});

getAll.addEventListener('click', EventHandlers.getAll);
