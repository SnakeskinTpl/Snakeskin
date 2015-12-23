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
import { ws } from '../helpers/string';

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
			ws`
				var
					__ATTR_CACHE__ = {},
					__ATTR_CONCAT_MAP__ = {'class': true};

				${
					$C(this.splitXMLAttrGroup(command))
						.reduce((res, el) => res += this.returnXMLAttrDecl(el), '')
				}

				for (var __KEY__ in __ATTR_CACHE__) {
					if (!__ATTR_CACHE__.hasOwnProperty(__KEY__)) {
						continue;
					}

					if (__NODE__) {
						__NODE__.setAttribute(__KEY__, __ATTR_CACHE__[__KEY__]);

					} else {
						${this.wrap(`' ' + __KEY__ + (__ATTR_CACHE__[__KEY__] && '="' + __ATTR_CACHE__[__KEY__] + '"')`)}
					}
				}
			`
		);
	}
);
