export class Header {
  constructor(header, bg = '') {
    this.header = header;
    this.btnAuth = this.header.querySelector('.nav_button-auth');
    this.linkSaved = this.header.querySelector('.nav__link_saved-main');
    this.btnOut = this.header.querySelector('.nav_button-out-main');
    this.bg = bg;
    this.setBg()
  }
  //перерисовывает шапку в зав-ти от залоган или нет
  render(isLoggedIn, userName = '') {

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

  setBg() {
    if (this.bg === 'main') {
      this.header.classList.add('header_bg-main')
    }
  }
}