import { MainApi } from './api/MainApi';
import configs from './config.js'
import { Header } from './components/Header';
import { NewsCardList } from './components/NewsCardList';

//Нам глобального не надо
(() => {

  //необходимые элементы
  const { urlMainApi, tokenMainApi } = configs;



  //Элементы HTML
  const root = document.querySelector('.root');
  const btnOutLogin = root.querySelector('#button-out-login');
  const headerHTML = root.querySelector('.header');
  const decsNewsTitle = root.querySelector('.desc-news__title');
  const decsNewsKeyWords = root.querySelector('.desc-news__key-words');

  //Сууущности
  const mainApi = new MainApi(urlMainApi);
  const header = new Header(headerHTML, 'saved');


  //проверка на регистрацию при начальной загрузки
  root.classList.add('overlay'); //нечего смотреть если не зареган

  //запрос проверка на сущетсвование в системе
  mainApi.getUserData(tokenMainApi)
    .then(res => {
      root.classList.remove('overlay');

      header.render(true, res.data.name);
      queryArticles(res.data.name)
    })
    .catch(err => {

      document.location.href = '/';
    })

  //отрисовка блока количества статей
  function queryArticles(name) {

    //TODO запрос на карточки
    mainApi.getArticles(tokenMainApi)
      .then(articles => {
        //TODO отрисовка блока дескрипшина
        renderDecsNews(name, articles.data);

        //TODO сразу отрисовать карточки
        //TODO подсчет статей
        //TODO подсчет ключевых слов

      })
  };

  //отрисовка блока дескрипшина
  function renderDecsNews(name, articles) {
    renderTitleDecsNews(name, articles.length);
    renderKeyWordsDecsNews(articles);
  };

  //отрисовка заголовка блока дескрипшина
  function renderTitleDecsNews(name, amountNews) {
    const nameUpper = name[0].toUpperCase() + name.slice(1);
    decsNewsTitle.textContent = `${nameUpper}, у вас ${amountNews} сохраненных статей`;
  };

  //отрисовка ключевых слов блока дескрипшина
  function renderKeyWordsDecsNews(articles) {
    const strongKeys = decsNewsKeyWords.querySelector('strong');
    strongKeys.textContent = amountKeys(articles);
    decsNewsKeyWords.textContent = `По ключевым словам `
    decsNewsKeyWords.append(strongKeys)
  };

  //Подсчет ключевыч слов
  function amountKeys(articles) {

    //делаем из объекта массив объектов из свойств
    const arrObjects = makeArrObj(objUnicKeys(articles));

    //сортировка массива по наибольшему количеству
    const amountArray = arrObjects.sort((a, b) => Object.values(b)[0] - Object.values(a)[0]);

    //Получение кей слов
    let popularityKeys = getPopularityKeys(amountArray);

    return setStringKeys(popularityKeys, amountArray.length)
  };

  //Получение кей слов
  function getPopularityKeys(amountArray) {
    let popularityKeys;
    if (amountArray.length > 3) {
      popularityKeys = amountArray.slice(0, 3).map(el => Object.keys(el).map(key => key)[0]);
    }
    if (amountArray.length === 2) {
      popularityKeys = amountArray.slice(0, 2).map(el => Object.keys(el).map(key => key)[0]);
    }
    if (amountArray.length === 1) {
      popularityKeys = amountArray.map(el => Object.keys(el).map(key => key)[0]);
    }
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
    length > 3
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



})()