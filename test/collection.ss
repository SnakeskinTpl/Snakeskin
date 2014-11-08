collection_index
collection_index2
collection_index3

###

- import $C = typeof require !== 'undefined' ? require('collection.js').$C : self.$C

{template collection_index()}
	{$forEach [1, 2, 3] => {filter: ':el > 1'} => el}
		{el}
	{/}
{/}

{template collection_index2()}
	{$forEach [1, 2, 3] => {filter: ':el > 1'} => el}
		{el}
		{break}
	{/}
{/}

{template collection_index3()}
	{$forEach [1, 2, 3] => {filter: ':el > 1'} => el}
		{if el === 3}
			{continue}
		{/}
		{el}
	{/}
{/}

###

2 3

***

2

***

2
