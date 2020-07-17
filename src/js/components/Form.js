// Form. Класс, отвечающий за логику работы формы. Методы:
// setServerError — добавляет форме ошибку, пришедшую с сервера;
// _validateInputElement — валидирует переданный в качестве аргумента инпут;
// _validateForm — валидирует всю форму;
// _clear — вспомогательный метод, очищает поля формы;
// _getInfo — вспомогательный метод, возвращает данные формы.
export class Form {
  constructor(form, errorMessages) {
    this.form = form;
    this.errorMessages = errorMessages;
    this.buttonSubmit = this.form.button;
    this._validateForm();
    this.inputHandler();
  }

  //возвращает данные формы
  _getInfo() {
    const valuesInput = {};
    const inputs = this.form
      .querySelectorAll('input')
      .forEach(input => {

        return valuesInput[input.name] = input.value;
      });
    this._clear();
    this._validateForm();
    return valuesInput;
  }

  //отрисовка ошибок валидации и проверка там же
  _validateInputElement(input) {
    const { name } = input;
    const error = input.nextElementSibling;

    if (!input.validity.valid) {
      this._validateForm(false);

      if (name === 'email') {
        return error.textContent = this.errorMessages.INCORRECT_EMAIL;
      } else if (name === 'password') {
        return error.textContent = this.errorMessages.REQUIRED_FIELD;
      } else if (name === 'name') {
        return error.textContent = this.errorMessages.REQUIRED_FIELD;
      };
    }
    this._validateForm();
    return error.textContent = '';
  }
  //валидирует всю форму
  _validateForm() {
    this.form.checkValidity()
      ? this.buttonSubmit.disabled = false
      : this.buttonSubmit.disabled = true;
  }
  //прослушка инпутов
  inputHandler() {
    this.form.addEventListener('input', (event) => {
      this._validateInputElement(event.target);
    });
  }

  //читска полсе
  _clear() {
    const inputs = this.form
      .querySelectorAll('input')
      .forEach(input => input.value = '')
  }

  //добавляет форме ошибку, пришедшую с сервера;
  setServerError(status) {
    const errorServer = this.buttonSubmit.previousElementSibling;
    errorServer.textContent = this.errorMessages[`SERVER_ERR_${status}`];
  }
}
// const SERVER_ERR_409 = 'Такой пользователь уже есть';
// const SERVER_ERR_401 = 'Неправильные логин или пароль';
// const SERVER_ERR_400 = 'Корявый запрос, сударь';