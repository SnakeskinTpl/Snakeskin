'use strict';

// jscs:disable maximumLineLength

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

const lib = {
	'angularjs': {
		'google': (v) => ws`
			<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/angularjs/${v}/angular.min.js"></script>
		`,

		'yandex': (v) => ws`
			<script type="text/javascript" src="http://yastatic.net/angularjs/${v}/angular.min.js"></script>
		`
	},

	'bootstrap': {
		'maxcdn': (v, e) => ws`
			<link type="text/css" rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/bootstrap/${v}/css/bootstrap.min.css"${e}>
			<script type="text/javascript" src="http://maxcdn.bootstrapcdn.com/bootstrap/${v}/js/bootstrap.min.js"></script>
		`,

		'yandex': (v, e) => ws`
			<link type="text/css" rel="stylesheet" href="http://yastatic.net/bootstrap/${v}/css/bootstrap.min.css"${e}>
			<script type="text/javascript" src="http://yastatic.net/bootstrap/${v}/js/bootstrap.min.js"></script>
		`
	},

	'dojo': {
		'google': (v) => ws`
			<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/dojo/${v}/dojo/dojo.js"></script>
		`,

		'yandex': (v) => ws`
			<script type="text/javascript" src="http://yastatic.net/dojo/${v}/dojo/dojo.js"></script>
		`
	},

	'extcore': {
		'google': (v) => ws`
			<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/ext-core/${v}/ext-core.js"></script>
		`,

		'yandex': (v) => ws`
			<script type="text/javascript" src="http://yastatic.net/ext-core/${v}/ext-core.min.js"></script>
		`
	},

	'fontawesome': {
		'maxcdn': (v, e) => ws`
			<link type="text/css" rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/font-awesome/${v}/css/font-awesome.min.css"${e}>
		`
	},

	'jquery': {
		'google': (v) => ws`
			<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/${v}/jquery.min.js"></script>
		`,

		'yandex': (v) => ws`
			<script type="text/javascript" src="http://yastatic.net/jquery/${v}/jquery.min.js"></script>
		`
	},

	'jquerymobile': {
		'google': (v, e) => ws`
			<link type="text/css" rel="stylesheet" href="http://ajax.googleapis.com/ajax/libs/jquerymobile/${v}/jquery.mobile.min.css"${e}>
			<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquerymobile/${v}/jquery.mobile.min.js"></script>
		`,

		'yandex': (v, e) => ws`
			<link type="text/css" rel="stylesheet" href="http://yastatic.net/jquery/mobile/${v}/jquery.mobile.min.css"${e}>
			<script type="text/javascript" src="http://yastatic.net/jquery/mobile/${v}/jquery.mobile.min.js"></script>
		`
	},

	'jqueryui': {
		'google': (v, e) => ws`
			<link type="text/css" rel="stylesheet" href="http://ajax.googleapis.com/ajax/libs/jqueryui/${v}/themes/smoothness/jquery-ui.css"${e}>
			<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jqueryui/${v}/jquery-ui.min.js"></script>
		`,

		'yandex': (v, e) => ws`
			<link type="text/css" rel="stylesheet" href="http://yastatic.net/jquery-ui/${v}/themes/smoothness/jquery-ui.min.css"${e}>
			<script type="text/javascript" src="http://yastatic.net/jquery-ui/${v}/jquery-ui.min.js"></script>
		`
	},

	'lodash': {
		'yandex': (v) => ws`
			<script type="text/javascript" src="http://yastatic.net/lodash/${v}/lodash.min.js"></script>
		`
	},

	'mootools': {
		'google': (v) => ws`
			<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/mootools/${v}/mootools-yui-compressed.js"></script>
		`,

		'yandex': (v) => ws`
			<script type="text/javascript" src="http://yastatic.net/mootools/${v}/mootools.min.js"></script>
		`
	},

	'prototype': {
		'google': (v) => ws`
			<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/prototype/${v}/prototype.js"></script>
		`,

		'yandex': (v) => ws`
			<script type="text/javascript" src="http://yastatic.net/prototype/${v}/prototype.min.js"></script>
		`
	},

	'script.aculo.us': {
		'google': (v) => ws`
			<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/scriptaculous/${v}/scriptaculous.js"></script>
		`,

		'yandex': (v) => ws`
			<script type="text/javascript" src="http://yastatic.net/scriptaculous/${v}/min/scriptaculous.js"></script>
		`
	},

	'swfobject': {
		'google': (v) => ws`
			<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/swfobject/${v}/swfobject.js"></script>
		`,

		'yandex': (v) => ws`
			<script type="text/javascript" src="http://yastatic.net/swfobject/${v}/swfobject.min.js"></script>
		`
	},

	'three.js': {
		'google': (v) => ws`
			<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/threejs/${v}/three.min.js"></script>
		`
	},

	'underscore.js': {
		'yandex': (v) => ws`
			<script type="text/javascript" src="http://yastatic.net/underscore/${v}/underscore-min.js"></script>
		`
	},

	'webfontloader': {
		'google': (v) => ws`
			<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/webfont/${v}/webfont.js"></script>
		`
	}
};

function first(obj) {
	return $C(obj).get({mult: false});
}

Snakeskin.addDirective(
	'cdn',

	{
		notEmpty: true,
		placement: 'template',
		text: true
	},

	function (command) {
		const
			parts = this.getTokens(command);

		let
			cdn = parts.slice(1).join(' '),
			val = parts[0].split('@');

		if (!val[1]) {
			return this.error(`missing a version of the requested library`);
		}

		cdn = cdn && cdn.toLowerCase();
		val[0] = val[0].toLowerCase();

		if (!lib[val[0]]) {
			return this.error(`the requested library is not found`);
		}

		this.append($=>
			this.wrap(
				ws`'${(cdn ? lib[val[0]][cdn] || first(lib[val[0]]) : first(lib[val[0]]))(
					val[1],
					this.doctype === 'xml' ?
						'/' : ''
				)}'`
			)
		);
	}
);
