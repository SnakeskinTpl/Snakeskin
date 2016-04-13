/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

[[simple]]==============================================================================================================

<div class="foo bar" bla="2" data-baz="foo bar" foo baz=""></div>

[[xml doctype]]=========================================================================================================

<?xml version="1.0" encoding="utf-8" ?><div class="foo" foo="foo"></div>

[[with groups]]=========================================================================================================

<div class="foo bar" ng-baz="foo bar" ng-foo="((1))"></div>

[[with object]]=========================================================================================================

<div class="foo bar" ng-baz="foo bar" bar-foo="bla"></div>

[[TRUE | FALSE]]========================================================================================================

<div class="foo" foo></div>

[[html escaping with object]]===========================================================================================

<div class="foo" onclick="javascript:alert(&quot;xss!&quot;)" onload="javascript&#31;:alert(&quot;xss!&quot;)"></div>

[[mixing with object]]==================================================================================================

<div class="foo bar" ng-baz="foo bar" bar="bla" ng-bar="foo"></div>

[[dasherize with object]]===============================================================================================

<div class="foo" data-foo-bar="bla"></div>

[[interpolation]]=======================================================================================================

<div class="foo bar" bar="[object Object]" baz=""></div>

[[with parentheses]]====================================================================================================

<div class="foo" foo="bar() && (bla ? bar((1)) : 2)" (onclick)="alert()"></div>

========================================================================================================================

- namespace tags[%fileName%]

- template simple()
	< .foo class = bar | bla = 2 | -baz = foo bar | foo | baz =

- template ['xml doctype']()
	- doctype xml
	< .foo foo

- template ['with groups']()
	< .foo (( class = bar )) ng-(( baz = foo bar | foo = ((1)) ))

- template ['with object']()
	< .foo ${{class: 'bar', ng: {baz: 'foo bar'}, 'bar-': {foo: 'bla'}}}

- template ['TRUE | FALSE']()
	< .foo ${{foo: TRUE, bar: FALSE}}

- template ['html escaping with object']()
	< .foo ${{onclick: 'javascript:alert("xss!")'}|!html} | ${{onload: 'javascript:alert("xss!")'}}

- template ['mixing with object']()
	< .foo (( ${{class: 'bar', ng: {baz: 'foo bar'}, bar: TRUE}} )) (( bar = bla )) ng-(( bar = foo ))

- template ['dasherize with object']()
	< .foo ${{dataFooBar: 'bla'}}

- template ['interpolation']()
	< .foo ${{class: 'bar'}} = foo | ${'bar'} = ${{class: 'bar'}} | ${''} = hello | ${'baz'} = ${''}

- template ['with parentheses']()
	< .foo foo = bar() && (bla ? bar((1)) : 2) | (onclick) = alert()
