/* eslint-disable-next-line import/extensions */
import utility from './helpers/UtilityFunctions.js';

const loginForm = document.querySelector('.form');
const submit = document.querySelector('.submit');

const submitData = async ({
  username: { value: username }, password: { value: password }
}) => {
  const json = JSON.stringify({ username, password });
  submit.disabled = true;
  utility.loaderStart();
  try {
    const res = await fetch('/api/v1/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: json,
    });
    const body = await res.json();
    utility.loaderStop();
    submit.disabled = false;
    if (res.status !== 200) {
      throw body;
    }
    localStorage.setItem('token', body.token);
    window.location.href = JSON.parse(window.atob(localStorage.token.split('.')[1])).isAdmin
      ? '/admin.html'
      : '/user.html';
  } catch ({ error }) {
    utility.modalController(error, 'red');
  }
};

loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  submitData(loginForm);
  return false;
});
