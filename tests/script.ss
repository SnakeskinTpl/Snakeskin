script_index
script_index2

###

{template script_index()}
	{script}
		var a = [];
	{/}

	{script coffee}
		var a = [];
	{/}

	{script coffee2}
		var a = [];
	{/}
{/}

{template script_index2()}
	{script ts ng-(class = foo | id = bar)}
		var a = [];
	{/}
{/}

###

<script type="text/javascript">var a = []; </script><script type="application/coffeescript">var a = []; </script><script type="coffee2">var a = []; </script>

***

<script type="application/typescript" ng-class="foo" ng-id="bar">var a = []; </script>
