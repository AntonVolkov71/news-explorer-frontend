import { MainApi } from './api/MainApi';
import configs from './config.js'
import { Popup } from './components/Popup';
import { Form } from './components/Form';
import * as errorMessages from './components/constants/errorMessages'
import { Header } from './components/Header';
import { NewsApi } from './api/NewsApi';
import { getMetadataKeys } from './utils/utils';
import { NewsCardList } from './components/NewsCardList'
import { articles } from './DATA_NEWS'; //TODO удалить после отладки
import { NewsCard } from './components/NewsCard';


//Нам глобального не надо
(() => {

  //необходимые элементы
  const { urlMainApi, tokenMainApi, urlNewsApi, apiKeyNewsApi, dateNow, pageSize } = configs;
  const dateTo = dateNow.toISOString();
  const dateFrom = getMetadataKeys(dateNow, -7);
  let flagLogin = false;

  //Элементы HTML
  const root = document.querySelector('.root');
  const btnAuth = document.getElementById('btn-auth');
  const popups = root.querySelectorAll('.popup');
  const popupsNew = {};
  const overlay = document.querySelector('.overlay');
  const headerHTML = root.querySelector('.header');
  const btnOutLogin = root.querySelector('#button-out-login');
  const searchForm = document.forms['search-form'];
  const preloader = root.querySelector('.preloader');
  const notFound = root.querySelector('.not-found');
  const newsContainer = root.querySelector('.news__container');

  //Сууущности
  const mainApi = new MainApi(urlMainApi);
  const header = new Header(headerHTML, 'main');
  const newsApi = new NewsApi({ url: urlNewsApi, token: apiKeyNewsApi, dateTo, dateFrom, pageSize });
  const findForm = new Form(searchForm);
  const newsCardList = new NewsCardList(newsContainer, preloader, notFound);
  const iconCard = new NewsCard(newsContainer);



  //проверка на аутентификацию при начальной загрузки
  if (tokenMainApi) {
    mainApi.getUserData(tokenMainApi)
      .then(data => {
        header.render(true, data.data.name);
        flagLogin = true;
      })
      .catch(err => {
        console.log('что-то с токеном');
        header.render(false);
        flagLogin = false;
      })
  };


  //Поиск новостей
  searchForm.addEventListener('submit', event => {
    event.preventDefault();

    const value = findForm.getInfo();

    //закрывать нотфаунд если в прошлый раз ничего не нашли
    if (!notFound.classList.contains('not-found_none')) {
      notFound.classList.add('not-found_none')
    }

    //запуск прелоадера
    preloader.classList.remove('preloader_none');

    //сам запрос на поиск новостей
    newsApi.getNews(value)
      .then(res => {

        preloader.classList.add('preloader_none');
        //TODO если новостей ноль то->
        if (res.totalResults === 0) {
          return notFound.classList.remove('not-found_none');
        }

        //отсылаем результаты на создание карточек
        newsCardList.renderResults(res.articles)


        //Состояние иконок
        iconCard.renderIcon(flagLogin)

        //прослушка иконок отправка запроса
        if (flagLogin) {
          const iconsAdd = newsContainer.querySelectorAll('.news__tag_add');
          iconAddHandler(iconsAdd)
        }

      })
      .catch(err => {
        console.log('err', err)
      })
  })

  //Создание экземпляров попапов
  popups.forEach(popup => {
    const popupNew = popupsNew[popup.id.slice(6)] = new Popup(popup, overlay);
    popupHandler(popupNew);
    popupNew.popup.querySelector('form') && controlForms(popupNew);
  })


  //Проcлушки

  // Прослушка иконки добавить карточку себе в сохраненные
  function iconAddHandler(iconsAdd) {

    iconsAdd.forEach(iconAdd => {
      iconAdd.addEventListener('click', event => {

        const data = getDataToSaved(event);
        const token = localStorage.getItem('token');
        mainApi.createArticle(data, token)
          .then(data => {
            console.log('succes')
          })
          .catch(err => {
            console.log('err')
          })
      })
    })
  }
  //Получение значений для отправки карточки карточки
  function getDataToSaved() {
    const card = event.target.closest('.news__card');

    return {
      keyword: findForm.getInfo().query,
      title: card.querySelector('.news__title').textContent,
      text: card.querySelector('.news__text').textContent,
      date: card.querySelector('.news__date').textContent,
      source: card.querySelector('.news__source').textContent,
      link: card.getAttribute('url'),
      image: card.querySelector('.news__image').style.backgroundImage.slice(5, -2)
    };

  }


  //Слухаем кнопку авторизация
  btnAuth.addEventListener('click', event => {

    //Октрытие попа авторизации
    popupsNew[event.target.id.slice(4)].open();
    popupsNew[event.target.id.slice(4)].clearContent();

  });

  //Управление попапами
  function popupHandler(popup) {
    togglePopup(popup)
    closePopupHandler(popup);
  }

  //Закрытие попапа кликом и эскейпом
  function closePopupHandler(popup) {
    const closerPopup = popup.popup.querySelector('.popup__close')

    closerPopup.addEventListener('click', event => {
      popup.close()
      popup.clearContent()
    })

    document.addEventListener('keyup', event => {
      event.preventDefault();
      if (event.code === 'Escape') {
        popup.close()
        popup.clearContent()
      }
    })
  }

  //Управление формами
  function controlForms(popup) {
    const forms = popup.popup
      .querySelectorAll('.popup__form')
      .forEach(form => {
        const formEntity = new Form(form, errorMessages)
        formHandler(form, formEntity, popup)
      })

  }

  //Просулшка сабмита формы
  function formHandler(form, formEntity, popup) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();

      const valuesForm = formEntity.getInfo()

      //Запрос на регистрацию
      if (event.target.getAttribute('name') === 'auth') {
        mainApi.signup(valuesForm)
          .then(res => {
            localStorage.setItem('name', res.data.name);

            popup.close();
            popup.clearContent();
            popupsNew['success'].open();
          })
          .catch(err => {
            formEntity.setServerError(err.message);
          })
      } else if (event.target.getAttribute('name') === 'signin') {

        //Запрос на аутентификацию  
        mainApi.signin(valuesForm)
          .then(res => {

            localStorage.setItem('token', res.token);

            mainApi.getUserData(res.token)
              .then((res) => {
                localStorage.setItem('name', res.data.name);
                header.render(true, res.data.name);

                flagLogin = true;

                //статус иконок меняем, если был поиск новостей
                iconCard.renderIcon(flagLogin);

                popup.close();
                popup.clearContent();
              })


          })
          .catch(err => {
            formEntity.setServerError(err.message);
          })

      }
    })
  }

  //Прослушка кнопки выхода из аутентификации
  btnOutLogin.addEventListener('click', event => {
    header.render(false);
    flagLogin = false;
    localStorage.clear();
    window.location.reload();
  })

  //Запрос на регистрацию
  //Переключение между попапом авторизации и входом
  function togglePopup(popup) {
    const link = popup.popup
      .querySelector('.popup__link')
      .addEventListener('click', event => {
        popup.close()
        popup.clearContent()
        popupsNew[event.target.className.slice(24)].open()
      })
  }
})()



