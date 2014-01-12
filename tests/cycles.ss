index

###

{template index(i = 0)}
	{for var j = 0; j < 3; j++}
		{j}
	{end}

	{while i++ < 3}
		{i}
	{end}

	{repeat}
		{i}
	{until i--}

	{do}
		{i}
	{while ++i < 3}
{end template}

###

0  1  2   1  2  3   4  3  2  1  0   -1  0  1  2