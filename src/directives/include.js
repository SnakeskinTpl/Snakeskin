'use strict';

/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

import Snakeskin from '../core';
import { ws } from '../helpers/string';
import { escapeBackslashes, escapeEOLs } from '../helpers/escape';
import { getRequire } from '../helpers/require';

Snakeskin.addDirective(
	'include',

	{
		ancestorsBlacklist: [Snakeskin.group('head'), Snakeskin.group('template')],
		deferInit: true,
		group: 'include',
		notEmpty: true
	},

	function (command) {
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
		if (this.hasParent(this.getGroup('eval'))) {
			return;
		}

		this.result = this.result.slice(0, this.structure.params.from);
	}
);

Snakeskin.addDirective(
	'__setFile__',

	{
		group: 'ignore'
	},

	function (file) {
		file = this.pasteDangerBlocks(file);
		this.namespace = undefined;

		const
			env = this.environment,
			r = getRequire(file);

		const module = {
			children: [],
			exports: {},
			filename: file,
			dirname: r.dirname,
			id: env.id + 1,
			key: null,
			loaded: true,
			namespace: null,
			parent: this.environment,
			require: r.require,
			root: env.root || env
		};

		module.root.key.push([file, require('fs').statSync(file).mtime.valueOf()]);
		env.children.push(module);

		this.environment = module;
		this.info.file = file;
		this.files[file] = true;
		this.save(this.declVars('$_', {sys: true}));
	}
);

Snakeskin.addDirective(
	'__endSetFile__',

	{
		group: 'ignore'
	},

	function () {
		const
			{filename, namespace} = this.environment;

		this.environment = this.environment.parent;
		this.info.file = this.environment.filename;

		if (namespace) {
			this.scope.pop();
		}

		if (this.params[this.params.length - 1]['@file'] === filename) {
			this.popParams();
		}
	}
);
