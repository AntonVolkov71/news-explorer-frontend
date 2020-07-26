import { MainApi } from './api/MainApi';
import configs from './config.js'
import { Popup } from './components/Popup';
import { Form } from './components/Form';
import * as errorMessages from './components/constants/errorMessages'
import { Header } from './components/Header';
import { NewsApi } from './api/NewsApi';
import { getMetadataKeys } from './utils/utils';
import { NewsCardList } from './components/NewsCardList'
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
  const news = root.querySelector('.news');
  const newsContainer = root.querySelector('.news__container');
  const buttonMore = newsContainer.querySelector('button');
  const title = newsContainer.querySelector('.news__res-title');
  const burger = root.querySelector('.nav__menu-burger');
  const navLinks = root.querySelector('.nav__links');
  const nav = root.querySelector('.nav');

  //Сууущности
  const mainApi = new MainApi(urlMainApi);
  const header = new Header(headerHTML, 'main');
  const newsApi = new NewsApi({ url: urlNewsApi, token: apiKeyNewsApi, dateTo, dateFrom, pageSize });
  const findForm = new Form(searchForm, errorMessages);
  const iconCard = new NewsCard(newsContainer, mainApi, findForm);
  const newsCardList = new NewsCardList(news, newsContainer, preloader, iconCard);

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

    //стереть старый поиск
    const cards = newsContainer.querySelectorAll('.news__card');
    const newsCards = newsContainer.querySelector('.news__cards');

    //убрать от предыдущего поиска кнопку и тайтл, карточки
    if (cards.length > 0) {
      //закрыть блок с карточками
      newsCardList.сloseContainer();

      closeButtonTitle();
      newsCards.innerHTML = '';
    }

    //закрывать нотфаунд если в прошлый раз ничего не нашли
    if (!notFound.classList.contains('not-found_none')) {
      notFound.classList.add('not-found_none');
    };

    //открыть блок новостей
    newsCardList.openNewsBlock();

    //запуск прелоадера
    newsCardList.renderLoader();
    //preloader.classList.remove('preloader_none');

    //сам запрос на поиск новостей
    newsApi.getNews(value)
      .then(res => {

        //показать тайтл и кнопку
        showButtonTitle();

        //preloader
        newsCardList.renderLoader();

        //если новостей ноль то->
        if (res.totalResults === 0) {
          closeButtonTitle();
          return notFound.classList.remove('not-found_none');
        }

        //отсылаем результаты на создание карточек
        newsCardList.renderResults(res.articles)
      })
      .catch(err => {
        notFound.classList.remove('not-found_none');
      })
  })

  //Убрать показать тайтл и кнопку 
  function showButtonTitle() {
    buttonMore.classList.remove('news_close');
    title.classList.remove('news_close');
  }
  function closeButtonTitle() {
    buttonMore.classList.add('news_close');
    title.classList.add('news_close');
  }

  //Создание экземпляров попапов
  popups.forEach(popup => {
    const popupNew = popupsNew[popup.id.slice(6)] = new Popup(popup);
    popupHandler(popupNew);
    popupNew.popup.querySelector('form') && controlForms(popupNew);
  })


  //открытие закрытие меню
  function toggleMenu() {
    nav.classList.toggle('nav__bg-dark')
    navLinks.classList.toggle('nav_none');
    navLinks.classList.toggle('nav__bg-dark');
    overlay.classList.toggle('overlay_is-opened');
  }

  //закрытие меню и возврат бургера
  function rebackIconBurger(burger) {
    burger.classList.add('nav__menu-burger_light')
    burger.classList.remove('nav__menu-burger_close-light');
  }
  function closeMenu() {
    nav.classList.remove('nav__bg-dark')
    navLinks.classList.add('nav_none');
    navLinks.classList.remove('nav__bg-dark');
    overlay.classList.remove('overlay_is-opened');
  };

  //смена значка бургера
  function toggleIconBurger(burger) {
    burger.classList.toggle('nav__menu-burger_light')
    burger.classList.toggle('nav__menu-burger_close-light');
  }

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

  //Проcлушки

  //клик на бургер
  burger.addEventListener('click', event => {
    toggleIconBurger(event.target)
    toggleMenu();
  })

  //Слухаем кнопку авторизация
  btnAuth.addEventListener('click', event => {
    let width = document.documentElement.clientWidth

    //закрыть бургерное меню
    if (width < 768) {
      toggleIconBurger(burger)
      toggleMenu();
    }

    //Октрытие попа авторизации
    popupsNew[event.target.id.slice(4)].open();
    popupsNew[event.target.id.slice(4)].clearContent();

  });

  //Управление попапами
  function popupHandler(popup) {
    togglePopup(popup)
    closePopupHandler(popup);
  }

  //Закрытие попапа 
  function closePopupHandler(popup) {
    const closerPopup = popup.popup.querySelector('.popup__close');

    // кликом
    popup.popup.addEventListener('click', event => {
      const besidePopup = event.target.classList.contains('popup');
      const closerPopup = event.target.classList.contains('popup__close');
      if (besidePopup || closerPopup) {
        popup.close();
        popup.clearContent();
      };
    });
    // эскейпом
    document.addEventListener('keyup', event => {
      event.preventDefault();
      if (event.code === 'Escape') {
        popup.close();
        popup.clearContent();
      };
    });
  };

  //Управление формами
  function controlForms(popup) {
    const forms = popup.popup
      .querySelectorAll('.popup__form')
      .forEach(form => {
        const formEntity = new Form(form, errorMessages)
        formHandler(form, formEntity, popup)
      });
  };

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
                const cards = root.querySelectorAll('.news__card')
                if (cards.length > 0) {
                  cards.forEach(card => iconCard.renderIcon(flagLogin, card))
                }

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



  //изменение окна
  window.addEventListener(`resize`, event => {
    const width = event.target.innerWidth;
    if (width > 767) {
      rebackIconBurger(burger)
      closeMenu();
    }
  }, false);
})()




