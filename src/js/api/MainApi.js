export class MainApi {
  constructor(url) {
    if (!!MainApi.instance) {
      return MainApi.instance;
    }
    MainApi.instance = this;
    this.url = url;
    return this;
  }

  //Обработка успешного запроса и выкидыш если ошибка от сервера
  _handleResult(res) {
    if (res.ok) {
      return res.json()
    }
    return Promise.reject(res.status)
  }

  _handleError(err) {
    throw new Error(err)
  }

  //Регистрация
  signup(data) {
    return fetch(`${this.url}signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(this._handleResult)

      .catch(this._handleError)
  }

  //Аутентификация
  signin(data) {
    return fetch(`${this.url}signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(this._handleResult)
      .catch(this._handleError)
  }

  //получение инфы о пользователе
  getUserData(token) {
    return fetch(`${this.url}users/me`, {
      method: 'GET',
      headers: {
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then(this._handleResult)
      .catch(this._handleError)
  }

  //добавление карточки
  createArticle(data, token) {
    return fetch(`${this.url}articles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })
      .then(this._handleResult)
      .catch(this._handleError)
  }

  //получение карточек
  getArticles(token) {
    return fetch(`${this.url}articles`, {
      method: 'GET',
      headers: {
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then(this._handleResult)
      .catch(this._handleError)
  }

  //Удаление карточки
  removeArticle(id, token) {
    return fetch(`${this.url}articles/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${token}`,
      }
    })
      .then(this._handleResult)
      .catch(this._handleError)
  }
}
