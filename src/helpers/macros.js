/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

import { $C } from '../deps/collection';
import { base } from '../consts/macros';
import { macroBlackSymbols } from '../consts/regs';

/**
 * Sets an object as macros
 *
 * @param {(Object|undefined)} obj - the source object
 * @param {!Object} macros - a macro namespace object
 * @param {?string=} [opt_namespace] - a namespace for adding macros
 * @param {?boolean=} [opt_init=false] - if is true, then macros will be re/initialised
 */
export function setMacros(obj, macros, opt_namespace, opt_init) {
	if (opt_init) {
		$C.extend(false, macros, {
			map: {},
			groups: {},
			inline: {'\\': true},
			combo: {}
		});

		setMacros(base, macros);
	}

	if (obj == null) {
		$C(obj = macros.groups[opt_namespace]).forEach((el, key) => {
			delete obj[key];
			delete macros.map[key];
			delete macros.combo[key];
		});

	} else {
		$C(obj).forEach((el, key) => {
			if (key[0] === '@' && !opt_namespace) {
				setMacros(el, macros, key);

			} else {
				if (opt_namespace) {
					macros.groups[opt_namespace] = macros.groups[opt_namespace] || {};
				}

				if (el) {
					if (macroBlackSymbols.test(key)) {
						throw new Error(`Invalid macro "${key}"`);
					}

					macros.map[key] = el.value || el;

					if (Array.isArray(macros[key])) {
						macros.combo[key] = true;
					}

					if (el.inline) {
						macros.inline[key[0]] = true;
					}

					if (opt_namespace) {
						macros.groups[opt_namespace][key] = macros.map[key];
					}

				} else {
					delete macros.map[key];
					delete macros.combo[key];

					if (opt_namespace) {
						delete macros.groups[opt_namespace][key];
					}
				}
			}
		});
	}

	return macros;
}
