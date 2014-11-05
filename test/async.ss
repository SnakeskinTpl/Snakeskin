async_index
async_index2

###

- import async = require('async')

- template async_index()
	- series
		() => cb
			1
			? cb()
		() =>
			- break
			2
	- final => err, res
		3

- template async_index2()
	- series
		() =>
			- continue
			1

		() => cb
			2
			? cb()

	- final => err, res
		3

###

1 3

***

2 3
