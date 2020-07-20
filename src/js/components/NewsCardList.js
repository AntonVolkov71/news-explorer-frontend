// Класс списка карточек новостей. Конструктор принимает массив карточек, которые должны быть в списке при первой отрисовке. Методы:


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
    this.cards = container.querySelector('.news__cards');
    this.buttonMore = container.querySelector('.button');

  }

  //шаблон карточки
  card({ urlToImage, publishedAt, title, content, url, source }) {

    let tmplCard = tmplcard.content.cloneNode(true)

    const image = tmplCard.querySelector('.news__image');
    image.style.backgroundImage = `url(${urlToImage})`;

    const newsDate = tmplCard.querySelector('.news__date');
    newsDate.textContent = `${publishedAt}`

    const newsTitle = tmplCard.querySelector('.news__title');
    newsTitle.textContent = `${title}`;

    const newsText = tmplCard.querySelector('.news__tex');
    // newsText.textContent = `${content}`;
    console.log(typeof content)
  }
  //отрисовка карточек
  renderResults(news) {

    this.container.classList.remove('news_none');

    if (this.container.id == 'news-main') {
      this.createTitle();
    }
    // this.card()
    //обработка массива новостей
    news.map(newCard => {
      const { urlToImage, publishedAt, title, content, url } = newCard;
      const source = newCard.source.name
  //console.log(newCard)
      // console.log(urlToImage, publishedAt, title, description, url )
      this.card({ urlToImage, publishedAt, title, content, url, source })
      // this.cards.appendChild(tmplcard.content.cloneNode(true))
      //this.addCard(this.card({ urlToImage, publishedAt, title, description, url, source }))
    })
    this.showMore(news.length)
  }

  //TODO добавить кнопку еелси ннадо
  showMore(length) {
    if (length > 6) {
      this.container.append(this.buttonMore)
    }
  }
  //принимает экземпляр карточки и добавляет её в список.
  addCard(card) {
    //this.cards.append(card)
  }


  //отрисовка титульника результата поиска
  createTitle() {
    //TODO убарть или не надо ретерн
    this.container.insertAdjacentHTML('afterbegin', '<h3 class="news__res-title">Результаты поиска</h3>');

  }



  //добавить контейнер к секции


  //TODO сделать лоудер отсюда
  //за отрисовку лоудера;
  renderLoader() {

  }


}