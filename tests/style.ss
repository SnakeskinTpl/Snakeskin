style_index
style_index2

###

{template style_index()}
	#{style}
		.a {}
	#{/}

	#{style css}
		.a {}
	#{/}

	#{style css2}
		.a {}
	#{/}
{/}

{template style_index2()}
	#{style css ng-('class' => 'foo'; 'id' => 'bar')}
		.a {}
	#{/}
{/}

###

<style type="text/css">.a {} </style> <style type="text/css">.a {} </style> <style type="css2">.a {} </style>

***

<style type="text/css" ng-class = "foo" ng-id = "bar">.a {} </style>