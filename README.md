# Snakeskin

<img src="http://kobezzza.com/files/snakeskin/logo.svg?1" alt="Snakeskin" width="190" />

*This is Frank, a snake-cowboy who loves templates.*

---

Snakeskin is an awesome JavaScript template engine with the best support for inheritance.

[![NPM version](http://img.shields.io/npm/v/snakeskin.svg?style=flat)](http://badge.fury.io/js/snakeskin)
[![NPM download](https://img.shields.io/npm/dm/snakeskin.svg?style=flat)](http://badge.fury.io/js/snakeskin)
[![Gitter](https://img.shields.io/gitter/room/nwjs/nw.js.svg?maxAge=2592000?style=flat-square)](https://gitter.im/SnakeskinTpl/Snakeskin)

[![Build Status](http://img.shields.io/travis/SnakeskinTpl/Snakeskin.svg?style=flat&branch=master)](https://travis-ci.org/SnakeskinTpl/Snakeskin)
[![Coverage Status](http://img.shields.io/coveralls/SnakeskinTpl/Snakeskin.svg?style=flat)](https://coveralls.io/r/SnakeskinTpl/Snakeskin?branch=master)
[![NPM dependencies](http://img.shields.io/david/SnakeskinTpl/Snakeskin.svg?style=flat)](https://david-dm.org/SnakeskinTpl/Snakeskin#info=dependencies&view=table)
[![NPM devDependencies](http://img.shields.io/david/dev/SnakeskinTpl/Snakeskin.svg?style=flat)](https://david-dm.org/SnakeskinTpl/Snakeskin#info=devDependencies&view=table)

[Demo](http://codepen.io/kobezzza/pen/zrJNXx)

[Documentation](http://snakeskintpl.github.io/docs)

## Features

* 2 types of syntax: classic and Jade-Like;
* Object-oriented approach with very rich features for code-reuse (inheritance, composition, mixing, etc.);
* JS-like set of directives;
* [BEM](http://en.bem.info) (as in [Stylus](https://github.com/LearnBoost/stylus));
* Localization;
* Filters;
* Modules;
* Work in browsers, as well as on a server ([node.js](http://nodejs.org));
* The source code is designed to work with Google Closure Compiler in advanced mode;
* Good code coverage;
* Detailed [documentation](http://snakeskintpl.github.io/docs) with examples.

## Plugins

* [Gulp](https://github.com/SnakeskinTpl/gulp-snakeskin)
* [Grunt](https://github.com/SnakeskinTpl/grunt-snakeskin)
* [WebPack](https://github.com/SnakeskinTpl/snakeskin-loader)
* [CLI](https://github.com/SnakeskinTpl/snakeskin-cli)
* [STD.ss](https://github.com/SnakeskinTpl/std.ss)

### Example

```js
- namespace example
- template helloWorld(name = 'world')
  < .hello
    Hello {name}!
```

```js
example.helloWorld();
```

It will transpiled to

```html
<div class="hello">Hello world!</div>
```

## [License](https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE)

The MIT License.
