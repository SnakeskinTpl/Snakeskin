interpolationTag1
interpolationTag2
interpolationTag3

###

- template interpolationTag1()
	< ${true ? 'input' : 'textarea'}
		Hello

	< ${false ? 'input' : 'textarea'}
		Hello

- template interpolationTag2()
	< ${'span'}.${'foo'}#${'bar'}
		< .&${'__bla'}
			Hello

- template ['interpolationTag3']()
	< body.i-page.${/\['(.*?)'\]/.exec(TPL_NAME)[1]}

###

<input value="Hello"> <textarea>Hello</textarea>

***

<span id="bar" class="foo"><div class="foo__bla">Hello</div></span>

***

<body class="i-page interpolationTag3"></body>
