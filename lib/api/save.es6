/*!
 * Методы и функции для записи в результирующий JS
 */

/**
 * Вернуть строку начала конкатенации c __RESULT__
 * @return {string}
 */
DirObj.prototype.$ = function () {
	if (this.domComment) {
		return '__TMP_RESULT__ +=';
	}

	switch (this.renderMode) {
		case 'stringConcat':
			return '__RESULT__ +=';

		case 'stringBuffer':
			return '__RESULT__.push(';

		case 'dom':
			return '__APPEND__(__RESULT__[__RESULT__.length - 1],';
	}
};

/**
 * Вернуть строку окончания конкатенации c __RESULT__
 * @return {string}
 */
DirObj.prototype.$$ = function () {
	if (this.domComment) {
		return '';
	}

	return this.renderMode !== 'stringConcat' ? ')' : '';
};

/**
 * Вернуть строку конкатенации c __RESULT__
 *
 * @param {?string=} [opt_str] - исходная строка
 * @return {string}
 */
DirObj.prototype.wrap = function (opt_str) {
	return this.$() + (opt_str || '') + this.$$() + ';';
};

/**
 * Вернуть текст добавления узла в стек
 * (для renderMode == dom)
 * @return {string}
 */
DirObj.prototype.returnPushNodeDecl = function () {
	return `
		${this.wrap('__NODE__')}
		__RESULT__.push(__NODE__);
		__NODE__ = null;
	`;
};

/**
 * Вернуть строку возврата содержимого шаблона
 * @return {string}
 */
DirObj.prototype.returnResult = function () {
	switch (this.renderMode) {
		case 'stringConcat':
			return '__RESULT__';

		case 'stringBuffer':
			return '__RESULT__.join(\'\')';

		case 'dom':
			return '__RESULT__[0]';
	}
};

/**
 * Вернуть строку декларации содержимого шаблона
 * @return {string}
 */
DirObj.prototype.declResult = function () {
	switch (this.renderMode) {
		case 'stringConcat':
			return '\'\'';

		case 'stringBuffer':
			return 'new Snakeskin.StringBuffer()';

		case 'dom':
			return '[document.createDocumentFragment()]';
	}
};

/**
 * Вернуть true,
 * если возможна запись в результирующую строку JavaScript
 * @return {boolean}
 */
DirObj.prototype.isSimpleOutput = function () {
	if (getName(this.name) !== 'end' && this.strong) {
		this.error(`directive "${this.structure.name}" can not be used with a "${this.strong}"`);
		return false;
	}

	return !this.parentTplName && !this.protoStart && (!this.proto || !this.proto.parentTplName);
};

/**
 * Вернуть true,
 * если возможна проверка валидности директивы
 * @return {boolean}
 */
DirObj.prototype.isReady = function () {
	return !this.protoStart && (!this.proto || !this.proto.parentTplName);
};

/**
 * Вернуть true,
 * если ситуация соотвествует условию:
 *     не обработка тела прототипа && не внешний прототип &&
 *     (
 *         не вложенный блок или прототип в родительской структуре ||
 *         standalone шаблон
 *     )
 *
 * @return {boolean}
 */
DirObj.prototype.isAdvTest = function () {
	var res = (
		!this.proto && !this.protoLink &&
		(
			(this.parentTplName && !this.hasParentBlock({
				'block': true,
				'proto': true
			})) ||
			!this.parentTplName
		)
	);

	return Boolean(res);
};

/**
 * Добавить указанную строку в результирующую строку JavaScript
 *
 * @param {string=} str - исходная строка
 * @param {?boolean=} [opt_interface=false] - если true, то идёт запись интерфейса шаблона
 * @param {(boolean|number)=} [opt_jsDoc] - позиция предущей декларации jsDoc или false
 * @return {boolean}
 */
DirObj.prototype.save = function (str, opt_interface, opt_jsDoc) {
	if (str === void 0) {
		return false;
	}

	if (!this.tplName || write[this.tplName] !== false || opt_interface) {
		if (opt_jsDoc) {
			let pos = Number(opt_jsDoc);
			this.res = this.res.substring(0, pos) + str + this.res.substring(pos);

		} else {
			this.res += str;
		}

		return true;
	}

	return false;
};

/**
 * Добавить указанную строку в результирующую строку JavaScript
 * (с проверкой this.isSimpleOutput())
 *
 * @param {string=} str - исходная строка
 * @return {boolean}
 */
DirObj.prototype.append = function (str) {
	if (!this.isSimpleOutput()) {
		return false;
	}

	return this.save(str);
};

/**
 * Выполнить заданную функцию, если возможна запись в результирующую строку
 * (this.isSimpleOutput())
 *
 * @param {function(this:DirObj)} callback - функция обратного вызова
 * @return {boolean}
 */
DirObj.prototype.mod = function (callback) {
	if (!this.isSimpleOutput()) {
		return false;
	}

	if (!this.tplName || write[this.tplName] !== false) {
		callback.call(this);
		return true;
	}

	return false;
};