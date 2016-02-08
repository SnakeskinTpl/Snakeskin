'use strict';

/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

import Snakeskin from '../core';
import { concatProp } from '../helpers/literals';

Snakeskin.addDirective(
	'namespace',

	{
		deferInit: true,
		group: 'namespace',
		notEmpty: true,
		placement: 'global'
	},

	function (nms) {
		if (this.namespace) {
			return this.error('namespace can be set only once for a file');
		}

		this.environment.namespace = nms = this.getBlockName(nms);
		this.namespaces[nms] = this.namespaces[nms] || {file: this.info.file, id: this.environment.id};
		this.scope.push(`exports${concatProp(nms)}`);
	}

);
