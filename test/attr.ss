attr_index
attr_index2
attr_index3
attr_index4

###

{template attr_index()}
	{foo = 'foo'}
	{bar = ''}

	{attr #{foo} = bar}
	{attr foo = ${bar} ${foo} | bar = foo}
{/}

{template attr_index2()}
	{foo = 'foo'}
	{bar = 'bar'}

	{attr ng-(foo = #{bar} #{foo} | bar = foo) ${foo} = bar}
	{attr ng-(foo = ${(1 ? bar : null)} ${((foo))} | bar = foo), foo:(#{foo} = bar) b-foo:(#{foo} = bar) b:foo-(${foo} = bar)}
{/}

- template attr_index3()
	? '121'
	- set & master
	< a.&__link class = &__link_#{'active_true'}
	< a.&__link #{'class'} = &__link_#{'active_true'}
	< a.&__link #{'class'} = b__link_#{'active_true'}
	< a.&__link #{'class'} = b__link_foo

- template attr_index4()
	? '121'
	- set & ${'master'}
	< a.&__link class = &__link_#{'active_true'}
	< a.&__link #{'class'} = &__link_#{'active_true'}
	< a.&__link ${'class'} = b__link_#{'active_true'}
	< a.&__link #{'class'} = b__link_foo

###

foo="bar"  foo="foo" bar="foo"

***

ng-foo="bar foo" ng-bar="foo" foo="bar"  ng-foo="bar foo" ng-bar="foo" foo:foo="bar" b-foo:foo="bar" b:foo-foo="bar"

***

<a class="master__link_active_true master__link"></a><a class="master__link_active_true master__link"></a><a class="b__link_active_true master__link"></a><a class="b__link_foo master__link"></a>

***

<a class="master__link_active_true master__link"></a><a class="master__link_active_true master__link"></a><a class="b__link_active_true master__link"></a><a class="b__link_foo master__link"></a>
