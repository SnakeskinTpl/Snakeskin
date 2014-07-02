pref_index

###

#{pref_global = 1}
{pref_global2 = 2}

{template pref_index()}
	#{if 1}
		{if 2}
			#{@pref_global}
			{pref_global2}
		{/}
	#{/}

	{if 1}
		{@pref_global}
		#{@pref_global2}
	#\{/}
{/template}

###

{if 2} 1 {pref_global2} {/}   1 2 #