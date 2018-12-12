const nav = document.querySelectorAll('.nav');
const doc = document.querySelectorAll('.doc');
const focus = document.querySelectorAll('.focus');

const headerLink1 = document.querySelector('.header_link1');
const headerLink2 = document.querySelector('.header_link2');

// go through each navigation tag and add listener for click event

for (let i = 0; i < nav.length; i += 1) {
  nav[i].addEventListener('click', (e) => {
    e.target.setAttribute('class', 'nav active'); // on click add to 'active' class, show content
    doc[i].setAttribute('class', 'doc');
    if (i < 4) focus[i].focus();
    for (let j = 0; j < nav.length; j += 1) {
      // remove 'active' class from non-active tags, hide content
      if (nav[j] !== e.target) {
        nav[j].setAttribute('class', 'nav');
        doc[j].setAttribute('class', 'doc no_display');
      }
    }
  });
}

console.log(localStorage.token);

if (localStorage.token) {
  headerLink1.innerHTML = '<span class="display_name"></span><i class="far fa-user"></i>';
  headerLink1.classList.add('see_profile');
  headerLink1.setAttribute('href', 'user.html');

  headerLink2.textContent = 'Log Out';
  headerLink2.classList.add('logout');
  headerLink2.setAttribute('href', '#');


  const { userFirstName: firstName } = JSON.parse(window.atob(localStorage.token.split('.')[1]));
  const displayName = document.querySelector('.display_name');
  displayName.textContent = `${firstName} `;


  const logout = document.querySelector('.logout');

  logout.addEventListener('click', () => {
    localStorage.clear();
    window.location.href = '/';
  });
}
