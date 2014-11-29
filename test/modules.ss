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

3fff2:123:5fff`fffuuuu`

***

3fff2:5:fff
