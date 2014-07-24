var inline = {
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

		}
	}
);

function getTag(str) {
	var action = '';

	var tag = '',
		id = '',
		classes = [];

	var pOpen = 0;
	var attrs = {};

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

		if (action === '#') {
			id += el;
		}

		if (action === '.') {
			classes[classes.length - 1] += el;
		}

		if (!action) {
			tag += el;
		}
	}

	console.log(tag, id, classes);
}
