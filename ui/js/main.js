const nav = document.querySelectorAll('.nav');
const doc = document.querySelectorAll('.doc');
const profileClose = document.querySelector('.profile_close');
const seeProfile = document.querySelector('.see_profile');
const blur = document.querySelector('.profile_wrapper');


for (let i = 0; i < nav.length; i += 1) {
  nav[i].addEventListener('click', (e) => {
    e.target.setAttribute('class', 'nav active');
    for (let j = 0; j < nav.length; j += 1) {
      if (nav[j] !== e.target) {
        nav[j].setAttribute('class', 'nav');
        doc[j].setAttribute('class', 'doc no_display');
      } else {
        doc[j].setAttribute('class', 'doc');
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
