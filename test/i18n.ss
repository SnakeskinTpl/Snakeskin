i18n_index
i18n_index2
i18n_index3
i18n_index4

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

###

hel`lo world `bar

***

hel`lo world `bar

***

привет привет   привет

***

ffffuuuuuu
