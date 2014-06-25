pref_index

###

#{a = 1}
{b = 2}

{template pref_index()}
	#{if 1}
		{if 2}
			#{@a}
			{b}
		{/}
	#{/}

	{if 1}
		{@a}
		#{@b}
	#\{/}
{/template}

###

{if 2} 1 {b} {/}   1 2 #