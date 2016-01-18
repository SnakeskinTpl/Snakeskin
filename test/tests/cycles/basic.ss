basicCycles1
basicCycles2

###

{template basicCycles1()}
	{for var j = 0; j < 3; j++}
		{j}
	{/}

	---

	{var i = 0 /}
	{while i++ < 3}
		{i}
	{end}

	---

	{do}
		{i}
	{while i--}
{/template}

- template basicCycles2()
	- for var j = 0; j < 3; j++
		{j}

	---

	- var i = 0
	- while i++ < 3
		{i}

	---

	- do
		{i}
	- while i--

###

0 1 2 --- 1 2 3 --- 4 3 2 1 0

***

0 1 2 --- 1 2 3 --- 4 3 2 1 0
