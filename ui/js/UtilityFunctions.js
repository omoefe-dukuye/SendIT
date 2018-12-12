/**
 * class for utility functions for front-end
 */
class UtilityFunctions {
  /**
   *
   * @param {String} content to be displayed in modal
   * @param {String} color of modal shadow
   */
  static modalController(content, color) {
    const modal = document.querySelector('#myModal');
    const close = document.querySelector('.close');
    const modalContent = document.querySelector('.modal-text');
    const modalWrapper = document.querySelector('.modal-content');

    modal.style.display = 'flex';
    modalWrapper.style.boxShadow = `2px 2px 6px ${color}, -2px -2px 6px ${color}`;
    close.onclick = () => {
      modal.style.display = 'none';
    };
    window.onclick = (event) => {
      if (event.target === modal) {
        modal.style.display = 'none';
      }
    };
    modalContent.innerHTML = content;
  }

  /** method for displaying loader */
  static loaderStart() {
    const loader = document.querySelector('.loaderBg');
    loader.style.display = 'flex';
  }

  /** method for hiding loader */
  static loaderStop() {
    const loader = document.querySelector('.loaderBg');
    loader.style.display = 'none';
  }
}

export default UtilityFunctions;
