interpolation1
interpolation2
interpolation3
interpolation4

###

- namespace tag

/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

- template interpolation1()
	< ${true ? 'input' : 'textarea'}
		Hello

	< ${false ? 'input' : 'textarea'}
		Hello

- template interpolation2()
	< ${'span'}.${'foo'}#${'bar'}
		< [[.&${'__bla'}]]
			Hello

- template ['interpolation3']()
	< body.i-page.${/\['(.*?)'\]/.exec(TPL_NAME)[1]}

- template interpolation4()
	< ${true ? '?' : ''}.foo bla = true
		< .&__baz

	< ${false ? '?' : ''}.foo bla = true
		< .&__baz

###

<input value="Hello"> <textarea>Hello</textarea>

***

<span id="bar" class="foo"><div class="foo__bla">Hello</div></span>

***

<body class="i-page interpolation3"></body>

***

<div class="foo__baz"></div> <div bla="true" class="foo"><div class="foo__baz"></div></div>
