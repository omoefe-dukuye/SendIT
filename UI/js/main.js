const nav = document.querySelectorAll('.nav');
const doc = document.querySelectorAll('.doc');
const profile = document.querySelector('.profile');
const profileClose = document.querySelector('.profile_close');
const seeProfile = document.querySelector('.see_profile');
const blur = document.querySelector('.profile_wrapper');


for (let i=0; i<nav.length; i++) {
  nav[i].addEventListener('click', (e) => {
    e.target.setAttribute('class', 'nav active');
    for (let i=0; i<nav.length; i++) {
      if (nav[i] !== e.target) {
        nav[i].setAttribute('class', 'nav');
        doc[i].setAttribute('class', 'doc no_display')
      } else {
        doc[i].setAttribute('class', 'doc');
      }
    }
  });
}

seeProfile.addEventListener('click', () => {
  blur.setAttribute('class', 'blur profile_wrapper');
  profileClose.addEventListener('click', () => {
    blur.setAttribute('class', 'profile_wrapper no_display');
  });
  window.addEventListener('click', (e) => {
    if (e.target === blur) {
      blur.setAttribute('class', 'profile_wrapper no_display');
    }
  });
});
