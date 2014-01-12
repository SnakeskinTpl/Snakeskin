index1
index2
index3

###

{template index1()}
	{forEach [1, 2, 3] => el, i, obj, isFirst, isLast, length}
		{el} {i} {obj[i]} {isFirst} {isLast} {length} ---
	{/}
{/}

{template index2()}
	{forEach {a: 1, b: 2} => el, key, obj, i, isFirst, isLast, length}
		{el} {key} {obj[key]} {i} {isFirst} {isLast} {length} ---
	{/}
{/}


{template index3()}
	{a = Object.create({a: 1, b: 2})}
	{forIn a => el, key, obj, i, isFirst, isLast, length}
		{el} {key} {obj[key]} {i} {isFirst} {isLast} {length} ---
	{/}
{/}

###

1 0 1 true false 3 ---  2 1 2 false false 3 ---  3 2 3 false true 3 ---

***

1 a 1 0 true false 2 ---  2 b 2 1 false true 2 ---

***

1 a 1 0 true false 2 ---  2 b 2 1 false true 2 ---