var inlineTagMap = {
	'img': true,
	'link': true,
	'embed': true,
	'br': true,
	'hr': true,
	'wbr': true,
	'meta': true,
	'input': true,
	'source': true,
	'track': true,
	'base': true
};

Snakeskin.addDirective(
	'tag',

	{
		placement: 'template',
		notEmpty: true,
		text: true,
		replacers: {
			'<': function(cmd)  {return cmd.replace('<', 'tag ')}
		}
	},

	function (command) {
		this.startDir();
		if (this.isSimpleOutput()) {
			var parts = command.split(' '),
				desc = returnTagDesc(parts[0]);

			var params = this.structure.params;

			params.tag = desc.tag;
			params.block = !inlineTagMap[desc.tag];

			this.save(this.wrap((("'<" + (desc.tag)) + ("" + (desc.id ? ((" id=\"" + (desc.id)) + "\"") : '')) + ("" + (desc.classes.length ? ((" class=\"" + (desc.classes.join(' '))) + "\"") : '')) + ("" + (!params.block ? '/' : '')) + ">'")));
		}
	},

	function () {
		if (this.isSimpleOutput()) {
			var params = this.structure.params;

			if (params.block) {
				this.save(this.wrap((("'</" + (params.tag)) + ">'")));
			}
		}
	}
);

/**
 * Анализировать заданную строку на декларацию тега
 * и вернуть объект-описание
 *
 * @param {string} str - исходная строка
 * @return {{tag: string, id: string, classes: !Array}}
 */
function returnTagDesc(str) {
	var action = '';

	var tag = '',
		id = '',
		classes = [];

	for (var i = 0; i < str.length; i++) {
		var el = str.charAt(i);

		if (el === '#' || el === '.') {
			if (!tag) {
				tag = 'div';
			}

			action = el;

			if (el === '.') {
				classes.push('');
			}

			continue;
		}

		switch (action) {
			case '#': {
				id += el;
			} break;

			case '.': {
				classes[classes.length - 1] += el;
			} break;

			default: {
				tag += el;
			}
		}
	}

	return {
		tag: tag,
		id: id,
		classes: classes
	};
}
