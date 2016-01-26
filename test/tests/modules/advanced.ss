/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

[[include as placeholder]]==============================================================================================

<div><div>foo <div>bar </div> </div> </div>

========================================================================================================================

- namespace modules.advanced

- include './base/block' as placeholder
- include './base/body'

- template ['include as placeholder']() extends modules.block['block']
	- block body
		+= modules.body['body']()
