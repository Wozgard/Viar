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
});