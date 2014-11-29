$__index

###

{?' bar '|trim}
{var tmp = $_}

{template $__index()}
	{$_}
	{?' foo '|trim}
	{$_} {tmp}
{/}

###

bar foo bar
