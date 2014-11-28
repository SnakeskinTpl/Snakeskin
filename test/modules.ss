modules_index
modules_index2

###

: bar = 5
- include './test3/base.ss'

- template modules_index() extends modules_base
	- block root
		- super
		| :
		+= bar
		| :
		- block bar
			{bar}
	- block foo
		`fffuuuu`

- template modules_index2() extends modules_base
	- block root
		- super
		| :
		{bar}


###

3:123:5`fffuuuu`

***

3:5
