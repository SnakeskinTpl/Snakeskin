Snakeskin.addDirective(
	'throw',

	{
		notEmpty: true
	},

	function (command) {
		this.startInlineDir();
		if (this.isSimpleOutput()) {
			this.save((("throw " + (this.prepareOutput(command, true))) + ";"));
		}
	}
);


Snakeskin.addDirective(
	'try',

	{
		block: true,
		after: {
			'catch': true,
			'finally': true
		}
	},

	function () {
		this.startDir();
		if (this.isSimpleOutput()) {
			this.save('try {');
		}
	},

	function () {
		if (this.isSimpleOutput()) {
			this.save('}');
		}
	}
);

Snakeskin.addDirective(
	'catch',

	{
		notEmpty: true,
		after: {
			'finally': true,
			'end': true
		}
	},

	function (command) {var this$0 = this;
		if (this.structure.name !== 'try') {
			return this.error((("directive \"" + (this.name)) + "\" can only be used with a \"try\""));
		}

		this.toQueue(function()  {
			Snakeskin.Directions['end']({
				ctx: this$0,
				name: 'catch'
			});

			this$0.startDir();
			if (this$0.isSimpleOutput()) {
				this$0.save(((" catch (" + (this$0.declVar(command))) + ") {"));
			}
		});
	},

	function () {
		if (this.isSimpleOutput()) {
			this.save('}');
		}
	}
);

Snakeskin.addDirective(
	'finally',

	{
		placement: 'template'
	},

	function () {var this$0 = this;
		if (!{'try': true, 'catch': true}[this.structure.name]) {
			return this.error((("directive \"" + (this.name)) + "\" can only be used with a \"try\""));
		}

		this.toQueue(function()  {
			Snakeskin.Directions['end']({
				ctx: this$0,
				name: 'finally'
			});

			this$0.startDir();
			if (this$0.isSimpleOutput()) {
				this$0.save(' finally {');
			}
		});
	},

	function () {
		if (this.isSimpleOutput()) {
			this.save('}');
		}
	}
);