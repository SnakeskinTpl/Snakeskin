index
recursive

###

{proto index->begin}
	{apply f1(1)}
{/}

{proto index->f1(i)}
	{apply f2(i)}
	{apply f2(i + 1)}

	{proto f3(i)}
		{i * 2}
	{/}{&}
{/}

{template index()}
	{apply begin}
	{apply f3(2)}

	{proto f2(i)}
		{i}
	{/}{&}

	{a = {a: 1}}
	{with a}{&}
		{proto f4(i)}
			{a} {i}
		{/}
	{/}

	{apply f4(2)}
{/}

{template recursive()}
	{proto begin(i)}
		{i}

		{if i}
			{apply begin(--i)}
		{/}
	{/}

	{apply begin(5)}
{/}

###

1   2     4      1 2

***

5     4     3     2     1     0