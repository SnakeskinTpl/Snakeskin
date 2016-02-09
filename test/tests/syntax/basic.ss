/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

[[simpleOutputClassic]]=================================================================================================

bar -1 1 foo foo 1

[[simpleOutput]]========================================================================================================

bar -1 1 foo foo 1

========================================================================================================================

- namespace syntax[%fileName%]

/**
 * @return {string}
 */
{template simpleOutputClassic()}
	{val = {
		foo: 'foo',
		bar: 'bar'
	}}

	{
		method = {
			foo: {
				bar: String.prototype.replace
			}
		}
	}

	{call method[val['foo']][val.bar].call('foo', 'foo', 'bar') /}
	{new String([1, 2, 3]).indexOf()}
	{call returnOne() /}

	{'{foo}'|replace /^{|}$/gim, ''}
	{'{foo}'|foo.bar.replace /^{|}$/gim, ''}
	{2 / 2}
{/template}

/**
 * @return {string}
 */
- template simpleOutput()
	/**
	 * @type {!Object}
	 */
	- val = { &
		foo: 'foo',
		bar: 'bar'
	} .

	/*
	 * @type {!Object}
	 */
	- method &
	= {
		foo: {
			bar: String.prototype.replace
		}
	} .

	+= method[val['foo']][val.bar].call('foo', 'foo', 'bar')
	{new String([1, 2, 3]).indexOf()}
	+= returnOne()

	{'{foo}'|replace /^{|}$/gim, ''}
	{'{foo}'|foo.bar.replace /^{|}$/gim, ''}
	{2 / 2}