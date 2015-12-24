'use strict';

/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

import Snakeskin from '../core';
import { q } from './index';
import { ws } from '../helpers/string';
import { escapeBackslashes, escapeEOLs } from '../helpers/escape';

Snakeskin.addDirective(
	'include',

	{
		deferInit: true,
		notEmpty: true
	},

	function (command) {
		if (this.tplName || this.hasParent('head')) {
			return this.error(
				`the directive "${this.name}" can't be used within directives ${q(this.getGroupList('template').concat('head'))}`
			);
		}

		this.startInlineDir(null, {
			from: this.result.length
		});

		const
			parts = command.split(/\s+as\s+/);

		if (!parts[0]) {
			return this.error(`invalid "${this.name}" declaration`);
		}

		const
			path = this.out(parts[0], {unsafe: true}),
			type = parts[1] ? `'${parts[1].trim()}'` : `''`;

		if (path !== undefined && type !== undefined) {
			this.save(ws`
				Snakeskin.include(
					'${escapeBackslashes(this.info.file || '')}',
					${this.pasteDangerBlocks(path)},
					'${escapeEOLs(this.eol)}',
					${type}
				);
			`);
		}
	},

	function () {
		if (this.hasParent('eval')) {
			return;
		}

		this.result = this.result.slice(0, this.structure.params.from);
	}
);

Snakeskin.addDirective(
	'__setFile__',

	{

	},

	function (command) {
		command = this.pasteDangerBlocks(command);

		const module = {
			children: [],
			exports: {},
			filename: command,
			id: this.environment.id + 1,
			key: null,
			loaded: true,
			parent: this.module,
			require,
			root: this.module.root || this.module
		};

		module.root.key.push([
			command,
			require('fs').statSync(command).mtime.valueOf()
		]);

		this.module.children.push(module);
		this.module = module;
		this.info.file = command;
		this.files[command] = true;
		this.save(this.declVars('$_'));
	}
);

Snakeskin.addDirective(
	'__endSetFile__',

	{

	},

	function () {
		const
			file = this.module.filename;

		this.module = this.module.parent;
		this.info.file = this.module.filename;

		if (this.params[this.params.length - 1]['@file'] === file) {
			this.popParams();
		}
	}
);
