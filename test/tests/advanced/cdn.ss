cdn1 ; 'angularjs@2'
cdn2 ; 'bootstrap@4' ; 'yandex'
cdn2 ; 'angularjs@2'

###

- namespace advanced

- template cdn1(name, provider)
	- if !name
		- throw new Error('missing a name of the requested library')

	: desc = name.split('@')
	- lib = desc[0]
	- version = desc[1]

	- if !version
		- throw new Error('missing a version of the requested library')

	- target {} as libraries
		* angularjs
			- target {}
				* google
					- script (src = http://ajax.googleapis.com/ajax/libs/angularjs/${version}/angular.min.js)

				* yandex
					- script (src = http://yastatic.net/angularjs/${version}/angular.min.js)

	- block libraries() =>

	- if !libraries[lib]
		- throw new Error('the requested library "${name}" is not found'|tpl {name: lib})

	: putIn firstKey
		() => obj
			: val

			- forEach obj => el, key
				? val = key
				- break

			- return val

	{libraries[lib][provider] || libraries[lib][firstKey(libraries[lib])]}

- template cdn2(name, provider) extends advanced.cdn1
	- block libraries()
		- super
		- putIn libraries.bootstrap
			- target {}
				* maxcdn
					- link (href = http://maxcdn.bootstrapcdn.com/bootstrap/${version}/css/bootstrap.min.css)
					- script (src = http://maxcdn.bootstrapcdn.com/bootstrap/${version}/js/bootstrap.min.js)

				* yandex
					- link (href = http://yastatic.net/bootstrap/${version}/css/bootstrap.min.css)
					- script (src = http://yastatic.net/bootstrap/${version}/js/bootstrap.min.js)

###

<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/angularjs/2/angular.min.js"></script>

***

<link rel="stylesheet" type="text/css" href="http://yastatic.net/bootstrap/4/css/bootstrap.min.css"><script type="text/javascript" src="http://yastatic.net/bootstrap/4/js/bootstrap.min.js"></script>

***

<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/angularjs/2/angular.min.js"></script>
