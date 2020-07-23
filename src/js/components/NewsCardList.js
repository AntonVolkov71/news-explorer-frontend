import { setFormatDate } from "../utils/utils";


// renderResults принимает массив экземпляров карточек и отрисовывает их;
// renderLoader отвечает за отрисовку лоудера;
// renderError принимает объект ошибки и показывает ошибку в интерфейсе;
// showMore отвечает за функциональность кнопки «Показать ещё»;
// addCard принимает экземпляр карточки и добавляет её в список.

export class NewsCardList {
  constructor(newsBlock, container, preloader, notFound) {
    this.newsBlock = newsBlock;
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

    let newsSlice;

    this.news = news;
    //Логика отрисовки карточек  и вставки кнопки
    if (news.length > 3) {
      newsSlice = news.splice(0, 3);
      newsSlice.forEach(newCard => {
        const { urlToImage, publishedAt, title, description, content, url } = newCard;
        const source = newCard.source.name
        this.addCard(this.card({ urlToImage, publishedAt, title, description, content, url, source }));
      });
      this.showMore()
    } else {
      newsSlice = news;
      newsSlice.forEach(newCard => {
        const { urlToImage, publishedAt, title, description, content, url } = newCard;
        const source = newCard.source.name

        this.addCard(this.card({ urlToImage, publishedAt, title, description, content, url, source }));
        this.buttonMore.classList.add('news_close');
      });
    }
  }

  //Кнопка есче
  showMore() {
    this.buttonMore.classList.remove('news_close');
    this.buttonMore.addEventListener('click', event => {
      event.stopImmediatePropagation();
      this.renderResults(this.news);
    })
  }

  //принимает экземпляр карточки и добавляет её в список.
  addCard(card) {
    this.cards.append(card);
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

  //TODO сделать лоудер отсюда
  //за отрисовку лоудера;
  renderLoader() {
    this.preloader.classList.toggle('preloader_none')
  }
  //TODO сделат not-found
  renderNotFound() {

  }


  //открыть блок новостей
  openNewsBlock() {
    this.newsBlock.classList.remove('news_none');
  }

  //закрыть контейнер с карточками
  сloseContainer() {
    this.container.classList.add('news_none')
  }
}