//Подключение нужных файлов =============================================================
"use strict"

//SPOLLERS=============================================================================================================
const spollersArray = document.querySelectorAll('[data-spollers]');
if (spollersArray.length > 0) {
   //Получаем массив обычных спойлеров (без условия)===================================================================
   const spollersRegular = Array.from(spollersArray).filter(function (item, index, self) {
      return !item.dataset.spollers.split(',')[0];
   });
   //Инициализация обычных спойлеров===================================================================================
   if (spollersRegular.length > 0) {
      initSpollers(spollersRegular);
   }

   //Получение спойлеров с условием====================================================================================
   const spollersMedia = Array.from(spollersArray).filter(function (item, index, self) {
      return item.dataset.spollers.split(',')[0];
   });

   //Инициализация спойлеров с условием================================================================================
   if (spollersMedia.length > 0) {
      const breakpointArray = [];
      spollersMedia.forEach(item => {
         const params = item.dataset.spollers;
         const breakpoint = {};
         const paramsArray = params.split(',');
         breakpoint.value = paramsArray[0];
         breakpoint.type = paramsArray[1] ? paramsArray[1].trim() : 'max';
         breakpoint.item = item;
         breakpointArray.push(breakpoint);
      });

      //Получаем уникальные брейкпоинты================================================================================
      let mediaQueries = breakpointArray.map(function (item) {
         return '(' + item.type + "-width: " + item.value + "px)," + item.value + ',' + item.type;
      });
      mediaQueries = mediaQueries.filter(function (item, index, self) {
         return self.indexOf(item) === index;
      });

      //Работа с брейкпоинтами=========================================================================================
      mediaQueries.forEach(breakpoint => {
         const paramsArray = breakpoint.split(',');
         const mediaBreakpoint = paramsArray[1];
         const mediaType = paramsArray[2];
         const matchMedia = window.matchMedia(paramsArray[0]);

         //Объекты с нужными условиями=================================================================================
         const spollersArray = breakpointArray.filter(function (item) {
            if (item.value === mediaBreakpoint && item.type === mediaType) {
               return true;
            }
         });
         //Событие=====================================================================================================
         matchMedia.addListener(function () {
            initSpollers(spollersArray, matchMedia);
         });
         initSpollers(spollersArray, matchMedia);
      });
   }

   function initSpollers(spollersArray, matchMedia = false) {
      spollersArray.forEach(spollersBlock => {
         spollersBlock = matchMedia ? spollersBlock.item : spollersBlock;
         if (matchMedia.matches || !matchMedia) {
            spollersBlock.classList.add('_init');
            initSpollersBody(spollersBlock);
            spollersBlock.addEventListener('click', setSpollerAction);
         } else {
            spollersBlock.classList.remove('_init');
            initSpollersBody(spollersBlock, false);
            spollersBlock.removeEventListener('click', setSpollerAction);
         }
      });
   }
   //Работа с контентом================================================================================================
   function initSpollersBody(spollersBlock, hideSpollerBody = true) {
      const spollerTitles = spollersBlock.querySelectorAll('[data-spoller]');
      if (spollerTitles.length > 0) {
         spollerTitles.forEach(spollerTitles => {
            if (hideSpollerBody) {
               spollerTitles.removeAttribute('tabindex');
               if (!spollerTitles.classList.contains('_active')) {
                  spollerTitles.nextElementSibling.hidden = true;
               }
            } else {
               spollerTitles.setAttribute('tabindex', '-1');
               spollerTitles.nextElementSibling.hidden = false;
            }
         });
      }
   }
   function setSpollerAction(e) {
      const el = e.target;
      if (el.hasAttribute('data-spoller') || el.closest('[data-spoller]')) {
         const spollerTitle = el.hasAttribute('data-spoller') ? el : el.closest('[data-spoller]');
         const spollersBlock = spollerTitle.closest('[data-spollers]');
         const oneSpoller = spollersBlock.hasAttribute('data-one-spoller') ? true : false;
         if (!spollersBlock.querySelectorAll('._slide').length) {
            if (oneSpoller && !spollerTitle.classList.contains('_active')) {
               hideSpollerBody(spollersBlock);
            }
            spollerTitle.classList.toggle('_active');
            _slideToggle(spollerTitle.nextElementSibling, 500);
         }
         e.preventDefault();
      }
   }
   function hideSpollerBody(spollersBlock) {
      const spollerActiveTitle = spollersBlock.querySelector('[data-spoller]._active');
      if (spollerActiveTitle) {
         spollerActiveTitle.classList.remove('_active');
         _slideUp(spollerActiveTitle.nextElementSibling, 500);
      }
   }
}

//=====================================================================================================================
//Slide Toggle
let _slideUp = (target, duration = 500) => {
   if (!target.classList.contains('_slide')) {
      //for animation
      target.classList.remove('_show');

      target.classList.add('_slide');
      target.style.transitionProperty = 'height, margin, padding';
      target.style.transitionDuration = duration + 'ms';
      target.style.height = target.offsetHeight + 'px';
      target.offsetHeight;
      target.style.overflow = 'hidden';
      target.style.height = 0;
      target.style.paddingTop = 0;
      target.style.paddingBottom = 0;
      target.style.marginTop = 0;
      target.style.marginBottom = 0;
      window.setTimeout(() => {
         target.hidden = true;
         target.style.removeProperty('height');
         target.style.removeProperty('padding-top');
         target.style.removeProperty('padding-bottom');
         target.style.removeProperty('margin-top');
         target.style.removeProperty('margin-bottom');
         target.style.removeProperty('overflow');
         target.style.removeProperty('transition-duration');
         target.style.removeProperty('transition-property');
         target.classList.remove('_slide');
      }, duration);
   }
}
let _slideDown = (target, duration = 500, durationToShow = 0) => {
   if (!target.classList.contains('_slide')) {
      target.classList.add('_slide');
      if (target.hidden) {
         target.hidden = false;
      }
      let height = target.offsetHeight;
      target.style.overflow = 'hidden';
      target.style.height = 0;
      target.style.paddingTop = 0;
      target.style.paddingBottom = 0;
      target.style.marginTop = 0;
      target.style.marginBottom = 0;
      target.offsetHeight;
      target.style.transitionProperty = 'height, margin, padding';
      target.style.transitionDuration = duration + 'ms';
      target.style.height = height + 'px';
      target.style.removeProperty('padding-top');
      target.style.removeProperty('padding-bottom');
      target.style.removeProperty('margin-top');
      target.style.removeProperty('margin-bottom');
      window.setTimeout(() => {
         target.style.removeProperty('height');
         target.style.removeProperty('overflow');
         target.style.removeProperty('transition-duration');
         target.style.removeProperty('transition-property');
         target.classList.remove('_slide');
      }, duration);

      //for animation
      setTimeout(() => {
         target.classList.add('_show');
      }, durationToShow);
   }
}
let _slideToggle = (target, duration = 500) => {
   if (target.hidden) {
      return _slideDown(target, duration);
   } else {
      return _slideUp(target, duration);
   }
}

//====================================================================================
/*
Для родителя спойлеров пишем атрибут data-spollers
Для заголовков спойлеров пишем атрибут data-spoller
Если нужно включать/выключать работу спойлера на определенной ширине экрана
пишем параметры ширины брейкпоинта:
data-spoller="992,max"

Если нужно чтобы в блоке был только один открытый спойлер пишем data-one-spoller
*/;
//Определиние тачпад или нет
let isMobile = {
	Android: function() {return navigator.userAgent.match(/Android/i);},
	BlackBerry: function() {return navigator.userAgent.match(/BlackBerry/i);},
	iOS: function() {return navigator.userAgent.match(/iPhone|iPad|iPod/i);},
	Opera: function() {return navigator.userAgent.match(/Opera Mini/i);},
	Windows: function() {return navigator.userAgent.match(/IEMobile/i);},
	any: function() {return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());}
};
/*		let body=document.querySelector('body');
if(isMobile.any()){
	body.classList.add('touch');
}else{
	body.classList.add('mouse');
};*/

//===================================================================================================
//Функции для Gulp
function textWebp(callback) {
	var webP = new Image();
	webP.onload = webP.onerror = function() {
		callback(webP.height == 2);
	};
}
textWebp(function(support) {
	if(support == true){
		document.querySelector('body').classList.add('webp');
	}
});;
//Burger ==============================================================================
/* const iconMenu = document.querySelector('.menu__icon');
const iconContainer = document.querySelector('.icon-menu__container')

if (iconMenu) {
	const iconBody = document.querySelector('.menu');
	iconMenu.addEventListener('click', function (e) {
		document.body.classList.toggle('_lock');
		iconMenu.classList.toggle('_active');
		iconBody.classList.toggle('_active');
		iconContainer.classList.toggle('_active')
	});
	menuBurgerHoverHelper()
} */
;

// Variable for fetch
const urlServer = 'http://localhost:3000';
const saleUrl = 'json/sale.json';
const artsUrl = 'json/arts.json';
const headers = { 'Content-Type': 'application/json' };


//Отслеживание любых кликов =====================================================================================================
window.onload = function () {
   // Чтобы решить проблему 100vh на мобильных устройствах приходится использовать --app-height
   const appHeight = () => {
      const doc = document.documentElement
      doc.style.setProperty('--app-height', `${window.innerHeight}px`)
   }
   window.addEventListener('resize', appHeight)
   appHeight()

   if (window.innerWidth < 992 && isMobile.any()) {
      adaptiveOnLoad()
   }
   document.addEventListener('click', documentActions)
   window.addEventListener('scroll', () => {
      if (document.querySelectorAll('.menu__item._hover').length > 0 && window.innerWidth > 767.98) {
         document.querySelectorAll('.menu__item._hover').forEach(item => {
            item.classList.remove('_hover')
         });
      }
      if (document.querySelector('.lang-menu__visible').classList.contains('_hold')) {
         document.querySelector('.lang-menu__visible').classList.remove('_hold');
      }
   })

   //Actions=====================================================================================================================
   function documentActions(e) {
      const targetElement = e.target;

      if (window.innerWidth >= 768 && isMobile.any()) {
         //Header================================================
         if (targetElement.classList.contains('menu__arrow')) {
            targetElement.closest('.menu__item').classList.toggle('_hover');
         }
         if (!targetElement.closest('.menu__item') && document.querySelectorAll('.menu__item._hover').length > 0) {
            document.querySelectorAll('.menu__item._hover').forEach(item => {
               item.classList.remove('_hover')
            });
         }
      }
      //Burger===================================================================================================================
      if (targetElement.closest('.menu__icon')) {
         menuOpenClose()
      }
      if (!targetElement.closest('.menu__icon') && !targetElement.closest('.menu__menu-hold') && window.innerWidth >= 768 && window.innerWidth < 992) {
         menuOpenClose('close')
      }
      if (targetElement.closest('.lang-menu__visible') && !document.querySelector('.lang-menu__visible').classList.contains('_hold')) {
         document.querySelector('.lang-menu__visible').classList.add('_hold')
         document.querySelectorAll('.lang-menu__option').forEach(item => {
            if (item.classList.contains('_active')) {
               item.classList.remove('_active')
            }
            item.style.transform = `translate(0, 0)`;
         });
      } else if (targetElement.closest('.lang-menu__option') && document.querySelector('.lang-menu__visible').classList.contains('_hold')) {
         const optionsValue = targetElement.getAttribute('data-value');
         const langList = document.querySelector('.lang-menu__list');
         const langSelect = document.querySelector('.lang-menu__select');
         langSelect.setAttribute('value', optionsValue);

         //Здесь мы получаем массив из "options" после чего нам нужно определить не является ли элемент первым, 
         //для этого я использовал findIndex(), чтобы первый элемент не получал transform и не улетал вверх
         const options = document.querySelectorAll('.lang-menu__option');
         const optionsIndex = Array.from(options).findIndex((el, i, ar) => el == targetElement ? i : null);
         const optionsCount = options.length;
         if (optionsIndex != -1) { targetElement.style.transform = `translate(0, -${100 * (optionsCount - 1)}%)`; }
         if (optionsIndex != -1 && window.innerWidth < 768) { targetElement.style.transform = `translate(-${100 * (optionsCount - 1)}%, 0)`; }

         targetElement.classList.add('_active');
         /* options.forEach(item => {
            if (!item.classList.contains('_active')) {
               item.style.backgroundColor = `#eee`;
               setTimeout(() => {
                  item.style.backgroundColor = `#fff`;
               }, 300)
            }
         }) */

         document.querySelector('.lang-menu__visible').classList.remove('_hold');
         setTimeout(() => {
            targetElement.style.transform = `translate(0, 0)`;
            langList.insertBefore(targetElement, langList.children[0])
         }, 300)
      }
      if (!targetElement.closest('.lang-menu__visible') && document.querySelector('.lang-menu__visible').classList.contains('_hold')) {
         document.querySelector('.lang-menu__visible').classList.remove('_hold');
      }

      //RadioChecking===============================================
      if (targetElement.closest('._radioInput')) {
         const saleRadioInput = targetElement.querySelector('input');
         const currentStep = targetElement.closest('._radioInputForm');
         const saleRadio = currentStep.querySelectorAll('._radioInput input[type = radio]');
         saleRadio.forEach(item => {
            if (item.hasAttribute('checked')) {
               item.removeAttribute('checked');
               item.parentElement.classList.remove('_active');
            }
         });

         saleRadioInput.setAttribute('checked', '');
         radioChecking()
      }

      //Sale==================================================
      if (targetElement.closest('.forms-sale__button') && !targetElement.closest('.forms-sale__button_prev') && !targetElement.closest('.forms-sale__button_send')) {
         const currentStepCount = document.querySelector('[data-step]').getAttribute('data-step')
         document.querySelector('[data-step]').setAttribute('data-step', Number(currentStepCount) + 1)
         const formsSaleQustion = document.querySelectorAll('[data-stepId]');
         /*  if (formsSaleQustion.length > 0) {
             formsSaleQustion.forEach(item => {
                item.style.opacity = 0;
             });
          } */
         const time = new Promise((res, rej) => {
            setTimeout(() => {
               currentStep()
               res()
            }, 100)
         })/* .then(() => {
            setTimeout(() => {
               document.querySelectorAll('[data-stepId]._active').forEach(elem => {
                  elem.style.opacity = 1
               });
               document.querySelector('[data-stepId]._view').style.opacity = 1;
            }, 60);
         }); */
      }
      if (targetElement.closest('.forms-sale__button_prev')) {
         const currentStepCount = document.querySelector('[data-step]').getAttribute('data-step')
         document.querySelector('[data-step]').setAttribute('data-step', Number(currentStepCount) - 1)
         const formsSaleQustion = document.querySelectorAll('[data-stepId]');
         /*  if (formsSaleQustion.length > 0) {
             formsSaleQustion.forEach(item => {
                item.style.opacity = 0;
             });
          } */
         const time = new Promise((res, rej) => {
            setTimeout(() => {
               currentStep()
               res()
            }, 100)
         })/* .then(() => {
            document.querySelectorAll('[data-stepId]._active').forEach(elem => {
               elem.style.opacity = 1
            });
            document.querySelector('[data-stepId]._view').style.opacity = 1;

         }); */
      }
      if (targetElement.closest('.forms-sale__button_send')) {
         sendSaleValue()
         e.preventDefault()
      }

      //Contact Us==================================================================================================================
      if (targetElement.closest('.forms-contact-us__button')) {
         contacFormCreateRequest()
         e.preventDefault();
      }

      //Show More======================================================================================
      if (targetElement.classList.contains('arts__showMore')) {
         getArts(targetElement);
         e.preventDefault();
      }

      //Popup========================================================================================================================
      if (targetElement.closest('.order-popup__button')) {
         helpListOrederPopupPadding(targetElement)
      }
      if (targetElement.closest('.order-popup__sub-item')) {
         if (targetElement.closest('[data-subSubList]')) {
            helpOrederPopupSubSubListSlide()
         }
      }
   }

   //Adaptive=============================================================================================
   function adaptiveOnLoad() {
      setTimeout(() => {
         document.querySelector('.menu__lang').style.display = `block`;
         document.querySelector('.contacts-menu').style.display = `flex`;
      }, 300);
      menuBurgerHoverHelper()
   }

   function radioChecking() {
      //Позволяет отмечать нужные чекбоксы
      const saleRadio = document.querySelectorAll('._radioInput input[type = radio]');
      saleRadio.forEach(item => {
         if (item.hasAttribute('checked')) {
            item.parentElement.classList.add('_active');
            return item.parentElement
         }
         if (!item.hasAttribute('checked') && item.parentElement.classList.contains('_active')) {
            item.parentElement.classList.remove('_active');
         }
      });
   }
   //Menu==================================================================================================================
   function menuListHoverHelper() {
      const menuItem = document.querySelectorAll('.menu__item');
      menuItem.forEach(i => {
         i.addEventListener('mouseleave', el => {
            const targetElement = el.target;
            if (!targetElement.hasAttribute('disabled')) {
               targetElement.setAttribute('disabled', '')
               setTimeout(() => {
                  targetElement.removeAttribute('disabled')
               }, 360)
            }
         });
      })
   } menuListHoverHelper()

   function menuOpenCloseClosing() {
      let opend = 'close';
      return function (action) {
         const iconMenu = document.querySelector('.icon-menu')
         const iconBody = document.querySelector('.menu');

         if (opend === 'close' && action !== 'close') {
            if (window.innerWidth < 768) {
               document.body.classList.add('_lock');
            }
            iconBody.classList.add('_active');
            iconMenu.classList.add('_active');
            opend = 'open';
         } else if (opend === 'open' && action !== 'open') {
            if (window.innerWidth < 768) {
               document.body.classList.remove('_lock');
            }
            iconBody.classList.remove('_active');
            iconMenu.classList.remove('_active')
            opend = 'close';
         }

      }
   }
   const menuOpenClose = menuOpenCloseClosing();

   /* function menuLangHelper() {
      const menuLangVisible = document.querySelector('.menu__lang-visible');
      const menuOptions = document.querySelector('.menu__option')

      console.log(menuOptions.value)
   } menuLangHelper() */

   function menuBurgerHoverHelper() {
      const menuBody = document.querySelector('.menu__body');
      const menuContacts = document.querySelector('.contacts-menu');
      const menuHold = document.querySelector('.menu__menu-hold');
      const menuLang = document.querySelector('.menu__lang');

      menuHold.insertBefore(menuContacts, menuHold.children[0])
      menuHold.insertBefore(menuLang, menuHold.children[1])
   }
   //Contact Us==================================================================================================================
   function formFocus() {
      //Вешает на input'ы события фокуса, блюра и изменения для изменеия плейсходера форм, изменения состояния иконки внутри формы
      const inputs = document.querySelectorAll('input._needFocus');
      const formPhotos = document.querySelectorAll('input[name="photoForm"]');

      inputs.forEach(item => {
         const itemPlaceholder = item.getAttribute('placeholder');
         item.addEventListener("focus", function (e) {
            item.setAttribute('placeholder', '');
            item.parentElement.classList.add('_focus');
         });
         item.addEventListener("blur", function (e) {
            item.setAttribute('placeholder', itemPlaceholder);
            if (!item.value) {
               item.parentElement.classList.remove('_focus');
            }
         });
      });
      //Этот код позволяет отображать имя выбранного файла и сокращает его, если оно слишком велико
      formPhotos.forEach(element => {
         element.addEventListener("change", () => {
            let photoName = '';
            for (var i = 0; i < element.value.length; i++) {
               let nuberNow = String(element.value[i]);

               if (nuberNow === "\\") {
                  let photoPath = String(element.value).split(nuberNow);
                  photoName = photoPath[photoPath.length - 1]
               }
            }

            if (photoName.length > 25) {
               let firstStr = String(photoName[1]) + String(photoName[2]) + String(photoName[3]) + String(photoName[4]) + String(photoName[5]);
               let lastStr = '';
               for (var i = 0; i < photoName.length; i++) {
                  let nuberNow = String(photoName[i]);

                  if (nuberNow === "\.") {
                     let fileExtension = String(photoName).split(nuberNow);
                     lastStr = String(photoName[i - 4]) + String(photoName[i - 3]) + String(photoName[i - 2]) + String(photoName[i - 1]) + nuberNow + fileExtension[1];
                  }

               }
               //let startPath = String(photoName).split(firstStr);
               let finalStr = /* startPath[0] + */ firstStr + '...' + lastStr;
               document.querySelector('._send-photo__title').innerHTML = `<div class="forms-contact-us__title_photo">Загружено фото <span>${finalStr}</span></div>`;

            } else {
               document.querySelector('._send-photo__title').innerHTML = `<div class="forms-contact-us__title_photo">Загружено фото <span>${photoName}</span></div>`;
            }
         });
      })
   } formFocus();

   async function contacFormCreateRequest() {
      const contactForm = document.forms.contactUsForm;
      const file = contactForm.querySelector(`input[type="file"]`).value;
      const email = contactForm.querySelector(`input[type="email"]`).value;
      const phone = contactForm.querySelector(`input[type="tel"]`).value;

      let body = {
         file,
         email,
         phone
      }

      let response = await fetch(urlServer, {
         method: "POST",
         headers,
         body
      })

      response.ok ? alert('Request is enter') : alert("Error " + response.status);
   }

   //Arts========================================================================================================================
   function isVertical() {
      //определяет ориентацию картинки продукта для корректного отображения
      const productImage = document.querySelectorAll('.item-arts__image');
      if (productImage.length > 0) {
         productImage.forEach(item => {
            let imageWidth = item.querySelector('img').naturalWidth;
            let imageHeight = item.querySelector('img').naturalHeight;
            if (imageWidth < imageHeight) {
               item.classList.add('_vertical');
            }
            item.classList.add('_done');
         });
      }
   }
   isVertical()

   async function getArts(button) {
      //получает с сервера продуктовые карточки изменяет состояние кнопки загрузки
      if (!button.classList.contains('_hold')) {
         button.classList.add('_hold');
         button.setAttribute('disabled', '')
         let response = await fetch(artsUrl, {
            method: "GET",
            headers
         });
         if (response.ok) {
            let resolte = await response.json();
            loadArts(resolte);
            button.classList.remove('_hold');
            button.remove();
         } else {
            alert("Error");
         }

      }
   }

   function loadArts(data) {
      //загружает полученные с сервера продуктовые карточки на страницу
      const endArts = document.querySelector('._end');

      data.arts.forEach(item => {
         const artId = item.id;
         const artUrl = item.url;
         const artTitle = item.title;
         const artImage = item.image;
         const artText = item.text;
         const artPrice = item.price;

         var template = `
				<article class="arts__item item-arts">
               <h3 class="item-arts__title">${artTitle}</h3>
               <div class="item-arts__body">
                  <a href="${artUrl}" class="item-arts__image">
                     <picture>
                        <source srcset="img/arts/${artImage}.webp" type="image/webp">
                        <img src="img/arts/${artImage}.png" alt="#">
                     </picture>
                  </a>
               </div>
               <div class="item-arts__text">${artText}</div>
               <div class="item-arts__price">от <span>${artPrice}</span></div>
               <button type="button" class="item-arts__buy btn">Заказать</button>
            </article>
         `;

         endArts.insertAdjacentHTML('afterend', template);
      });

      isVertical()
   }

   //Sale========================================================================================================================
   async function saleLoadFunc() {
      // Запустить изменение размера формы в зависимости от количества вопросов и корректно ее отобразить, 
      // мы можем только дождавшись когда форма подгрузится с сервера
      const startHelp = await takeQuestions(saleUrl);
      // Не подходит resize для отрисовки сайта с нуля замыкание тоже....
      if (startHelp) {
         window.addEventListener('resize', () => {
            saleQuestionHelper()
         });
      }
   }
   saleLoadFunc()

   function saleQuestionHelper() {
      const itemListWidth = 500;
      //Помогает корректно отображать форму независимо от количества вопросов в ней
      const maxWidthContainer = 1380;
      const currentWidthContainer = window.innerWidth;
      const minSize = 600;
      const addSize = startSize - minSize;

      const saleForm = document.forms.saleForm;
      const itemLists = document.querySelectorAll('.forms-sale__list');
      const item = document.querySelectorAll('.forms-sale__item');
      const itemCount = saleForm.querySelectorAll('.forms-sale__item').length;


      const startSize = (itemCount * 52) / 2;

      itemLists.forEach(i => {
         i.style.maxHeight = startSize;
         i.style.transform = null;
      })

      if (window.innerWidth < 992) {
         itemLists.forEach(i => {
            i.style.transform = `translate(-25%)`;
         })
      }
      if (window.innerWidth < (itemListWidth + 30)) {
         itemLists.forEach(i => {
            i.style.maxHeight = null;
            i.style.transform = null;
         })
         item.forEach(e => {
            e.style.marginRight = 0;
         })
      }

   }


   async function sendSaleValue() {
      const saleForm = document.querySelectorAll(`[name="saleForm"]`);
      const body = []

      saleForm.forEach(item => {
         body.push(item.querySelector('input[checked]').value)
      });

      let response = await fetch(urlServer, {
         method: "POST",
         headers,
         body
      });

      response.ok ? alert('Request is enter') : alert("Error " + response.status);
   }

   function currentStep() {
      //определяет текущий шаг заполнения формы и меняет цифру в счетчике шагов
      const currentStepCount = document.querySelector('[data-step]').getAttribute('data-step');
      const allStepPreview = document.querySelectorAll('[data-stepId]');
      const finalStep = allStepPreview[allStepPreview.length - 1].getAttribute('data-stepId');
      allStepPreview.forEach(item => {
         item.classList.contains('_active') ? item.classList.remove('_active') : item.classList.contains('_view') ? item.classList.remove('_view') : null;
         item.classList.contains('_next') ? item.classList.remove('_next') : item.classList.contains('_prev') ? item.classList.remove('_prev') : null;
         item.getAttribute('data-stepId') == currentStepCount ? item.classList.add('_active') : null;
         item.getAttribute('data-stepId') - 1 == currentStepCount && !item.classList.contains('forms-sale__qustion') ? item.classList.add('_view') : null;
         if (item.getAttribute('data-stepId') == finalStep && finalStep == currentStepCount && !item.classList.contains('forms-sale__qustion')) {
            const preFinalStep = document.querySelector(`[data-stepId = "${finalStep - 1}"]`);
            preFinalStep.classList.add('_view');
            preFinalStep.classList.contains('_prev') ? preFinalStep.classList.remove('_prev') : null;
         }
         item.getAttribute('data-stepId') > currentStepCount && !item.classList.contains('_view') ? item.classList.add('_next') : null;
         item.getAttribute('data-stepId') < currentStepCount ? item.classList.add('_prev') : null;
      });
      const currentStepSpan = document.querySelector('[data-step]');
      const stepTemplate = `<span data-step="${currentStepCount}">${currentStepCount}</span>`;
      currentStepSpan.insertAdjacentHTML('afterend', stepTemplate);
      currentStepSpan.remove();
   }

   async function takeQuestions(url) {
      //получает с сервера вопросы для формы
      const response = await fetch(url, {
         method: "GET",
         headers: { 'Content-Type': 'application/json' }
      });
      if (response.ok) {
         let resolte = await response.json();
         return loadQuestion(resolte);
      }
   }

   function loadQuestion(data) {
      //Загружает полученные с сервера вопросы на страницу и вызывает связанные с этим функции
      const body = document.querySelector('.forms-sale__body');
      let stepCounter = 0;
      const lastIndex = data[data.length - 1].id;

      data.forEach(item => {
         const stepId = item.id;
         const questTitle = item.title;
         const questions = item.values;
         let questConter = 0;
         let questTemplate = ``;
         let prevButton = '';
         let buttonStyle = '';

         if (stepCounter > 0) {
            prevButton = window.innerWidth < 530 ? `<button type="button" class="forms-sale__button forms-sale__button_prev _icon-angle-down btn"></button>` : `<button type="button" class="forms-sale__button forms-sale__button_prev _icon-angle-down btn">Предыдущий шаг</button>`;
         }

         questions.forEach(el => {
            let checked = '';
            if (questConter == 0) {
               checked = 'checked'
            }
            questTemplate += `
            <li class="forms-sale__item _radioInput"><input type="radio" ${checked} name="radioSale" value="${questConter}" class="forms-sale__radio">${el}</li>
            `;
            questConter++;
         });


         let nextButton = stepCounter === 0 ? `<button type="button" class="forms-sale__button forms-sale__button_first _icon-angle-down btn">Следующий шаг</button>` : window.innerWidth < 530 ? `<button type="button" class="forms-sale__button _icon-angle-down btn"></button>` : `<button type="button" class="forms-sale__button _icon-angle-down btn">Следующий шаг</button>`;

         if (lastIndex == stepId) {
            nextButton = `<button type="button" class="forms-sale__button forms-sale__button_send btn">Отправить</button>`;
         }

         let template = `
         <div data-stepId="${stepId}" class="forms-sale__qustion _radioInputForm">
            <div class="forms-sale__title">${questTitle}</div>
            <form action="#" name="saleForm" class="forms-sale__form">
               <ul class="forms-sale__list">
                  ${questTemplate}
               </ul>
            </form>
            <div class="forms-sale__box-button">
               ${prevButton}
               ${nextButton}
            </div>
         </div>
         `;
         stepCounter++;
         body.insertAdjacentHTML('beforeend', template);
      });
      currentStep()
      radioChecking()
      saleQuestionHelper()
   }

   //Popup===============================================================================================
   function helpListOrederPopupPadding(button) {
      button.closest('._open') ? button.parentElement.classList.remove('_open') : null;
      button.closest('._active') ? button.parentElement.classList.add('_open') : null;
   }

   function helpOrederPopupSubSubListSlideFather() {
      const group = document.querySelector('.order-popup__sub-group');
      let swicher = true;

      _slideUp(group)

      return function () {
         const opener = document.querySelector('input[value="group"]');

         if (opener.hasAttribute('checked') && swicher) {
            _slideDown(group, 500, 550);
            swicher = false;
         } else if (!opener.hasAttribute('checked')) {
            _slideUp(group, 700);
            swicher = true;
         }

      }
   }
   const helpOrederPopupSubSubListSlide = helpOrederPopupSubSubListSlideFather()
}
