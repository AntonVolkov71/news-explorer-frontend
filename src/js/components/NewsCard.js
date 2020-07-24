// NewsCard. Класс карточки новости. Методы:
// renderIcon — отвечает за отрисовку иконки карточки. У этой иконки три состояния: иконка незалогиненного пользователя, активная иконка залогиненного, неактивная иконка залогиненного.

export class NewsCard {
  constructor(container) {
    this.container = container;
  }

  //доступна ли иконка в зав-ти о логина
  renderIcon(isLogin, card) {
    
    const icon = card.querySelector('.news__tag_add');
    console.log(icon)
    // icon.forEach(tag => {
      if (isLogin !== null) {
        // console.log(tag)
        icon.classList.add('news__tag_add_states');
        this.iconLogHandler(icon);
      } else {
        this.iconNoLogHandler(ticong);
      }
    //})
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
  iconLogHandler(tag) {
    //отключить ховер при залогане
    tag.addEventListener('mouseover', event => {
      tag.previousElementSibling.classList.add('new__tag_none')
    });
    //можно сохранить один раз
    tag.addEventListener('click', event => {
      //показать что успешно
      tag.previousElementSibling.textContent = 'Сохранение успешно';
      tag.previousElementSibling.classList.remove('new__tag_none');
      setTimeout(() => {
        tag.previousElementSibling.classList.add('new__tag_none');
      }, 1000);

      //маркировать
      event.target.classList.remove('news__tag_add_states');
      event.target.classList.add('news__tag_add_mark');
      event.target.disabled = true;
    })
  }
}