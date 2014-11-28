call_index

###

- template call_base()
	1

- template call_base.base()
	2

- template call_index()
	^= call_base()
	- call call_base.base()

###

1 2
