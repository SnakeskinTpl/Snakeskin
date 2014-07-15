link_index
link_index2

###

{template link_index()}
	{link}foo{/}
	{link css}foo{/}
	{link acss}foo{/}
{/}

{template link_index2()}
	{link css ng-('class' => 'foo'; 'id' => 'bar')}
		foo
	{/}
{/}

###

<link type="text/css" rel="stylesheet" href="foo" /> <link type="text/css" rel="stylesheet" href="foo" /> <link type="text/css" rel="alternate stylesheet" href="foo" />

***

<link type="text/css" rel="stylesheet" ng-class = "foo" ng-id = "bar" href="foo " />