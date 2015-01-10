/*!
 * Различные вспомогательные методы и функции
 */

/**
 * Вернуть истинное имя директивы
 *
 * @param {?string} name - исходное имя
 * @return {?string}
 */
function getName(name) {
	return aliases[name] || name;
}

/**
 * Вернуть список названий шаблонов,
 * которые участвуют в цепи наследования указанного
 *
 * @param {string} name - имя шаблона
 * @return {!Array}
 */
function getExtList(name) {
	if (extListCache[name]) {
		return extListCache[name].slice();
	}

	var res = [];
	while (name = extMap[name]) {
		res.unshift(name);
	}

	extListCache[name] = res;
	return res.slice();
}

/**
 * Очистить кеш областей видимости заданного шаблона
 * @param {string} name - имя шаблона
 */
function clearScopeCache(name) {
	forIn(scopeCache, (cluster, key) => {
		if (key === 'template') {
			if (cluster[name] && cluster[name].parent) {
				delete cluster[name].parent.children[name];
			}

		} else {
			forIn(cluster[name], (el) => {
				if (el.parent) {
					delete el.parent.children[name];
				}
			});
		}

		delete cluster[name];
	});
}

/**
 * Вернуть имя функции из заданной строки
 *
 * @param {string} str - исходная строка
 * @param {?boolean=} [opt_empty=false] - если true, то допускается "пустое" имя
 * @return {string}
 */
DirObj.prototype.getFnName = function (str, opt_empty) {
	var tmp = /^[^(]+/.exec(str),
		val = tmp ? tmp[0].trim() : '';

	if (!opt_empty && !val) {
		this.error(`invalid "${this.name}" declaration`);
	}

	return val;
};

/**
 * Вернуть значение разницы длины команды с учётом типа декларации директивы
 *
 * @param {number} length - исходная длина
 * @return {number}
 */
DirObj.prototype.getDiff = function (length) {
	return length + Number(this.needPrfx) + 1;
};



/**
 * Сбросить слой параметров компиляции
 * @return {!DirObj}
 */
DirObj.prototype.popParams = function () {
	this.params.pop();

	forIn(this.params[this.params.length - 1], (el, key) => {
		this[key] = el;
	});

	return this;
};

/**
 * Заменить %fileName% в заданной строке на имя активного файла
 *
 * @param {string} str - исходная строка
 * @return {string}
 */
DirObj.prototype.replaceFileName = function (str) {
	var file = this.info['file'],
		basename;

	str = this.replaceDangerBlocks(str.replace(/(.?)%fileName%/g, (sstr, $1) => {
		if (!file) {
			this.error('placeholder %fileName% can\'t be used without "file" option');
			return '';
		}

		if (!IS_NODE) {
			this.error('placeholder %fileName% can\'t be used with live compilation in browser');
			return '';
		}

		if (!basename) {
			let path = require('path');
			basename = path.basename(file, path.extname(file));
		}

		var str = basename;

		if ($1) {
			if ($1 !== '.') {
				str = `${$1}'${str}'`;

			} else {
				str = $1 + str;
			}
		}

		return str;
	}));

	return str;
};

var nmRgxp = /\.|\[/,
	nmssRgxp = /^\[/,
	nmsRgxp = /\[/g,
	nmeRgxp = /]/g;

/**
 * Подготовить заданную строку декларации имени шаблона
 * (вычисление выражений и т.д.)
 *
 * @param {string} name - исходная строка
 * @return {string}
 */
DirObj.prototype.prepareNameDecl = function (name) {
	name = this.replaceFileName(name);
	if (nmRgxp.test(name)) {
		let tmpArr = name
			.replace(nmssRgxp, '%')
			.replace(nmsRgxp, '.%')
			.replace(nmeRgxp, '')
			.split('.');

		let str = '',
			length = tmpArr.length;

		for (let i = -1; ++i < length;) {
			let el = tmpArr[i],
				custom = el.charAt(0) === '%';

			if (custom) {
				el = el.substring(1);
			}

			if (custom) {
				str += /* cbws */`['${
					applyDefEscape(
						this.returnEvalVal(
							this.prepareOutput(el, true)
						)
					)
				}']`;

				continue;
			}

			str += str ? `.${el}` : el;
		}

		name = str;
	}

	return name.trim();
};
