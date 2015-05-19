/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

import { GLOBAL } from '../consts/links';
export const
	$C = GLOBAL.$C || require('collection.js').$C,
	Collection = GLOBAL.Collection || require('collection.js').Collection;

export function forEach() {
	return (this.NAME === 'Collection' ? this : $C(this)).forEach(...arguments);
}

export function get() {
	return (this.NAME === 'Collection' ? this : $C(this)).get(...arguments);
}

export function map() {
	return (this.NAME === 'Collection' ? this : $C(this)).map(...arguments);
}

export function reduce() {
	return (this.NAME === 'Collection' ? this : $C(this)).reduce(...arguments);
}

export function filter() {
	return (this.NAME === 'Collection' ? this : $C(this)).filter(...arguments);
}
