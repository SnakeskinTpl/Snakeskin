@= localization false
- include './super.ss'

: foo = 1
: bar = 2

? ' fff2 '|trim
: tmp = $_

- template modules_super()
	- block root
		{foo + bar}
		| :
		{tmp}

- template modules_base() extends modules_super
