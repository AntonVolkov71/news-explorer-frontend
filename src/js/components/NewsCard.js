// NewsCard. Класс карточки новости. Методы:
// renderIcon — отвечает за отрисовку иконки карточки. У этой иконки три состояния: иконка незалогиненного пользователя, активная иконка залогиненного, неактивная иконка залогиненного.

export class NewsCard {
  constructor(container) {
    this.container = container;

  }

  //доступна ли иконка в зав-ти о логина
  renderIcon(isLogin) {
    const icons = this.container.querySelectorAll('.news__tag_add');

    icons.forEach(tag => {
      if (isLogin) {
        tag.classList.add('news__tag_add_states');
        this.iconLogHandler(icons);
      } else {

        this.iconNoLogHandler(icons);
      }
    })
  }

  //прослушки иконки если не залоган, вылетает сообщение
  iconNoLogHandler(icons) {
    icons.forEach(tag => {

      tag.addEventListener('mouseover', event => {
        event.target.previousElementSibling.classList.remove('new__tag_none')
      })

      tag.addEventListener('mouseout', event => {
        event.target.previousElementSibling.classList.add('new__tag_none')
      })
    })
  }
  //Прослушка если залоган, отрисовка маркера
  iconLogHandler(icons) {

    icons.forEach(tag => {

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
    })
  }
}