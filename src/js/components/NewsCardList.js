import { setFormatDate } from "../utils/utils";

export class NewsCardList {
  constructor(newsBlock, container, preloader, iconCard) {
    this.newsBlock = newsBlock;
    this.container = container;
    this.iconCard = iconCard;
    this.preloader = preloader;
    this.cards = this.container.querySelector('.news__cards');
    this.buttonMore = this.container.querySelector('.button');
  }

  //шаблон карточки
  card({ urlToImage, publishedAt, title, description, content, url, source, _id, keyword }) {
    let tmplCard = tmplcard.content.cloneNode(true);
    const newsCard = tmplCard.querySelector('.news__card');
    this.newsCard = newsCard;
    if (_id) {
      newsCard.setAttribute('_id', _id)
    }
    newsCard.setAttribute('url', url);
    

    //прослушка на клик 
    this.newsCardHandler();

    const image = tmplCard.querySelector('.news__image');
    image.style.backgroundImage = `url(${urlToImage})`;

    const newsDate = tmplCard.querySelector('.news__date');
    _id
      ? newsDate.textContent = publishedAt
      : newsDate.textContent = setFormatDate(publishedAt)

    const newsTitle = tmplCard.querySelector('.news__title');
    newsTitle.textContent = `${title}`;

    const newsText = tmplCard.querySelector('.news__text');
    description === null
      ? newsText.textContent = `${content}`
      : newsText.textContent = `${description}`;

    const newsSource = tmplCard.querySelector('.news__source');
    newsSource.textContent = `${source}`;

    if (keyword) {
      const newsTagKey = tmplCard.querySelector('.news__tag_key');
      newsTagKey.textContent = keyword[0].toUpperCase() + keyword.slice(1);
    }

    return tmplCard
  }

  //отрисовка карточек
  renderResults(news) {

    this.container.classList.remove('news_none');
    let newsSlice;
    this.news = news;
    //Логика отрисовки карточек  и вставки кнопки
    const mountNews = 3;
    if (news.length > mountNews) {
      newsSlice = news.splice(0, mountNews);
      newsSlice.forEach(newCard => {
        //отрисовка если сохранненая страница
        if (newCard['_id']) {

          const value = this.getValue(newCard);
          return this.addCard(this.card(value));
        }
        //отрисовка если главная страница
        const { urlToImage, publishedAt, title, description, content, url } = newCard;
        const source = newCard.source.name;
        this.addCard(this.card({ urlToImage, publishedAt, title, description, content, url, source }));
      });
      this.showMore();
    } else {
      newsSlice = news;
      newsSlice.forEach(newCard => {
        if (newCard['_id']) {
          const value = this.getValue(newCard);
          this.addCard(this.card(value));
        } else {
          const { urlToImage, publishedAt, title, description, content, url } = newCard;
          const source = newCard.source.name;
          this.addCard(this.card({ urlToImage, publishedAt, title, description, content, url, source }));
        }
        this.buttonMore.classList.add('news_close');
      });
    }


  }
  //получить значения для карточек
  getValue(card) {
    const { _id, date, image, keyword, link, source, text, title } = card;
    const value = {};
    value.urlToImage = image;
    value.publishedAt = date;
    value.title = title;
    value.description = text;
    value.content = text;
    value.url = link;
    value.source = source;
    value['_id'] = _id;
    value.keyword = keyword;

    return value;
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

  //Прослушка тыка карточки 
  newsCardHandler() {
    this.iconCard.renderIcon(localStorage.getItem('name'), this.newsCard);

    //TODO вызвать NewsCard прослушки
    this.newsCard.addEventListener('click', event => {
      const urlCard = event.target.closest('.news__card').getAttribute('url');
      //кроме иконнок
      if (event.target.classList.contains('news__title')) {
        window.open(urlCard, '_blank');
      }
    })
  }

  //за отрисовку лоудера;
  renderLoader() {
    this.preloader.classList.toggle('preloader_none')
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