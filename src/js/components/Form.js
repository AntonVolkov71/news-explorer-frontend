export class Form {
  constructor(form, errorMessages = '') {
    this.form = form;
    this.errorMessages = errorMessages;
    this.buttonSubmit = this.form.button;
    
    if(this.form.id !== 'form-search') {
      this._validateForm();
      this.inputHandler();
    }
    
  }

  //возвращает данные формы
  getInfo() {
    const valuesInput = {};
    const inputs = this.form
      .querySelectorAll('input')
      inputs.forEach(input => {
        return valuesInput[input.name] = input.value;
      });
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
    if (this.errorMessages[`SERVER_ERR_${status}`]) {
      errorServer.textContent = this.errorMessages[`SERVER_ERR_${status}`];
    } else {
      errorServer.textContent = `Ошибка: ${status}`;
    }
  }
}
