attr_index
attr_index2

###

{template attr_index()}
	{foo = 'foo'}
	{bar = ''}

	{attr foo => 'bar'}
	{attr 'foo' => bar, foo; 'bar' => 'foo'}
{/}

{template attr_index2()}
	{foo = 'foo'}
	{bar = 'bar'}

	{attr ng-('foo' => bar, foo; 'bar' => 'foo'), foo => 'bar'}
	{attr ng-('foo' => (1 ? bar : null), ((foo)); 'bar' => 'foo'), foo:(foo => 'bar')}
{/}

###

foo = "bar"  foo = "foo" bar = "foo"

***

ng-foo = "bar foo" ng-bar = "foo" foo = "bar"  ng-foo = "bar foo" ng-bar = "foo" foo:foo = "bar"