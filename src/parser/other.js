'use strict';

/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

import $C from '../deps/collection';
import Parser from './constructor';
import { $extList, $extMap, $scope } from '../consts/cache';

/**
 * Returns a list of template names
 * that are involved in an inheritance chain
 *
 * @param {string} name - template name
 * @return {!Array}
 */
Parser.getExtList = function (name) {
	if ($extList[name]) {
		return $extList[name].slice();
	}

	const res = [];
	while (name = $extMap[name]) {
		res.unshift(name);
	}

	$extList[name] = res;
	return res.slice();
};

/**
 * Clears the SS cache scope of a template
 * @param {string} name - template name
 */
Parser.clearScopeCache = function (name) {
	$C($scope).forEach((cluster, key) => {
		if (key === 'template') {
			if (cluster[name] && cluster[name].parent) {
				delete cluster[name].parent.children[name];
			}

		} else {
			$C(cluster[name]).forEach((el) => {
				if (el.parent) {
					delete el.parent.children[name];
				}
			});
		}

		delete cluster[name];
	});
};

/**
 * Returns diff of a directive command and directive declaration
 *
 * @param {number} length - command length
 * @return {number}
 */
Parser.prototype.getDiff = function (length) {
	return length + Number(this.needPrfx) + 1;
};

/**
 * Resets a layer of compilation parameters
 * @return {!Parser}
 */
Parser.prototype.popParams = function () {
	this.params.pop();

	$C(this.params[this.params.length - 1]).forEach((el, key) => {
		this[key] = el;
	});

	return this;
};
