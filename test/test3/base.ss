@= localization false
- include './super.ss'

: foo = 1
: bar = 2

- template modules_super()
	- block root
		{foo + bar}

- template modules_base() extends modules_super
