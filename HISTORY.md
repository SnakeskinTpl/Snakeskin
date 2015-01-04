## v6.5.15

- [x] Updated description.

## v6.5.14

- [x] Small fixes;
- [x] Updated description.

## v6.5.13

- [x] Small fixes;
- [x] Refactoring and optimization.

## v6.5.12

- [x] Updated description.

## v6.5.11

- [x] Added English readme;
- [x] Small fixes.

## v6.5.10

- [x] Bugfix.

## v6.5.9

- [x] Bugfix.

## v6.5.8

- [x] Added project logo;
- [x] Refactoring.

## v6.5.7

- [x] Bugfix.
- [x] Refactoring.

## v6.5.6

- [x] Updated version of `Escaper` in the build.

## v6.5.5

- [x] Improved integration with GCC.

## v6.5.4

- [x] Improved integration with GCC.

## v6.5.3

- [x] Bugfix.

## v6.5.2

- [x] Bugfix.

## v6.5.1

- [x] Bugfix.

## v6.5.0

- [x] Added parameter `.useStrict`;
- [x] Bugfix.

## v6.4.2

- [x] Bugfix.

## v6.4.1

- [x] Bugfix.

## v6.4.0

- [x] [Simplify calling templates in the template](https://github.com/kobezzza/Snakeskin/issues/14);
- [x] [Added support for anonymous prototypes](https://github.com/kobezzza/Snakeskin/issues/13);

```
- template foo(myData)
	- proto (data) => myData
		...
		- if data.children
			- apply &(data.children)
```

- [x] [Added support for anonymous sticky links](https://github.com/kobezzza/Snakeskin/issues/12);
- [x] [Added support for closures of global variables of the attached files in inheritance](https://github.com/kobezzza/Snakeskin/issues/10);
- [x] Improved inheriting translation: general settings now also inherited;

**base.ss**

```
@= localization false
- template base()
	`foo`
```

**index.ss**

```
- include './base.ss'
- template index() extends base
```

```
`foo`
```

- [x] Added new directive `callBlock`, which is sugar for `call blocks.`;
- [x] New short forms:

* `apply`     — `+=`;
* `call`      — `^=`;
* `callBlock` — `~=`.

- [x] Added link `$0`, which indicates the active DOM element (only for `renderMode = 'dom'`);

```
< .b-foo
	< .&__cell
		? console.log($0) /// <div class="b-foo__cell"> (HTMLDivElement)
		? console.log($0.parentNode) /// <div class="b-foo"> (HTMLDivElement)

	? console.log($0) /// <div class="b-foo"> (HTMLDivElement)

? console.log($0) /// undefined
```

- [x] Filter `bem` now accepts third parameter `node`, which refers to the active DOM node (if any);
- [x] Added parameter `.bemFilter`;
- [x] Bugfix and refactoring.

## v6.3.2

- [x] Bugfix and refactoring.

## v6.3.1

- [x] Bugfix.

## v6.3.0

- [x] Tag interpolation:

```
< .b-foo.&_${isActive ? 'active_true': ''}
```

```html
<div class="b-foo b-foo_active_true"></div>
```

- [x] Sticky links:

```
< .b-button
    < .&__content[.&_focus_true]
```

```html
<div class="b-button">
	<div class="b-button__content b-button__content_focus_true"></div>
</div>
```

- [x] Universal export format;
- [x] Sort the names of templates;
- [x] Bugfix and refactoring.

## v6.2.0

- [x] Bugfix and refactoring.
- [x] Improved macros;
- [x] The folder `build` renamed to `dist`.

## v6.1.3

- [x] Bugfix.

## v6.1.2

- [x] Small fixes.

## v6.1.1

- [x] Bugfix.

## v6.1.0

- [x] Added support for a pattern matching in `include`

## v6.0.6

- [x] At the end of the generated text always put a line break.

## v6.0.5

- [x] Small fixes.

## v6.0.4

- [x] Small fixes.

## v6.0.3

- [x] Small fixes.

## v6.0.2

- [x] Bugfix.

## v6.0.1

- [x] Small fixes.

## v6.0.0

- [x] The parameter `.commonJS` replaced by `.exports = 'commonJS'`;
- [x] The parameter `.xml` replaced by `.doctype`;
- [x] Added parameter `.lineSeparator`;
- [x] Added parameter `.replaceUndef`.

## v5.1.10

- [x] Small fixes.

## v5.1.9

- [x] Fixed the bug when overriding parameters broadcast in the child template.

## v5.1.8

- [x] Updated version of `Escaper` in the build.

## v5.1.7

- [x] Fixed the bug with the generation of `:inline` node in `renderMode = 'dom'`.

## v5.1.6

- [x] Bugfix.

## v5.1.5

- [x] Fixed the bug with node.js cache.

## v5.1.4

- [x] Changed the success message in the CLI API.

## v5.1.3

- [x] Fixed the bug when deleting a file in the `--watch`.

## v5.1.2

- [x] Small fixes.

## v5.1.1

- [x] Bugfix.

## v5.1.0

- [x] Added parameter `.tolerateWhitespace`;
- [x] Added class `:inline` for the directive `tag`;
- [x] Bugfix.

## v5.0.0

- [x] Removed directive `ignore`, and the functionality is moved to the transpiler settings;
- [x] Added directive `setSSFlag`;
- [x] Improved support for modules;
- [x] Added support for external blocks;
- [x] Added translation mode to DOM;
- [x] Removed parameter `.stringBuffer`, added parameter `renderMode` with values: `stringConcat`,` stringBuffer`, `dom`;
- [x] Removed parameter `.interface`, added parameter` renderAs` with values: `placeholder`,` interface`, `template`;
- [x] Improved directive include: added support modifier `as interface` and `as placeholder`;
- [x] Added support functions as a replacement strings-localization;
- [x] Added directive `cdn`;
- [x] Added support for `arguments` for prototypes;
- [X] Improved CLI API:
* added support for working with folders;
* added flag `--watch` to automatically recompile templates.
