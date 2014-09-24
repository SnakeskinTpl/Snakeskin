(function()  {
	var lib = {
		'angular': {
			'google': function(v)  {return (("\
\n				<script type=\"text/javascript\" src=\"//ajax.googleapis.com/ajax/libs/angularjs/" + v) + "/angular.min.js\"></script>\
\n			")},

			'yandex': function(v)  {return (("\
\n				<script type=\"text/javascript\" src=\"http://yastatic.net/angularjs/" + v) + "/angular.min.js\"></script>\
\n			")}
		},

		'dojo': {
			'google': function(v)  {return (("\
\n				<script type=\"text/javascript\" src=\"//ajax.googleapis.com/ajax/libs/dojo/" + v) + "/dojo/dojo.js\"></script>\
\n			")},

			'yandex': function(v)  {return (("\
\n				<script type=\"text/javascript\" src=\"http://yastatic.net/dojo/" + v) + "/dojo/dojo.js\"></script>\
\n			")}
		},

		'extcore': {
			'google': function(v)  {return (("\
\n				<script type=\"text/javascript\" src=\"//ajax.googleapis.com/ajax/libs/ext-core/" + v) + "/ext-core.js\"></script>\
\n			")},

			'yandex': function(v)  {return (("\
\n				<script type=\"text/javascript\" src=\"http://yastatic.net/ext-core/" + v) + "/ext-core.min.js\"></script>\
\n			")}
		},

		'jquery': {
			'google': function(v)  {return (("\
\n				<script type=\"text/javascript\" src=\"//ajax.googleapis.com/ajax/libs/jquery/" + v) + "/jquery.min.js\"></script>\
\n			")},

			'yandex': function(v)  {return (("\
\n				<script type=\"text/javascript\" src=\"http://yastatic.net/jquery/" + v) + "/jquery.min.js\"></script>\
\n			")}
		},

		'jquerymobile': {
			'google': function(v)  {return (("\
\n				<link type=\"text/css\" rel=\"stylesheet\" href=\"//ajax.googleapis.com/ajax/libs/jquerymobile/" + v) + ("/jquery.mobile.min.css\"/>\
\n				<script type=\"text/javascript\" src=\"//ajax.googleapis.com/ajax/libs/jquerymobile/" + v) + "/jquery.mobile.min.js\"></script>\
\n			")},

			'yandex': function(v)  {return (("\
\n				<link type=\"text/css\" rel=\"stylesheet\" href=\"http://yastatic.net/jquery/mobile/" + v) + ("/jquery.mobile.min.css\"/>\
\n				<script type=\"text/javascript\" src=\"http://yastatic.net/jquery/mobile/" + v) + "/jquery.mobile.min.js\"></script>\
\n			")}
		},

		'jqueryui': {
			'google': function(v)  {return (("\
\n				<link type=\"text/css\" rel=\"stylesheet\" href=\"//ajax.googleapis.com/ajax/libs/jqueryui/" + v) + ("/themes/smoothness/jquery-ui.css\"/>\
\n				<script type=\"text/javascript\" src=\"//ajax.googleapis.com/ajax/libs/jqueryui/" + v) + "/jquery-ui.min.js\"></script>\
\n			")},

			'yandex': function(v)  {return (("\
\n				<link type=\"text/css\" rel=\"stylesheet\" href=\"http://yastatic.net/jquery-ui/" + v) + ("/themes/smoothness/jquery-ui.min.css\"/>\
\n				<script type=\"text/javascript\" src=\"http://yastatic.net/jquery-ui/" + v) + "/jquery-ui.min.js\"></script>\
\n			")}
		},

		'mootools': {
			'google': function(v)  {return (("\
\n				<script type=\"text/javascript\" src=\"//ajax.googleapis.com/ajax/libs/mootools/" + v) + "/mootools-yui-compressed.js\"></script>\
\n			")},

			'yandex': function(v)  {return (("\
\n				<script type=\"text/javascript\" src=\"http://yastatic.net/mootools/" + v) + "/mootools.min.js\"></script>\
\n			")}
		},

		'prototype': {
			'google': function(v)  {return (("\
\n				<script type=\"text/javascript\" src=\"//ajax.googleapis.com/ajax/libs/prototype/" + v) + "/prototype.js\"></script>\
\n			")},

			'yandex': function(v)  {return (("\
\n				<script type=\"text/javascript\" src=\"http://yastatic.net/prototype/" + v) + "/prototype.min.js\"></script>\
\n			")}
		},

		'script.aculo.us': {
			'google': function(v)  {return (("\
\n				<script type=\"text/javascript\" src=\"//ajax.googleapis.com/ajax/libs/scriptaculous/" + v) + "/scriptaculous.js\"></script>\
\n			")},

			'yandex': function(v)  {return (("\
\n				<script type=\"text/javascript\" src=\"http://yastatic.net/scriptaculous/" + v) + "/min/scriptaculous.js\"></script>\
\n			")}
		},

		'swfobject': {
			'google': function(v)  {return (("\
\n				<script type=\"text/javascript\" src=\"//ajax.googleapis.com/ajax/libs/swfobject/" + v) + "/swfobject.js\"></script>\
\n			")},

			'yandex': function(v)  {return (("\
\n				<script type=\"text/javascript\" src=\"http://yastatic.net/swfobject/" + v) + "/swfobject.min.js\"></script>\
\n			")}
		},

		'three.js': {
			'google': function(v)  {return (("\
\n				<script type=\"text/javascript\" src=\"//ajax.googleapis.com/ajax/libs/threejs/" + v) + "/three.min.js\"></script>\
\n			")}
		},

		'webfontloader': {
			'google': function(v)  {return (("\
\n				<script type=\"text/javascript\" src=\"//ajax.googleapis.com/ajax/libs/webfont/" + v) + "/webfont.js\"></script>\
\n			")}
		},

		'bootstrap': {
			'yandex': function(v)  {return (("\
\n				<link type=\"text/css\" rel=\"stylesheet\" href=\"http://yastatic.net/bootstrap/" + v) + ("/css/bootstrap.min.css\"/>\
\n				<script type=\"text/javascript\" src=\"http://yastatic.net/bootstrap/" + v) + "/js/bootstrap.min.js\"></script>\
\n			")},

			'maxcdn': function(v)  {return (("\
\n				<link type=\"text/css\" rel=\"stylesheet\" href=\"//maxcdn.bootstrapcdn.com/bootstrap/" + v) + ("/css/bootstrap.min.css\"/>\
\n				<script type=\"text/javascript\" src=\"//maxcdn.bootstrapcdn.com/bootstrap/" + v) + "/js/bootstrap.min.js\"></script>\
\n			")}
		},

		'fontawesome': {
			'maxcdn': function(v)  {return (("\
\n				<link type=\"text/css\" rel=\"stylesheet\" href=\"//maxcdn.bootstrapcdn.com/font-awesome/" + v) + "/css/font-awesome.min.css\"/>\
\n			")}
		},

		'underscore.js': {
			'yandex': function(v)  {return (("\
\n				<script type=\"text/javascript\" src=\"http://yastatic.net/underscore/" + v) + "/underscore-min.js\"></script>\
\n			")}
		},

		'lodash': {
			'yandex': function(v)  {return (("\
\n				<script type=\"text/javascript\" src=\"http://yastatic.net/lodash/" + v) + "/lodash.min.js\"></script>\
\n			")}
		}
	};

	function first(obj) {
		for (var key in obj) {
			if (obj.hasOwnProperty(key)) {
				return obj[key];
			}
		}
	}

	Snakeskin.addDirective(
		'cdn',

		{
			placement: 'template',
			notEmpty: true,
			text: true
		},

		function (command) {
			var parts = command.split(' '),
				cdn = parts.slice(1).join(' '),
				val = parts[0].split('@');

			if (!val[1]) {
				return this.error(("missing version"));
			}

			cdn = cdn && cdn.toLowerCase();
			val[0] = val[0].toLowerCase();

			if (!lib[val[0]]) {
				return this.error(("requested is not found"));
			}

			this.append(cdn ? lib[val[0]][cdn] || first(lib[val[0]]) : first(lib[val[0]]));
		}
	);
})();