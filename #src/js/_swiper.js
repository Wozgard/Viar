let sliders = document.querySelectorAll('._swiper');
if(sliders){
	for(let index = 0; index < sliders.length; index++){
		let slider = sliders[index];
		if(!slider.classList.contains('swiper-bild')){
			let slider_items = slider.children;
			if(slider_items){
				for(let index = 0; index < slider_items.length; index++){
					let el = slider_items[index];
					el.classList.add('swiper-slide');
				}
			}
			let slider_content = slider.innerHTML;
			let slider_wrapper = document.createElement('div');
			slider_wrapper.classList.add('swiper-wrapper');
			slider_wrapper.innerHTML = slider_content;
			slider.innerHTML = '';
			slider.appendChild(slider_wrapper);
			slider.classList.add('swiper-bild');

			if(slider.classList.contains('_swiper_scroll')){
				let sliderScroll = document.createElement('div');
				sliderScroll.classList.add('swiper-scrollbar');
				slider.appendChild(sliderScroll);
			}
		}
		if(slider.classList.contains('_galery')){
			//slider.data('lightGallery').destroy(true);
		}
	}
	sliders_build_callback();
}

function sliders_build_callback(params){}

let sliderScrollItems = document.querySelectorAll('._swiper_scroll');

//Settings slider ===============================================================================================
if(document.querySelectorAll('.slider-main__body')){
	new Swiper('.slider-main__body',{
		observer: true,
		observerParents: true,
		slidesPerView: 1,
		spaceBetween: 32,
		watchOverflow: true,
		speed: 800,
		loop: true,
		loopAdditionalSlides: 5,
		preloadImages: false,
		parallax: true,
		//Dotts ============
		pagination: {
			el: '.control-slider-main__dotts',
			clickable: true,
		},
		//Arrows ===========
		navigation: {
			nextEl: '.slider-main .slider-arrow slider-arrow_next',
			prevEl: '.slider-main .slider-arrow slider-arrow_prev',
		},
	});
}