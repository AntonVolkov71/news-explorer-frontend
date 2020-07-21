import { MainApi } from './api/MainApi';
import configs from './config.js'
import { Header } from './components/Header';
import { NewsCardList } from './components/NewsCardList';

//Нам глобального не надо
(() => {
  console.log('object')
  //необходимые элементы
  const { urlMainApi, tokenMainApi } = configs;



  //Элементы HTML
  const root = document.querySelector('.root');

  const btnOutLogin = root.querySelector('#button-out-login');
  const headerHTML = root.querySelector('.header');

  //Сууущности
  const mainApi = new MainApi(urlMainApi);
  const header = new Header(headerHTML, 'saved');
  const preloader = root.querySelector('.preloader');
  const notFound = root.querySelector('.not-found');
  const newsContainer = root.querySelector('.news__container');


  //проверка на регистрацию при начальной загрузки
  root.classList.add('overlay'); //нечего смотреть если не зареган

  //запрос проверка на сущетсвование в системе
  mainApi.getUserData(tokenMainApi)
    .then(data => {
      root.classList.remove('overlay')
      header.render(true, data.data.name);
    })
    .catch(err => {
      document.location.href = '/';
    })

  //отрисовка карточек
  // const newsCardList = new NewsCardList(newsContainer, preloader, notFound);
  // newsCardList.renderResults()



  //Прослушки

  //Прослушка кнопки выхода из аутентификации
  btnOutLogin.addEventListener('click', event => {

    localStorage.clear();
    document.location.href = '/';
  })



})()