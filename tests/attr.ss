data_attr
data_attr2

###

{template data_attr()}
	{foo = 'foo'}
	{bar = 'bar'}

	{attr foo => 'bar'}
	{attr 'foo' => bar, foo; 'bar' => 'foo'}
{/}

{template data_attr2()}
	{foo = 'foo'}
	{bar = 'bar'}

	{attr ng-('foo' => bar, foo; 'bar' => 'foo'), foo => 'bar'}
	{attr ng-('foo' => (1 ? bar : null), ((foo)); 'bar' => 'foo'), foo:(foo => 'bar')}
{/}

###

foo = " bar"  foo = " bar foo" bar = " foo"

***

ng-foo = " bar foo" ng-bar = " foo" foo = " bar"  ng-foo = " bar foo" ng-bar = " foo" foo:foo = " bar"