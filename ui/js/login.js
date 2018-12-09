const loginForm = document.querySelector('.form');

const submitData = async (form) => {
  const {
    username: { value: username }, password: { value: password }
  } = form;
  const json = JSON.stringify({ username, password });

  const res = await fetch('/api/v1/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: json,
  });
  const body = await res.json();
  localStorage.setItem('token', body.token);
  window.location.href = '/user.html';
};

loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  submitData(loginForm);
});
