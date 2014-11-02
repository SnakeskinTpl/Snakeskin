inherit2_sub
inherit2_sub2

###

{template inherit2_base()}
	#{a1 = 1}

	{proto foo}
		{const a = 1}
		{b = 3}
	{/}
{/template}

#{template inherit2_sub() extends inherit2_base}
	#{const a1 = 22}
	#{const b = 2}
	#{b33 = 34}
	#{const b13 = 2}

	#{block e}
		#{a1} #{b33} #{b13}

		#{try}
			#{a}
		#{catch err}
			%
		#{/}

		#{try}
			#{b}
		#{catch err}
			%
		#{/}
	#{/}
#{/template}

#{template inherit2_base2(val = 1)}
	#{a1 = 1}

	#{proto foo}
		#{const a = 1}
		#{b = 3}
	#{/}
#{/template}

{template inherit2_sub2() extends inherit2_base2}
	{const a1 = 22}
	{const b = 2}
	{b33 = 34}
	{const b13 = 2}

	{block e}
		{a1} #{b33} #{b13} {val}

		{try}
			{a}
		{catch err}
			%
		{/}

		{try}
			#{b}
		{catch err}
			%
		{/}
	{/}
{/template}

###

22 34 2

***

22 34 2 1
