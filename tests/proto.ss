proto_index
proto_index2.a['foo']
proto_recursive
proto_recursive2

###

{proto proto_index->begin}
	{apply f1(1)}
{/}

{proto proto_index->f1(i)}
	{apply f2(i)}
	{apply f2(i + 1)}

	{proto f3(i)}
		{i * 2}
	{/}{&}
{/}

{template proto_index()}
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

{proto proto_index2.a['foo']->begin(i)}
	{apply f1(1)}
{/}

{proto proto_index2.a['foo']->f1(i)}
	{i}
{/}

{template proto_index2.a['foo']()}
	{apply begin(1)}
{/}

{template proto_recursive()}
	{proto begin(i)}
		{i}

		{if i}
			{apply begin(--i)}
		{/}
	{/}

	{apply begin(5)}
{/}

{template proto_recursive2()}
	{proto begin(i)}
		{proto foo(i)}
			{if i === 2}
				{return}
			{/}

			{apply begin(i)}
		{/}

		{i}

		{if i}
			{apply foo(--i)}
		{/}
	{/}

	{apply begin(5)}
{/}


###

1   2     4      1 2

***

1

***

5     4     3     2     1     0

***

5         4         3