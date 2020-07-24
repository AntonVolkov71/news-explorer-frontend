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

  //Сууущности
  const mainApi = new MainApi(urlMainApi);
  const header = new Header(headerHTML, 'saved');
  const iconCard = new NewsCard(newsContainer);
  const newsCardList = new NewsCardList(news, newsContainer, preloader,iconCard);


  //проверка на регистрацию при начальной загрузки
  root.classList.add('overlay'); //нечего смотреть если не зареган

  //запрос проверка на сущетсвование в системе
  mainApi.getUserData(tokenMainApi)
    .then(res => {
      root.classList.remove('overlay');//TODO посмотреть что это
      header.render(true, res.data.name);
      localStorage.setItem('name', res.data.name);
    })
    .catch(err => {
      document.location.href = '/';
    })

  //отрисовка блока статей 
  const queryArticles = (name) => {
   
    //запуск релоудера
    newsCardList.renderLoader();

    //TODO запрос на карточки
    getArticles(name)

  };

  //запрос на карточки
  function getArticles(name) {
    mainApi.getArticles(tokenMainApi)
      .then(articles => {
        //останова релоудера
        newsCardList.renderLoader();
        
        //TODO отрисовка блока дескрипшина
        renderDecsNews(name, articles.data);

        //TODO  отрисовать карточки

        newsCardList.renderResults(articles.data)
        //Состояние иконок
        iconCard.renderIcon();

        // //Прослушка иконок
        // iconDelHandler();
        //Прослушка карочек
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
      })
  }

  // Прослушка иконки удалить карточку

  function iconDelHandler() {
    const iconsDel = newsContainer.querySelectorAll('.news__tag_del');
    const newsCards = newsContainer.querySelector('.news__cards');

    iconsDel.forEach(iconDel => {
      iconDel.addEventListener('click', event => {
        const card = event.target.closest('.news__card');
        const id = card.getAttribute('_id');

        //Запрос на удаление
        mainApi.removeArticle(id, tokenMainApi)
          .then(res => {
            //Перерисовка блока с новостями
            newsCards.innerHTML = '';
            queryArticles(localStorage.getItem('name'));

          })
          .catch(err => {
            console.log(err.message)
          })

      })
    })
  }


  //отрисовка блока статей 
  queryArticles(localStorage.getItem('name'))


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
    let popularityKeys = getPopularityKeys(amountArray);

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



})()