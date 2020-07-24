// NewsCard. Класс карточки новости. Методы:
// renderIcon — отвечает за отрисовку иконки карточки. У этой иконки три состояния: иконка незалогиненного пользователя, активная иконка залогиненного, неактивная иконка залогиненного.

export class NewsCard {
  constructor(container, mainApi, findForm) {
    this.container = container;
    this.mainApi = mainApi;
    this.findForm = findForm;

  }

  //доступна ли иконка в зав-ти о логина
  renderIcon(isLogin, card) {

    const icon = card.querySelector('button');
    const id = card.getAttribute('_id');
    if (isLogin !== null) {
      id === null && icon.classList.add('news__tag_add_states');
      this.iconLogHandler(icon, id);
    } else {
      this.iconNoLogHandler(icon);
    }
  }

  //прослушки иконки если не залоган, вылетает сообщение
  iconNoLogHandler(tag) {
    tag.addEventListener('mouseover', event => {
      event.target.previousElementSibling.classList.remove('new__tag_none')
    })
    tag.addEventListener('mouseout', event => {
      event.target.previousElementSibling.classList.add('new__tag_none')
    })
  }

  //Прослушка если залоган, отрисовка маркера
  iconLogHandler(tag, id) {
    if (id !== null) {
      tag.addEventListener('mouseover', event => {
        event.target.previousElementSibling.classList.remove('new__tag_none')
      })
      tag.addEventListener('mouseout', event => {
        event.target.previousElementSibling.classList.add('new__tag_none')
      });
      this.tagSavedPageHandler(tag);
    } else {
      //отключить ховер при залогане
      tag.addEventListener('mouseover', event => {
        tag.previousElementSibling.classList.add('new__tag_none')
      });
      //Прослушка кнопочки добавить/удалить
      this.tagMainPageHandlet(tag)

    }
  }
  //Прослушка если главная страница
  tagMainPageHandlet(tag) {
    tag.addEventListener('click', event => {
      !event.target.classList.contains('news__tag_add_mark')
        ? this.saved(event)
        : this.delete(event);
      //маркировать
      event.target.classList.toggle('news__tag_add_states');
      event.target.classList.toggle('news__tag_add_mark');
    })
  }

  //Прослушка если  страница с сохраненными статьями
  tagSavedPageHandler(tag) {
    console.log(tag)
  }

  //Удаление карточки если сохранил на главной
  delete(event) {
    const token = localStorage.getItem('token');
    this.mainApi.removeArticle(this.id, token)
      .then(() => {
        event.target.previousElementSibling.textContent = 'Удаление успешно';
        event.target.previousElementSibling.classList.remove('new__tag_none');
        setTimeout(() => {
          event.target.previousElementSibling.classList.add('new__tag_none');
        }, 1000);
      })
      .catch(err => {
        console.log(err)
      })
  }
  // добавить карточку себе в сохраненные
  saved(event) {
    const data = this.getDataToSaved(event);
    const token = localStorage.getItem('token');
    this.mainApi.createArticle(data, token)
      .then(res => {
        this.id = res.data._id;
        event.target.previousElementSibling.textContent = 'Сохранение успешно';
        event.target.previousElementSibling.classList.remove('new__tag_none');
        setTimeout(() => {
          event.target.previousElementSibling.classList.add('new__tag_none');
        }, 1000);
      })
      .catch(err => {
        console.log(err)
      })
  }
  //Получение значений для отправки карточки карточки
  getDataToSaved(event) {
    const card = event.target.closest('.news__card');

    return {
      keyword: this.findForm.getInfo().query,
      title: card.querySelector('.news__title').textContent,
      text: card.querySelector('.news__text').textContent,
      date: card.querySelector('.news__date').textContent,
      source: card.querySelector('.news__source').textContent,
      link: card.getAttribute('url'),
      image: card.querySelector('.news__image').style.backgroundImage.slice(5, -2)
    };
  }

}