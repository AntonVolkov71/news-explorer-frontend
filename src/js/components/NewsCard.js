// NewsCard. Класс карточки новости. Методы:
// renderIcon — отвечает за отрисовку иконки карточки. У этой иконки три состояния: иконка незалогиненного пользователя, активная иконка залогиненного, неактивная иконка залогиненного.

export class NewsCard {
  constructor(container) {
    this.container = container;
    this.icons = this.container.querySelectorAll('.news__tag_add');
    this.iconHandler();
  }

  //доступна ли иконка в зав-ти о логина
  renderIcon(isLogin) {
    this.icons.forEach(tag => {
      if (isLogin) {
        tag.disabled = false;
       
      } else {
        tag.disabled = true;
       
      }
    })
   
  }

  //прослушки иконки
  iconHandler() {
    this.icons.forEach(tag => {

      tag.addEventListener('mouseover', event => {
       event.target.disabled = false;
        event.target.previousElementSibling.classList.remove('new__tag_none')
      })

      tag.addEventListener('mouseout', event => {
        event.target.disabled = true;
        event.target.previousElementSibling.classList.add('new__tag_none')
      })
    })
  }
}