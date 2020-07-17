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
  card(){//{ urlToImage, publishedAt, title, description, url, source }) {
    // console.log('object')
    // const card =
    //   ` 
    //` <template id="tmpl">

    let elem = document.createElement('div'); 
    
    elem.innerHTML +=  <div class="news__card">

      <div class="news__image">
        <div class="news__tools">

          <div class="news__left"></div>

          <div class="news__right">
            <button class="news__tag news__tag_auth new__tag_none">Войдите, чтобы сохранять статьи</button>
            <button class="news__tag news__tag_add news__tag_add_mark"></button>
          </div>
        </div>
      </div>

      <div class="news__about">
        <p class="news__date">8 сентября 1380</p>
        <h4 class="news__title">«Первозданная тайга»: новый фотопроект Игоря Шпиленка</h4>
        <p class="news__text">В 2016 году Америка отмечала важный юбилей: сто лет назад здесь начала складываться
        система национальных парков – охраняемых территорий, где и сегодня каждый может приобщиться к природе.
</p>
        <p class="news__source">Бабушки подъезда</p>
      </div>
    </div>


    // </template>`


    // let elem = document.createElement('div');

    // elem.append(tmpl.content.cloneNode(true));

    return elem
  }
  //отрисовка карточек
  renderResults(news) {

    this.container.classList.remove('news_none');

    if (this.container.id == 'news-main') {
      this.createTitle();
    }

    //обработка массива новостей
    news.map(newCard => {
      //console.log(newCard)
      // const { urlToImage, publishedAt, title, description, url } = newCard;
      // const source = newCard.source.name
      
      console.log(this.card())
      // this.card({ urlToImage, publishedAt, title, description, url, source })
      // this.addCard(this.card({ urlToImage, publishedAt, title, description, url, source }))
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
    this.cards.append(card)
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