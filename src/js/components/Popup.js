export class Popup {
  constructor(popup, overlay) {
    this.popup = popup,
      this.overlay = overlay

  }

  open() {
    this.overlay.classList.add('overlay_is-opened')
    this.popup.classList.remove('popup_none')
  }

  close() {
    this.overlay.classList.remove('overlay_is-opened')
    this.popup.classList.add('popup_none')
  }

  //Чистка полей попапа
  clearContent() {
    this.popup.querySelectorAll('.popup__input').forEach(input => input.value = '');
    this.popup.querySelectorAll('.popup__error-message').forEach(el => el.textContent = '');
  }


}