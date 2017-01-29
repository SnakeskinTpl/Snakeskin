/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

[[simpleOutputClassic]]=================================================================================================

bar -1 1 foo foo 1 \1

[[simpleOutput]]========================================================================================================

bar -1 1 foo foo 1 \1

[[escaping]]============================================================================================================

{{ { /* hello */ }} /* world */ /** ! */ {{ /* 121 */ }} <div class="foo" bla-(( a ))="2" bar(( foo ))="3"></div>foo'bar' 3 `foo` {/*121 { <div bar="'}*/'" bla="'`121`'"></div><a href="&quot;"></a><a href="/"></a><a href="/foo"></a>

[[directiveWithRegExpLiteral]]==========================================================================================

true false

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
	#{cdata}\1#{/cdata}
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
	#{cdata}\1#{/cdata}

- template escaping()
	{{ \{ \/* hello *\/ }}
	\/* world */
	\/** ! */
	{{
		\/* 121 *\/
	}}
	< .foo bla-\(( a )) = 2 | bar\(( foo )) = 3
	{ 'foo\'bar\'' |!html }
	: a = 2
	{1\|a}
	\`foo\`
	`{/*121`
	{`{`}
	< div bar = '`}*/`' | bla = '\`121\`'
	< a href = \"
	< a href = \/
	< a href = \/foo

- template directiveWithRegExpLiteral()
	{output /123/.test('123')}
	{ /\d+/.test('bla')}
