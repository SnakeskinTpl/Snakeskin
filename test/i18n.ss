i18n_index
i18n_index2
i18n_index3
i18n_index4
i18n_index5

###

{template i18n_index()}
	`hel\`lo` {`world`} \`bar
{/}

#{template i18n_index2()}
	`hel\`lo` #{`world`} \`bar
#{/}

- proto i18n_index3->foo :: `hello`

{template i18n_index3() @= localization true @= language {hello: 'привет'}}
	`hello` #{`hello`} `#{'hello'}` `--` {apply foo}
	`{proto bar}hello{/}`
{/}

{template i18n_index4() @= localization true @= language 'lang.js'}
	`foo`
{/}

- proto i18n_index5->foo :: `hello`

{template i18n_index5() @= localization true}
	`hello` #{`hello`} `#{'hello'}` `--` {apply foo}
	`{proto bar}hello{/}`
{/}

###

hel`lo world `bar

***

hel`lo world `bar

***

привет привет   привет

***

ffffuuuuuu

***

hello hello #{'hello'} -- hello {proto bar}hello{/}
