override_index

###

- include './test3/override.ss'

- template override_index()
	~= bar()

: foo = 1
: foo2 = 2

- block override_index->bar()
	{foo + foo2}

- template override_index()
	~= bar()

###

3
