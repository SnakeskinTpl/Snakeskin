/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

[[get variable from closure]]===========================================================================================

5

[[get variable from closure with override]]=============================================================================

3

[[get variable from closure with super]]================================================================================

5 3

[[super with nested blocks]]============================================================================================

foo Hello world!

[[simple extend]]=======================================================================================================

Hello world! baz

[[include as placeholder]]==============================================================================================

<div><div>foo <div>bar </div> </div> </div>

[[include as placeholder 2]]============================================================================================

Hello world!

========================================================================================================================

- namespace modules[%fileName%]

- import fs from 'fs'
- import path from 'path'

: baseVar = 3
- include './base/!(block|body|asPlaceholder)'
- include './base/asPlaceholder.ss' as placeholder

- eval
	- forEach fs.readdirSync(path.join(__dirname, 'base')) => file
		- if file !== 'asPlaceholder.ss'
			- include path.join(__dirname, 'base', file)

- template ['get variable from closure']() extends modules.base.base1

- template ['get variable from closure with override']() extends modules.base.base1
	- block foo
		{baseVar}

- template ['get variable from closure with super']() extends modules.base.base1
	- block foo
		- super
		{baseVar}

- template ['super with nested blocks']() extends modules.base.base2
	- block bar
		- super

	- block foo
		foo

- template ['simple extend']() extends modules.base.base2
	- block baz
		baz

- template ['include as placeholder']() extends modules['block']['block']
	- block body
		+= modules.body['body']()

- template ['include as placeholder 2']()
	+= modules['asPlaceholder'].parent()
