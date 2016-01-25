/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

[[input-textarea]]======================================================================================================

<input value="Hello"> <textarea>Hello</textarea>

[[advanced tag declaration]]============================================================================================

<span id="bar" class="foo"><div class="foo__bla">Hello</div></span>

[[RegExp with filter]]==================================================================================================

<body class="i-page RegExp with filter"></body>

[[placeholder and default]]=============================================================================================

<div class="foo__baz"></div> <div bla="true" class="foo"><div class="foo__baz"></div></div>

========================================================================================================================

- namespace tags.interpolation

- template ['input-textarea']()
	< ${true ? 'input' : 'textarea'}
		Hello

	< ${false ? 'input' : 'textarea'}
		Hello

- template ['advanced tag declaration']()
	< ${'span'}.${'foo'}#${'bar'}
		< [[.&${'__bla'}]]
			Hello

- template ['RegExp with filter']()
	< body.i-page.${/\['(.*?)'\]/.exec(TPL_NAME)[1]}

- template ['placeholder and default']()
	< ${true ? '?' : ''}.foo bla = true
		< .&__baz

	< ${false ? '?' : ''}.foo bla = true
		< .&__baz
