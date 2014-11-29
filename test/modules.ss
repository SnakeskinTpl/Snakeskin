modules_index
modules_index2

###

: bar = 5
? ' fff '|trim
- include './test3/base2.ss'
: tmp = $_

- template modules_index() extends modules_base
	- block root
		- super
		| :
		+= bar
		| :
		- block bar
			{bar}
			{tmp}
	- block foo
		`fffuuuu`

- template modules_index2() extends modules_base
	- block root
		- super
		| :
		{bar}
		| :
		{tmp}

###

3 : fff2 : 123 : 5 fff `fffuuuu`

***

3 : fff2 : 5 : fff
