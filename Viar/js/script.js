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
let _slideDown = (target, duration = 500) => {
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
const iconMenu = document.querySelector('.menu__icon');
const iconContainer = document.querySelector('.icon-menu__container')

if (iconMenu) {
	const iconBody = document.querySelector('.menu');
	iconMenu.addEventListener('click', function (e) {
		document.body.classList.toggle('_lock');
		iconMenu.classList.toggle('_active');
		iconBody.classList.toggle('_active');
		iconContainer.classList.toggle('_active')
	});
}
;

const urlServer = 'http://localhost:3000';
const saleUrl = 'json/sale.json';
const artsUrl = 'json/arts.json';
const headers = { 'Content-Type': 'application/json' };
//Отслеживание любых кликов =====================================================================================================
window.onload = function () {
   document.addEventListener('click', documentActions)

   //Actions=====================================================================================================================
   function documentActions(e) {
      const targetElement = e.target;

      if (window.innerWidth >= 768 && isMobile.any()) {
         //Header================================================
         if (targetElement.classList.contains('menu__arrow')) {
            targetElement.closest('.menu__item').classList.toggle('_hover');
         }
         if (!targetElement.closest('.menu__item') && document.querySelectorAll('.menu__item._hover').length > 0) {
            const menuItemHover = document.querySelectorAll('.menu__item._hover');
            menuItemHover.forEach(el => {
               el.removeClass("_hover")
            });
         }
      }
      //Sale==================================================
      if (targetElement.closest('.forms-sale__item')) {
         const saleRadioInput = targetElement.querySelector('input');
         const currentStep = document.querySelector('.forms-sale__qustion._active');
         const saleRadio = currentStep.querySelectorAll('li.forms-sale__item input[type = radio]');
         saleRadio.forEach(item => {
            if (item.hasAttribute('checked')) {
               item.removeAttribute('checked');
               item.parentElement.classList.remove('_active');
            }
         });

         saleRadioInput.setAttribute('checked', '');
         saleRadioChecking()
      }

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
      //Burger===================================================================================================================
      /* if (targetElement.classList.contains('menu__arrow') && document.querySelectorAll('.menu__button._active').length >= 0) {
         const menu = document.querySelector('.menu');
         const countActive = document.querySelectorAll('.menu__button._active').length;
         const countButtons = document.querySelectorAll('.menu__button').length;
         if (countButtons > countActive) {
            const differenceCount = countButtons - countActive;
            //const hideActive = document.querySelector('.menu').getAttribute('class').replace(/[^0-9]/g, '');
            const countHideActive = countActive + 1;
            menu.classList.remove(`_scroll-plus${countHideActive}`);
         }
         if (countActive != 1) {
            menu.classList.add(`_scroll-plus${countActive}`);
            const scrollPlus = document.querySelector(`._scroll-plus${countActive}`);
            const countActivePecent = 100 + 15 * countActive;
            menu.style.cssText =
               `
            height: ${countActivePecent}%;
            `;
         } else {
            menu.style.cssText =
               `
            height: 100%;
            `;
         }
      } */
   }
   //Contact Us==================================================================================================================
   function contacFormFocus() {
      //Вешает на формы из раздела Contact Us события фокуса, блюра и изменения для изменеия плейсходера форм, изменения состояния иконки внутри формы
      const contacForm = document.forms.contactUsForm;
      const contacFormInput = contacForm.contactUsInput;
      const contacFormPhoto = contacForm.contactUsPhoto;

      contacFormInput.forEach(item => {
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
      contacFormPhoto.addEventListener("change", function (e) {
         if (contacFormPhoto.value.length > 35) {
            let firstStr = '';
            let lastStr = '';
            for (var i = 0; i < contacFormPhoto.value.length; i++) {
               let nuberNow = String(contacFormPhoto.value[i]);

               if (nuberNow === "\\") {
                  firstStr = String(contacFormPhoto.value[i + 1]) + String(contacFormPhoto.value[i + 2]) + String(contacFormPhoto.value[i + 3]);
               }
               if (nuberNow === "\.") {
                  let fileExtension = String(contacFormPhoto.value).split(nuberNow);
                  lastStr = String(contacFormPhoto.value[i - 2]) + String(contacFormPhoto.value[i - 1]) + nuberNow + fileExtension[1];
               }

            }
            let startPath = String(contacFormPhoto.value).split(firstStr);
            let finalStr = startPath[0] + firstStr + '...' + lastStr;
            contacForm.querySelector('.forms-contact-us__title_photo').innerHTML = `<div class="forms-contact-us__title_photo">Загружено фото <span>${finalStr}</span></div>`;

         } else {
            contacForm.querySelector('.forms-contact-us__title_photo').innerHTML = `<div class="forms-contact-us__title_photo">Загружено фото <span>${contacFormPhoto.value}</span></div>`;
         }
      });
   } contacFormFocus();

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


   function saleRadioChecking() {
      //Позволяет отмечать нужные чекбоксы
      const saleRadio = document.querySelectorAll('li.forms-sale__item input[type = radio]');
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

   function saleQuestionHelper() {
      const itemListWidth = 500;
      //Помогает корректно отображать форму независимо от количества вопросов в ней
      const maxWidthContainer = 1380;
      const currentWidthContainer = window.innerWidth;
      const minSize = 600;
      const addSize = startSize - minSize;

      const saleForm = document.forms.saleForm;
      const itemLists = document.querySelectorAll('.forms-sale__list');
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
         // одна функция возвращает вторую, которая возвращает третью и все для того, чтобы точно убедиться в том, 
         // что формы подгружены и объект функции saleQuestionHelperUpper не создался раньше времени, замыкая значение
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
            prevButton = `
            <button type="button" class="forms-sale__button forms-sale__button_prev _icon-angle-down btn">Предыдущий шаг</button>
            `;
            buttonStyle = `
            style="width: 180px;"
            `;
         }

         questions.forEach(el => {
            let checked = '';
            if (questConter == 0) {
               checked = 'checked'
            }
            questTemplate += `
            <li class="forms-sale__item"><input type="radio" ${checked} name="radioSale" value="${questConter}" class="forms-sale__radio">${el}</li>
            `;
            questConter++;
         });


         let nextButton = `<button type="button" class="forms-sale__button _icon-angle-down btn" ${buttonStyle}>Следующий шаг</button>`;

         if (lastIndex == stepId) {
            nextButton = `<button type="button" class="forms-sale__button forms-sale__button_send _icon-angle-down btn" ${buttonStyle}>Отправить</button>`;
         }

         let template = `
         <div data-stepId="${stepId}" class="forms-sale__qustion">
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
      saleRadioChecking()
      saleQuestionHelper()
      return true
   }
}
