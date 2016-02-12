'use strict';

/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

import Parser from './constructor';
import { ws } from '../helpers/string';

/**
 * Returns declaration of template runtime
 * @return {string}
 */
Parser.prototype.getTplRuntime = function () {
	return ws`
		var __RESULT__ = ${this.getResultDecl()};

		function getTplResult(opt_clear) {
			var res = ${this.getReturnResultDecl()};

			if (opt_clear) {
				__RESULT__ = ${this.getResultDecl()};
			}

			return res;
		}

		function clearTplResult() {
			__RESULT__ = ${this.getResultDecl()};
		}
	`;
};
