sub
childTestConst
childTestConst2

###

{proto base->bar}{/}
{template base(val = 1, val2 = 3)}
	{val2}
	{block foo}
		{val}

		{apply bar}
	{/}
{/}

{proto sub->bar(i = 11)}
	{i}
{/}

{template sub(val = 2) extends base}
	{block e}my{/}
{/}

{template superTestConst()}
	{proto a}
		{foo = 1}
	{/}
	{apply a}
{/}

{template childTestConst() extends superTestConst}
	{proto a}
		{foo = 2}
		{foo}
	{/}
{/}

{template superTestConst2()}
	{proto a}
		{a = 1}
	{/}
	{apply a}
{/}

{template childTestConst2() extends superTestConst2}
	{proto a}
		{a = 2}
		{proto e}
			{j = 1}
			{j}
		{/}
		{apply e}
	{/}
	{apply a}
{/}

###

3  2  11   my

***

2

***

1