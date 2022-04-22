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
