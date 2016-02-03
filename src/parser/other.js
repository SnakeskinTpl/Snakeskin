'use strict';

/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

import Parser from './constructor';
import { $extList, $extMap, $scope } from '../consts/cache';

/**
 * Returns an array of template names
 * that are involved in an inheritance chain
 *
 * @param {string} name - template name
 * @return {!Array}
 */
Parser.prototype.getExtList = function (name) {
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
 * Clears the SS cache scope of the specified template
 *
 * @param {string} name - template name
 * @return {!Parser}
 */
Parser.prototype.clearScopeCache = function (name) {
	for (let key in $scope) {
		if (!$scope.hasOwnProperty(key)) {
			break;
		}

		const
			cluster = $scope[key],
			el = cluster[name];

		if (key === 'template') {
			if (el && el.parent) {
				delete el.parent.children[name];
			}

		} else {
			for (let key in el) {
				if (!el.hasOwnProperty(el)) {
					break;
				}

				if (el[key].parent) {
					delete el[key].parent.children[name];
				}
			}
		}

		delete cluster[name];
	}

	return this;
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

	const
		last = this.params[this.params.length - 1];

	for (let key in last) {
		if (!last.hasOwnProperty(key)) {
			break;
		}

		this[key] = last[key];
	}

	return this;
};
