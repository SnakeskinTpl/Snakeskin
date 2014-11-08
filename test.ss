- template test(asserts)
	- doctype transitional
	< html
		< head
			< meta http-equiv = Content-Type | content = text/html; charset\=utf-8
			< title :: Snakeskin.compile
			- link :: http://code.jquery.com/qunit/qunit-1.13.0.css

			- script (src = http://code.jquery.com/jquery-1.10.2.min.js)
			- script (src = http://code.jquery.com/qunit/qunit-1.11.0.js)
			- script (src = ../dist/snakeskin.min.js)
			- script (src = ../node_modules/async/lib/async.js)
			- script (src = ../node_modules/collection.js/dist/collection.min.js)

			# script
				Snakeskin.importFilters(Snakeskin.Filters, 'test.bar');
				Snakeskin.importFilters({
					'квадрат': function (val) {
						return val * val;
					}
				});

				function i18n(str) {
					return str;
				}

				function returnOne() {
					return 1;
				}

				Object.create = Object.create || function (obj) {
					function F() {

					};

					F.prototype = obj;
					return new F();
				};

				function i18n(str) {
					return str;
				}

		< body
			< h1#qunit-header :: Test: Snakeskin.compile
			< h2#qunit-banner
			< #qunit-testrunner-toolbar
			< h2#qunit-userAgent
			< ol#qunit-tests

			- forEach asserts => el
				# script text/x-snakeskin-template (id = #{el.id})
					#{'\n' + el.tpl + '\n'|!html}

				# script
					var log = {};

					Snakeskin.compile(document.getElementById('#{el.id}'), {
						prettyPrint: true,
						autoReplace: true,
						debug: log
					});

					test('#{el.id}', function () {
						# forEach el.js => el
							#{el|!html}
					});
