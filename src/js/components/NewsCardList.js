import { setFormatDate } from "../utils/utils";


// renderResults принимает массив экземпляров карточек и отрисовывает их;
// renderLoader отвечает за отрисовку лоудера;
// renderError принимает объект ошибки и показывает ошибку в интерфейсе;
// showMore отвечает за функциональность кнопки «Показать ещё»;
// addCard принимает экземпляр карточки и добавляет её в список.

export class NewsCardList {
  constructor(container, preloader, notFound) {
    this.container = container;
    this.notFound = notFound;
    this.preloader = preloader;
    this.cards = this.container.querySelector('.news__cards');
    this.buttonMore = this.container.querySelector('.button');

  }

  //шаблон карточки
  card({ urlToImage, publishedAt, title, description, content, url, source }) {

    let tmplCard = tmplcard.content.cloneNode(true)

    const newsCard = tmplCard.querySelector('.news__card');
    newsCard.setAttribute('url', url)

    //прослушка на клик 
    this.newsCardHandler(newsCard);

    const image = tmplCard.querySelector('.news__image');
    image.style.backgroundImage = `url(${urlToImage})`;

    //TODO картинка по умолчанию если не грузится
    image.onload = function () {
      console.log(`Изображение загружено, размеры `);
    };

    image.onerror = function () {
      console.log("Ошибка во время загрузки изображения");
    };

    const newsDate = tmplCard.querySelector('.news__date');
    newsDate.textContent = setFormatDate(publishedAt);

    const newsTitle = tmplCard.querySelector('.news__title');
    newsTitle.textContent = `${title}`;

    const newsText = tmplCard.querySelector('.news__text');
    if (description === null) {
      newsText.textContent = `${content}`;
    } else {
      newsText.textContent = `${description}`;
    }

    const newsSource = tmplCard.querySelector('.news__source');
    newsSource.textContent = `${source}`;

    return tmplCard
  }

  //отрисовка карточек
  renderResults(news) {

    this.container.classList.remove('news_none');

    //фильтр одинаковых карточек
    const dublicateNon = this.filterDublicate(news)

    //отрисовка карточек
    dublicateNon.forEach(newCard => {
      const { urlToImage, publishedAt, title, description, content, url } = newCard;
      const source = newCard.source.name

      this.addCard(this.card({ urlToImage, publishedAt, title, description, content, url, source }));
    });

    this.showMore(news.length);
  }

  //Фильтр дубликатов результатов поиска
  filterDublicate(news) {
    const ids = [];

    return news.filter(el => {
      if (ids.includes(el.description)) {
        return false;
      }
      ids.push(el.description);
      return true;
    })
  }


  //TODO добавить кнопку еелси ннадо
  showMore(length) {
    if (length > 6) {
      this.container.append(this.buttonMore)
    }
  }
  //принимает экземпляр карточки и добавляет её в список.
  addCard(card) {
    this.cards.append(card)
  }

  //Прослушка тыка карточки открытие новости
  newsCardHandler(card) {
    card.addEventListener('click', event => {
      const urlCard = event.target.closest('.news__card').getAttribute('url');

      //кроме иконнок
      if (event.target.classList.contains('news__title')) {
        window.open(urlCard, '_blank');
      }

    })
  }

  //добавить контейнер к секции

  //TODO сделать лоудер отсюда
  //за отрисовку лоудера;
  renderLoader() {

  }


}