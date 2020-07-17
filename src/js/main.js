import { MainApi } from './api/MainApi';
import configs from './config.js'
import { Popup } from './components/Popup';
import { Form } from './components/Form';
import * as errorMessages from './components/constants/errorMessages'
import { Header } from './components/Header';

//Нам глобального не надо
(() => {

  //необходимые элементы
  const { urlMainApi, tokenMainApi } = configs;

  
  //Элементы HTML
  const root = document.querySelector('.root');
  const btnAuth = document.getElementById('btn-auth');
  const popups = root.querySelectorAll('.popup');
  const popupsNew = {};
  const overlay = document.querySelector('.overlay');
  const headerHTML = root.querySelector('.header');

  //Сууущности
  const mainApi = new MainApi(urlMainApi);
  const header = new Header(headerHTML, 'main');

  //проверка на регистрацию при начальной загрузки
  if (tokenMainApi) {
    mainApi.getUserData(tokenMainApi)
      .then(data => {
        header.render(true, data.data.name)
      })
      .catch(err => {
        header.render(false)
      })
  };


  //Создание экземпляров попапов
  popups.forEach(popup => {

    const popupNew = popupsNew[popup.id.slice(6)] = new Popup(popup, overlay);
    popupHandler(popupNew);
    popupNew.popup.querySelector('form') && controlForms(popupNew);
  })


  //Проуслшки

  //Слухаем кнопку авторизация
  btnAuth.addEventListener('click', event => {

    //Октрытие попа авторизации
    popupsNew[event.target.id.slice(4)].open();
    popupsNew[event.target.id.slice(4)].clearContent();

  });

  //Прослушка попапа
  function popupHandler(popup) {
    togglePopup(popup)
    closePopupHandler(popup);
  }

  //Закрытие попапа прослушка кликом и эскейпом
  function closePopupHandler(popup) {

    const closerPopup = popup.popup.querySelector('.popup__close')
    closerPopup.addEventListener('click', event => {
      popup.close()
      popup.clearContent()
    })

    document.addEventListener('keyup', event => {
      event.preventDefault();
      if (event.code === 'Escape') {
        popup.close()
        popup.clearContent()
      }
    })
  }

  //Упраление формами
  function controlForms(popup) {

    const forms = popup.popup
      .querySelectorAll('.popup__form')
      .forEach(form => {
        const formEntity = new Form(form, errorMessages)
        formHandler(form, formEntity, popup)
      })

  }

  //Просулшка сабмита формы
  function formHandler(form, formEntity, popup) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const valuesForm = formEntity._getInfo()
      //Запрос на регистрацию
      if (event.target.name === 'auth') {
        mainApi.signup(valuesForm)
          .then(res => {
            console.log(res)
            localStorage.setItem('name', res.data.name)
            popup.close();
            popup.clearContent();
            popupsNew['success'].open();
          })
          .catch(err => {
            console.log('err', err)
            
            formEntity.setServerError(err.message)
          })
      } else if (event.target.name === 'signin') {
       
        mainApi.signin(valuesForm)
          .then(res => {
          
            localStorage.setItem('token', res.token)
          
            mainApi.getUserData(res.token)
            .then((res) => {
              localStorage.setItem('name', res.name)
           
              popup.close();
              popup.clearContent();
            })
          })
          .catch(err => {
            formEntity.setServerError(err.message)
          })

      }
    })
  }

  //Запрос на регистрацию

  //Переключение между попапом авторизации и входом
  function togglePopup(popup) {
    const link = popup.popup
      .querySelector('.popup__link')
      .addEventListener('click', event => {
        popup.close()
        popup.clearContent()
        popupsNew[event.target.className.slice(24)].open()
        //TODO проверить вход попапа саксес
      })
  }

})()




