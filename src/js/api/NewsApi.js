export class NewsApi {
  constructor({ url, token, dateTo, dateFrom, pageSize }) {
    if (!!NewsApi.instance) {
      return MainApi.instance;
    }

    NewsApi.instance = this;

    this.url = url;
    this.token = token;
    this.dateTo = dateTo;
    this.dateFrom = dateFrom;
    this.pageSize = pageSize;

    return this;
  }

  //Обработка успешного запроса и выкидыш если ошибка от сервера
  _handleResult(res) {
    if (res.ok) return res.json();
    return Promise.reject(res.message)
  }

  _handleError(err) {
    throw new Error(err)
  }

  //получение новостей
  getNews({query}) {
    return fetch(`${this.url}?q=${query}&apiKey=${this.token}&pageSize=${this.pageSize}&to=${this.dateTo}&from=${this.dateFrom}&language=ru&sortBy=publishedAt`, {
      method: 'GET',
    })
      .then(this._handleResult)
      .catch(this._handleError)
  }
}