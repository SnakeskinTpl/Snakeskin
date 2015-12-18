'use strict';

/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

import Parser from './constructor';

/**
 * The number of deferred return calls
 * @type {number}
 */
Parser.prototype.deferReturn = 0;

/**
 * The number of iteration,
 * where the active template was declared
 * @type {number}
 */
Parser.prototype.startTemplateI = 0;

/**
 * The number of a line,
 * where the active template was declared
 * @type {?number}
 */
Parser.prototype.startTemplateLine = null;

/**
 * If is true, then the active template is generator
 * @type {?boolean}
 */
Parser.prototype.generator = null;

/**
 * The name of the active template
 * @type {?string}
 */
Parser.prototype.tplName = null;

/**
 * The parent name of the active template
 * @type {?string}
 */
Parser.prototype.parentTplName = null;

/**
 * The array of declared constants
 * @type {Array}
 */
Parser.prototype.consts = null;

/**
 * The name of the parent BEM class
 * @type {string}
 */
Parser.prototype.bemRef = '';
