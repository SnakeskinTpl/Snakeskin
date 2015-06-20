/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

/**
 * The map of prototype callbacks
 */
DirObj.prototype.backTable = {
	init() {
		return {};
	}
};

/**
 * The number of prototype callbacks
 * (when "apply" calls before prototype declaration)
 * @type {number}
 */
DirObj.prototype.backTableI = 0;

Snakeskin.addDirective(
	'apply',

	{
		placement: 'template',
		notEmpty: true,
		text: true,
		replacers: {
			'+=': (cmd) => cmd.replace('+=', 'apply ')
		}
	},

	function (command) {
		this.startInlineDir();
		if (this.isSimpleOutput()) {
			let tplName = this.tplName;
			let name = this.getFnName(command),
				args = this.getFnArgs(command);

			if (name === '&' && this.proto) {
				name = this.proto.name;
			}

			let cache = protoCache[tplName];
			let proto = cache[name],
				argsStr = '';

			if (proto) {
				argsStr = this.returnProtoArgs(proto.args, args);
			}

			let selfProto = this.proto;
			if (selfProto && proto && proto.calls[selfProto.name]) {
				return this.error(`invalid form of recursion for the proto (apply "${name}" inside "${selfProto.name}")`);
			}

			// The recursive call of proto
			if (selfProto && selfProto.name === name) {
				this.save(argsStr + this.out('__I_PROTO__++', true) + ';');

			// Attempt to apply an undefined proto
			// (memorise the call point and return to it
			// when the proto will be declared)
			} else if (!proto || !proto.body) {
				let back = this.backTable;

				if (!back[name]) {
					back[name] = [];
					back[name].protoStart = this.protoStart;
					this.backTableI++;
				}

				let rand = Math.random().toString(),
					key = `${tplName.replace(/([.\[])/g, '\\$1')}_${name}_${rand.replace('.', '\\.')}`;

				back[name].push({
					proto: selfProto ?
						cache[selfProto.name] : null,

					pos: this.res.length,
					label: new RegExp(`\\/\\* __APPLY__${key} \\*\\/`),

					args: args,
					recursive: Boolean(proto)
				});

				this.save(`/* __APPLY__${tplName}_${name}_${rand} */`);

				if (selfProto && !proto) {
					cache[selfProto.name].calls[name] = true;
				}

			} else {
				this.save(argsStr + proto.body);
			}
		}
	}
);
