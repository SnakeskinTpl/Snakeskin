Snakeskin.addDirective(
	'comment',

	{
		text: true,
		block: true,
		placement: 'template',
		replacers: {
			'@!': function(cmd)  {return cmd.replace('@!', 'comment ')},
			'/@': function(cmd)  {return cmd.replace('\/@', 'end comment')}
		}
	},

	function (command) {
		this.startDir(null, {
			conditional: Boolean(command)
		});

		var str;

		if (this.renderMode === 'dom') {
			this.advRenderMode = 'tmp';
			str = '__TMP_RESULT__ = \'\';';

		} else {
			str = this.wrap('\'<!--\'');
		}

		if (command) {
			str += this.wrap((("'[if " + (this.replaceTplVars(command))) + "]>'"));
		}

		this.append(str);
	},

	function () {
		var comment = this.structure.params.conditional ? ' <![endif]' : '',
			str;

		if (this.renderMode === 'dom') {
			str = this.wrap((("'" + comment) + "'"));
			this.advRenderMode = null;
			str += (("\
\n				__NODE__ = document.createComment(__TMP_RESULT__);\
\n				" + (this.returnPushNodeDecl())) + "\
\n				__TMP_RESULT__ = \'\';\
\n				__RESULT__.pop();\
\n			");

		} else {
			str = this.wrap((("'" + comment) + "-->'"));
		}

		this.append(str);
	}
);