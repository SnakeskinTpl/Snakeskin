/**
 * Если true, то идёт декларация XML комментария
 * в режиме рендеренга dom
 * @type {boolean}
 */
DirObj.prototype.domComment = false;

Snakeskin.addDirective(
	'comment',

	{
		text: true,
		block: true,
		selfInclude: false,
		placement: 'template',
		replacers: {
			'@!': (cmd) => cmd.replace('@!', 'comment '),
			'/@': (cmd) => cmd.replace('\/@', 'end comment')
		}
	},

	function (command) {
		this.startDir(null, {
			conditional: Boolean(command)
		});

		var str;

		if (this.renderMode === 'dom') {
			this.domComment = true;
			str = '__TMP_RESULT__ = \'\';';

		} else {
			str = this.wrap('\'<!--\'');
		}

		if (command) {
			str += this.wrap(`'[if ${this.replaceTplVars(command)}]>'`);
		}

		this.append(str);
	},

	function () {
		var comment = this.structure.params.conditional ? ' <![endif]' : '',
			str;

		if (this.renderMode === 'dom') {
			str = this.wrap(`'${comment}'`);
			this.domComment = false;
			str += `
				__NODE__ = document.createComment(__TMP_RESULT__);
				${this.returnPushNodeDecl()}
				__TMP_RESULT__ = \'\';
				__RESULT__.pop();
			`;

		} else {
			str = this.wrap(`'${comment}-->'`);
		}

		this.append(str);
	}
);