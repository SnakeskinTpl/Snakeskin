/*!
 * Вспомогательные методы
 */

/**
 * Вывести дополнительную информацию об ошибке
 *
 * @private
 * @param {Object} obj - дополнительная информация
 * @return {string}
 */
Snakeskin._genError = function (obj) {
	var key,
		str = '';
	
	for (key in obj) {
		if (!obj.hasOwnProperty(key)) { continue; }
		
		if (!obj[key].innerHTML) {
			str += key + ': ' + obj[key] + ', ';
		} else {
			str += key + ': (class: ' + (obj[key].className || 'undefined') + ', id: ' + (obj[key].id || 'undefined') + '), ';
		}
	}
	
	return str.replace(/, $/, '');
};