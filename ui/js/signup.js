const signupForm = document.querySelector('.form');

const submitData = async (form) => {
  const json = JSON.stringify({
    firstName: form.firstname.value,
    lastName: form.lastname.value,
    username: form.username.value,
    email: form.email.value,
    password: form.password.value,
  });

  const res = await fetch('/api/v1/auth/signup', {
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

signupForm.addEventListener('submit', (e) => {
  e.preventDefault();
  submitData(signupForm);
});
