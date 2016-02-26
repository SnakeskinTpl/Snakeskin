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

		if (this.namespaces[nms]) {
			this.namespaces[nms].files.push(this.info.file);

		} else {
			this.namespaces[nms] = {files: [this.info.file]};
		}

		this.scope.push(`exports${concatProp(nms)}`);
	}

);
