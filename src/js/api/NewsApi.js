export class NewsApi {
  constructor(url) {
    if (!!NewsApi.instance) {
      return MainApi.instance;
    }

    NewsApi.instance = this;

    this.url = url;

    return this;
  }

  //Обработка успешного запроса и выкидыш если ошибка от сервера
  _handleResult(res) {
    console.log('api', res)

    console.log('api.totalResults', res.totalResults)
    return res.json();
    if (res.ok) return res.json();

    return Promise.reject(res)
  }

  _handleError(err) {
    throw new Error(err)
  }

  //получение новостей
  getNews({ query, token, dateTo, dateFrom }) {

    return fetch(`${this.url}&q=${query}&pageSize=100&to=${dateTo}&from=${dateFrom}&language=ru&sortBy=relevancy`, {
      // return fetch( `${this.url}?q=${keyWord}&from=${this.from}&to=${this.to}&pageSize=${this.pageSize}`, {
      method: 'GET',
      // headers: {
    //     authorization: token,
    //     //apiKey: '9f328fa718fd439faa9a9504f2d2b589',
    //     // from: dateFrom,
    //     // to: dateTo,
    //     // pageSize: 100,
    //     //country: 'us',
    //     // language: 'ru'
    //   },
    //  options: {
    //   q: query,
    //  }
        
      


      // }

    })
      .then(this._handleResult)
      .catch(this._handleError)

  }
}