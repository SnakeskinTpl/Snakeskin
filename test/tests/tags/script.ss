/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

[[with default value]]==================================================================================================

	<script type="text/javascript">
		var baz = {
			foo: 'bar'
		};
	</script>

[[with ts value]]=======================================================================================================

	<script type="application/typescript">
		const baz: number = 1;
	</script>

[[with custom value]]===================================================================================================

	<script type="text/x-snakeskin">
		- template foo()
			< .bar
	</script>

[[with merging attributes]]=============================================================================================

	<script type="text/x-snakeskin">
		- template foo()
			< .bar
	</script>

========================================================================================================================

- namespace tags.script
@= tolerateWhitespaces true

- template ['with default value']()
	# script
		var baz = {
			foo: 'bar'
		};

- template ['with ts value']()
	# script ts
		const baz: number = 1;

- template ['with custom value']()
	# script text/x-snakeskin
		- template foo()
			< .bar

- template ['with merging attributes']()
	# script (type = text/x-snakeskin)
		- template foo()
			< .bar
