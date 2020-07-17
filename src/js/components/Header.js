export class Header {
  constructor(header, bg = '') {
    this.header = header;
    this.btnOut = this.header.querySelector('#button-out-login');
    this.bg = bg;
    this.setBg();
  }

  //перерисовывает шапку в зав-ти от залоган или нет
  render(isLoggedIn, userName = '') {
    //Шапка главной
    if (this.header.id === 'header-main') {
      this.btnAuth = this.header.querySelector('.nav_button-auth');
      this.linkSaved = this.header.querySelector('.nav__link_saved-main');

      if (isLoggedIn) {
        this.btnAuth.classList.add('nav__link_none');
        this.linkSaved.classList.remove('nav__link_none')
        this.btnOut.classList.remove('nav__link_none')
        this.btnOut.textContent = userName;

      } else {
        this.btnAuth.classList.remove('nav__link_none');
        this.linkSaved.classList.add('nav__link_none')
        this.btnOut.classList.add('nav__link_none')
        this.btnOut.textContent = '';
      }
    }
    //Шапка сохраненных
    if (this.header.id === 'header-saved' && isLoggedIn) {
      this.btnOut.textContent = userName;
    }
  }

  //Задник головы
  setBg() {
    if (this.bg === 'main') {
      this.header.classList.add('header_bg-main')
    }
    if (this.bg === 'saved') {
      this.header.classList.add('header_bg-saved')
    }
  }

 
}