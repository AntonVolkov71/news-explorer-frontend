import { MainApi } from './api/MainApi';
import configs from './config.js'


//Нам глобального не надо
(() => {
  console.log('object')
  //необходимые элементы
  const { urlMainApi, tokenMainApi } = configs;
  const mainApi = new MainApi(urlMainApi);



  //проверка на регистрацию при начальной загрузки
  mainApi.getUserData(tokenMainApi)
    .then(data => {
      console.log('sce')
    })
    .catch(err => {
      console.log('err')
      document.location.href = '/'
    })





})()