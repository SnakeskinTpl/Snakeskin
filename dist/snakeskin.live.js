/*!
 * Snakeskin v6.5.19 (live)
 * https://github.com/kobezzza/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/kobezzza/Snakeskin/blob/master/LICENSE
 *
 * Date: Sat, 10 Jan 2015 12:44:39 GMT
 */

(function (root) {
"use strict";

var global = this;
/*!
 * Полифилы, необходимые для работы live библиотеки
 * в старых браузерах
 */

Array.isArray = Array.isArray || function (obj) {
  return ({}).toString.call(obj) === "[object Array]";
};

String.prototype.trim = String.prototype.trim || function () {
  var str = this.replace(/^\s\s*/, ""),
      i = str.length;

  for (var rgxp = /\s/; rgxp.test(str.charAt(--i));) {}
  return str.substring(0, i + 1);
};

/** @type {!Object} */
var Snakeskin = {
  /**
   * Версия Snakeskin
   * @type {!Array}
   */
  VERSION: [6, 5, 19],

  /**
   * Пространство имён для директив
   * @type {!Object}
   */
  Directions: {},

  /**
   * Пространство имён для фильтров
   * @type {!Object}
   */
  Filters: {},

  /**
   * Пространство имён для суперглобальных переменных
   * @type {!Object}
   */
  Vars: {},

  /**
   * Пространство имён для локальных переменных
   * области декларации шаблонов
   * @type {!Object}
   */
  LocalVars: {},

  /**
   * Кеш шаблонов
   * @type {!Object}
   */
  cache: {}
};

var IS_NODE = false,
    JSON_SUPPORT = false;

try {
  IS_NODE = "object" === typeof process && Object.prototype.toString.call(process) === "[object process]";
  JSON_SUPPORT = JSON.parse(JSON.stringify({ foo: "bar" })).foo === "bar";
} catch (ignore) {}

/**
 * Экспортировать свойство объекта для GCC
 *
 * @param {?} a - вариант 1
 * @param {?} b - вариант 2
 * @param {?=} [opt_c] - вариант 3
 * @return {?}
 */
function _(a, b, opt_c) {
  if (a !== void 0) {
    return a;
  }

  if (opt_c !== void 0) {
    return b === void 0 ? opt_c : b;
  }

  return b;
}

/**
 * Вернуть заданный объект с указанием произвольного типа
 * (для приведения типа в GCC)
 *
 * @param {?} val - исходное значение
 * @return {?}
 */
_.any = function (val) {
  return val;
};
/*!
 * Набор базовых фильтров и методы для работы с ними
 */

/**
 * Импортировать свойства заданного объекта в пространство имён Snakeskin.Filters
 *
 * @param {!Object} filters - импортируемый объект
 * @param {?string=} [opt_namespace] - пространство имён для сохранения, например, foo.bar
 */
Snakeskin.importFilters = function (filters, opt_namespace) {
  var obj = Snakeskin.Filters;

  if (opt_namespace) {
    var parts = opt_namespace.split(".");
    for (var i = -1; ++i < parts.length;) {
      obj[parts[i]] = obj[parts[i]] || {};
      obj = obj[parts[i]];
    }
  }

  forIn(filters, function (filter, key) {
    obj[key] = filter;
  });
};

var symbols = "\\u0041-\\u005A\\u0061-\\u007A\\u00AA\\u00B5\\u00BA\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02C1" + "\\u02C6-\\u02D1\\u02E0-\\u02E4\\u02EC\\u02EE\\u0370-\\u0374\\u0376\\u0377\\u037A-\\u037D\\u0386\\u0388-\\u038A" + "\\u038C\\u038E-\\u03A1\\u03A3-\\u03F5\\u03F7-\\u0481\\u048A-\\u0525\\u0531-\\u0556\\u0559\\u0561-\\u0587" + "\\u05D0-\\u05EA\\u05F0-\\u05F2\\u0621-\\u064A\\u066E\\u066F\\u0671-\\u06D3\\u06D5\\u06E5\\u06E6\\u06EE\\u06EF\\u06FA-\\u06FC" + "\\u06FF\\u0710\\u0712-\\u072F\\u074D-\\u07A5\\u07B1\\u07CA-\\u07EA\\u07F4\\u07F5\\u07FA\\u0800-\\u0815\\u081A\\u0824" + "\\u0828\\u0904-\\u0939\\u093D\\u0950\\u0958-\\u0961\\u0971\\u0972\\u0979-\\u097F\\u0985-\\u098C\\u098F\\u0990" + "\\u0993-\\u09A8\\u09AA-\\u09B0\\u09B2\\u09B6-\\u09B9\\u09BD\\u09CE\\u09DC\\u09DD\\u09DF-\\u09E1\\u09F0\\u09F1\\u0A05-\\u0A0A" + "\\u0A0F\\u0A10\\u0A13-\\u0A28\\u0A2A-\\u0A30\\u0A32\\u0A33\\u0A35\\u0A36\\u0A38\\u0A39\\u0A59-\\u0A5C\\u0A5E\\u0A72-\\u0A74\\u0A85-\\u0A8D" + "\\u0A8F-\\u0A91\\u0A93-\\u0AA8\\u0AAA-\\u0AB0\\u0AB2\\u0AB3\\u0AB5-\\u0AB9\\u0ABD\\u0AD0\\u0AE0\\u0AE1\\u0B05-\\u0B0C\\u0B0F\\u0B10" + "\\u0B13-\\u0B28\\u0B2A-\\u0B30\\u0B32\\u0B33\\u0B35-\\u0B39\\u0B3D\\u0B5C\\u0B5D\\u0B5F-\\u0B61\\u0B71\\u0B83\\u0B85-\\u0B8A\\u0B8E-\\u0B90" + "\\u0B92-\\u0B95\\u0B99\\u0B9A\\u0B9C\\u0B9E\\u0B9F\\u0BA3\\u0BA4\\u0BA8-\\u0BAA\\u0BAE-\\u0BB9\\u0BD0\\u0C05-\\u0C0C" + "\\u0C0E-\\u0C10\\u0C12-\\u0C28\\u0C2A-\\u0C33\\u0C35-\\u0C39\\u0C3D\\u0C58\\u0C59\\u0C60\\u0C61\\u0C85-\\u0C8C\\u0C8E-\\u0C90\\u0C92-\\u0CA8" + "\\u0CAA-\\u0CB3\\u0CB5-\\u0CB9\\u0CBD\\u0CDE\\u0CE0\\u0CE1\\u0D05-\\u0D0C\\u0D0E-\\u0D10\\u0D12-\\u0D28\\u0D2A-\\u0D39\\u0D3D" + "\\u0D60\\u0D61\\u0D7A-\\u0D7F\\u0D85-\\u0D96\\u0D9A-\\u0DB1\\u0DB3-\\u0DBB\\u0DBD\\u0DC0-\\u0DC6\\u0E01-\\u0E30\\u0E32\\u0E33" + "\\u0E40-\\u0E46\\u0E81\\u0E82\\u0E84\\u0E87\\u0E88\\u0E8A\\u0E8D\\u0E94-\\u0E97\\u0E99-\\u0E9F\\u0EA1-\\u0EA3\\u0EA5" + "\\u0EA7\\u0EAA\\u0EAB\\u0EAD-\\u0EB0\\u0EB2\\u0EB3\\u0EBD\\u0EC0-\\u0EC4\\u0EC6\\u0EDC\\u0EDD\\u0F00\\u0F40-\\u0F47" + "\\u0F49-\\u0F6C\\u0F88-\\u0F8B\\u1000-\\u102A\\u103F\\u1050-\\u1055\\u105A-\\u105D\\u1061\\u1065\\u1066" + "\\u106E-\\u1070\\u1075-\\u1081\\u108E\\u10A0-\\u10C5\\u10D0-\\u10FA\\u10FC\\u1100-\\u1248\\u124A-\\u124D\\u1250-\\u1256" + "\\u1258\\u125A-\\u125D\\u1260-\\u1288\\u128A-\\u128D\\u1290-\\u12B0\\u12B2-\\u12B5\\u12B8-\\u12BE\\u12C0\\u12C2-\\u12C5" + "\\u12C8-\\u12D6\\u12D8-\\u1310\\u1312-\\u1315\\u1318-\\u135A\\u1380-\\u138F\\u13A0-\\u13F4\\u1401-\\u166C\\u166F-\\u167F" + "\\u1681-\\u169A\\u16A0-\\u16EA\\u1700-\\u170C\\u170E-\\u1711\\u1720-\\u1731\\u1740-\\u1751\\u1760-\\u176C\\u176E-\\u1770" + "\\u1780-\\u17B3\\u17D7\\u17DC\\u1820-\\u1877\\u1880-\\u18A8\\u18AA\\u18B0-\\u18F5\\u1900-\\u191C\\u1950-\\u196D" + "\\u1970-\\u1974\\u1980-\\u19AB\\u19C1-\\u19C7\\u1A00-\\u1A16\\u1A20-\\u1A54\\u1AA7\\u1B05-\\u1B33\\u1B45-\\u1B4B\\u1B83-\\u1BA0" + "\\u1BAE\\u1BAF\\u1C00-\\u1C23\\u1C4D-\\u1C4F\\u1C5A-\\u1C7D\\u1CE9-\\u1CEC\\u1CEE-\\u1CF1\\u1D00-\\u1DBF\\u1E00-\\u1F15" + "\\u1F18-\\u1F1D\\u1F20-\\u1F45\\u1F48-\\u1F4D\\u1F50-\\u1F57\\u1F59\\u1F5B\\u1F5D\\u1F5F-\\u1F7D\\u1F80-\\u1FB4\\u1FB6-\\u1FBC" + "\\u1FBE\\u1FC2-\\u1FC4\\u1FC6-\\u1FCC\\u1FD0-\\u1FD3\\u1FD6-\\u1FDB\\u1FE0-\\u1FEC\\u1FF2-\\u1FF4\\u1FF6-\\u1FFC\\u2071\\u207F" + "\\u2090-\\u2094\\u2102\\u2107\\u210A-\\u2113\\u2115\\u2119-\\u211D\\u2124\\u2126\\u2128\\u212A-\\u212D\\u212F-\\u2139\\u213C-\\u213F" + "\\u2145-\\u2149\\u214E\\u2183\\u2184\\u2C00-\\u2C2E\\u2C30-\\u2C5E\\u2C60-\\u2CE4\\u2CEB-\\u2CEE\\u2D00-\\u2D25\\u2D30-\\u2D65\\u2D6F" + "\\u2D80-\\u2D96\\u2DA0-\\u2DA6\\u2DA8-\\u2DAE\\u2DB0-\\u2DB6\\u2DB8-\\u2DBE\\u2DC0-\\u2DC6\\u2DC8-\\u2DCE\\u2DD0-\\u2DD6\\u2DD8-\\u2DDE" + "\\u2E2F\\u3005\\u3006\\u3031-\\u3035\\u303B\\u303C\\u3041-\\u3096\\u309D-\\u309F\\u30A1-\\u30FA\\u30FC-\\u30FF\\u3105-\\u312D\\u3131-\\u318E\\u31A0-\\u31B7" + "\\u31F0-\\u31FF\\u3400-\\u4DB5\\u4E00-\\u9FCB\\uA000-\\uA48C\\uA4D0-\\uA4FD\\uA500-\\uA60C\\uA610-\\uA61F\\uA62A\\uA62B\\uA640-\\uA65F\\uA662-\\uA66E\\uA67F-\\uA697" + "\\uA6A0-\\uA6E5\\uA717-\\uA71F\\uA722-\\uA788\\uA78B\\uA78C\\uA7FB-\\uA801\\uA803-\\uA805\\uA807-\\uA80A\\uA80C-\\uA822\\uA840-\\uA873\\uA882-\\uA8B3\\uA8F2-\\uA8F7" + "\\uA8FB\\uA90A-\\uA925\\uA930-\\uA946\\uA960-\\uA97C\\uA984-\\uA9B2\\uA9CF\\uAA00-\\uAA28\\uAA40-\\uAA42\\uAA44-\\uAA4B\\uAA60-\\uAA76\\uAA7A\\uAA80-\\uAAAF\\uAAB1" + "\\uAAB5\\uAAB6\\uAAB9-\\uAABD\\uAAC0\\uAAC2\\uAADB-\\uAADD\\uABC0-\\uABE2\\uAC00-\\uD7A3\\uD7B0-\\uD7C6\\uD7CB-\\uD7FB\\uF900-\\uFA2D\\uFA30-\\uFA6D\\uFA70-\\uFAD9" + "\\uFB00-\\uFB06\\uFB13-\\uFB17\\uFB1D\\uFB1F-\\uFB28\\uFB2A-\\uFB36\\uFB38-\\uFB3C\\uFB3E\\uFB40\\uFB41\\uFB43\\uFB44\\uFB46-\\uFBB1\\uFBD3-\\uFD3D\\uFD50-\\uFD8F" + "\\uFD92-\\uFDC7\\uFDF0-\\uFDFB\\uFE70-\\uFE74\\uFE76-\\uFEFC\\uFF21-\\uFF3A\\uFF41-\\uFF5A\\uFF66-\\uFFBE\\uFFC2-\\uFFC7\\uFFCA-\\uFFCF" + "\\uFFD2-\\uFFD7\\uFFDA-\\uFFDC";

var w = "" + symbols + "0-9_";
var entityMap = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  "\"": "&quot;",
  "'": "&#39;"
};

var escapeHTMLRgxp = /[<>"'\/]|&(?!#|[a-z]+;)/g,
    escapeAttrRgxp = new RegExp("([$" + w + "]\\s*=\\s*)([^\"'\\s>=]+)", "g"),
    escapeJavaScript = /(javascript)(:|;)/,
    escapeHTML = function (s) {
  return entityMap[s] || s;
};

/**
 * Экранирование HTML сущностей
 *
 * @param {?} str - исходная строка
 * @param {?boolean=} opt_attr - если true, то дополнительное экранируются html атрибуты
 * @param {?boolean=} opt_escapedAttr - если true, то атрибут считается принудительно экранированным
 * @return {string}
 */
Snakeskin.Filters.html = function (str, opt_attr, opt_escapedAttr) {
  var res = String(str);

  if (opt_attr && opt_escapedAttr) {
    res = res.replace(escapeAttrRgxp, "$1\"$2\"");
  }

  res = res.replace(escapeHTMLRgxp, escapeHTML);

  if (opt_attr) {
    res = res.replace(escapeJavaScript, "$1&#31;$2");
  }

  return res;
};

/**
 * Замена undefined на ''
 *
 * @param {?} str - исходная строка
 * @return {?}
 */
Snakeskin.Filters.undef = function (str) {
  return str !== void 0 ? str : "";
};

local(function () {
  var uentityMap = {
    "&amp;": "&",
    "&lt;": "<",
    "&gt;": ">",
    "&quot;": "\"",
    "&#39;": "'",
    "&#x2F;": "/"
  };

  var uescapeHTMLRgxp = /&amp;|&lt;|&gt;|&quot;|&#39;|&#x2F;/g,
      uescapeHTML = function (s) {
    return uentityMap[s];
  };

  /**
   * Снятие экранирования HTML сущностей
   *
   * @param {?} str - исходная строка
   * @return {string}
   */
  Snakeskin.Filters["uhtml"] = function (str) {
    return String(str).replace(uescapeHTMLRgxp, uescapeHTML);
  };

  var stripTagsRgxp = /<\/?[^>]+>/g;

  /**
   * Удаление HTML тегов
   *
   * @param {?} str - исходная строка
   * @return {string}
   */
  Snakeskin.Filters["stripTags"] = function (str) {
    return String(str).replace(stripTagsRgxp, "");
  };

  var uriO = /%5B/g,
      uriC = /%5D/g;

  /**
   * Кодирование URL
   *
   * @see https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/encodeURI
   * @param {?} str - исходная строка
   * @return {string}
   */
  Snakeskin.Filters["uri"] = function (str) {
    return encodeURI(String(str)).replace(uriO, "[").replace(uriC, "]");
  };

  /**
   * Перевод строки в верхний регистр
   *
   * @param {?} str - исходная строка
   * @return {string}
   */
  Snakeskin.Filters["upper"] = function (str) {
    return String(str).toUpperCase();
  };

  /**
   * Перевод первой буквы строки в верхний регистр
   *
   * @param {?} str - исходная строка
   * @return {string}
   */
  Snakeskin.Filters["ucfirst"] = function (str) {
    str = String(str);
    return str.charAt(0).toUpperCase() + str.substring(1);
  };

  /**
   * Перевод строки в нижний регистр
   *
   * @param {?} str - исходная строка
   * @return {string}
   */
  Snakeskin.Filters["lower"] = function (str) {
    return String(str).toLowerCase();
  };

  /**
   * Перевод первой буквы строки в нижний регистр
   *
   * @param {?} str - исходная строка
   * @return {string}
   */
  Snakeskin.Filters["lcfirst"] = function (str) {
    str = String(str);
    return str.charAt(0).toLowerCase() + str.substring(1);
  };

  /**
   * Срез крайних пробелов строки
   *
   * @param {?} str - исходная строка
   * @return {string}
   */
  Snakeskin.Filters["trim"] = function (str) {
    return String(str).trim();
  };

  var spaceCollapseRgxp = /\s{2,}/g;

  /**
   * Срез крайних пробелов строки
   * и свёртывание остальных пробелов в один
   *
   * @param {?} str - исходная строка
   * @return {string}
   */
  Snakeskin.Filters["collapse"] = function (str) {
    return String(str).replace(spaceCollapseRgxp, " ").trim();
  };

  /**
   * Обрезание строки до заданной длины
   * (в конце, если нужно, ставится многоточие)
   *
   * @param {?} str - исходная строка
   * @param {number} length - максимальная длина текста
   * @param {?boolean=} opt_wordOnly - если false, то текст обрезается без учёта целостности слов
   * @param {?boolean=} opt_html - если true, то символ многоточия вставляется как HTML-мнемоник
   * @return {string}
   */
  Snakeskin.Filters["truncate"] = function (str, length, opt_wordOnly, opt_html) {
    str = String(str);
    if (!str || str.length <= length) {
      return str;
    }

    var tmp = str.substring(0, length - 1),
        lastInd = void 0;

    var i = tmp.length;
    while (i-- && opt_wordOnly) {
      if (tmp.charAt(i) === " ") {
        lastInd = i;
      } else if (lastInd !== void 0) {
        break;
      }
    }

    return (lastInd !== void 0 ? tmp.substring(0, lastInd) : tmp) + (opt_html ? "&#8230;" : "…");
  };

  /**
   * Генерация строки из повторений исходной подстроки
   *
   * @param {?} str - исходная строка
   * @param {?number=} opt_num - число повторений
   * @return {string}
   */
  Snakeskin.Filters["repeat"] = function (str, opt_num) {
    return new Array(opt_num != null ? opt_num + 1 : 3).join(str);
  };

  /**
   * Удаление подстроки из строки
   *
   * @param {?} str - исходная строка
   * @param {(string|RegExp)} search - искомая подстрока
   * @return {string}
   */
  Snakeskin.Filters["remove"] = function (str, search) {
    return String(str).replace(search, "");
  };

  /**
   * Замена подстроки в строке
   *
   * @param {?} str - исходная строка
   * @param {(string|!RegExp)} search - искомая подстрока
   * @param {string} replace - строка для замены
   * @return {string}
   */
  Snakeskin.Filters["replace"] = function (str, search, replace) {
    return String(str).replace(search, replace);
  };

  /**
   * Преобразование объекта в JSON
   *
   * @param {(Object|Array|string|number|boolean)} obj - исходный объект
   * @return {string}
   */
  Snakeskin.Filters["json"] = function (obj) {
    return JSON.stringify(obj);
  };

  /**
   * Преобразование объекта в строку
   *
   * @param {(Object|Array|string|number|boolean)} obj - исходный объект
   * @return {string}
   */
  Snakeskin.Filters["string"] = function (obj) {
    if (typeof obj === "object" && obj instanceof String === false) {
      return JSON.stringify(obj);
    }

    return String(obj);
  };

  /**
   * Преобразование JSON в объект
   *
   * @param {?} val - исходное значение
   * @return {?}
   */
  Snakeskin.Filters["parse"] = function (val) {
    if (typeof val !== "string") {
      return val;
    }

    return JSON.parse(val);
  };

  /**
   * Декларация BEM части
   *
   * @param {?} block - название блока
   * @param {?} part - вторая часть декларации
   * @param {(Element|undefined)} node - ссылка на активный узел
   * @return {string}
   */
  Snakeskin.Filters["bem"] = function (block, part, node) {
    return String(block) + String(part);
  };

  /**
   * Задача значения по умолчанию для объекта
   *
   * @param {?} val - исходное значение
   * @param {?} def - значение по умолчанию
   * @return {?}
   */
  Snakeskin.Filters["default"] = function (val, def) {
    return val === void 0 ? def : val;
  };
});

/*!
 * Методы live библиотеки Snakeskin
 */

if (/\[native code]/.test(Object.keys && Object.keys.toString())) {
  var keys = Object.keys;
}

/**
 * Декларировать локальный модуль
 * @param {function()} fn
 */
function local(fn) {
  fn();
}

/**
 * Итератор объекта
 *
 * @param {(Object|undefined)} obj - исходный объект
 * @param {function(?, string, !Object)} callback - функция обратного вызова
 */
function forIn(obj, callback) {
  if (!obj) {
    return;
  }

  if (keys) {
    var arr = keys(obj),
        length = arr.length;

    for (var i = -1; ++i < length;) {
      if (callback(obj[arr[i]], arr[i], obj) === false) {
        break;
      }
    }
  } else {
    for (var key in obj) {
      if (!obj.hasOwnProperty(key)) {
        continue;
      }

      if (callback(obj[key], key, obj) === false) {
        break;
      }
    }
  }
}

/**
 * Конструктор объекта StringBuffer
 *
 * @constructor
 * @return {!Array}
 */
Snakeskin.StringBuffer = function () {
  return [];
};

/**
 * Итератор массива или объекта (с проверкой hasOwnProperty)
 *
 * @param {(Array|Object|undefined)} obj - исходный объект
 * @param {(function(?, number, !Array, boolean, boolean, number)|function(?, string, !Object, number, boolean, boolean, number))} callback - функция обратного вызова
 */
Snakeskin.forEach = function (obj, callback) {
  if (!obj) {
    return;
  }

  var length = 0;

  if (Array.isArray(obj)) {
    length = obj.length;
    for (var i = -1; ++i < length;) {
      if (callback(obj[i], i, obj, i === 0, i === length - 1, length) === false) {
        break;
      }
    }
  } else if (keys) {
    var arr = keys(obj);
    length = arr.length;

    for (var i = -1; ++i < length;) {
      if (callback(obj[arr[i]], arr[i], obj, i, i === 0, i === length - 1, length) === false) {
        break;
      }
    }
  } else {
    var i = 0;

    if (callback.length >= 6) {
      for (var key in obj) {
        if (!obj.hasOwnProperty(key)) {
          continue;
        }

        length++;
      }
    }

    for (var key in obj) {
      if (!obj.hasOwnProperty(key)) {
        continue;
      }

      if (callback(obj[key], key, obj, i, i === 0, i === length - 1, length) === false) {
        break;
      }

      i++;
    }
  }
};

/**
 * Итератор объекта без проверки hasOwnProperty
 *
 * @param {(Object|undefined)} obj - исходный объект
 * @param {function(?, string, !Object, number, boolean, boolean, number)} callback - функция обратного вызова
 */
Snakeskin.forIn = function (obj, callback) {
  if (!obj) {
    return;
  }

  var length = 0,
      i = 0;

  if (callback.length >= 6) {
    for (var key in obj) {
      length++;
    }
  }

  for (var key in obj) {
    if (callback(obj[key], key, obj, i, i === 0, i === length - 1, length) === false) {
      break;
    }

    i++;
  }
};

var inlineTagMap = {
  "img": true,
  "link": true,
  "embed": true,
  "br": true,
  "hr": true,
  "wbr": true,
  "meta": true,
  "input": true,
  "source": true,
  "track": true,
  "base": true,
  "area": true,
  "col": true,
  "param": true
};

/**
 * Вставить заданный узел или текст в исходный
 *
 * @param {!Node} node - исходный элемент
 * @param {(!Node|string)} obj - элемент для вставки или текст
 * @return {(!Node|string)}
 */
Snakeskin.appendChild = function (node, obj) {
  if (node["tagName"] && inlineTagMap[node["tagName"].toLowerCase()]) {
    return String(obj).trim();
  }

  if (typeof obj === "string") {
    obj = document.createTextNode(obj);
  }

  node.appendChild(obj);
  return obj;
};



global["define"] = globalDefine;
if (typeof define === "function" && (define.amd || define["amd"])) {
  define([], function () {
    return Snakeskin;
  });
} else if (IS_NODE) {
  module.exports = exports = Snakeskin;
} else {
  global.Snakeskin = Snakeskin;
}
}).call(new Function('return this')(), this);
