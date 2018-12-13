/* eslint-disable-next-line import/extensions */
import utility from './UtilityFunctions.js';

const signupForm = document.querySelector('.form');
const submit = document.querySelector('.submit');


const submitData = async ({
  firstname: { value: firstName }, lastname: { value: lastName },
  username: { value: username }, email: { value: email }, password: { value: password },
}) => {
  const json = JSON.stringify({
    firstName, lastName, username, email, password
  });

  submit.disabled = true;
  utility.loaderStart();

  try {
    const res = await fetch('/api/v1/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: json,
    });
    const body = await res.json();
    utility.loaderStop();
    submit.disabled = false;
    if (res.status !== 201) {
      throw body;
    }
    localStorage.setItem('token', body.token);
    window.location.href = '/user.html';
  } catch ({ error }) {
    utility.modalController(error, 'red');
  }
};

signupForm.addEventListener('submit', (e) => {
  e.preventDefault();
  submitData(signupForm);
  return false;
});
