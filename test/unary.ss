unary_index

###

{template unary_index()}
	{typeof foo}
	{1 instanceof Number}
	{new Object}
	{'valueOf' in Object.prototype}
	{typeof typeof foo}
	{1 instanceof Number instanceof Boolean}
{/}

###

undefined false [object Object] true string false
