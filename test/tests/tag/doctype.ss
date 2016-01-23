/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

[[with default value]]==================================================================================================

<!DOCTYPE html><input value="foo">

[[with xml value]]======================================================================================================

<?xml version="1.0" encoding="utf-8" ?><input value="foo"/>

========================================================================================================================

- namespace tag.doctype

- template ['with default value']()
	- doctype
	< input value = foo

- template ['with xml value']()
	- doctype xml
	< input value = foo
