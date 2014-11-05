try_index
try_index2

###

{template try_index()}
	{&+}
	{try}
		{void foo()}
	{/}

	{try}
		{void foo()}

	{catch err}
		bar

	{finally}
		2
	{/}

	{try}
		{void foo()}

	{catch err}
		bar
	{/}

	{try}
		{void 2}

	{finally}
		1
	{/}
{/}

- template try_index2()
	- try
		- throw new Error('ffffuuu'|upper)
	- catch err
		- err.message
###

bar2bar1

***

FFFFUUU
