- include './super.ss'

: foo = 1
: bar = 2

- template modules_base()
	- block root
		{foo + bar}
