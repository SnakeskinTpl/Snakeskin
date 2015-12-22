'use strict';

/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

import $C from '../deps/collection';
import Snakeskin from '../core';

Snakeskin.addDirective(
	'attr',

	{
		group: ['attr', 'output'],
		notEmpty: true,
		placement: 'template',
		text: true
	},

	function (command) {
		this.append($=>
			$C(this.splitXMLAttrGroup(command)).reduce((res, el) => res += this.returnXMLAttrDecl(el), '')
		);
	}
);
