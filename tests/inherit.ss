childTestConst
childTestConst2

###

{template superTestConst()}
	{proto a}
		{foo = 1}
	{end}
	{apply a}
{end}

{template childTestConst() extends superTestConst}
	{proto a}
		{foo = 2}
		{foo}
	{end}
{end}

{template superTestConst2()}
	{proto a}
		{a = 1}
	{end}
	{apply a}
{/template}

{template childTestConst2() extends superTestConst2}
	{proto a}
		{a = 2}
		{proto e}
			{j = 1}
			{j}
		{end}
		{apply e}
	{end}
	{apply a}
{/template}

###

2

***

1
