{include './foo/bar.ss'}

{template include[%fileName% + '--'](name) extends include.bar}
{/template}