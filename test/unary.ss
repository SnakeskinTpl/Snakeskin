unary_index
unary_index2

###

{template unary_index()}
	{typeof foo}
	{1 instanceof Number}
	{new Object}
	{'valueOf' in Object.prototype}
	{typeof typeof foo}
	{1 instanceof Number instanceof Boolean}
{/}

- template unary_index2()
	: i = 0
	{++i}
	{i++}
	{!!i}

###

undefined false [object Object] true string false

***

1 1 true
