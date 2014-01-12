index

###

{proto index->begin}
	{apply f1(1)}{&}
{end}

{proto index->f1(i)}
	{apply f2(i)}{&}
	{apply f2(i + 1)}{&}

	{proto f3(i)}{&}
		{i * 2}
	{end}{&}
{end}

{template index()}
	{apply begin}{&}
	{apply f3(2)}

	{proto f2(i)}{&}
		{i}
	{end}
{end}

###

1 2 4