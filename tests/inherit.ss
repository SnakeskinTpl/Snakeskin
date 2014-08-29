inherit_sub
inherit_childTestConst
inherit_childTestConst2
inherit_childTestConst3

###

{proto inherit_base->bar}{/}
{template inherit_base(val = 1, val2 = 3)}
	{val2}
	{block foo}
		{val}

		{apply bar}
	{/}
{/}

{proto inherit_sub->bar(i = 11)}
	{i}
{/}

{template inherit_sub(val = 2) extends inherit_base}
	{block e}my{/}
{/}

{template inherit_superTestConst()}
	{proto a}
		{foo = 1}
	{/}
	{apply a}
{/}

{template inherit_childTestConst() extends inherit_superTestConst}
	{proto a}
		{foo = 2}
		{foo}
	{/}
{/}

{template inherit_superTestConst2()}
	{proto a}
		{a = 1}
	{/}
	{apply a}
{/}

{template inherit_childTestConst2() extends inherit_superTestConst2}
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

{template inherit_superTestConst3()}
	{a = {}}

	{a.a = 1}
	{a['b'] = 2}

	{a.a}
	{a.b}
{/}

{template inherit_childTestConst3() extends inherit_superTestConst3}
	{a.a = 2}
	{a.b = 3}
{/}

###

3 2 11  my

***

2

***

1

***

2 3