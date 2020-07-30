import { MainApi } from './api/MainApi';
import configs from './config.js'
import { Header } from './components/Header';
import { NewsCardList } from './components/NewsCardList';
import { cutEar } from './utils/utils';
import { NewsCard } from './components/NewsCard';

//Нам глобального не надо
(() => {

  //необходимые элементы
  const { urlMainApi, tokenMainApi } = configs;

  //Элементы HTML
  const root = document.querySelector('.root');
  const btnOutLogin = root.querySelector('#button-out-login');
  const headerHTML = root.querySelector('.header');
  const decsNews = root.querySelector('.desc-news');
  const decsNewsTitle = root.querySelector('.desc-news__title');
  const decsNewsKeyWords = root.querySelector('.desc-news__key-words');
  const preloader = root.querySelector('.preloader');
  const notFound = root.querySelector('.not-found');
  const news = root.querySelector('.news');
  const newsContainer = root.querySelector('.news__container');
  const burger = root.querySelector('.nav__menu-burger');
  const navLinks = root.querySelector('.nav__links');
  const overlay = document.querySelector('.overlay');
  const nav = root.querySelector('.nav');

  //Сууущности
  const mainApi = new MainApi(urlMainApi);
  const header = new Header(headerHTML, 'saved');
  const iconCard = new NewsCard(newsContainer, mainApi, '', queryArticles);
  const newsCardList = new NewsCardList(news, newsContainer, preloader, iconCard);


  //проверка на регистрацию при начальной загрузки
  root.classList.add('overlay'); //нечего смотреть если не зареган //TODO

  //запрос проверка на сущетсвование в системе
  mainApi.getUserData(tokenMainApi)
    .then(res => {
      root.classList.remove('overlay');
      header.render(true, res.data.name);
      localStorage.setItem('name', res.data.name);
      //отрисовка блока статей 
      queryArticles(localStorage.getItem('name'));
    })
    .catch(err => {
      document.location.href = '/';
    })

  //отрисовка блока статей 
  function queryArticles(name) {
    //запуск релоудера
    newsCardList.renderLoader();
    //запрос на карточки
    getArticles(name)
  };

  //запрос на карточки
  function getArticles(name) {
    mainApi.getArticles(tokenMainApi)
      .then(articles => {
        //останова релоудера
        newsCardList.renderLoader();

        //отрисовка блока дескрипшина
        renderDecsNews(name, articles.data);

        //отрисовать карточки
        newsCardList.renderResults(articles.data)
        //Состояние иконок
        iconCard.renderIcon();
      })
      .catch(err => {
        if (err.message === '404') {
          //останова релоудера
          newsCardList.renderLoader();
          //рендер нотфаунд
          decsNews.classList.add('decs-news_none');
          notFound.classList.remove('not-found_none');
          newsContainer.classList.add('news_none');
        }
      });
  }

  //отрисовка блока дескрипшина
  function renderDecsNews(name, articles) {
    decsNews.classList.remove('decs-news_none');
    renderTitleDecsNews(name, articles.length);
    renderKeyWordsDecsNews(articles);
  };

  //отрисовка заголовка блока дескрипшина
  function renderTitleDecsNews(name, amountNews) {
    const nameUpper = name[0].toUpperCase() + name.slice(1);
    decsNewsTitle.textContent = `${nameUpper}, у вас ${amountNews} ${cutEar(amountNews)}`;
  };

  //отрисовка ключевых слов блока дескрипшина
  function renderKeyWordsDecsNews(articles) {

    //Получение ключевых слов
    const strongKeys = decsNewsKeyWords.querySelector('strong');
    strongKeys.textContent = amountKeys(articles);

    //Отрисовка текста с ключевыми словами
    decsNewsKeyWords.textContent = 'По ключевым словам ';
    decsNewsKeyWords.append(strongKeys)
  };

  //Подсчет ключевыч слов
  function amountKeys(articles) {

    //делаем из объекта массив объектов из свойств
    const arrObjects = makeArrObj(objUnicKeys(articles));
    //сортировка массива по наибольшему количеству
    const amountArray = arrObjects.sort((a, b) => Object.values(b)[0] - Object.values(a)[0]);
    //Получение кей слов
    const popularityKeys = getPopularityKeys(amountArray);

    return setStringKeys(popularityKeys, amountArray.length)
  };

  //Получение кей слов
  function getPopularityKeys(amountArray) {

    let popularityKeys;
    if (amountArray.length >= 2) {
      popularityKeys = amountArray.slice(0, 2).map(el => Object.keys(el).map(key => key)[0]);
    }
    if (amountArray.length === 2) {
      popularityKeys = amountArray.slice(0, 2).map(el => Object.keys(el).map(key => key)[0]);
    }
    if (amountArray.length === 1) {
      popularityKeys = amountArray.map(el => Object.keys(el).map(key => key)[0]);
    }
    console.log(popularityKeys)
    return popularityKeys;
  };

  //Создаем объект с уникальными ключ словами
  function objUnicKeys(articles) {
    const obj = {};
    const keyWords = articles.map(el => {
      obj[el.keyword] !== undefined
        ? obj[el.keyword] += 1
        : obj[el.keyword] = 0;
    })
    return obj
  };

  //делаем из объекта массив объектов из свойств
  function makeArrObj(objectKeysValues) {
    const arr = [];
    Object.keys(objectKeysValues).map(key => {
      const obj = {};
      obj[key] = objectKeysValues[key]
      arr.push(obj)
    })
    return arr
  };

  //Деструктизация массива с кей слова
  function setStringKeys(keys, length) {
    const res = [...keys].map(el => el[0].toUpperCase() + el.slice(1)).join(', ')
    let text;
    length > 2
      ? text = `${res} и ${length - keys.length} другим.`
      : text = `${res}.`

    return text;
  }

  //Прослушки

  //Прослушка кнопки выхода из аутентификации
  btnOutLogin.addEventListener('click', event => {
    localStorage.clear();
    document.location.href = '/';
  })

  //открытие закрытие бургерного меню
  function toggleMenu() {
    navLinks.classList.toggle('nav_none');
    nav.classList.toggle('nav_bg-light');
    navLinks.classList.toggle('nav__bg-light');
    overlay.classList.toggle('overlay_is-opened')
  }
  //закрытие меню и возврат бургера
  function rebackIconBurger(burger) {
    burger.classList.add('nav__menu-burger_light')
    burger.classList.remove('nav__menu-burger_close-light');
  }
  function closeMenu() {
    nav.classList.remove('nav_bg-light')
    navLinks.classList.add('nav_none');
    navLinks.classList.remove('nav__bg-light');
    overlay.classList.remove('overlay_is-opened');
  };

  //клик на бургер
  burger.addEventListener('click', event => {
    event.target.classList.toggle('nav__menu-burger_dark')
    event.target.classList.toggle('nav__menu-burger_close-dark')

    toggleMenu();
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