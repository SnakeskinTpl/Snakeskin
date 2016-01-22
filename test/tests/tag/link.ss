/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

[[with default value]]==================================================================================================

<link rel="stylesheet" type="text/css" href="foo.css">

[[with css value]]======================================================================================================

<link rel="stylesheet" type="text/css" href="foo.css">

[[with acss value]]=====================================================================================================

<link rel="alternate stylesheet" type="text/css" href="foo.css">

[[with icon value]]=====================================================================================================

<link rel="icon" type="image/x-icon" href="foo.ico">

[[with custom value]]===================================================================================================

<link rel="foo" href="foo.css">

[[with merging attributes]]=============================================================================================

<link rel="alternate stylesheet" type="text/css" href="foo.css">

[[with auto value]]=====================================================================================================

<link rel="stylesheet" type="text/css" href="foo.css">

========================================================================================================================

- namespace tag.link

- template ['with default value']()
	- link (href = foo.css)

- template ['with css value']()
	- link css (href = foo.css)

- template ['with acss value']()
	- link acss (href = foo.css)

- template ['with icon value']()
	- link icon (href = foo.ico)

- template ['with custom value']()
	- link foo (href = foo.css)

- template ['with merging attributes']()
	- link (href = foo.css | rel = alternate stylesheet)

- template ['with auto value']()
	- link
		foo.css
