export class Popup {
  constructor(popup) {
    this.popup = popup
  }

  open() {
    this.popup.classList.remove('popup_none')
  }

  close() {
    this.popup.classList.add('popup_none')
  }

  //Чистка полей попапа
  clearContent() {
    this.popup.querySelectorAll('.popup__input').forEach(input => input.value = '');
    this.popup.querySelectorAll('.popup__error-message').forEach(el => el.textContent = '');
  }
}