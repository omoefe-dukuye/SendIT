const nav = document.querySelectorAll('.nav');
const doc = document.querySelectorAll('.doc');
const profileClose = document.querySelector('.profile_close');
const seeProfile = document.querySelector('.see_profile');
const blur = document.querySelector('.profile_wrapper');

// go through each navigation tag and add listener for click event

for (let i = 0; i < nav.length; i += 1) {
  nav[i].addEventListener('click', (e) => {
    e.target.setAttribute('class', 'nav active'); // on click add to 'active' class, show content
    doc[i].setAttribute('class', 'doc');
    for (let j = 0; j < nav.length; j += 1) {
      // remove 'active' class from non-active tags, hide content
      if (nav[j] !== e.target) {
        nav[j].setAttribute('class', 'nav');
        doc[j].setAttribute('class', 'doc no_display');
      }
    }
  });
}

seeProfile.addEventListener('click', () => { // blur background on click
  blur.setAttribute('class', 'blur profile_wrapper');
  profileClose.addEventListener('click', () => { // cancel button reverses page to normal
    blur.setAttribute('class', 'profile_wrapper no_display');
  });
  window.addEventListener('click', (e) => { // clicking anywhere outside pop-up reverses page to normal
    if (e.target === blur) {
      blur.setAttribute('class', 'profile_wrapper no_display');
    }
  });
});
