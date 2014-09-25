cycles_index
cycles_index2

###

{template cycles_index(i = 0)}
	{&+}
		{for var j = 0; j < 3; j++}
			{j}
		{end}
	{&-}

	{&+}
		{while i++ < 3}
			{i}
		{end}
	{&-}

	{&+}
		{repeat}
			{i}
		{until i--}
	{&-}

	{&+}
		{do}
			{i}
		{while ++i < 3}
	{&-}
{end template}

{template cycles_index2(i = 0)}
	{&+}
		{for var j = 0; j < 3; j++}
			{j}
			{break}
		{end}
	{&-}

	{&+}
		{while i++ < 3}
			{if i === 1}
				{continue}
			{/}
			{i}
		{end}
	{&-}

	{&+}
		{repeat}
			{i}
			{break}
		{until i--}
	{&-}
{end template}

###

012 123 43210 -1012

***

0 23 4
