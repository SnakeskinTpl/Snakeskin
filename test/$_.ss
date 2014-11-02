$__index

###

{?' bar '|trim}
{var tmp = $_}

{template $__index()}
	{?' foo '|trim}
	{$_} {tmp}
{/}

###

foo bar
