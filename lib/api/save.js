/*!
 * API for writing final JS
 */

/**
 * Returns a string for the beginning of concatenation with __RESULT__
 * @return {string}
 */
DirObj.prototype.$ = function () {
	if (this.domComment) {
		return '__COMMENT_RESULT__ +=';
	}

	switch (this.renderMode) {
		case 'stringBuffer':
			return '__RESULT__.push(';

		case 'dom':
			return '__APPEND__(__RESULT__[__RESULT__.length - 1],';

		default:
			return '__RESULT__ +=';
	}
};

/**
 * Returns a string for the ending of concatenation with __RESULT__
 * @return {string}
 */
DirObj.prototype.$$ = function () {
	if (this.domComment) {
		return '';
	}

	switch (this.renderMode) {
		case 'stringBuffer':
			return ')';

		case 'dom':
			return ')';

		default:
			return '';
	}
};

/**
 * Appends a string to __RESULT__
 *
 * @param {?string=} [opt_str] - the source string
 * @return {string}
 */
DirObj.prototype.wrap = function (opt_str) {
	return this.$() + (opt_str || '') + this.$$() + ';';
};

/**
 * Returns a string of node declaration
 * (for renderMode == dom)
 *
 * @param {?boolean=} [opt_inline=false] - if is true, then the node considered as inline
 * @return {string}
 */
DirObj.prototype.returnPushNodeDecl = function (opt_inline) {
	return /* cbws */`
		${this.wrap('__NODE__')}
		${opt_inline ? '' : '__RESULT__.push(__NODE__);'}
		__NODE__ = null;
	`;
};

/**
 * Returns a string of a template content
 * @return {string}
 */
DirObj.prototype.returnResult = function () {
	switch (this.renderMode) {
		case 'stringBuffer':
			return '__RESULT__.join(\'\')';

		case 'dom':
			return '__RESULT__[0]';

		default:
			return '__RESULT__';
	}
};

/**
 * Returns a string of template declaration
 * @return {string}
 */
DirObj.prototype.declResult = function () {
	switch (this.renderMode) {
		case 'stringBuffer':
			return 'new Snakeskin.StringBuffer()';

		case 'dom':
			return '[document.createDocumentFragment()]';

		default:
			return '\'\'';
	}
};

/**
 * Replaces CDATA blocks in a string
 * and returns a new string
 *
 * @param {string} str - the source string
 * @return {string}
 */
DirObj.prototype.replaceCData = function (str) {
	const
		s = ADV_LEFT_BLOCK + LEFT_BLOCK,
		e = RIGHT_BLOCK;

	return str
		.replace(new RegExp(`${s}cdata${e}([\\s\\S]*?)${s}(?:\\/cdata|end cdata)${e}`, 'g'), (sstr, data) => {
			this.cDataContent.push(data);
			return String(
					// The count of added lines
					`${s}__appendLine__ ${(data.match(new RegExp(nextLineRgxp.source, 'g')) || '').length}${e}` +

					// Label to replace CDATA
					`__CDATA__${this.cDataContent.length - 1}_`
			);
		});
};

/**
 * Declares the end of templates declaration
 *
 * @param {?string} cacheKey - a cache key
 * @param {(Date|string)} label - the declaration label
 * @return {!DirObj}
 */
DirObj.prototype.end = function (cacheKey, label) {
	label = label || '';
	switch (this.renderMode) {
		case 'stringBuffer':
			this.res = this.res.replace(/__RESULT__\.push\(''\);/g, '');
			break;

		case 'dom':
			this.res = this.res.replace(/__APPEND__\(__RESULT__\[__RESULT__\.length - 1],''\);/g, '');
			break;

		default:
			this.res = this.res.replace(/__RESULT__ \+= '';/g, '');
			break;
	}

	let includes = '';
	if (this.module.key.length) {
		includes = JSON.stringify(this.module.key);
	}

	this.res = this.pasteDangerBlocks(this.res)
		.replace(
			/__CDATA__(\d+)_/g,
			(sstr, pos) => escapeNextLine(
					this.cDataContent[pos].replace(new RegExp(nextLineRgxp.source, 'g'), this.lineSeparator)
				).replace(/'/g, '&#39;')
		);

	const
		versionDecl = `Snakeskin v${Snakeskin.VERSION.join('.')}`,
		keyDecl = `key <${cacheKey}>`,
		labelDecl = `label <${label.valueOf()}>`,
		includesDecl = `includes <${includes}>`,
		generatedAtDecl = `generated at <${new Date().valueOf()}>`,
		resDecl = `${this.lineSeparator}   ${this.res}`;

	this.res = `/* ${versionDecl}, ${keyDecl}, ${labelDecl}, ${includesDecl}, ${generatedAtDecl}.${resDecl}`;
	this.res += /* cbws */`
			}

			if (!__IS_NODE__ && !__HAS_EXPORTS__) {
				__INIT__();
			}

		}).call(this);
	`;

	return this;
};

/**
 * Returns true, if is possible to write in the JS string
 * @return {boolean}
 */
DirObj.prototype.isSimpleOutput = function () {
	if (getDirName(this.name) !== 'end' && this.strong) {
		this.error(`the directive "${this.structure.name}" can not be used with a "${this.strong}"`);
		return false;
	}

	return !this.parentTplName && !this.protoStart && !this.outerLink && (!this.proto || !this.proto.parentTplName);
};

/**
 * Returns true, if a directive is ready to test
 * @return {boolean}
 */
DirObj.prototype.isReady = function () {
	return !this.protoStart && (!this.proto || !this.proto.parentTplName);
};

/**
 * Returns true, if
 *     !proto && !outerLink &&
 *     (
 *         parentTplName && !hasParentBlock ||
 *         !parentTplName
 *     )
 *
 * @return {boolean}
 */
DirObj.prototype.isAdvTest = function () {
	const res = (
		!this.proto && !this.outerLink &&
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
 * Adds a string to the JS string
 *
 * @param {string=} str - the source string
 * @param {?boolean=} [opt_interface=false] - if is true, then the current operation is an interface
 * @param {(boolean|number)=} [opt_jsDoc] - the last position of JSdoc or false
 * @return {boolean}
 */
DirObj.prototype.save = function (str, opt_interface, opt_jsDoc) {
	if (str === undefined) {
		return false;
	}

	if (!this.tplName || write[this.tplName] !== false || opt_interface) {
		if (opt_jsDoc) {
			const pos = Number(opt_jsDoc);
			this.res = this.res.substring(0, pos) + str + this.res.substring(pos);

		} else {
			this.res += str;
		}

		return true;
	}

	return false;
};

/**
 * Adds a string to the JS string
 * (with this.isSimpleOutput())
 *
 * @param {string=} str - the source string
 * @return {boolean}
 */
DirObj.prototype.append = function (str) {
	if (!this.isSimpleOutput()) {
		return false;
	}

	return this.save(str);
};

/**
 * Executes a string
 * (with this.isSimpleOutput())
 *
 * @param {function(this:DirObj)} callback - a callback function
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
