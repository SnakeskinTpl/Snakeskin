/*!
 * Snakeskin v6.5.17
 * https://github.com/kobezzza/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/kobezzza/Snakeskin/blob/master/LICENSE
 *
 * Date: Wed, 07 Jan 2015 10:07:27 GMT
 */

(function (root) {
"use strict";

var _defineProperty = function (obj, key, value) {
  return Object.defineProperty(obj, key, {
    value: value,
    enumerable: true,
    configurable: true,
    writable: true
  });
};

var global = this;
/*!
 * Полифилы, необходимые для работы live библиотеки
 * в старых браузерах
 */

Array.isArray = Array.isArray || function (obj) {
  return ({}).toString.call(obj) === "[object Array]";
};

String.prototype.trim = String.prototype.trim || function () {
  var str = this.replace(/^\s\s*/, ""), i = str.length;

  for (var rgxp = /\s/; rgxp.test(str.charAt(--i));) {}
  return str.substring(0, i + 1);
};

/** @type {!Object} */
var Snakeskin = {
  /**
   * Версия Snakeskin
   * @type {!Array}
   */
  VERSION: [6, 5, 17],

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

var IS_NODE = false;

try {
  IS_NODE = "object" === typeof process && Object.prototype.toString.call(process) === "[object process]";
} catch (ignore) {}

var JSON_SUPPORT = Boolean(typeof JSON !== "undefined" && JSON.parse && JSON.stringify);

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
 * Методы live библиотеки Snakeskin
 */

if (/\[native code]/.test(Object.keys && Object.keys.toString())) {
  var keys = Object.keys;
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

  var length = 0, i = 0;

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
    var arr = keys(obj), length = arr.length;

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
      if (!obj[parts[i]]) {
        obj[parts[i]] = {};
      }

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
  //,'/': '&#x2F;'
};

var escapeHTMLRgxp = /[<>"'\/]|&(?!#|[a-z]+;)/g, escapeAttrRgxp = new RegExp("([$" + w + "]\\s*=\\s*)([^\"'\\s>=]+)", "g"), escapeJavaScript = /(javascript)(:|;)/, escapeHTML = function (s) {
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

(function () {
  var uentityMap = {
    "&amp;": "&",
    "&lt;": "<",
    "&gt;": ">",
    "&quot;": "\"",
    "&#39;": "'",
    "&#x2F;": "/"
  };

  var uescapeHTMLRgxp = /&amp;|&lt;|&gt;|&quot;|&#39;|&#x2F;/g, uescapeHTML = function (s) {
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

  var uriO = /%5B/g, uriC = /%5D/g;

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

    var tmp = str.substring(0, length - 1), lastInd = void 0;

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
})();


var globalDefine = global["define"];
global["define"] = void 0;

var beautify, globalBeautify = global.js_beautify;

/* istanbul ignore next */
/*jshint curly:true, eqeqeq:true, laxbreak:true, noempty:false */
/*

  The MIT License (MIT)

  Copyright (c) 2007-2013 Einar Lielmanis and contributors.

  Permission is hereby granted, free of charge, to any person
  obtaining a copy of this software and associated documentation files
  (the "Software"), to deal in the Software without restriction,
  including without limitation the rights to use, copy, modify, merge,
  publish, distribute, sublicense, and/or sell copies of the Software,
  and to permit persons to whom the Software is furnished to do so,
  subject to the following conditions:

  The above copyright notice and this permission notice shall be
  included in all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
  EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
  MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
  NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
  BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
  ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
  CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  SOFTWARE.

 JS Beautifier
---------------


  Written by Einar Lielmanis, <einar@jsbeautifier.org>
      http://jsbeautifier.org/

  Originally converted to javascript by Vital, <vital76@gmail.com>
  "End braces on own line" added by Chris J. Shull, <chrisjshull@gmail.com>
  Parsing improvements for brace-less statements by Liam Newman <bitwiseman@gmail.com>


  Usage:
    js_beautify(js_source_text);
    js_beautify(js_source_text, options);

  The options are:
    indent_size (default 4)          - indentation size,
    indent_char (default space)      - character to indent with,
    preserve_newlines (default true) - whether existing line breaks should be preserved,
    max_preserve_newlines (default unlimited) - maximum number of line breaks to be preserved in one chunk,

    jslint_happy (default false) - if true, then jslint-stricter mode is enforced.

            jslint_happy        !jslint_happy
            ---------------------------------
            function ()         function()

            switch () {         switch() {
            case 1:               case 1:
              break;                break;
            }                   }

    space_after_anon_function (default false) - should the space before an anonymous function's parens be added, "function()" vs "function ()",
          NOTE: This option is overriden by jslint_happy (i.e. if jslint_happy is true, space_after_anon_function is true by design)

    brace_style (default "collapse") - "collapse" | "expand" | "end-expand"
            put braces on the same line as control statements (default), or put braces on own line (Allman / ANSI style), or just put end braces on own line.

    space_before_conditional (default true) - should the space before conditional statement be added, "if(true)" vs "if (true)",

    unescape_strings (default false) - should printable characters in strings encoded in \xNN notation be unescaped, "example" vs "\x65\x78\x61\x6d\x70\x6c\x65"

    wrap_line_length (default unlimited) - lines should wrap at next opportunity after this number of characters.
          NOTE: This is not a hard limit. Lines will continue until a point where a newline would
                be preserved if it were present.

    end_with_newline (default false)  - end output with a newline


    e.g

    js_beautify(js_source_text, {
      'indent_size': 1,
      'indent_char': '\t'
    });

*/

(function() {

    var acorn = {};
    (function (exports) {
      // This section of code is taken from acorn.
      //
      // Acorn was written by Marijn Haverbeke and released under an MIT
      // license. The Unicode regexps (for identifiers and whitespace) were
      // taken from [Esprima](http://esprima.org) by Ariya Hidayat.
      //
      // Git repositories for Acorn are available at
      //
      //     http://marijnhaverbeke.nl/git/acorn
      //     https://github.com/marijnh/acorn.git

      // ## Character categories

      // Big ugly regular expressions that match characters in the
      // whitespace, identifier, and identifier-start categories. These
      // are only applied when a character is found to actually have a
      // code point above 128.

      var nonASCIIwhitespace = /[\u1680\u180e\u2000-\u200a\u202f\u205f\u3000\ufeff]/;
      var nonASCIIidentifierStartChars = "\xaa\xb5\xba\xc0-\xd6\xd8-\xf6\xf8-\u02c1\u02c6-\u02d1\u02e0-\u02e4\u02ec\u02ee\u0370-\u0374\u0376\u0377\u037a-\u037d\u0386\u0388-\u038a\u038c\u038e-\u03a1\u03a3-\u03f5\u03f7-\u0481\u048a-\u0527\u0531-\u0556\u0559\u0561-\u0587\u05d0-\u05ea\u05f0-\u05f2\u0620-\u064a\u066e\u066f\u0671-\u06d3\u06d5\u06e5\u06e6\u06ee\u06ef\u06fa-\u06fc\u06ff\u0710\u0712-\u072f\u074d-\u07a5\u07b1\u07ca-\u07ea\u07f4\u07f5\u07fa\u0800-\u0815\u081a\u0824\u0828\u0840-\u0858\u08a0\u08a2-\u08ac\u0904-\u0939\u093d\u0950\u0958-\u0961\u0971-\u0977\u0979-\u097f\u0985-\u098c\u098f\u0990\u0993-\u09a8\u09aa-\u09b0\u09b2\u09b6-\u09b9\u09bd\u09ce\u09dc\u09dd\u09df-\u09e1\u09f0\u09f1\u0a05-\u0a0a\u0a0f\u0a10\u0a13-\u0a28\u0a2a-\u0a30\u0a32\u0a33\u0a35\u0a36\u0a38\u0a39\u0a59-\u0a5c\u0a5e\u0a72-\u0a74\u0a85-\u0a8d\u0a8f-\u0a91\u0a93-\u0aa8\u0aaa-\u0ab0\u0ab2\u0ab3\u0ab5-\u0ab9\u0abd\u0ad0\u0ae0\u0ae1\u0b05-\u0b0c\u0b0f\u0b10\u0b13-\u0b28\u0b2a-\u0b30\u0b32\u0b33\u0b35-\u0b39\u0b3d\u0b5c\u0b5d\u0b5f-\u0b61\u0b71\u0b83\u0b85-\u0b8a\u0b8e-\u0b90\u0b92-\u0b95\u0b99\u0b9a\u0b9c\u0b9e\u0b9f\u0ba3\u0ba4\u0ba8-\u0baa\u0bae-\u0bb9\u0bd0\u0c05-\u0c0c\u0c0e-\u0c10\u0c12-\u0c28\u0c2a-\u0c33\u0c35-\u0c39\u0c3d\u0c58\u0c59\u0c60\u0c61\u0c85-\u0c8c\u0c8e-\u0c90\u0c92-\u0ca8\u0caa-\u0cb3\u0cb5-\u0cb9\u0cbd\u0cde\u0ce0\u0ce1\u0cf1\u0cf2\u0d05-\u0d0c\u0d0e-\u0d10\u0d12-\u0d3a\u0d3d\u0d4e\u0d60\u0d61\u0d7a-\u0d7f\u0d85-\u0d96\u0d9a-\u0db1\u0db3-\u0dbb\u0dbd\u0dc0-\u0dc6\u0e01-\u0e30\u0e32\u0e33\u0e40-\u0e46\u0e81\u0e82\u0e84\u0e87\u0e88\u0e8a\u0e8d\u0e94-\u0e97\u0e99-\u0e9f\u0ea1-\u0ea3\u0ea5\u0ea7\u0eaa\u0eab\u0ead-\u0eb0\u0eb2\u0eb3\u0ebd\u0ec0-\u0ec4\u0ec6\u0edc-\u0edf\u0f00\u0f40-\u0f47\u0f49-\u0f6c\u0f88-\u0f8c\u1000-\u102a\u103f\u1050-\u1055\u105a-\u105d\u1061\u1065\u1066\u106e-\u1070\u1075-\u1081\u108e\u10a0-\u10c5\u10c7\u10cd\u10d0-\u10fa\u10fc-\u1248\u124a-\u124d\u1250-\u1256\u1258\u125a-\u125d\u1260-\u1288\u128a-\u128d\u1290-\u12b0\u12b2-\u12b5\u12b8-\u12be\u12c0\u12c2-\u12c5\u12c8-\u12d6\u12d8-\u1310\u1312-\u1315\u1318-\u135a\u1380-\u138f\u13a0-\u13f4\u1401-\u166c\u166f-\u167f\u1681-\u169a\u16a0-\u16ea\u16ee-\u16f0\u1700-\u170c\u170e-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176c\u176e-\u1770\u1780-\u17b3\u17d7\u17dc\u1820-\u1877\u1880-\u18a8\u18aa\u18b0-\u18f5\u1900-\u191c\u1950-\u196d\u1970-\u1974\u1980-\u19ab\u19c1-\u19c7\u1a00-\u1a16\u1a20-\u1a54\u1aa7\u1b05-\u1b33\u1b45-\u1b4b\u1b83-\u1ba0\u1bae\u1baf\u1bba-\u1be5\u1c00-\u1c23\u1c4d-\u1c4f\u1c5a-\u1c7d\u1ce9-\u1cec\u1cee-\u1cf1\u1cf5\u1cf6\u1d00-\u1dbf\u1e00-\u1f15\u1f18-\u1f1d\u1f20-\u1f45\u1f48-\u1f4d\u1f50-\u1f57\u1f59\u1f5b\u1f5d\u1f5f-\u1f7d\u1f80-\u1fb4\u1fb6-\u1fbc\u1fbe\u1fc2-\u1fc4\u1fc6-\u1fcc\u1fd0-\u1fd3\u1fd6-\u1fdb\u1fe0-\u1fec\u1ff2-\u1ff4\u1ff6-\u1ffc\u2071\u207f\u2090-\u209c\u2102\u2107\u210a-\u2113\u2115\u2119-\u211d\u2124\u2126\u2128\u212a-\u212d\u212f-\u2139\u213c-\u213f\u2145-\u2149\u214e\u2160-\u2188\u2c00-\u2c2e\u2c30-\u2c5e\u2c60-\u2ce4\u2ceb-\u2cee\u2cf2\u2cf3\u2d00-\u2d25\u2d27\u2d2d\u2d30-\u2d67\u2d6f\u2d80-\u2d96\u2da0-\u2da6\u2da8-\u2dae\u2db0-\u2db6\u2db8-\u2dbe\u2dc0-\u2dc6\u2dc8-\u2dce\u2dd0-\u2dd6\u2dd8-\u2dde\u2e2f\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303c\u3041-\u3096\u309d-\u309f\u30a1-\u30fa\u30fc-\u30ff\u3105-\u312d\u3131-\u318e\u31a0-\u31ba\u31f0-\u31ff\u3400-\u4db5\u4e00-\u9fcc\ua000-\ua48c\ua4d0-\ua4fd\ua500-\ua60c\ua610-\ua61f\ua62a\ua62b\ua640-\ua66e\ua67f-\ua697\ua6a0-\ua6ef\ua717-\ua71f\ua722-\ua788\ua78b-\ua78e\ua790-\ua793\ua7a0-\ua7aa\ua7f8-\ua801\ua803-\ua805\ua807-\ua80a\ua80c-\ua822\ua840-\ua873\ua882-\ua8b3\ua8f2-\ua8f7\ua8fb\ua90a-\ua925\ua930-\ua946\ua960-\ua97c\ua984-\ua9b2\ua9cf\uaa00-\uaa28\uaa40-\uaa42\uaa44-\uaa4b\uaa60-\uaa76\uaa7a\uaa80-\uaaaf\uaab1\uaab5\uaab6\uaab9-\uaabd\uaac0\uaac2\uaadb-\uaadd\uaae0-\uaaea\uaaf2-\uaaf4\uab01-\uab06\uab09-\uab0e\uab11-\uab16\uab20-\uab26\uab28-\uab2e\uabc0-\uabe2\uac00-\ud7a3\ud7b0-\ud7c6\ud7cb-\ud7fb\uf900-\ufa6d\ufa70-\ufad9\ufb00-\ufb06\ufb13-\ufb17\ufb1d\ufb1f-\ufb28\ufb2a-\ufb36\ufb38-\ufb3c\ufb3e\ufb40\ufb41\ufb43\ufb44\ufb46-\ufbb1\ufbd3-\ufd3d\ufd50-\ufd8f\ufd92-\ufdc7\ufdf0-\ufdfb\ufe70-\ufe74\ufe76-\ufefc\uff21-\uff3a\uff41-\uff5a\uff66-\uffbe\uffc2-\uffc7\uffca-\uffcf\uffd2-\uffd7\uffda-\uffdc";
      var nonASCIIidentifierChars = "\u0300-\u036f\u0483-\u0487\u0591-\u05bd\u05bf\u05c1\u05c2\u05c4\u05c5\u05c7\u0610-\u061a\u0620-\u0649\u0672-\u06d3\u06e7-\u06e8\u06fb-\u06fc\u0730-\u074a\u0800-\u0814\u081b-\u0823\u0825-\u0827\u0829-\u082d\u0840-\u0857\u08e4-\u08fe\u0900-\u0903\u093a-\u093c\u093e-\u094f\u0951-\u0957\u0962-\u0963\u0966-\u096f\u0981-\u0983\u09bc\u09be-\u09c4\u09c7\u09c8\u09d7\u09df-\u09e0\u0a01-\u0a03\u0a3c\u0a3e-\u0a42\u0a47\u0a48\u0a4b-\u0a4d\u0a51\u0a66-\u0a71\u0a75\u0a81-\u0a83\u0abc\u0abe-\u0ac5\u0ac7-\u0ac9\u0acb-\u0acd\u0ae2-\u0ae3\u0ae6-\u0aef\u0b01-\u0b03\u0b3c\u0b3e-\u0b44\u0b47\u0b48\u0b4b-\u0b4d\u0b56\u0b57\u0b5f-\u0b60\u0b66-\u0b6f\u0b82\u0bbe-\u0bc2\u0bc6-\u0bc8\u0bca-\u0bcd\u0bd7\u0be6-\u0bef\u0c01-\u0c03\u0c46-\u0c48\u0c4a-\u0c4d\u0c55\u0c56\u0c62-\u0c63\u0c66-\u0c6f\u0c82\u0c83\u0cbc\u0cbe-\u0cc4\u0cc6-\u0cc8\u0cca-\u0ccd\u0cd5\u0cd6\u0ce2-\u0ce3\u0ce6-\u0cef\u0d02\u0d03\u0d46-\u0d48\u0d57\u0d62-\u0d63\u0d66-\u0d6f\u0d82\u0d83\u0dca\u0dcf-\u0dd4\u0dd6\u0dd8-\u0ddf\u0df2\u0df3\u0e34-\u0e3a\u0e40-\u0e45\u0e50-\u0e59\u0eb4-\u0eb9\u0ec8-\u0ecd\u0ed0-\u0ed9\u0f18\u0f19\u0f20-\u0f29\u0f35\u0f37\u0f39\u0f41-\u0f47\u0f71-\u0f84\u0f86-\u0f87\u0f8d-\u0f97\u0f99-\u0fbc\u0fc6\u1000-\u1029\u1040-\u1049\u1067-\u106d\u1071-\u1074\u1082-\u108d\u108f-\u109d\u135d-\u135f\u170e-\u1710\u1720-\u1730\u1740-\u1750\u1772\u1773\u1780-\u17b2\u17dd\u17e0-\u17e9\u180b-\u180d\u1810-\u1819\u1920-\u192b\u1930-\u193b\u1951-\u196d\u19b0-\u19c0\u19c8-\u19c9\u19d0-\u19d9\u1a00-\u1a15\u1a20-\u1a53\u1a60-\u1a7c\u1a7f-\u1a89\u1a90-\u1a99\u1b46-\u1b4b\u1b50-\u1b59\u1b6b-\u1b73\u1bb0-\u1bb9\u1be6-\u1bf3\u1c00-\u1c22\u1c40-\u1c49\u1c5b-\u1c7d\u1cd0-\u1cd2\u1d00-\u1dbe\u1e01-\u1f15\u200c\u200d\u203f\u2040\u2054\u20d0-\u20dc\u20e1\u20e5-\u20f0\u2d81-\u2d96\u2de0-\u2dff\u3021-\u3028\u3099\u309a\ua640-\ua66d\ua674-\ua67d\ua69f\ua6f0-\ua6f1\ua7f8-\ua800\ua806\ua80b\ua823-\ua827\ua880-\ua881\ua8b4-\ua8c4\ua8d0-\ua8d9\ua8f3-\ua8f7\ua900-\ua909\ua926-\ua92d\ua930-\ua945\ua980-\ua983\ua9b3-\ua9c0\uaa00-\uaa27\uaa40-\uaa41\uaa4c-\uaa4d\uaa50-\uaa59\uaa7b\uaae0-\uaae9\uaaf2-\uaaf3\uabc0-\uabe1\uabec\uabed\uabf0-\uabf9\ufb20-\ufb28\ufe00-\ufe0f\ufe20-\ufe26\ufe33\ufe34\ufe4d-\ufe4f\uff10-\uff19\uff3f";
      var nonASCIIidentifierStart = new RegExp("[" + nonASCIIidentifierStartChars + "]");
      var nonASCIIidentifier = new RegExp("[" + nonASCIIidentifierStartChars + nonASCIIidentifierChars + "]");

      // Whether a single character denotes a newline.

      var newline = exports.newline = /[\n\r\u2028\u2029]/;

      // Matches a whole line break (where CRLF is considered a single
      // line break). Used to count lines.

      var lineBreak = /\r\n|[\n\r\u2028\u2029]/g;

      // Test whether a given character code starts an identifier.

      var isIdentifierStart = exports.isIdentifierStart = function(code) {
        if (code < 65) return code === 36;
        if (code < 91) return true;
        if (code < 97) return code === 95;
        if (code < 123)return true;
        return code >= 0xaa && nonASCIIidentifierStart.test(String.fromCharCode(code));
      };

      // Test whether a given character is part of an identifier.

      var isIdentifierChar = exports.isIdentifierChar = function(code) {
        if (code < 48) return code === 36;
        if (code < 58) return true;
        if (code < 65) return false;
        if (code < 91) return true;
        if (code < 97) return code === 95;
        if (code < 123)return true;
        return code >= 0xaa && nonASCIIidentifier.test(String.fromCharCode(code));
      };
    })(acorn);

    function in_array(what, arr) {
        for (var i = 0; i < arr.length; i += 1) {
            if (arr[i] === what) {
                return true;
            }
        }
        return false;
    }

    function trim(s) {
        return s.replace(/^\s+|\s+$/g, '');
    }

    function js_beautify(js_source_text, options) {
        "use strict";
        var beautifier = new Beautifier(js_source_text, options);
        return beautifier.beautify();
    }

    var MODE = {
            BlockStatement: 'BlockStatement', // 'BLOCK'
            Statement: 'Statement', // 'STATEMENT'
            ObjectLiteral: 'ObjectLiteral', // 'OBJECT',
            ArrayLiteral: 'ArrayLiteral', //'[EXPRESSION]',
            ForInitializer: 'ForInitializer', //'(FOR-EXPRESSION)',
            Conditional: 'Conditional', //'(COND-EXPRESSION)',
            Expression: 'Expression' //'(EXPRESSION)'
        };

    function Beautifier(js_source_text, options) {
        "use strict";
        var output
        var tokens = [], token_pos;
        var Tokenizer;
        var current_token;
        var last_type, last_last_text, indent_string;
        var flags, previous_flags, flag_store;
        var prefix;

        var handlers, opt;
        var baseIndentString = '';

        handlers = {
            'TK_START_EXPR': handle_start_expr,
            'TK_END_EXPR': handle_end_expr,
            'TK_START_BLOCK': handle_start_block,
            'TK_END_BLOCK': handle_end_block,
            'TK_WORD': handle_word,
            'TK_RESERVED': handle_word,
            'TK_SEMICOLON': handle_semicolon,
            'TK_STRING': handle_string,
            'TK_EQUALS': handle_equals,
            'TK_OPERATOR': handle_operator,
            'TK_COMMA': handle_comma,
            'TK_BLOCK_COMMENT': handle_block_comment,
            'TK_INLINE_COMMENT': handle_inline_comment,
            'TK_COMMENT': handle_comment,
            'TK_DOT': handle_dot,
            'TK_UNKNOWN': handle_unknown,
            'TK_EOF': handle_eof
        };

        function create_flags(flags_base, mode) {
            var next_indent_level = 0;
            if (flags_base) {
                next_indent_level = flags_base.indentation_level;
                if (!output.just_added_newline() &&
                    flags_base.line_indent_level > next_indent_level) {
                    next_indent_level = flags_base.line_indent_level;
                }
            }

            var next_flags = {
                mode: mode,
                parent: flags_base,
                last_text: flags_base ? flags_base.last_text : '', // last token text
                last_word: flags_base ? flags_base.last_word : '', // last 'TK_WORD' passed
                declaration_statement: false,
                declaration_assignment: false,
                multiline_frame: false,
                if_block: false,
                else_block: false,
                do_block: false,
                do_while: false,
                in_case_statement: false, // switch(..){ INSIDE HERE }
                in_case: false, // we're on the exact line with "case 0:"
                case_body: false, // the indented case-action block
                indentation_level: next_indent_level,
                line_indent_level: flags_base ? flags_base.line_indent_level : next_indent_level,
                start_line_index: output.get_line_number(),
                ternary_depth: 0
            };
            return next_flags;
        }

        // Some interpreters have unexpected results with foo = baz || bar;
        options = options ? options : {};
        opt = {};

        // compatibility
        if (options.braces_on_own_line !== undefined) { //graceful handling of deprecated option
            opt.brace_style = options.braces_on_own_line ? "expand" : "collapse";
        }
        opt.brace_style = options.brace_style ? options.brace_style : (opt.brace_style ? opt.brace_style : "collapse");

        // graceful handling of deprecated option
        if (opt.brace_style === "expand-strict") {
            opt.brace_style = "expand";
        }


        opt.indent_size = options.indent_size ? parseInt(options.indent_size, 10) : 4;
        opt.indent_char = options.indent_char ? options.indent_char : ' ';
        opt.preserve_newlines = (options.preserve_newlines === undefined) ? true : options.preserve_newlines;
        opt.break_chained_methods = (options.break_chained_methods === undefined) ? false : options.break_chained_methods;
        opt.max_preserve_newlines = (options.max_preserve_newlines === undefined) ? 0 : parseInt(options.max_preserve_newlines, 10);
        opt.space_in_paren = (options.space_in_paren === undefined) ? false : options.space_in_paren;
        opt.space_in_empty_paren = (options.space_in_empty_paren === undefined) ? false : options.space_in_empty_paren;
        opt.jslint_happy = (options.jslint_happy === undefined) ? false : options.jslint_happy;
        opt.space_after_anon_function = (options.space_after_anon_function === undefined) ? false : options.space_after_anon_function;
        opt.keep_array_indentation = (options.keep_array_indentation === undefined) ? false : options.keep_array_indentation;
        opt.space_before_conditional = (options.space_before_conditional === undefined) ? true : options.space_before_conditional;
        opt.unescape_strings = (options.unescape_strings === undefined) ? false : options.unescape_strings;
        opt.wrap_line_length = (options.wrap_line_length === undefined) ? 0 : parseInt(options.wrap_line_length, 10);
        opt.e4x = (options.e4x === undefined) ? false : options.e4x;
        opt.end_with_newline = (options.end_with_newline === undefined) ? false : options.end_with_newline;


        // force opt.space_after_anon_function to true if opt.jslint_happy
        if(opt.jslint_happy) {
            opt.space_after_anon_function = true;
        }

        if(options.indent_with_tabs){
            opt.indent_char = '\t';
            opt.indent_size = 1;
        }

        //----------------------------------
        indent_string = '';
        while (opt.indent_size > 0) {
            indent_string += opt.indent_char;
            opt.indent_size -= 1;
        }

        var preindent_index = 0;
        if(js_source_text && js_source_text.length) {
            while ( (js_source_text.charAt(preindent_index) === ' ' ||
                    js_source_text.charAt(preindent_index) === '\t')) {
                baseIndentString += js_source_text.charAt(preindent_index);
                preindent_index += 1;
            }
            js_source_text = js_source_text.substring(preindent_index);
        }

        last_type = 'TK_START_BLOCK'; // last token type
        last_last_text = ''; // pre-last token text
        output = new Output(indent_string, baseIndentString);


        // Stack of parsing/formatting states, including MODE.
        // We tokenize, parse, and output in an almost purely a forward-only stream of token input
        // and formatted output.  This makes the beautifier less accurate than full parsers
        // but also far more tolerant of syntax errors.
        //
        // For example, the default mode is MODE.BlockStatement. If we see a '{' we push a new frame of type
        // MODE.BlockStatement on the the stack, even though it could be object literal.  If we later
        // encounter a ":", we'll switch to to MODE.ObjectLiteral.  If we then see a ";",
        // most full parsers would die, but the beautifier gracefully falls back to
        // MODE.BlockStatement and continues on.
        flag_store = [];
        set_mode(MODE.BlockStatement);

        this.beautify = function() {

            /*jshint onevar:true */
            var local_token, sweet_code;
            Tokenizer = new tokenizer(js_source_text, opt, indent_string);
            tokens = Tokenizer.tokenize();
            token_pos = 0;

            while (local_token = get_token()) {
                for(var i = 0; i < local_token.comments_before.length; i++) {
                    // The cleanest handling of inline comments is to treat them as though they aren't there.
                    // Just continue formatting and the behavior should be logical.
                    // Also ignore unknown tokens.  Again, this should result in better behavior.
                    handle_token(local_token.comments_before[i]);
                }
                handle_token(local_token);

                last_last_text = flags.last_text;
                last_type = local_token.type;
                flags.last_text = local_token.text;

                token_pos += 1;
            }

            sweet_code = output.get_code();
            if (opt.end_with_newline) {
                sweet_code += '\n';
            }

            return sweet_code;
        };

        function handle_token(local_token) {
            var newlines = local_token.newlines;
            var keep_whitespace = opt.keep_array_indentation && is_array(flags.mode);

            if (keep_whitespace) {
                for (i = 0; i < newlines; i += 1) {
                    print_newline(i > 0);
                }
            } else {
                if (opt.max_preserve_newlines && newlines > opt.max_preserve_newlines) {
                    newlines = opt.max_preserve_newlines;
                }

                if (opt.preserve_newlines) {
                    if (local_token.newlines > 1) {
                        print_newline();
                        for (var i = 1; i < newlines; i += 1) {
                            print_newline(true);
                        }
                    }
                }
            }

            current_token = local_token;
            handlers[current_token.type]();
        }

        // we could use just string.split, but
        // IE doesn't like returning empty strings

        function split_newlines(s) {
            //return s.split(/\x0d\x0a|\x0a/);

            s = s.replace(/\x0d/g, '');
            var out = [],
                idx = s.indexOf("\n");
            while (idx !== -1) {
                out.push(s.substring(0, idx));
                s = s.substring(idx + 1);
                idx = s.indexOf("\n");
            }
            if (s.length) {
                out.push(s);
            }
            return out;
        }

        function allow_wrap_or_preserved_newline(force_linewrap) {
            force_linewrap = (force_linewrap === undefined) ? false : force_linewrap;

            if (output.just_added_newline()) {
                return
            }

            if ((opt.preserve_newlines && current_token.wanted_newline) || force_linewrap) {
                print_newline(false, true);
            } else if (opt.wrap_line_length) {
                // We never wrap the first token of a line due to newline check above.
                var proposed_line_length = output.current_line.get_character_count() + current_token.text.length +
                    (output.space_before_token ? 1 : 0);
                if (proposed_line_length >= opt.wrap_line_length) {
                    print_newline(false, true);
                }
            }
        }

        function print_newline(force_newline, preserve_statement_flags) {
            if (!preserve_statement_flags) {
                if (flags.last_text !== ';' && flags.last_text !== ',' && flags.last_text !== '=' && last_type !== 'TK_OPERATOR') {
                    while (flags.mode === MODE.Statement && !flags.if_block && !flags.do_block) {
                        restore_mode();
                    }
                }
            }

            if (output.add_new_line(force_newline)) {
                flags.multiline_frame = true;
            }
        }

        function print_token_line_indentation() {
            if (output.just_added_newline()) {
                if (opt.keep_array_indentation && is_array(flags.mode) && current_token.wanted_newline) {
                    // prevent removing of this whitespace as redundant
                    output.current_line.push('');
                    for (var i = 0; i < current_token.whitespace_before.length; i += 1) {
                        output.current_line.push(current_token.whitespace_before[i]);
                    }
                    output.space_before_token = false;
                } else if (output.add_indent_string(flags.indentation_level)) {
                    flags.line_indent_level = flags.indentation_level;
                }
            }
        }

        function print_token(printable_token) {
            printable_token = printable_token || current_token.text;
            print_token_line_indentation();
            output.add_token(printable_token);
        }

        function indent() {
            flags.indentation_level += 1;
        }

        function deindent() {
            if (flags.indentation_level > 0 &&
                ((!flags.parent) || flags.indentation_level > flags.parent.indentation_level))
                flags.indentation_level -= 1;
        }

        function set_mode(mode) {
            if (flags) {
                flag_store.push(flags);
                previous_flags = flags;
            } else {
                previous_flags = create_flags(null, mode);
            }

            flags = create_flags(previous_flags, mode);
        }

        function is_array(mode) {
            return mode === MODE.ArrayLiteral;
        }

        function is_expression(mode) {
            return in_array(mode, [MODE.Expression, MODE.ForInitializer, MODE.Conditional]);
        }

        function restore_mode() {
            if (flag_store.length > 0) {
                previous_flags = flags;
                flags = flag_store.pop();
                if (previous_flags.mode === MODE.Statement) {
                    output.remove_redundant_indentation(previous_flags);
                }
            }
        }

        function start_of_object_property() {
            return flags.parent.mode === MODE.ObjectLiteral && flags.mode === MODE.Statement && (
                (flags.last_text === ':' && flags.ternary_depth === 0) || (last_type === 'TK_RESERVED' && in_array(flags.last_text, ['get', 'set'])));
        }

        function start_of_statement() {
            if (
                    (last_type === 'TK_RESERVED' && in_array(flags.last_text, ['var', 'let', 'const']) && current_token.type === 'TK_WORD') ||
                    (last_type === 'TK_RESERVED' && flags.last_text === 'do') ||
                    (last_type === 'TK_RESERVED' && flags.last_text === 'return' && !current_token.wanted_newline) ||
                    (last_type === 'TK_RESERVED' && flags.last_text === 'else' && !(current_token.type === 'TK_RESERVED' && current_token.text === 'if')) ||
                    (last_type === 'TK_END_EXPR' && (previous_flags.mode === MODE.ForInitializer || previous_flags.mode === MODE.Conditional)) ||
                    (last_type === 'TK_WORD' && flags.mode === MODE.BlockStatement
                        && !flags.in_case
                        && !(current_token.text === '--' || current_token.text === '++')
                        && current_token.type !== 'TK_WORD' && current_token.type !== 'TK_RESERVED') ||
                    (flags.mode === MODE.ObjectLiteral && (
                        (flags.last_text === ':' && flags.ternary_depth === 0) || (last_type === 'TK_RESERVED' && in_array(flags.last_text, ['get', 'set']))))
                ) {

                set_mode(MODE.Statement);
                indent();

                if (last_type === 'TK_RESERVED' && in_array(flags.last_text, ['var', 'let', 'const']) && current_token.type === 'TK_WORD') {
                    flags.declaration_statement = true;
                }

                // Issue #276:
                // If starting a new statement with [if, for, while, do], push to a new line.
                // if (a) if (b) if(c) d(); else e(); else f();
                if (!start_of_object_property()) {
                    allow_wrap_or_preserved_newline(
                        current_token.type === 'TK_RESERVED' && in_array(current_token.text, ['do', 'for', 'if', 'while']));
                }

                return true;
            }
            return false;
        }

        function all_lines_start_with(lines, c) {
            for (var i = 0; i < lines.length; i++) {
                var line = trim(lines[i]);
                if (line.charAt(0) !== c) {
                    return false;
                }
            }
            return true;
        }

        function each_line_matches_indent(lines, indent) {
            var i = 0,
                len = lines.length,
                line;
            for (; i < len; i++) {
                line = lines[i];
                // allow empty lines to pass through
                if (line && line.indexOf(indent) !== 0) {
                    return false;
                }
            }
            return true;
        }

        function is_special_word(word) {
            return in_array(word, ['case', 'return', 'do', 'if', 'throw', 'else']);
        }

        function get_token(offset) {
            var index = token_pos + (offset || 0);
            return (index < 0 || index >= tokens.length) ? null : tokens[index];
        }

        function handle_start_expr() {
            if (start_of_statement()) {
                // The conditional starts the statement if appropriate.
            }

            var next_mode = MODE.Expression;
            if (current_token.text === '[') {

                if (last_type === 'TK_WORD' || flags.last_text === ')') {
                    // this is array index specifier, break immediately
                    // a[x], fn()[x]
                    if (last_type === 'TK_RESERVED' && in_array(flags.last_text, Tokenizer.line_starters)) {
                        output.space_before_token = true;
                    }
                    set_mode(next_mode);
                    print_token();
                    indent();
                    if (opt.space_in_paren) {
                        output.space_before_token = true;
                    }
                    return;
                }

                next_mode = MODE.ArrayLiteral;
                if (is_array(flags.mode)) {
                    if (flags.last_text === '[' ||
                        (flags.last_text === ',' && (last_last_text === ']' || last_last_text === '}'))) {
                        // ], [ goes to new line
                        // }, [ goes to new line
                        if (!opt.keep_array_indentation) {
                            print_newline();
                        }
                    }
                }

            } else {
                if (last_type === 'TK_RESERVED' && flags.last_text === 'for') {
                    next_mode = MODE.ForInitializer;
                } else if (last_type === 'TK_RESERVED' && in_array(flags.last_text, ['if', 'while'])) {
                    next_mode = MODE.Conditional;
                } else {
                    // next_mode = MODE.Expression;
                }
            }

            if (flags.last_text === ';' || last_type === 'TK_START_BLOCK') {
                print_newline();
            } else if (last_type === 'TK_END_EXPR' || last_type === 'TK_START_EXPR' || last_type === 'TK_END_BLOCK' || flags.last_text === '.') {
                // TODO: Consider whether forcing this is required.  Review failing tests when removed.
                allow_wrap_or_preserved_newline(current_token.wanted_newline);
                // do nothing on (( and )( and ][ and ]( and .(
            } else if (!(last_type === 'TK_RESERVED' && current_token.text === '(') && last_type !== 'TK_WORD' && last_type !== 'TK_OPERATOR') {
                output.space_before_token = true;
            } else if ((last_type === 'TK_RESERVED' && (flags.last_word === 'function' || flags.last_word === 'typeof')) ||
                (flags.last_text === '*' && last_last_text === 'function')) {
                // function() vs function ()
                if (opt.space_after_anon_function) {
                    output.space_before_token = true;
                }
            } else if (last_type === 'TK_RESERVED' && (in_array(flags.last_text, Tokenizer.line_starters) || flags.last_text === 'catch')) {
                if (opt.space_before_conditional) {
                    output.space_before_token = true;
                }
            }

            // Support of this kind of newline preservation.
            // a = (b &&
            //     (c || d));
            if (current_token.text === '(') {
                if (last_type === 'TK_EQUALS' || last_type === 'TK_OPERATOR') {
                    if (!start_of_object_property()) {
                        allow_wrap_or_preserved_newline();
                    }
                }
            }

            set_mode(next_mode);
            print_token();
            if (opt.space_in_paren) {
                output.space_before_token = true;
            }

            // In all cases, if we newline while inside an expression it should be indented.
            indent();
        }

        function handle_end_expr() {
            // statements inside expressions are not valid syntax, but...
            // statements must all be closed when their container closes
            while (flags.mode === MODE.Statement) {
                restore_mode();
            }

            if (flags.multiline_frame) {
                allow_wrap_or_preserved_newline(current_token.text === ']' && is_array(flags.mode) && !opt.keep_array_indentation);
            }

            if (opt.space_in_paren) {
                if (last_type === 'TK_START_EXPR' && ! opt.space_in_empty_paren) {
                    // () [] no inner space in empty parens like these, ever, ref #320
                    output.trim();
                    output.space_before_token = false;
                } else {
                    output.space_before_token = true;
                }
            }
            if (current_token.text === ']' && opt.keep_array_indentation) {
                print_token();
                restore_mode();
            } else {
                restore_mode();
                print_token();
            }
            output.remove_redundant_indentation(previous_flags);

            // do {} while () // no statement required after
            if (flags.do_while && previous_flags.mode === MODE.Conditional) {
                previous_flags.mode = MODE.Expression;
                flags.do_block = false;
                flags.do_while = false;

            }
        }

        function handle_start_block() {
            // Check if this is should be treated as a ObjectLiteral
            var next_token = get_token(1)
            var second_token = get_token(2)
            if (second_token && (
                    (second_token.text === ':' && in_array(next_token.type, ['TK_STRING', 'TK_WORD', 'TK_RESERVED']))
                    || (in_array(next_token.text, ['get', 'set']) && in_array(second_token.type, ['TK_WORD', 'TK_RESERVED']))
                )) {
                // We don't support TypeScript,but we didn't break it for a very long time.
                // We'll try to keep not breaking it.
                if (!in_array(last_last_text, ['class','interface'])) {
                    set_mode(MODE.ObjectLiteral);
                } else {
                    set_mode(MODE.BlockStatement);
                }
            } else {
                set_mode(MODE.BlockStatement);
            }

            var empty_braces = !next_token.comments_before.length &&  next_token.text === '}';
            var empty_anonymous_function = empty_braces && flags.last_word === 'function' &&
                last_type === 'TK_END_EXPR';

            if (opt.brace_style === "expand") {
                if (last_type !== 'TK_OPERATOR' &&
                    (empty_anonymous_function ||
                        last_type === 'TK_EQUALS' ||
                        (last_type === 'TK_RESERVED' && is_special_word(flags.last_text) && flags.last_text !== 'else'))) {
                    output.space_before_token = true;
                } else {
                    print_newline(false, true);
                }
            } else { // collapse
                if (last_type !== 'TK_OPERATOR' && last_type !== 'TK_START_EXPR') {
                    if (last_type === 'TK_START_BLOCK') {
                        print_newline();
                    } else {
                        output.space_before_token = true;
                    }
                } else {
                    // if TK_OPERATOR or TK_START_EXPR
                    if (is_array(previous_flags.mode) && flags.last_text === ',') {
                        if (last_last_text === '}') {
                            // }, { in array context
                            output.space_before_token = true;
                        } else {
                            print_newline(); // [a, b, c, {
                        }
                    }
                }
            }
            print_token();
            indent();
        }

        function handle_end_block() {
            // statements must all be closed when their container closes
            while (flags.mode === MODE.Statement) {
                restore_mode();
            }
            var empty_braces = last_type === 'TK_START_BLOCK';

            if (opt.brace_style === "expand") {
                if (!empty_braces) {
                    print_newline();
                }
            } else {
                // skip {}
                if (!empty_braces) {
                    if (is_array(flags.mode) && opt.keep_array_indentation) {
                        // we REALLY need a newline here, but newliner would skip that
                        opt.keep_array_indentation = false;
                        print_newline();
                        opt.keep_array_indentation = true;

                    } else {
                        print_newline();
                    }
                }
            }
            restore_mode();
            print_token();
        }

        function handle_word() {
            if (current_token.type === 'TK_RESERVED' && flags.mode !== MODE.ObjectLiteral &&
                in_array(current_token.text, ['set', 'get'])) {
                current_token.type = 'TK_WORD';
            }

            if (current_token.type === 'TK_RESERVED' && flags.mode === MODE.ObjectLiteral) {
                var next_token = get_token(1);
                if (next_token.text == ':') {
                    current_token.type = 'TK_WORD';
                }
            }

            if (start_of_statement()) {
                // The conditional starts the statement if appropriate.
            } else if (current_token.wanted_newline && !is_expression(flags.mode) &&
                (last_type !== 'TK_OPERATOR' || (flags.last_text === '--' || flags.last_text === '++')) &&
                last_type !== 'TK_EQUALS' &&
                (opt.preserve_newlines || !(last_type === 'TK_RESERVED' && in_array(flags.last_text, ['var', 'let', 'const', 'set', 'get'])))) {

                print_newline();
            }

            if (flags.do_block && !flags.do_while) {
                if (current_token.type === 'TK_RESERVED' && current_token.text === 'while') {
                    // do {} ## while ()
                    output.space_before_token = true;
                    print_token();
                    output.space_before_token = true;
                    flags.do_while = true;
                    return;
                } else {
                    // do {} should always have while as the next word.
                    // if we don't see the expected while, recover
                    print_newline();
                    flags.do_block = false;
                }
            }

            // if may be followed by else, or not
            // Bare/inline ifs are tricky
            // Need to unwind the modes correctly: if (a) if (b) c(); else d(); else e();
            if (flags.if_block) {
                if (!flags.else_block && (current_token.type === 'TK_RESERVED' && current_token.text === 'else')) {
                    flags.else_block = true;
                } else {
                    while (flags.mode === MODE.Statement) {
                        restore_mode();
                    }
                    flags.if_block = false;
                    flags.else_block = false;
                }
            }

            if (current_token.type === 'TK_RESERVED' && (current_token.text === 'case' || (current_token.text === 'default' && flags.in_case_statement))) {
                print_newline();
                if (flags.case_body || opt.jslint_happy) {
                    // switch cases following one another
                    deindent();
                    flags.case_body = false;
                }
                print_token();
                flags.in_case = true;
                flags.in_case_statement = true;
                return;
            }

            if (current_token.type === 'TK_RESERVED' && current_token.text === 'function') {
                if (in_array(flags.last_text, ['}', ';']) || (output.just_added_newline() && ! in_array(flags.last_text, ['[', '{', ':', '=', ',']))) {
                    // make sure there is a nice clean space of at least one blank line
                    // before a new function definition
                    if ( !output.just_added_blankline() && !current_token.comments_before.length) {
                        print_newline();
                        print_newline(true);
                    }
                }
                if (last_type === 'TK_RESERVED' || last_type === 'TK_WORD') {
                    if (last_type === 'TK_RESERVED' && in_array(flags.last_text, ['get', 'set', 'new', 'return', 'export'])) {
                        output.space_before_token = true;
                    } else if (last_type === 'TK_RESERVED' && flags.last_text === 'default' && last_last_text === 'export') {
                        output.space_before_token = true;
                    } else {
                        print_newline();
                    }
                } else if (last_type === 'TK_OPERATOR' || flags.last_text === '=') {
                    // foo = function
                    output.space_before_token = true;
                } else if (!flags.multiline_frame && (is_expression(flags.mode) || is_array(flags.mode))) {
                    // (function
                } else {
                    print_newline();
                }
            }

            if (last_type === 'TK_COMMA' || last_type === 'TK_START_EXPR' || last_type === 'TK_EQUALS' || last_type === 'TK_OPERATOR') {
                if (!start_of_object_property()) {
                    allow_wrap_or_preserved_newline();
                }
            }

            if (current_token.type === 'TK_RESERVED' &&  in_array(current_token.text, ['function', 'get', 'set'])) {
                print_token();
                flags.last_word = current_token.text;
                return;
            }

            prefix = 'NONE';

            if (last_type === 'TK_END_BLOCK') {
                if (!(current_token.type === 'TK_RESERVED' && in_array(current_token.text, ['else', 'catch', 'finally']))) {
                    prefix = 'NEWLINE';
                } else {
                    if (opt.brace_style === "expand" || opt.brace_style === "end-expand") {
                        prefix = 'NEWLINE';
                    } else {
                        prefix = 'SPACE';
                        output.space_before_token = true;
                    }
                }
            } else if (last_type === 'TK_SEMICOLON' && flags.mode === MODE.BlockStatement) {
                // TODO: Should this be for STATEMENT as well?
                prefix = 'NEWLINE';
            } else if (last_type === 'TK_SEMICOLON' && is_expression(flags.mode)) {
                prefix = 'SPACE';
            } else if (last_type === 'TK_STRING') {
                prefix = 'NEWLINE';
            } else if (last_type === 'TK_RESERVED' || last_type === 'TK_WORD' ||
                (flags.last_text === '*' && last_last_text === 'function')) {
                prefix = 'SPACE';
            } else if (last_type === 'TK_START_BLOCK') {
                prefix = 'NEWLINE';
            } else if (last_type === 'TK_END_EXPR') {
                output.space_before_token = true;
                prefix = 'NEWLINE';
            }

            if (current_token.type === 'TK_RESERVED' && in_array(current_token.text, Tokenizer.line_starters) && flags.last_text !== ')') {
                if (flags.last_text === 'else' || flags.last_text === 'export') {
                    prefix = 'SPACE';
                } else {
                    prefix = 'NEWLINE';
                }

            }

            if (current_token.type === 'TK_RESERVED' && in_array(current_token.text, ['else', 'catch', 'finally'])) {
                if (last_type !== 'TK_END_BLOCK' || opt.brace_style === "expand" || opt.brace_style === "end-expand") {
                    print_newline();
                } else {
                    output.trim(true);
                    var line = output.current_line;
                    // If we trimmed and there's something other than a close block before us
                    // put a newline back in.  Handles '} // comment' scenario.
                    if (line.last() !== '}') {
                        print_newline();
                    }
                    output.space_before_token = true;
                }
            } else if (prefix === 'NEWLINE') {
                if (last_type === 'TK_RESERVED' && is_special_word(flags.last_text)) {
                    // no newline between 'return nnn'
                    output.space_before_token = true;
                } else if (last_type !== 'TK_END_EXPR') {
                    if ((last_type !== 'TK_START_EXPR' || !(current_token.type === 'TK_RESERVED' && in_array(current_token.text, ['var', 'let', 'const']))) && flags.last_text !== ':') {
                        // no need to force newline on 'var': for (var x = 0...)
                        if (current_token.type === 'TK_RESERVED' && current_token.text === 'if' && flags.last_text === 'else') {
                            // no newline for } else if {
                            output.space_before_token = true;
                        } else {
                            print_newline();
                        }
                    }
                } else if (current_token.type === 'TK_RESERVED' && in_array(current_token.text, Tokenizer.line_starters) && flags.last_text !== ')') {
                    print_newline();
                }
            } else if (flags.multiline_frame && is_array(flags.mode) && flags.last_text === ',' && last_last_text === '}') {
                print_newline(); // }, in lists get a newline treatment
            } else if (prefix === 'SPACE') {
                output.space_before_token = true;
            }
            print_token();
            flags.last_word = current_token.text;

            if (current_token.type === 'TK_RESERVED' && current_token.text === 'do') {
                flags.do_block = true;
            }

            if (current_token.type === 'TK_RESERVED' && current_token.text === 'if') {
                flags.if_block = true;
            }
        }

        function handle_semicolon() {
            if (start_of_statement()) {
                // The conditional starts the statement if appropriate.
                // Semicolon can be the start (and end) of a statement
                output.space_before_token = false;
            }
            while (flags.mode === MODE.Statement && !flags.if_block && !flags.do_block) {
                restore_mode();
            }
            print_token();
        }

        function handle_string() {
            if (start_of_statement()) {
                // The conditional starts the statement if appropriate.
                // One difference - strings want at least a space before
                output.space_before_token = true;
            } else if (last_type === 'TK_RESERVED' || last_type === 'TK_WORD') {
                output.space_before_token = true;
            } else if (last_type === 'TK_COMMA' || last_type === 'TK_START_EXPR' || last_type === 'TK_EQUALS' || last_type === 'TK_OPERATOR') {
                if (!start_of_object_property()) {
                    allow_wrap_or_preserved_newline();
                }
            } else {
                print_newline();
            }
            print_token();
        }

        function handle_equals() {
            if (start_of_statement()) {
                // The conditional starts the statement if appropriate.
            }

            if (flags.declaration_statement) {
                // just got an '=' in a var-line, different formatting/line-breaking, etc will now be done
                flags.declaration_assignment = true;
            }
            output.space_before_token = true;
            print_token();
            output.space_before_token = true;
        }

        function handle_comma() {
            if (flags.declaration_statement) {
                if (is_expression(flags.parent.mode)) {
                    // do not break on comma, for(var a = 1, b = 2)
                    flags.declaration_assignment = false;
                }

                print_token();

                if (flags.declaration_assignment) {
                    flags.declaration_assignment = false;
                    print_newline(false, true);
                } else {
                    output.space_before_token = true;
                }
                return;
            }

            print_token();
            if (flags.mode === MODE.ObjectLiteral ||
                (flags.mode === MODE.Statement && flags.parent.mode === MODE.ObjectLiteral)) {
                if (flags.mode === MODE.Statement) {
                    restore_mode();
                }
                print_newline();
            } else {
                // EXPR or DO_BLOCK
                output.space_before_token = true;
            }

        }

        function handle_operator() {
            if (start_of_statement()) {
                // The conditional starts the statement if appropriate.
            }

            if (last_type === 'TK_RESERVED' && is_special_word(flags.last_text)) {
                // "return" had a special handling in TK_WORD. Now we need to return the favor
                output.space_before_token = true;
                print_token();
                return;
            }

            // hack for actionscript's import .*;
            if (current_token.text === '*' && last_type === 'TK_DOT') {
                print_token();
                return;
            }

            if (current_token.text === ':' && flags.in_case) {
                flags.case_body = true;
                indent();
                print_token();
                print_newline();
                flags.in_case = false;
                return;
            }

            if (current_token.text === '::') {
                // no spaces around exotic namespacing syntax operator
                print_token();
                return;
            }

            // http://www.ecma-international.org/ecma-262/5.1/#sec-7.9.1
            // if there is a newline between -- or ++ and anything else we should preserve it.
            if (current_token.wanted_newline && (current_token.text === '--' || current_token.text === '++')) {
                print_newline(false, true);
            }

            // Allow line wrapping between operators
            if (last_type === 'TK_OPERATOR') {
                allow_wrap_or_preserved_newline();
            }

            var space_before = true;
            var space_after = true;

            if (in_array(current_token.text, ['--', '++', '!', '~']) || (in_array(current_token.text, ['-', '+']) && (in_array(last_type, ['TK_START_BLOCK', 'TK_START_EXPR', 'TK_EQUALS', 'TK_OPERATOR']) || in_array(flags.last_text, Tokenizer.line_starters) || flags.last_text === ','))) {
                // unary operators (and binary +/- pretending to be unary) special cases

                space_before = false;
                space_after = false;

                if (flags.last_text === ';' && is_expression(flags.mode)) {
                    // for (;; ++i)
                    //        ^^^
                    space_before = true;
                }

                if (last_type === 'TK_RESERVED' || last_type === 'TK_END_EXPR') {
                    space_before = true;
                } else if (last_type === 'TK_OPERATOR') {
                    space_before =
                        (in_array(current_token.text, ['--', '-']) && in_array(flags.last_text, ['--', '-'])) ||
                        (in_array(current_token.text, ['++', '+']) && in_array(flags.last_text, ['++', '+']));
                }

                if ((flags.mode === MODE.BlockStatement || flags.mode === MODE.Statement) && (flags.last_text === '{' || flags.last_text === ';')) {
                    // { foo; --i }
                    // foo(); --bar;
                    print_newline();
                }
            } else if (current_token.text === ':') {
                if (flags.ternary_depth === 0) {
                    // Colon is invalid javascript outside of ternary and object, but do our best to guess what was meant.
                    space_before = false;
                } else {
                    flags.ternary_depth -= 1;
                }
            } else if (current_token.text === '?') {
                flags.ternary_depth += 1;
            } else if (current_token.text === '*' && last_type === 'TK_RESERVED' && flags.last_text === 'function') {
                space_before = false;
                space_after = false;
            }
            output.space_before_token = output.space_before_token || space_before;
            print_token();
            output.space_before_token = space_after;
        }

        function handle_block_comment() {
            var lines = split_newlines(current_token.text);
            var j; // iterator for this case
            var javadoc = false;
            var starless = false;
            var lastIndent = current_token.whitespace_before.join('');
            var lastIndentLength = lastIndent.length;

            // block comment starts with a new line
            print_newline(false, true);
            if (lines.length > 1) {
                if (all_lines_start_with(lines.slice(1), '*')) {
                    javadoc = true;
                }
                else if (each_line_matches_indent(lines.slice(1), lastIndent)) {
                    starless = true;
                }
            }

            // first line always indented
            print_token(lines[0]);
            for (j = 1; j < lines.length; j++) {
                print_newline(false, true);
                if (javadoc) {
                    // javadoc: reformat and re-indent
                    print_token(' ' + trim(lines[j]));
                } else if (starless && lines[j].length > lastIndentLength) {
                    // starless: re-indent non-empty content, avoiding trim
                    print_token(lines[j].substring(lastIndentLength));
                } else {
                    // normal comments output raw
                    output.add_token(lines[j]);
                }
            }

            // for comments of more than one line, make sure there's a new line after
            print_newline(false, true);
        }

        function handle_inline_comment() {
            output.space_before_token = true;
            print_token();
            output.space_before_token = true;
        }

        function handle_comment() {
            if (current_token.wanted_newline) {
                print_newline(false, true);
            } else {
                output.trim(true);
            }

            output.space_before_token = true;
            print_token();
            print_newline(false, true);
        }

        function handle_dot() {
            if (start_of_statement()) {
                // The conditional starts the statement if appropriate.
            }

            if (last_type === 'TK_RESERVED' && is_special_word(flags.last_text)) {
                output.space_before_token = true;
            } else {
                // allow preserved newlines before dots in general
                // force newlines on dots after close paren when break_chained - for bar().baz()
                allow_wrap_or_preserved_newline(flags.last_text === ')' && opt.break_chained_methods);
            }

            print_token();
        }

        function handle_unknown() {
            print_token();

            if (current_token.text[current_token.text.length - 1] === '\n') {
                print_newline();
            }
        }

        function handle_eof() {
            // Unwind any open statements
            while (flags.mode === MODE.Statement) {
                restore_mode();
            }
        }
    }

    function OutputLine() {
        var character_count = 0;
        var line_items = [];

        this.get_character_count = function() {
            return character_count;
        }

        this.get_item_count = function() {
            return line_items.length;
        }

        this.get_output = function() {
            return line_items.join('');
        }

        this.last = function() {
            if (line_items.length) {
              return line_items[line_items.length - 1];
            } else {
              return null;
            }
        }

        this.push = function(input) {
            line_items.push(input);
            character_count += input.length;
        }

        this.remove_indent = function(indent_string, baseIndentString) {
            var splice_index = 0;

            // skip empty lines
            if (line_items.length === 0) {
                return;
            }

            // skip the preindent string if present
            if (baseIndentString && line_items[0] === baseIndentString) {
                splice_index = 1;
            }

            // remove one indent, if present
            if (line_items[splice_index] === indent_string) {
                character_count -= line_items[splice_index].length;
                line_items.splice(splice_index, 1);
            }
        }

        this.trim = function(indent_string, baseIndentString) {
            while (this.get_item_count() &&
                (this.last() === ' ' ||
                    this.last() === indent_string ||
                    this.last() === baseIndentString)) {
                var item = line_items.pop();
                character_count -= item.length;
            }
        }
    }

    function Output(indent_string, baseIndentString) {
        var lines =[];
        this.baseIndentString = baseIndentString;
        this.current_line = null;
        this.space_before_token = false;

        this.get_line_number = function() {
            return lines.length;
        }

        // Using object instead of string to allow for later expansion of info about each line
        this.add_new_line = function(force_newline) {
            if (this.get_line_number() === 1 && this.just_added_newline()) {
                return false; // no newline on start of file
            }

            if (force_newline || !this.just_added_newline()) {
                this.current_line = new OutputLine();
                lines.push(this.current_line);
                return true;
            }

            return false;
        }

        // initialize
        this.add_new_line(true);

        this.get_code = function() {
            var sweet_code = lines[0].get_output();
            for (var line_index = 1; line_index < lines.length; line_index++) {
                sweet_code += '\n' + lines[line_index].get_output();
            }
            sweet_code = sweet_code.replace(/[\r\n\t ]+$/, '');
            return sweet_code;
        }

        this.add_indent_string = function(indentation_level) {
            if (baseIndentString) {
                this.current_line.push(baseIndentString);
            }

            // Never indent your first output indent at the start of the file
            if (lines.length > 1) {
                for (var i = 0; i < indentation_level; i += 1) {
                    this.current_line.push(indent_string);
                }
                return true;
            }
            return false;
        }

        this.add_token = function(printable_token) {
            this.add_space_before_token();
            this.current_line.push(printable_token);
        }

        this.add_space_before_token = function() {
            if (this.space_before_token && this.current_line.get_item_count()) {
                var last_output = this.current_line.last();
                if (last_output !== ' ' && last_output !== indent_string && last_output !== baseIndentString) { // prevent occassional duplicate space
                    this.current_line.push(' ');
                }
            }
            this.space_before_token = false;
        }

        this.remove_redundant_indentation = function (frame) {
            // This implementation is effective but has some issues:
            //     - less than great performance due to array splicing
            //     - can cause line wrap to happen too soon due to indent removal
            //           after wrap points are calculated
            // These issues are minor compared to ugly indentation.

            if (frame.multiline_frame ||
                frame.mode === MODE.ForInitializer ||
                frame.mode === MODE.Conditional) {
                return;
            }

            // remove one indent from each line inside this section
            var index = frame.start_line_index;
            var line;

            var output_length = lines.length;
            while (index < output_length) {
                lines[index].remove_indent(indent_string, baseIndentString);
                index++;
            }
        }

        this.trim = function(eat_newlines) {
            eat_newlines = (eat_newlines === undefined) ? false : eat_newlines;

            this.current_line.trim(indent_string, baseIndentString);

            while (eat_newlines && lines.length > 1 &&
                this.current_line.get_item_count() === 0) {
                lines.pop();
                this.current_line = lines[lines.length - 1]
                this.current_line.trim(indent_string, baseIndentString);
            }
        }

        this.just_added_newline = function() {
            return this.current_line.get_item_count() === 0;
        }

        this.just_added_blankline = function() {
            if (this.just_added_newline()) {
                if (lines.length === 1) {
                    return true; // start of the file and newline = blank
                }

                var line = lines[lines.length - 2];
                return line.get_item_count() === 0;
            }
            return false;
        }
    }


    var Token = function(type, text, newlines, whitespace_before, mode, parent) {
        this.type = type;
        this.text = text;
        this.comments_before = [];
        this.newlines = newlines || 0;
        this.wanted_newline = newlines > 0;
        this.whitespace_before = whitespace_before || [];
        this.parent = null;
    }

    function tokenizer(input, opts, indent_string) {

        var whitespace = "\n\r\t ".split('');
        var digit = /[0-9]/;

        var punct = ('+ - * / % & ++ -- = += -= *= /= %= == === != !== > < >= <= >> << >>> >>>= >>= <<= && &= | || ! ~ , : ? ^ ^= |= :: =>'
                +' <%= <% %> <?= <? ?>').split(' '); // try to be a good boy and try not to break the markup language identifiers

        // words which should always start on new line.
        this.line_starters = 'continue,try,throw,return,var,let,const,if,switch,case,default,for,while,break,function,yield,import,export'.split(',');
        var reserved_words = this.line_starters.concat(['do', 'in', 'else', 'get', 'set', 'new', 'catch', 'finally', 'typeof']);

        var n_newlines, whitespace_before_token, in_html_comment, tokens, parser_pos;
        var input_length;

        this.tokenize = function() {
            // cache the source's length.
            input_length = input.length
            parser_pos = 0;
            in_html_comment = false
            tokens = [];

            var next, last;
            var token_values;
            var open = null;
            var open_stack = [];
            var comments = [];

            while (!(last && last.type === 'TK_EOF')) {
                token_values = tokenize_next();
                next = new Token(token_values[1], token_values[0], n_newlines, whitespace_before_token);
                while(next.type === 'TK_INLINE_COMMENT' || next.type === 'TK_COMMENT' ||
                    next.type === 'TK_BLOCK_COMMENT' || next.type === 'TK_UNKNOWN') {
                    comments.push(next);
                    token_values = tokenize_next();
                    next = new Token(token_values[1], token_values[0], n_newlines, whitespace_before_token);
                }

                if (comments.length) {
                    next.comments_before = comments;
                    comments = [];
                }

                if (next.type === 'TK_START_BLOCK' || next.type === 'TK_START_EXPR') {
                    next.parent = last;
                    open = next;
                    open_stack.push(next);
                }  else if ((next.type === 'TK_END_BLOCK' || next.type === 'TK_END_EXPR') &&
                    (open && (
                        (next.text === ']' && open.text === '[') ||
                        (next.text === ')' && open.text === '(') ||
                        (next.text === '}' && open.text === '}')))) {
                    next.parent = open.parent;
                    open = open_stack.pop();
                }

                tokens.push(next);
                last = next;
            }

            return tokens;
        }

        function tokenize_next() {
            var i, resulting_string;

            n_newlines = 0;
            whitespace_before_token = [];

            if (parser_pos >= input_length) {
                return ['', 'TK_EOF'];
            }

            var last_token;
            if (tokens.length) {
                last_token = tokens[tokens.length-1];
            } else {
                // For the sake of tokenizing we can pretend that there was on open brace to start
                last_token = new Token('TK_START_BLOCK', '{');
            }


            var c = input.charAt(parser_pos);
            parser_pos += 1;

            while (in_array(c, whitespace)) {

                if (c === '\n') {
                    n_newlines += 1;
                    whitespace_before_token = [];
                } else if (n_newlines) {
                    if (c === indent_string) {
                        whitespace_before_token.push(indent_string);
                    } else if (c !== '\r') {
                        whitespace_before_token.push(' ');
                    }
                }

                if (parser_pos >= input_length) {
                    return ['', 'TK_EOF'];
                }

                c = input.charAt(parser_pos);
                parser_pos += 1;
            }

            if (digit.test(c)) {
                var allow_decimal = true;
                var allow_e = true;
                var local_digit = digit;

                if (c === '0' && parser_pos < input_length && /[Xx]/.test(input.charAt(parser_pos))) {
                    // switch to hex number, no decimal or e, just hex digits
                    allow_decimal = false;
                    allow_e = false;
                    c += input.charAt(parser_pos);
                    parser_pos += 1;
                    local_digit = /[0123456789abcdefABCDEF]/
                } else {
                    // we know this first loop will run.  It keeps the logic simpler.
                    c = '';
                    parser_pos -= 1
                }

                // Add the digits
                while (parser_pos < input_length && local_digit.test(input.charAt(parser_pos))) {
                    c += input.charAt(parser_pos);
                    parser_pos += 1;

                    if (allow_decimal && parser_pos < input_length && input.charAt(parser_pos) === '.') {
                        c += input.charAt(parser_pos);
                        parser_pos += 1;
                        allow_decimal = false;
                    }

                    if (allow_e && parser_pos < input_length && /[Ee]/.test(input.charAt(parser_pos))) {
                        c += input.charAt(parser_pos);
                        parser_pos += 1;

                        if (parser_pos < input_length && /[+-]/.test(input.charAt(parser_pos))) {
                            c += input.charAt(parser_pos);
                            parser_pos += 1;
                        }

                        allow_e = false;
                        allow_decimal = false;
                    }
                }

                return [c, 'TK_WORD'];
            }

            if (acorn.isIdentifierStart(input.charCodeAt(parser_pos-1))) {
                if (parser_pos < input_length) {
                    while (acorn.isIdentifierChar(input.charCodeAt(parser_pos))) {
                        c += input.charAt(parser_pos);
                        parser_pos += 1;
                        if (parser_pos === input_length) {
                            break;
                        }
                    }
                }

                if (!(last_token.type === 'TK_DOT' ||
                        (last_token.type === 'TK_RESERVED' && in_array(last_token.text, ['set', 'get'])))
                    && in_array(c, reserved_words)) {
                    if (c === 'in') { // hack for 'in' operator
                        return [c, 'TK_OPERATOR'];
                    }
                    return [c, 'TK_RESERVED'];
                }

                return [c, 'TK_WORD'];
            }

            if (c === '(' || c === '[') {
                return [c, 'TK_START_EXPR'];
            }

            if (c === ')' || c === ']') {
                return [c, 'TK_END_EXPR'];
            }

            if (c === '{') {
                return [c, 'TK_START_BLOCK'];
            }

            if (c === '}') {
                return [c, 'TK_END_BLOCK'];
            }

            if (c === ';') {
                return [c, 'TK_SEMICOLON'];
            }

            if (c === '/') {
                var comment = '';
                // peek for comment /* ... */
                var inline_comment = true;
                if (input.charAt(parser_pos) === '*') {
                    parser_pos += 1;
                    if (parser_pos < input_length) {
                        while (parser_pos < input_length && !(input.charAt(parser_pos) === '*' && input.charAt(parser_pos + 1) && input.charAt(parser_pos + 1) === '/')) {
                            c = input.charAt(parser_pos);
                            comment += c;
                            if (c === "\n" || c === "\r") {
                                inline_comment = false;
                            }
                            parser_pos += 1;
                            if (parser_pos >= input_length) {
                                break;
                            }
                        }
                    }
                    parser_pos += 2;
                    if (inline_comment && n_newlines === 0) {
                        return ['/*' + comment + '*/', 'TK_INLINE_COMMENT'];
                    } else {
                        return ['/*' + comment + '*/', 'TK_BLOCK_COMMENT'];
                    }
                }
                // peek for comment // ...
                if (input.charAt(parser_pos) === '/') {
                    comment = c;
                    while (input.charAt(parser_pos) !== '\r' && input.charAt(parser_pos) !== '\n') {
                        comment += input.charAt(parser_pos);
                        parser_pos += 1;
                        if (parser_pos >= input_length) {
                            break;
                        }
                    }
                    return [comment, 'TK_COMMENT'];
                }

            }

            if (c === '`' || c === "'" || c === '"' || // string
                (
                    (c === '/') || // regexp
                    (opts.e4x && c === "<" && input.slice(parser_pos - 1).match(/^<([-a-zA-Z:0-9_.]+|{[^{}]*}|!\[CDATA\[[\s\S]*?\]\])\s*([-a-zA-Z:0-9_.]+=('[^']*'|"[^"]*"|{[^{}]*})\s*)*\/?\s*>/)) // xml
                ) && ( // regex and xml can only appear in specific locations during parsing
                    (last_token.type === 'TK_RESERVED' && in_array(last_token.text , ['return', 'case', 'throw', 'else', 'do', 'typeof', 'yield'])) ||
                    (last_token.type === 'TK_END_EXPR' && last_token.text === ')' &&
                        last_token.parent && last_token.parent.type === 'TK_RESERVED' && in_array(last_token.parent.text, ['if', 'while', 'for'])) ||
                    (in_array(last_token.type, ['TK_COMMENT', 'TK_START_EXPR', 'TK_START_BLOCK',
                        'TK_END_BLOCK', 'TK_OPERATOR', 'TK_EQUALS', 'TK_EOF', 'TK_SEMICOLON', 'TK_COMMA'
                    ]))
                )) {

                var sep = c,
                    esc = false,
                    has_char_escapes = false;

                resulting_string = c;

                if (sep === '/') {
                    //
                    // handle regexp
                    //
                    var in_char_class = false;
                    while (parser_pos < input_length &&
                            ((esc || in_char_class || input.charAt(parser_pos) !== sep) &&
                            !acorn.newline.test(input.charAt(parser_pos)))) {
                        resulting_string += input.charAt(parser_pos);
                        if (!esc) {
                            esc = input.charAt(parser_pos) === '\\';
                            if (input.charAt(parser_pos) === '[') {
                                in_char_class = true;
                            } else if (input.charAt(parser_pos) === ']') {
                                in_char_class = false;
                            }
                        } else {
                            esc = false;
                        }
                        parser_pos += 1;
                    }
                } else if (opts.e4x && sep === '<') {
                    //
                    // handle e4x xml literals
                    //
                    var xmlRegExp = /<(\/?)([-a-zA-Z:0-9_.]+|{[^{}]*}|!\[CDATA\[[\s\S]*?\]\])\s*([-a-zA-Z:0-9_.]+=('[^']*'|"[^"]*"|{[^{}]*})\s*)*(\/?)\s*>/g;
                    var xmlStr = input.slice(parser_pos - 1);
                    var match = xmlRegExp.exec(xmlStr);
                    if (match && match.index === 0) {
                        var rootTag = match[2];
                        var depth = 0;
                        while (match) {
                            var isEndTag = !! match[1];
                            var tagName = match[2];
                            var isSingletonTag = ( !! match[match.length - 1]) || (tagName.slice(0, 8) === "![CDATA[");
                            if (tagName === rootTag && !isSingletonTag) {
                                if (isEndTag) {
                                    --depth;
                                } else {
                                    ++depth;
                                }
                            }
                            if (depth <= 0) {
                                break;
                            }
                            match = xmlRegExp.exec(xmlStr);
                        }
                        var xmlLength = match ? match.index + match[0].length : xmlStr.length;
                        parser_pos += xmlLength - 1;
                        return [xmlStr.slice(0, xmlLength), "TK_STRING"];
                    }
                } else {
                    //
                    // handle string
                    //
                    // Template strings can travers lines without escape characters.
                    // Other strings cannot
                    while (parser_pos < input_length &&
                            (esc || (input.charAt(parser_pos) !== sep &&
                            (sep === '`' || !acorn.newline.test(input.charAt(parser_pos)))))) {
                        resulting_string += input.charAt(parser_pos);
                        if (esc) {
                            if (input.charAt(parser_pos) === 'x' || input.charAt(parser_pos) === 'u') {
                                has_char_escapes = true;
                            }
                            esc = false;
                        } else {
                            esc = input.charAt(parser_pos) === '\\';
                        }
                        parser_pos += 1;
                    }

                }

                if (has_char_escapes && opts.unescape_strings) {
                    resulting_string = unescape_string(resulting_string);
                }

                if (parser_pos < input_length && input.charAt(parser_pos) === sep) {
                    resulting_string += sep;
                    parser_pos += 1;

                    if (sep === '/') {
                        // regexps may have modifiers /regexp/MOD , so fetch those, too
                        // Only [gim] are valid, but if the user puts in garbage, do what we can to take it.
                        while (parser_pos < input_length && acorn.isIdentifierStart(input.charCodeAt(parser_pos))) {
                            resulting_string += input.charAt(parser_pos);
                            parser_pos += 1;
                        }
                    }
                }
                return [resulting_string, 'TK_STRING'];
            }

            if (c === '#') {

                if (tokens.length === 0 && input.charAt(parser_pos) === '!') {
                    // shebang
                    resulting_string = c;
                    while (parser_pos < input_length && c !== '\n') {
                        c = input.charAt(parser_pos);
                        resulting_string += c;
                        parser_pos += 1;
                    }
                    return [trim(resulting_string) + '\n', 'TK_UNKNOWN'];
                }



                // Spidermonkey-specific sharp variables for circular references
                // https://developer.mozilla.org/En/Sharp_variables_in_JavaScript
                // http://mxr.mozilla.org/mozilla-central/source/js/src/jsscan.cpp around line 1935
                var sharp = '#';
                if (parser_pos < input_length && digit.test(input.charAt(parser_pos))) {
                    do {
                        c = input.charAt(parser_pos);
                        sharp += c;
                        parser_pos += 1;
                    } while (parser_pos < input_length && c !== '#' && c !== '=');
                    if (c === '#') {
                        //
                    } else if (input.charAt(parser_pos) === '[' && input.charAt(parser_pos + 1) === ']') {
                        sharp += '[]';
                        parser_pos += 2;
                    } else if (input.charAt(parser_pos) === '{' && input.charAt(parser_pos + 1) === '}') {
                        sharp += '{}';
                        parser_pos += 2;
                    }
                    return [sharp, 'TK_WORD'];
                }
            }

            if (c === '<' && input.substring(parser_pos - 1, parser_pos + 3) === '<!--') {
                parser_pos += 3;
                c = '<!--';
                while (input.charAt(parser_pos) !== '\n' && parser_pos < input_length) {
                    c += input.charAt(parser_pos);
                    parser_pos++;
                }
                in_html_comment = true;
                return [c, 'TK_COMMENT'];
            }

            if (c === '-' && in_html_comment && input.substring(parser_pos - 1, parser_pos + 2) === '-->') {
                in_html_comment = false;
                parser_pos += 2;
                return ['-->', 'TK_COMMENT'];
            }

            if (c === '.') {
                return [c, 'TK_DOT'];
            }

            if (in_array(c, punct)) {
                while (parser_pos < input_length && in_array(c + input.charAt(parser_pos), punct)) {
                    c += input.charAt(parser_pos);
                    parser_pos += 1;
                    if (parser_pos >= input_length) {
                        break;
                    }
                }

                if (c === ',') {
                    return [c, 'TK_COMMA'];
                } else if (c === '=') {
                    return [c, 'TK_EQUALS'];
                } else {
                    return [c, 'TK_OPERATOR'];
                }
            }

            return [c, 'TK_UNKNOWN'];
        }


        function unescape_string(s) {
            var esc = false,
                out = '',
                pos = 0,
                s_hex = '',
                escaped = 0,
                c;

            while (esc || pos < s.length) {

                c = s.charAt(pos);
                pos++;

                if (esc) {
                    esc = false;
                    if (c === 'x') {
                        // simple hex-escape \x24
                        s_hex = s.substr(pos, 2);
                        pos += 2;
                    } else if (c === 'u') {
                        // unicode-escape, \u2134
                        s_hex = s.substr(pos, 4);
                        pos += 4;
                    } else {
                        // some common escape, e.g \n
                        out += '\\' + c;
                        continue;
                    }
                    if (!s_hex.match(/^[0123456789abcdefABCDEF]+$/)) {
                        // some weird escaping, bail out,
                        // leaving whole string intact
                        return s;
                    }

                    escaped = parseInt(s_hex, 16);

                    if (escaped >= 0x00 && escaped < 0x20) {
                        // leave 0x00...0x1f escaped
                        if (c === 'x') {
                            out += '\\x' + s_hex;
                        } else {
                            out += '\\u' + s_hex;
                        }
                        continue;
                    } else if (escaped === 0x22 || escaped === 0x27 || escaped === 0x5c) {
                        // single-quote, apostrophe, backslash - escape these
                        out += '\\' + String.fromCharCode(escaped);
                    } else if (c === 'x' && escaped > 0x7e && escaped <= 0xff) {
                        // we bail out on \x7f..\xff,
                        // leaving whole string escaped,
                        // as it's probably completely binary
                        return s;
                    } else {
                        out += String.fromCharCode(escaped);
                    }
                } else if (c === '\\') {
                    esc = true;
                } else {
                    out += c;
                }
            }
            return out;
        }

    }


    if (typeof define === "function" && define.amd) {
        // Add support for AMD ( https://github.com/amdjs/amdjs-api/wiki/AMD#defineamd-property- )
        define([], function() {
            return { js_beautify: js_beautify };
        });
    } else if (typeof exports !== "undefined") {
        // Add support for CommonJS. Just put this file somewhere on your require.paths
        // and you will be able to `var js_beautify = require("beautify").js_beautify`.
        exports.js_beautify = js_beautify;
    } else if (typeof window !== "undefined") {
        // If we're running a web page and don't have either of the above, add our one global
        window.js_beautify = js_beautify;
    } else if (typeof global !== "undefined") {
        // If we don't even have window, try global.
        global.js_beautify = js_beautify;
    }

}());

if (IS_NODE) {
  beautify = exports.js_beautify;
  delete exports.js_beautify;
} else {
  beautify = global.js_beautify;
  global.js_beautify = globalBeautify;
}

var esprima, globalEsprima = global.esprima;

/* istanbul ignore next */
/*
  Copyright (C) 2013 Ariya Hidayat <ariya.hidayat@gmail.com>
  Copyright (C) 2013 Thaddee Tyl <thaddee.tyl@gmail.com>
  Copyright (C) 2013 Mathias Bynens <mathias@qiwi.be>
  Copyright (C) 2012 Ariya Hidayat <ariya.hidayat@gmail.com>
  Copyright (C) 2012 Mathias Bynens <mathias@qiwi.be>
  Copyright (C) 2012 Joost-Wim Boekesteijn <joost-wim@boekesteijn.nl>
  Copyright (C) 2012 Kris Kowal <kris.kowal@cixar.com>
  Copyright (C) 2012 Yusuke Suzuki <utatane.tea@gmail.com>
  Copyright (C) 2012 Arpad Borsos <arpad.borsos@googlemail.com>
  Copyright (C) 2011 Ariya Hidayat <ariya.hidayat@gmail.com>

  Redistribution and use in source and binary forms, with or without
  modification, are permitted provided that the following conditions are met:

    * Redistributions of source code must retain the above copyright
      notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer in the
      documentation and/or other materials provided with the distribution.

  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
  AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
  IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
  ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
  DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
  (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
  LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
  ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
  THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

/*jslint bitwise:true plusplus:true */
/*global esprima:true, define:true, exports:true, window: true,
throwErrorTolerant: true,
throwError: true, generateStatement: true, peek: true,
parseAssignmentExpression: true, parseBlock: true, parseExpression: true,
parseFunctionDeclaration: true, parseFunctionExpression: true,
parseFunctionSourceElements: true, parseVariableIdentifier: true,
parseLeftHandSideExpression: true,
parseUnaryExpression: true,
parseStatement: true, parseSourceElement: true */

(function (root, factory) {
    'use strict';

    // Universal Module Definition (UMD) to support AMD, CommonJS/Node.js,
    // Rhino, and plain browser loading.

    /* istanbul ignore next */
    if (typeof define === 'function' && define.amd) {
        define(['exports'], factory);
    } else if (typeof exports !== 'undefined') {
        factory(exports);
    } else {
        factory((root.esprima = {}));
    }
}(this, function (exports) {
    'use strict';

    var Token,
        TokenName,
        FnExprTokens,
        Syntax,
        PropertyKind,
        Messages,
        Regex,
        SyntaxTreeDelegate,
        source,
        strict,
        index,
        lineNumber,
        lineStart,
        length,
        delegate,
        lookahead,
        state,
        extra;

    Token = {
        BooleanLiteral: 1,
        EOF: 2,
        Identifier: 3,
        Keyword: 4,
        NullLiteral: 5,
        NumericLiteral: 6,
        Punctuator: 7,
        StringLiteral: 8,
        RegularExpression: 9
    };

    TokenName = {};
    TokenName[Token.BooleanLiteral] = 'Boolean';
    TokenName[Token.EOF] = '<end>';
    TokenName[Token.Identifier] = 'Identifier';
    TokenName[Token.Keyword] = 'Keyword';
    TokenName[Token.NullLiteral] = 'Null';
    TokenName[Token.NumericLiteral] = 'Numeric';
    TokenName[Token.Punctuator] = 'Punctuator';
    TokenName[Token.StringLiteral] = 'String';
    TokenName[Token.RegularExpression] = 'RegularExpression';

    // A function following one of those tokens is an expression.
    FnExprTokens = ['(', '{', '[', 'in', 'typeof', 'instanceof', 'new',
                    'return', 'case', 'delete', 'throw', 'void',
                    // assignment operators
                    '=', '+=', '-=', '*=', '/=', '%=', '<<=', '>>=', '>>>=',
                    '&=', '|=', '^=', ',',
                    // binary/unary operators
                    '+', '-', '*', '/', '%', '++', '--', '<<', '>>', '>>>', '&',
                    '|', '^', '!', '~', '&&', '||', '?', ':', '===', '==', '>=',
                    '<=', '<', '>', '!=', '!=='];

    Syntax = {
        AssignmentExpression: 'AssignmentExpression',
        ArrayExpression: 'ArrayExpression',
        BlockStatement: 'BlockStatement',
        BinaryExpression: 'BinaryExpression',
        BreakStatement: 'BreakStatement',
        CallExpression: 'CallExpression',
        CatchClause: 'CatchClause',
        ConditionalExpression: 'ConditionalExpression',
        ContinueStatement: 'ContinueStatement',
        DoWhileStatement: 'DoWhileStatement',
        DebuggerStatement: 'DebuggerStatement',
        EmptyStatement: 'EmptyStatement',
        ExpressionStatement: 'ExpressionStatement',
        ForStatement: 'ForStatement',
        ForInStatement: 'ForInStatement',
        FunctionDeclaration: 'FunctionDeclaration',
        FunctionExpression: 'FunctionExpression',
        Identifier: 'Identifier',
        IfStatement: 'IfStatement',
        Literal: 'Literal',
        LabeledStatement: 'LabeledStatement',
        LogicalExpression: 'LogicalExpression',
        MemberExpression: 'MemberExpression',
        NewExpression: 'NewExpression',
        ObjectExpression: 'ObjectExpression',
        Program: 'Program',
        Property: 'Property',
        ReturnStatement: 'ReturnStatement',
        SequenceExpression: 'SequenceExpression',
        SwitchStatement: 'SwitchStatement',
        SwitchCase: 'SwitchCase',
        ThisExpression: 'ThisExpression',
        ThrowStatement: 'ThrowStatement',
        TryStatement: 'TryStatement',
        UnaryExpression: 'UnaryExpression',
        UpdateExpression: 'UpdateExpression',
        VariableDeclaration: 'VariableDeclaration',
        VariableDeclarator: 'VariableDeclarator',
        WhileStatement: 'WhileStatement',
        WithStatement: 'WithStatement'
    };

    PropertyKind = {
        Data: 1,
        Get: 2,
        Set: 4
    };

    // Error messages should be identical to V8.
    Messages = {
        UnexpectedToken:  'Unexpected token %0',
        UnexpectedNumber:  'Unexpected number',
        UnexpectedString:  'Unexpected string',
        UnexpectedIdentifier:  'Unexpected identifier',
        UnexpectedReserved:  'Unexpected reserved word',
        UnexpectedEOS:  'Unexpected end of input',
        NewlineAfterThrow:  'Illegal newline after throw',
        InvalidRegExp: 'Invalid regular expression',
        UnterminatedRegExp:  'Invalid regular expression: missing /',
        InvalidLHSInAssignment:  'Invalid left-hand side in assignment',
        InvalidLHSInForIn:  'Invalid left-hand side in for-in',
        MultipleDefaultsInSwitch: 'More than one default clause in switch statement',
        NoCatchOrFinally:  'Missing catch or finally after try',
        UnknownLabel: 'Undefined label \'%0\'',
        Redeclaration: '%0 \'%1\' has already been declared',
        IllegalContinue: 'Illegal continue statement',
        IllegalBreak: 'Illegal break statement',
        IllegalReturn: 'Illegal return statement',
        StrictModeWith:  'Strict mode code may not include a with statement',
        StrictCatchVariable:  'Catch variable may not be eval or arguments in strict mode',
        StrictVarName:  'Variable name may not be eval or arguments in strict mode',
        StrictParamName:  'Parameter name eval or arguments is not allowed in strict mode',
        StrictParamDupe: 'Strict mode function may not have duplicate parameter names',
        StrictFunctionName:  'Function name may not be eval or arguments in strict mode',
        StrictOctalLiteral:  'Octal literals are not allowed in strict mode.',
        StrictDelete:  'Delete of an unqualified identifier in strict mode.',
        StrictDuplicateProperty:  'Duplicate data property in object literal not allowed in strict mode',
        AccessorDataProperty:  'Object literal may not have data and accessor property with the same name',
        AccessorGetSet:  'Object literal may not have multiple get/set accessors with the same name',
        StrictLHSAssignment:  'Assignment to eval or arguments is not allowed in strict mode',
        StrictLHSPostfix:  'Postfix increment/decrement may not have eval or arguments operand in strict mode',
        StrictLHSPrefix:  'Prefix increment/decrement may not have eval or arguments operand in strict mode',
        StrictReservedWord:  'Use of future reserved word in strict mode'
    };

    // See also tools/generate-unicode-regex.py.
    Regex = {
        NonAsciiIdentifierStart: new RegExp('[\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u0527\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0\u08A2-\u08AC\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0977\u0979-\u097F\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C33\u0C35-\u0C39\u0C3D\u0C58\u0C59\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D60\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F0\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191C\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19C1-\u19C7\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA697\uA6A0-\uA6EF\uA717-\uA71F\uA722-\uA788\uA78B-\uA78E\uA790-\uA793\uA7A0-\uA7AA\uA7F8-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA80-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uABC0-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]'),
        NonAsciiIdentifierPart: new RegExp('[\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0300-\u0374\u0376\u0377\u037A-\u037D\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u0483-\u0487\u048A-\u0527\u0531-\u0556\u0559\u0561-\u0587\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u05D0-\u05EA\u05F0-\u05F2\u0610-\u061A\u0620-\u0669\u066E-\u06D3\u06D5-\u06DC\u06DF-\u06E8\u06EA-\u06FC\u06FF\u0710-\u074A\u074D-\u07B1\u07C0-\u07F5\u07FA\u0800-\u082D\u0840-\u085B\u08A0\u08A2-\u08AC\u08E4-\u08FE\u0900-\u0963\u0966-\u096F\u0971-\u0977\u0979-\u097F\u0981-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BC-\u09C4\u09C7\u09C8\u09CB-\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E3\u09E6-\u09F1\u0A01-\u0A03\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A59-\u0A5C\u0A5E\u0A66-\u0A75\u0A81-\u0A83\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABC-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AD0\u0AE0-\u0AE3\u0AE6-\u0AEF\u0B01-\u0B03\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3C-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B56\u0B57\u0B5C\u0B5D\u0B5F-\u0B63\u0B66-\u0B6F\u0B71\u0B82\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD0\u0BD7\u0BE6-\u0BEF\u0C01-\u0C03\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C33\u0C35-\u0C39\u0C3D-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C58\u0C59\u0C60-\u0C63\u0C66-\u0C6F\u0C82\u0C83\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBC-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CDE\u0CE0-\u0CE3\u0CE6-\u0CEF\u0CF1\u0CF2\u0D02\u0D03\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D-\u0D44\u0D46-\u0D48\u0D4A-\u0D4E\u0D57\u0D60-\u0D63\u0D66-\u0D6F\u0D7A-\u0D7F\u0D82\u0D83\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DF2\u0DF3\u0E01-\u0E3A\u0E40-\u0E4E\u0E50-\u0E59\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB9\u0EBB-\u0EBD\u0EC0-\u0EC4\u0EC6\u0EC8-\u0ECD\u0ED0-\u0ED9\u0EDC-\u0EDF\u0F00\u0F18\u0F19\u0F20-\u0F29\u0F35\u0F37\u0F39\u0F3E-\u0F47\u0F49-\u0F6C\u0F71-\u0F84\u0F86-\u0F97\u0F99-\u0FBC\u0FC6\u1000-\u1049\u1050-\u109D\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u135D-\u135F\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F0\u1700-\u170C\u170E-\u1714\u1720-\u1734\u1740-\u1753\u1760-\u176C\u176E-\u1770\u1772\u1773\u1780-\u17D3\u17D7\u17DC\u17DD\u17E0-\u17E9\u180B-\u180D\u1810-\u1819\u1820-\u1877\u1880-\u18AA\u18B0-\u18F5\u1900-\u191C\u1920-\u192B\u1930-\u193B\u1946-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u19D0-\u19D9\u1A00-\u1A1B\u1A20-\u1A5E\u1A60-\u1A7C\u1A7F-\u1A89\u1A90-\u1A99\u1AA7\u1B00-\u1B4B\u1B50-\u1B59\u1B6B-\u1B73\u1B80-\u1BF3\u1C00-\u1C37\u1C40-\u1C49\u1C4D-\u1C7D\u1CD0-\u1CD2\u1CD4-\u1CF6\u1D00-\u1DE6\u1DFC-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u200C\u200D\u203F\u2040\u2054\u2071\u207F\u2090-\u209C\u20D0-\u20DC\u20E1\u20E5-\u20F0\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D7F-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2DE0-\u2DFF\u2E2F\u3005-\u3007\u3021-\u302F\u3031-\u3035\u3038-\u303C\u3041-\u3096\u3099\u309A\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA62B\uA640-\uA66F\uA674-\uA67D\uA67F-\uA697\uA69F-\uA6F1\uA717-\uA71F\uA722-\uA788\uA78B-\uA78E\uA790-\uA793\uA7A0-\uA7AA\uA7F8-\uA827\uA840-\uA873\uA880-\uA8C4\uA8D0-\uA8D9\uA8E0-\uA8F7\uA8FB\uA900-\uA92D\uA930-\uA953\uA960-\uA97C\uA980-\uA9C0\uA9CF-\uA9D9\uAA00-\uAA36\uAA40-\uAA4D\uAA50-\uAA59\uAA60-\uAA76\uAA7A\uAA7B\uAA80-\uAAC2\uAADB-\uAADD\uAAE0-\uAAEF\uAAF2-\uAAF6\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uABC0-\uABEA\uABEC\uABED\uABF0-\uABF9\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE00-\uFE0F\uFE20-\uFE26\uFE33\uFE34\uFE4D-\uFE4F\uFE70-\uFE74\uFE76-\uFEFC\uFF10-\uFF19\uFF21-\uFF3A\uFF3F\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]')
    };

    // Ensure the condition is true, otherwise throw an error.
    // This is only to have a better contract semantic, i.e. another safety net
    // to catch a logic error. The condition shall be fulfilled in normal case.
    // Do NOT use this to enforce a certain condition on any user input.

    function assert(condition, message) {
        /* istanbul ignore if */
        if (!condition) {
            throw new Error('ASSERT: ' + message);
        }
    }

    function isDecimalDigit(ch) {
        return (ch >= 48 && ch <= 57);   // 0..9
    }

    function isHexDigit(ch) {
        return '0123456789abcdefABCDEF'.indexOf(ch) >= 0;
    }

    function isOctalDigit(ch) {
        return '01234567'.indexOf(ch) >= 0;
    }


    // 7.2 White Space

    function isWhiteSpace(ch) {
        return (ch === 0x20) || (ch === 0x09) || (ch === 0x0B) || (ch === 0x0C) || (ch === 0xA0) ||
            (ch >= 0x1680 && [0x1680, 0x180E, 0x2000, 0x2001, 0x2002, 0x2003, 0x2004, 0x2005, 0x2006, 0x2007, 0x2008, 0x2009, 0x200A, 0x202F, 0x205F, 0x3000, 0xFEFF].indexOf(ch) >= 0);
    }

    // 7.3 Line Terminators

    function isLineTerminator(ch) {
        return (ch === 0x0A) || (ch === 0x0D) || (ch === 0x2028) || (ch === 0x2029);
    }

    // 7.6 Identifier Names and Identifiers

    function isIdentifierStart(ch) {
        return (ch === 0x24) || (ch === 0x5F) ||  // $ (dollar) and _ (underscore)
            (ch >= 0x41 && ch <= 0x5A) ||         // A..Z
            (ch >= 0x61 && ch <= 0x7A) ||         // a..z
            (ch === 0x5C) ||                      // \ (backslash)
            ((ch >= 0x80) && Regex.NonAsciiIdentifierStart.test(String.fromCharCode(ch)));
    }

    function isIdentifierPart(ch) {
        return (ch === 0x24) || (ch === 0x5F) ||  // $ (dollar) and _ (underscore)
            (ch >= 0x41 && ch <= 0x5A) ||         // A..Z
            (ch >= 0x61 && ch <= 0x7A) ||         // a..z
            (ch >= 0x30 && ch <= 0x39) ||         // 0..9
            (ch === 0x5C) ||                      // \ (backslash)
            ((ch >= 0x80) && Regex.NonAsciiIdentifierPart.test(String.fromCharCode(ch)));
    }

    // 7.6.1.2 Future Reserved Words

    function isFutureReservedWord(id) {
        switch (id) {
        case 'class':
        case 'enum':
        case 'export':
        case 'extends':
        case 'import':
        case 'super':
            return true;
        default:
            return false;
        }
    }

    function isStrictModeReservedWord(id) {
        switch (id) {
        case 'implements':
        case 'interface':
        case 'package':
        case 'private':
        case 'protected':
        case 'public':
        case 'static':
        case 'yield':
        case 'let':
            return true;
        default:
            return false;
        }
    }

    function isRestrictedWord(id) {
        return id === 'eval' || id === 'arguments';
    }

    // 7.6.1.1 Keywords

    function isKeyword(id) {
        if (strict && isStrictModeReservedWord(id)) {
            return true;
        }

        // 'const' is specialized as Keyword in V8.
        // 'yield' and 'let' are for compatiblity with SpiderMonkey and ES.next.
        // Some others are from future reserved words.

        switch (id.length) {
        case 2:
            return (id === 'if') || (id === 'in') || (id === 'do');
        case 3:
            return (id === 'var') || (id === 'for') || (id === 'new') ||
                (id === 'try') || (id === 'let');
        case 4:
            return (id === 'this') || (id === 'else') || (id === 'case') ||
                (id === 'void') || (id === 'with') || (id === 'enum');
        case 5:
            return (id === 'while') || (id === 'break') || (id === 'catch') ||
                (id === 'throw') || (id === 'const') || (id === 'yield') ||
                (id === 'class') || (id === 'super');
        case 6:
            return (id === 'return') || (id === 'typeof') || (id === 'delete') ||
                (id === 'switch') || (id === 'export') || (id === 'import');
        case 7:
            return (id === 'default') || (id === 'finally') || (id === 'extends');
        case 8:
            return (id === 'function') || (id === 'continue') || (id === 'debugger');
        case 10:
            return (id === 'instanceof');
        default:
            return false;
        }
    }

    // 7.4 Comments

    function addComment(type, value, start, end, loc) {
        var comment, attacher;

        assert(typeof start === 'number', 'Comment must have valid position');

        // Because the way the actual token is scanned, often the comments
        // (if any) are skipped twice during the lexical analysis.
        // Thus, we need to skip adding a comment if the comment array already
        // handled it.
        if (state.lastCommentStart >= start) {
            return;
        }
        state.lastCommentStart = start;

        comment = {
            type: type,
            value: value
        };
        if (extra.range) {
            comment.range = [start, end];
        }
        if (extra.loc) {
            comment.loc = loc;
        }
        extra.comments.push(comment);
        if (extra.attachComment) {
            extra.leadingComments.push(comment);
            extra.trailingComments.push(comment);
        }
    }

    function skipSingleLineComment(offset) {
        var start, loc, ch, comment;

        start = index - offset;
        loc = {
            start: {
                line: lineNumber,
                column: index - lineStart - offset
            }
        };

        while (index < length) {
            ch = source.charCodeAt(index);
            ++index;
            if (isLineTerminator(ch)) {
                if (extra.comments) {
                    comment = source.slice(start + offset, index - 1);
                    loc.end = {
                        line: lineNumber,
                        column: index - lineStart - 1
                    };
                    addComment('Line', comment, start, index - 1, loc);
                }
                if (ch === 13 && source.charCodeAt(index) === 10) {
                    ++index;
                }
                ++lineNumber;
                lineStart = index;
                return;
            }
        }

        if (extra.comments) {
            comment = source.slice(start + offset, index);
            loc.end = {
                line: lineNumber,
                column: index - lineStart
            };
            addComment('Line', comment, start, index, loc);
        }
    }

    function skipMultiLineComment() {
        var start, loc, ch, comment;

        if (extra.comments) {
            start = index - 2;
            loc = {
                start: {
                    line: lineNumber,
                    column: index - lineStart - 2
                }
            };
        }

        while (index < length) {
            ch = source.charCodeAt(index);
            if (isLineTerminator(ch)) {
                if (ch === 0x0D && source.charCodeAt(index + 1) === 0x0A) {
                    ++index;
                }
                ++lineNumber;
                ++index;
                lineStart = index;
                if (index >= length) {
                    throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
                }
            } else if (ch === 0x2A) {
                // Block comment ends with '*/'.
                if (source.charCodeAt(index + 1) === 0x2F) {
                    ++index;
                    ++index;
                    if (extra.comments) {
                        comment = source.slice(start + 2, index - 2);
                        loc.end = {
                            line: lineNumber,
                            column: index - lineStart
                        };
                        addComment('Block', comment, start, index, loc);
                    }
                    return;
                }
                ++index;
            } else {
                ++index;
            }
        }

        throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
    }

    function skipComment() {
        var ch, start;

        start = (index === 0);
        while (index < length) {
            ch = source.charCodeAt(index);

            if (isWhiteSpace(ch)) {
                ++index;
            } else if (isLineTerminator(ch)) {
                ++index;
                if (ch === 0x0D && source.charCodeAt(index) === 0x0A) {
                    ++index;
                }
                ++lineNumber;
                lineStart = index;
                start = true;
            } else if (ch === 0x2F) { // U+002F is '/'
                ch = source.charCodeAt(index + 1);
                if (ch === 0x2F) {
                    ++index;
                    ++index;
                    skipSingleLineComment(2);
                    start = true;
                } else if (ch === 0x2A) {  // U+002A is '*'
                    ++index;
                    ++index;
                    skipMultiLineComment();
                } else {
                    break;
                }
            } else if (start && ch === 0x2D) { // U+002D is '-'
                // U+003E is '>'
                if ((source.charCodeAt(index + 1) === 0x2D) && (source.charCodeAt(index + 2) === 0x3E)) {
                    // '-->' is a single-line comment
                    index += 3;
                    skipSingleLineComment(3);
                } else {
                    break;
                }
            } else if (ch === 0x3C) { // U+003C is '<'
                if (source.slice(index + 1, index + 4) === '!--') {
                    ++index; // `<`
                    ++index; // `!`
                    ++index; // `-`
                    ++index; // `-`
                    skipSingleLineComment(4);
                } else {
                    break;
                }
            } else {
                break;
            }
        }
    }

    function scanHexEscape(prefix) {
        var i, len, ch, code = 0;

        len = (prefix === 'u') ? 4 : 2;
        for (i = 0; i < len; ++i) {
            if (index < length && isHexDigit(source[index])) {
                ch = source[index++];
                code = code * 16 + '0123456789abcdef'.indexOf(ch.toLowerCase());
            } else {
                return '';
            }
        }
        return String.fromCharCode(code);
    }

    function getEscapedIdentifier() {
        var ch, id;

        ch = source.charCodeAt(index++);
        id = String.fromCharCode(ch);

        // '\u' (U+005C, U+0075) denotes an escaped character.
        if (ch === 0x5C) {
            if (source.charCodeAt(index) !== 0x75) {
                throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
            }
            ++index;
            ch = scanHexEscape('u');
            if (!ch || ch === '\\' || !isIdentifierStart(ch.charCodeAt(0))) {
                throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
            }
            id = ch;
        }

        while (index < length) {
            ch = source.charCodeAt(index);
            if (!isIdentifierPart(ch)) {
                break;
            }
            ++index;
            id += String.fromCharCode(ch);

            // '\u' (U+005C, U+0075) denotes an escaped character.
            if (ch === 0x5C) {
                id = id.substr(0, id.length - 1);
                if (source.charCodeAt(index) !== 0x75) {
                    throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
                }
                ++index;
                ch = scanHexEscape('u');
                if (!ch || ch === '\\' || !isIdentifierPart(ch.charCodeAt(0))) {
                    throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
                }
                id += ch;
            }
        }

        return id;
    }

    function getIdentifier() {
        var start, ch;

        start = index++;
        while (index < length) {
            ch = source.charCodeAt(index);
            if (ch === 0x5C) {
                // Blackslash (U+005C) marks Unicode escape sequence.
                index = start;
                return getEscapedIdentifier();
            }
            if (isIdentifierPart(ch)) {
                ++index;
            } else {
                break;
            }
        }

        return source.slice(start, index);
    }

    function scanIdentifier() {
        var start, id, type;

        start = index;

        // Backslash (U+005C) starts an escaped character.
        id = (source.charCodeAt(index) === 0x5C) ? getEscapedIdentifier() : getIdentifier();

        // There is no keyword or literal with only one character.
        // Thus, it must be an identifier.
        if (id.length === 1) {
            type = Token.Identifier;
        } else if (isKeyword(id)) {
            type = Token.Keyword;
        } else if (id === 'null') {
            type = Token.NullLiteral;
        } else if (id === 'true' || id === 'false') {
            type = Token.BooleanLiteral;
        } else {
            type = Token.Identifier;
        }

        return {
            type: type,
            value: id,
            lineNumber: lineNumber,
            lineStart: lineStart,
            start: start,
            end: index
        };
    }


    // 7.7 Punctuators

    function scanPunctuator() {
        var start = index,
            code = source.charCodeAt(index),
            code2,
            ch1 = source[index],
            ch2,
            ch3,
            ch4;

        switch (code) {

        // Check for most common single-character punctuators.
        case 0x2E:  // . dot
        case 0x28:  // ( open bracket
        case 0x29:  // ) close bracket
        case 0x3B:  // ; semicolon
        case 0x2C:  // , comma
        case 0x7B:  // { open curly brace
        case 0x7D:  // } close curly brace
        case 0x5B:  // [
        case 0x5D:  // ]
        case 0x3A:  // :
        case 0x3F:  // ?
        case 0x7E:  // ~
            ++index;
            if (extra.tokenize) {
                if (code === 0x28) {
                    extra.openParenToken = extra.tokens.length;
                } else if (code === 0x7B) {
                    extra.openCurlyToken = extra.tokens.length;
                }
            }
            return {
                type: Token.Punctuator,
                value: String.fromCharCode(code),
                lineNumber: lineNumber,
                lineStart: lineStart,
                start: start,
                end: index
            };

        default:
            code2 = source.charCodeAt(index + 1);

            // '=' (U+003D) marks an assignment or comparison operator.
            if (code2 === 0x3D) {
                switch (code) {
                case 0x2B:  // +
                case 0x2D:  // -
                case 0x2F:  // /
                case 0x3C:  // <
                case 0x3E:  // >
                case 0x5E:  // ^
                case 0x7C:  // |
                case 0x25:  // %
                case 0x26:  // &
                case 0x2A:  // *
                    index += 2;
                    return {
                        type: Token.Punctuator,
                        value: String.fromCharCode(code) + String.fromCharCode(code2),
                        lineNumber: lineNumber,
                        lineStart: lineStart,
                        start: start,
                        end: index
                    };

                case 0x21: // !
                case 0x3D: // =
                    index += 2;

                    // !== and ===
                    if (source.charCodeAt(index) === 0x3D) {
                        ++index;
                    }
                    return {
                        type: Token.Punctuator,
                        value: source.slice(start, index),
                        lineNumber: lineNumber,
                        lineStart: lineStart,
                        start: start,
                        end: index
                    };
                }
            }
        }

        // 4-character punctuator: >>>=

        ch4 = source.substr(index, 4);

        if (ch4 === '>>>=') {
            index += 4;
            return {
                type: Token.Punctuator,
                value: ch4,
                lineNumber: lineNumber,
                lineStart: lineStart,
                start: start,
                end: index
            };
        }

        // 3-character punctuators: === !== >>> <<= >>=

        ch3 = ch4.substr(0, 3);

        if (ch3 === '>>>' || ch3 === '<<=' || ch3 === '>>=') {
            index += 3;
            return {
                type: Token.Punctuator,
                value: ch3,
                lineNumber: lineNumber,
                lineStart: lineStart,
                start: start,
                end: index
            };
        }

        // Other 2-character punctuators: ++ -- << >> && ||
        ch2 = ch3.substr(0, 2);

        if ((ch1 === ch2[1] && ('+-<>&|'.indexOf(ch1) >= 0)) || ch2 === '=>') {
            index += 2;
            return {
                type: Token.Punctuator,
                value: ch2,
                lineNumber: lineNumber,
                lineStart: lineStart,
                start: start,
                end: index
            };
        }

        // 1-character punctuators: < > = ! + - * % & | ^ /
        if ('<>=!+-*%&|^/'.indexOf(ch1) >= 0) {
            ++index;
            return {
                type: Token.Punctuator,
                value: ch1,
                lineNumber: lineNumber,
                lineStart: lineStart,
                start: start,
                end: index
            };
        }

        throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
    }

    // 7.8.3 Numeric Literals

    function scanHexLiteral(start) {
        var number = '';

        while (index < length) {
            if (!isHexDigit(source[index])) {
                break;
            }
            number += source[index++];
        }

        if (number.length === 0) {
            throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
        }

        if (isIdentifierStart(source.charCodeAt(index))) {
            throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
        }

        return {
            type: Token.NumericLiteral,
            value: parseInt('0x' + number, 16),
            lineNumber: lineNumber,
            lineStart: lineStart,
            start: start,
            end: index
        };
    }

    function scanOctalLiteral(start) {
        var number = '0' + source[index++];
        while (index < length) {
            if (!isOctalDigit(source[index])) {
                break;
            }
            number += source[index++];
        }

        if (isIdentifierStart(source.charCodeAt(index)) || isDecimalDigit(source.charCodeAt(index))) {
            throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
        }

        return {
            type: Token.NumericLiteral,
            value: parseInt(number, 8),
            octal: true,
            lineNumber: lineNumber,
            lineStart: lineStart,
            start: start,
            end: index
        };
    }

    function scanNumericLiteral() {
        var number, start, ch;

        ch = source[index];
        assert(isDecimalDigit(ch.charCodeAt(0)) || (ch === '.'),
            'Numeric literal must start with a decimal digit or a decimal point');

        start = index;
        number = '';
        if (ch !== '.') {
            number = source[index++];
            ch = source[index];

            // Hex number starts with '0x'.
            // Octal number starts with '0'.
            if (number === '0') {
                if (ch === 'x' || ch === 'X') {
                    ++index;
                    return scanHexLiteral(start);
                }
                if (isOctalDigit(ch)) {
                    return scanOctalLiteral(start);
                }

                // decimal number starts with '0' such as '09' is illegal.
                if (ch && isDecimalDigit(ch.charCodeAt(0))) {
                    throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
                }
            }

            while (isDecimalDigit(source.charCodeAt(index))) {
                number += source[index++];
            }
            ch = source[index];
        }

        if (ch === '.') {
            number += source[index++];
            while (isDecimalDigit(source.charCodeAt(index))) {
                number += source[index++];
            }
            ch = source[index];
        }

        if (ch === 'e' || ch === 'E') {
            number += source[index++];

            ch = source[index];
            if (ch === '+' || ch === '-') {
                number += source[index++];
            }
            if (isDecimalDigit(source.charCodeAt(index))) {
                while (isDecimalDigit(source.charCodeAt(index))) {
                    number += source[index++];
                }
            } else {
                throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
            }
        }

        if (isIdentifierStart(source.charCodeAt(index))) {
            throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
        }

        return {
            type: Token.NumericLiteral,
            value: parseFloat(number),
            lineNumber: lineNumber,
            lineStart: lineStart,
            start: start,
            end: index
        };
    }

    // 7.8.4 String Literals

    function scanStringLiteral() {
        var str = '', quote, start, ch, code, unescaped, restore, octal = false, startLineNumber, startLineStart;
        startLineNumber = lineNumber;
        startLineStart = lineStart;

        quote = source[index];
        assert((quote === '\'' || quote === '"'),
            'String literal must starts with a quote');

        start = index;
        ++index;

        while (index < length) {
            ch = source[index++];

            if (ch === quote) {
                quote = '';
                break;
            } else if (ch === '\\') {
                ch = source[index++];
                if (!ch || !isLineTerminator(ch.charCodeAt(0))) {
                    switch (ch) {
                    case 'u':
                    case 'x':
                        restore = index;
                        unescaped = scanHexEscape(ch);
                        if (unescaped) {
                            str += unescaped;
                        } else {
                            index = restore;
                            str += ch;
                        }
                        break;
                    case 'n':
                        str += '\n';
                        break;
                    case 'r':
                        str += '\r';
                        break;
                    case 't':
                        str += '\t';
                        break;
                    case 'b':
                        str += '\b';
                        break;
                    case 'f':
                        str += '\f';
                        break;
                    case 'v':
                        str += '\x0B';
                        break;

                    default:
                        if (isOctalDigit(ch)) {
                            code = '01234567'.indexOf(ch);

                            // \0 is not octal escape sequence
                            if (code !== 0) {
                                octal = true;
                            }

                            if (index < length && isOctalDigit(source[index])) {
                                octal = true;
                                code = code * 8 + '01234567'.indexOf(source[index++]);

                                // 3 digits are only allowed when string starts
                                // with 0, 1, 2, 3
                                if ('0123'.indexOf(ch) >= 0 &&
                                        index < length &&
                                        isOctalDigit(source[index])) {
                                    code = code * 8 + '01234567'.indexOf(source[index++]);
                                }
                            }
                            str += String.fromCharCode(code);
                        } else {
                            str += ch;
                        }
                        break;
                    }
                } else {
                    ++lineNumber;
                    if (ch ===  '\r' && source[index] === '\n') {
                        ++index;
                    }
                    lineStart = index;
                }
            } else if (isLineTerminator(ch.charCodeAt(0))) {
                break;
            } else {
                str += ch;
            }
        }

        if (quote !== '') {
            throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
        }

        return {
            type: Token.StringLiteral,
            value: str,
            octal: octal,
            startLineNumber: startLineNumber,
            startLineStart: startLineStart,
            lineNumber: lineNumber,
            lineStart: lineStart,
            start: start,
            end: index
        };
    }

    function testRegExp(pattern, flags) {
        var value;
        try {
            value = new RegExp(pattern, flags);
        } catch (e) {
            throwError({}, Messages.InvalidRegExp);
        }
        return value;
    }

    function scanRegExpBody() {
        var ch, str, classMarker, terminated, body;

        ch = source[index];
        assert(ch === '/', 'Regular expression literal must start with a slash');
        str = source[index++];

        classMarker = false;
        terminated = false;
        while (index < length) {
            ch = source[index++];
            str += ch;
            if (ch === '\\') {
                ch = source[index++];
                // ECMA-262 7.8.5
                if (isLineTerminator(ch.charCodeAt(0))) {
                    throwError({}, Messages.UnterminatedRegExp);
                }
                str += ch;
            } else if (isLineTerminator(ch.charCodeAt(0))) {
                throwError({}, Messages.UnterminatedRegExp);
            } else if (classMarker) {
                if (ch === ']') {
                    classMarker = false;
                }
            } else {
                if (ch === '/') {
                    terminated = true;
                    break;
                } else if (ch === '[') {
                    classMarker = true;
                }
            }
        }

        if (!terminated) {
            throwError({}, Messages.UnterminatedRegExp);
        }

        // Exclude leading and trailing slash.
        body = str.substr(1, str.length - 2);
        return {
            value: body,
            literal: str
        };
    }

    function scanRegExpFlags() {
        var ch, str, flags, restore;

        str = '';
        flags = '';
        while (index < length) {
            ch = source[index];
            if (!isIdentifierPart(ch.charCodeAt(0))) {
                break;
            }

            ++index;
            if (ch === '\\' && index < length) {
                ch = source[index];
                if (ch === 'u') {
                    ++index;
                    restore = index;
                    ch = scanHexEscape('u');
                    if (ch) {
                        flags += ch;
                        for (str += '\\u'; restore < index; ++restore) {
                            str += source[restore];
                        }
                    } else {
                        index = restore;
                        flags += 'u';
                        str += '\\u';
                    }
                    throwErrorTolerant({}, Messages.UnexpectedToken, 'ILLEGAL');
                } else {
                    str += '\\';
                    throwErrorTolerant({}, Messages.UnexpectedToken, 'ILLEGAL');
                }
            } else {
                flags += ch;
                str += ch;
            }
        }

        return {
            value: flags,
            literal: str
        };
    }

    function scanRegExp() {
        var start, body, flags, pattern, value;

        lookahead = null;
        skipComment();
        start = index;

        body = scanRegExpBody();
        flags = scanRegExpFlags();
        value = testRegExp(body.value, flags.value);

        if (extra.tokenize) {
            return {
                type: Token.RegularExpression,
                value: value,
                lineNumber: lineNumber,
                lineStart: lineStart,
                start: start,
                end: index
            };
        }

        return {
            literal: body.literal + flags.literal,
            value: value,
            start: start,
            end: index
        };
    }

    function collectRegex() {
        var pos, loc, regex, token;

        skipComment();

        pos = index;
        loc = {
            start: {
                line: lineNumber,
                column: index - lineStart
            }
        };

        regex = scanRegExp();
        loc.end = {
            line: lineNumber,
            column: index - lineStart
        };

        /* istanbul ignore next */
        if (!extra.tokenize) {
            // Pop the previous token, which is likely '/' or '/='
            if (extra.tokens.length > 0) {
                token = extra.tokens[extra.tokens.length - 1];
                if (token.range[0] === pos && token.type === 'Punctuator') {
                    if (token.value === '/' || token.value === '/=') {
                        extra.tokens.pop();
                    }
                }
            }

            extra.tokens.push({
                type: 'RegularExpression',
                value: regex.literal,
                range: [pos, index],
                loc: loc
            });
        }

        return regex;
    }

    function isIdentifierName(token) {
        return token.type === Token.Identifier ||
            token.type === Token.Keyword ||
            token.type === Token.BooleanLiteral ||
            token.type === Token.NullLiteral;
    }

    function advanceSlash() {
        var prevToken,
            checkToken;
        // Using the following algorithm:
        // https://github.com/mozilla/sweet.js/wiki/design
        prevToken = extra.tokens[extra.tokens.length - 1];
        if (!prevToken) {
            // Nothing before that: it cannot be a division.
            return collectRegex();
        }
        if (prevToken.type === 'Punctuator') {
            if (prevToken.value === ']') {
                return scanPunctuator();
            }
            if (prevToken.value === ')') {
                checkToken = extra.tokens[extra.openParenToken - 1];
                if (checkToken &&
                        checkToken.type === 'Keyword' &&
                        (checkToken.value === 'if' ||
                         checkToken.value === 'while' ||
                         checkToken.value === 'for' ||
                         checkToken.value === 'with')) {
                    return collectRegex();
                }
                return scanPunctuator();
            }
            if (prevToken.value === '}') {
                // Dividing a function by anything makes little sense,
                // but we have to check for that.
                if (extra.tokens[extra.openCurlyToken - 3] &&
                        extra.tokens[extra.openCurlyToken - 3].type === 'Keyword') {
                    // Anonymous function.
                    checkToken = extra.tokens[extra.openCurlyToken - 4];
                    if (!checkToken) {
                        return scanPunctuator();
                    }
                } else if (extra.tokens[extra.openCurlyToken - 4] &&
                        extra.tokens[extra.openCurlyToken - 4].type === 'Keyword') {
                    // Named function.
                    checkToken = extra.tokens[extra.openCurlyToken - 5];
                    if (!checkToken) {
                        return collectRegex();
                    }
                } else {
                    return scanPunctuator();
                }
                // checkToken determines whether the function is
                // a declaration or an expression.
                if (FnExprTokens.indexOf(checkToken.value) >= 0) {
                    // It is an expression.
                    return scanPunctuator();
                }
                // It is a declaration.
                return collectRegex();
            }
            return collectRegex();
        }
        if (prevToken.type === 'Keyword') {
            return collectRegex();
        }
        return scanPunctuator();
    }

    function advance() {
        var ch;

        skipComment();

        if (index >= length) {
            return {
                type: Token.EOF,
                lineNumber: lineNumber,
                lineStart: lineStart,
                start: index,
                end: index
            };
        }

        ch = source.charCodeAt(index);

        if (isIdentifierStart(ch)) {
            return scanIdentifier();
        }

        // Very common: ( and ) and ;
        if (ch === 0x28 || ch === 0x29 || ch === 0x3B) {
            return scanPunctuator();
        }

        // String literal starts with single quote (U+0027) or double quote (U+0022).
        if (ch === 0x27 || ch === 0x22) {
            return scanStringLiteral();
        }


        // Dot (.) U+002E can also start a floating-point number, hence the need
        // to check the next character.
        if (ch === 0x2E) {
            if (isDecimalDigit(source.charCodeAt(index + 1))) {
                return scanNumericLiteral();
            }
            return scanPunctuator();
        }

        if (isDecimalDigit(ch)) {
            return scanNumericLiteral();
        }

        // Slash (/) U+002F can also start a regex.
        if (extra.tokenize && ch === 0x2F) {
            return advanceSlash();
        }

        return scanPunctuator();
    }

    function collectToken() {
        var loc, token, range, value;

        skipComment();
        loc = {
            start: {
                line: lineNumber,
                column: index - lineStart
            }
        };

        token = advance();
        loc.end = {
            line: lineNumber,
            column: index - lineStart
        };

        if (token.type !== Token.EOF) {
            value = source.slice(token.start, token.end);
            extra.tokens.push({
                type: TokenName[token.type],
                value: value,
                range: [token.start, token.end],
                loc: loc
            });
        }

        return token;
    }

    function lex() {
        var token;

        token = lookahead;
        index = token.end;
        lineNumber = token.lineNumber;
        lineStart = token.lineStart;

        lookahead = (typeof extra.tokens !== 'undefined') ? collectToken() : advance();

        index = token.end;
        lineNumber = token.lineNumber;
        lineStart = token.lineStart;

        return token;
    }

    function peek() {
        var pos, line, start;

        pos = index;
        line = lineNumber;
        start = lineStart;
        lookahead = (typeof extra.tokens !== 'undefined') ? collectToken() : advance();
        index = pos;
        lineNumber = line;
        lineStart = start;
    }

    function Position(line, column) {
        this.line = line;
        this.column = column;
    }

    function SourceLocation(startLine, startColumn, line, column) {
        this.start = new Position(startLine, startColumn);
        this.end = new Position(line, column);
    }

    SyntaxTreeDelegate = {

        name: 'SyntaxTree',

        processComment: function (node) {
            var lastChild, trailingComments;

            if (node.type === Syntax.Program) {
                if (node.body.length > 0) {
                    return;
                }
            }

            if (extra.trailingComments.length > 0) {
                if (extra.trailingComments[0].range[0] >= node.range[1]) {
                    trailingComments = extra.trailingComments;
                    extra.trailingComments = [];
                } else {
                    extra.trailingComments.length = 0;
                }
            } else {
                if (extra.bottomRightStack.length > 0 &&
                        extra.bottomRightStack[extra.bottomRightStack.length - 1].trailingComments &&
                        extra.bottomRightStack[extra.bottomRightStack.length - 1].trailingComments[0].range[0] >= node.range[1]) {
                    trailingComments = extra.bottomRightStack[extra.bottomRightStack.length - 1].trailingComments;
                    delete extra.bottomRightStack[extra.bottomRightStack.length - 1].trailingComments;
                }
            }

            // Eating the stack.
            while (extra.bottomRightStack.length > 0 && extra.bottomRightStack[extra.bottomRightStack.length - 1].range[0] >= node.range[0]) {
                lastChild = extra.bottomRightStack.pop();
            }

            if (lastChild) {
                if (lastChild.leadingComments && lastChild.leadingComments[lastChild.leadingComments.length - 1].range[1] <= node.range[0]) {
                    node.leadingComments = lastChild.leadingComments;
                    delete lastChild.leadingComments;
                }
            } else if (extra.leadingComments.length > 0 && extra.leadingComments[extra.leadingComments.length - 1].range[1] <= node.range[0]) {
                node.leadingComments = extra.leadingComments;
                extra.leadingComments = [];
            }


            if (trailingComments) {
                node.trailingComments = trailingComments;
            }

            extra.bottomRightStack.push(node);
        },

        markEnd: function (node, startToken) {
            if (extra.range) {
                node.range = [startToken.start, index];
            }
            if (extra.loc) {
                node.loc = new SourceLocation(
                    startToken.startLineNumber === undefined ?  startToken.lineNumber : startToken.startLineNumber,
                    startToken.start - (startToken.startLineStart === undefined ?  startToken.lineStart : startToken.startLineStart),
                    lineNumber,
                    index - lineStart
                );
                this.postProcess(node);
            }

            if (extra.attachComment) {
                this.processComment(node);
            }
            return node;
        },

        postProcess: function (node) {
            if (extra.source) {
                node.loc.source = extra.source;
            }
            return node;
        },

        createArrayExpression: function (elements) {
            return {
                type: Syntax.ArrayExpression,
                elements: elements
            };
        },

        createAssignmentExpression: function (operator, left, right) {
            return {
                type: Syntax.AssignmentExpression,
                operator: operator,
                left: left,
                right: right
            };
        },

        createBinaryExpression: function (operator, left, right) {
            var type = (operator === '||' || operator === '&&') ? Syntax.LogicalExpression :
                        Syntax.BinaryExpression;
            return {
                type: type,
                operator: operator,
                left: left,
                right: right
            };
        },

        createBlockStatement: function (body) {
            return {
                type: Syntax.BlockStatement,
                body: body
            };
        },

        createBreakStatement: function (label) {
            return {
                type: Syntax.BreakStatement,
                label: label
            };
        },

        createCallExpression: function (callee, args) {
            return {
                type: Syntax.CallExpression,
                callee: callee,
                'arguments': args
            };
        },

        createCatchClause: function (param, body) {
            return {
                type: Syntax.CatchClause,
                param: param,
                body: body
            };
        },

        createConditionalExpression: function (test, consequent, alternate) {
            return {
                type: Syntax.ConditionalExpression,
                test: test,
                consequent: consequent,
                alternate: alternate
            };
        },

        createContinueStatement: function (label) {
            return {
                type: Syntax.ContinueStatement,
                label: label
            };
        },

        createDebuggerStatement: function () {
            return {
                type: Syntax.DebuggerStatement
            };
        },

        createDoWhileStatement: function (body, test) {
            return {
                type: Syntax.DoWhileStatement,
                body: body,
                test: test
            };
        },

        createEmptyStatement: function () {
            return {
                type: Syntax.EmptyStatement
            };
        },

        createExpressionStatement: function (expression) {
            return {
                type: Syntax.ExpressionStatement,
                expression: expression
            };
        },

        createForStatement: function (init, test, update, body) {
            return {
                type: Syntax.ForStatement,
                init: init,
                test: test,
                update: update,
                body: body
            };
        },

        createForInStatement: function (left, right, body) {
            return {
                type: Syntax.ForInStatement,
                left: left,
                right: right,
                body: body,
                each: false
            };
        },

        createFunctionDeclaration: function (id, params, defaults, body) {
            return {
                type: Syntax.FunctionDeclaration,
                id: id,
                params: params,
                defaults: defaults,
                body: body,
                rest: null,
                generator: false,
                expression: false
            };
        },

        createFunctionExpression: function (id, params, defaults, body) {
            return {
                type: Syntax.FunctionExpression,
                id: id,
                params: params,
                defaults: defaults,
                body: body,
                rest: null,
                generator: false,
                expression: false
            };
        },

        createIdentifier: function (name) {
            return {
                type: Syntax.Identifier,
                name: name
            };
        },

        createIfStatement: function (test, consequent, alternate) {
            return {
                type: Syntax.IfStatement,
                test: test,
                consequent: consequent,
                alternate: alternate
            };
        },

        createLabeledStatement: function (label, body) {
            return {
                type: Syntax.LabeledStatement,
                label: label,
                body: body
            };
        },

        createLiteral: function (token) {
            return {
                type: Syntax.Literal,
                value: token.value,
                raw: source.slice(token.start, token.end)
            };
        },

        createMemberExpression: function (accessor, object, property) {
            return {
                type: Syntax.MemberExpression,
                computed: accessor === '[',
                object: object,
                property: property
            };
        },

        createNewExpression: function (callee, args) {
            return {
                type: Syntax.NewExpression,
                callee: callee,
                'arguments': args
            };
        },

        createObjectExpression: function (properties) {
            return {
                type: Syntax.ObjectExpression,
                properties: properties
            };
        },

        createPostfixExpression: function (operator, argument) {
            return {
                type: Syntax.UpdateExpression,
                operator: operator,
                argument: argument,
                prefix: false
            };
        },

        createProgram: function (body) {
            return {
                type: Syntax.Program,
                body: body
            };
        },

        createProperty: function (kind, key, value) {
            return {
                type: Syntax.Property,
                key: key,
                value: value,
                kind: kind
            };
        },

        createReturnStatement: function (argument) {
            return {
                type: Syntax.ReturnStatement,
                argument: argument
            };
        },

        createSequenceExpression: function (expressions) {
            return {
                type: Syntax.SequenceExpression,
                expressions: expressions
            };
        },

        createSwitchCase: function (test, consequent) {
            return {
                type: Syntax.SwitchCase,
                test: test,
                consequent: consequent
            };
        },

        createSwitchStatement: function (discriminant, cases) {
            return {
                type: Syntax.SwitchStatement,
                discriminant: discriminant,
                cases: cases
            };
        },

        createThisExpression: function () {
            return {
                type: Syntax.ThisExpression
            };
        },

        createThrowStatement: function (argument) {
            return {
                type: Syntax.ThrowStatement,
                argument: argument
            };
        },

        createTryStatement: function (block, guardedHandlers, handlers, finalizer) {
            return {
                type: Syntax.TryStatement,
                block: block,
                guardedHandlers: guardedHandlers,
                handlers: handlers,
                finalizer: finalizer
            };
        },

        createUnaryExpression: function (operator, argument) {
            if (operator === '++' || operator === '--') {
                return {
                    type: Syntax.UpdateExpression,
                    operator: operator,
                    argument: argument,
                    prefix: true
                };
            }
            return {
                type: Syntax.UnaryExpression,
                operator: operator,
                argument: argument,
                prefix: true
            };
        },

        createVariableDeclaration: function (declarations, kind) {
            return {
                type: Syntax.VariableDeclaration,
                declarations: declarations,
                kind: kind
            };
        },

        createVariableDeclarator: function (id, init) {
            return {
                type: Syntax.VariableDeclarator,
                id: id,
                init: init
            };
        },

        createWhileStatement: function (test, body) {
            return {
                type: Syntax.WhileStatement,
                test: test,
                body: body
            };
        },

        createWithStatement: function (object, body) {
            return {
                type: Syntax.WithStatement,
                object: object,
                body: body
            };
        }
    };

    // Return true if there is a line terminator before the next token.

    function peekLineTerminator() {
        var pos, line, start, found;

        pos = index;
        line = lineNumber;
        start = lineStart;
        skipComment();
        found = lineNumber !== line;
        index = pos;
        lineNumber = line;
        lineStart = start;

        return found;
    }

    // Throw an exception

    function throwError(token, messageFormat) {
        var error,
            args = Array.prototype.slice.call(arguments, 2),
            msg = messageFormat.replace(
                /%(\d)/g,
                function (whole, index) {
                    assert(index < args.length, 'Message reference must be in range');
                    return args[index];
                }
            );

        if (typeof token.lineNumber === 'number') {
            error = new Error('Line ' + token.lineNumber + ': ' + msg);
            error.index = token.start;
            error.lineNumber = token.lineNumber;
            error.column = token.start - lineStart + 1;
        } else {
            error = new Error('Line ' + lineNumber + ': ' + msg);
            error.index = index;
            error.lineNumber = lineNumber;
            error.column = index - lineStart + 1;
        }

        error.description = msg;
        throw error;
    }

    function throwErrorTolerant() {
        try {
            throwError.apply(null, arguments);
        } catch (e) {
            if (extra.errors) {
                extra.errors.push(e);
            } else {
                throw e;
            }
        }
    }


    // Throw an exception because of the token.

    function throwUnexpected(token) {
        if (token.type === Token.EOF) {
            throwError(token, Messages.UnexpectedEOS);
        }

        if (token.type === Token.NumericLiteral) {
            throwError(token, Messages.UnexpectedNumber);
        }

        if (token.type === Token.StringLiteral) {
            throwError(token, Messages.UnexpectedString);
        }

        if (token.type === Token.Identifier) {
            throwError(token, Messages.UnexpectedIdentifier);
        }

        if (token.type === Token.Keyword) {
            if (isFutureReservedWord(token.value)) {
                throwError(token, Messages.UnexpectedReserved);
            } else if (strict && isStrictModeReservedWord(token.value)) {
                throwErrorTolerant(token, Messages.StrictReservedWord);
                return;
            }
            throwError(token, Messages.UnexpectedToken, token.value);
        }

        // BooleanLiteral, NullLiteral, or Punctuator.
        throwError(token, Messages.UnexpectedToken, token.value);
    }

    // Expect the next token to match the specified punctuator.
    // If not, an exception will be thrown.

    function expect(value) {
        var token = lex();
        if (token.type !== Token.Punctuator || token.value !== value) {
            throwUnexpected(token);
        }
    }

    // Expect the next token to match the specified keyword.
    // If not, an exception will be thrown.

    function expectKeyword(keyword) {
        var token = lex();
        if (token.type !== Token.Keyword || token.value !== keyword) {
            throwUnexpected(token);
        }
    }

    // Return true if the next token matches the specified punctuator.

    function match(value) {
        return lookahead.type === Token.Punctuator && lookahead.value === value;
    }

    // Return true if the next token matches the specified keyword

    function matchKeyword(keyword) {
        return lookahead.type === Token.Keyword && lookahead.value === keyword;
    }

    // Return true if the next token is an assignment operator

    function matchAssign() {
        var op;

        if (lookahead.type !== Token.Punctuator) {
            return false;
        }
        op = lookahead.value;
        return op === '=' ||
            op === '*=' ||
            op === '/=' ||
            op === '%=' ||
            op === '+=' ||
            op === '-=' ||
            op === '<<=' ||
            op === '>>=' ||
            op === '>>>=' ||
            op === '&=' ||
            op === '^=' ||
            op === '|=';
    }

    function consumeSemicolon() {
        var line;

        // Catch the very common case first: immediately a semicolon (U+003B).
        if (source.charCodeAt(index) === 0x3B || match(';')) {
            lex();
            return;
        }

        line = lineNumber;
        skipComment();
        if (lineNumber !== line) {
            return;
        }

        if (lookahead.type !== Token.EOF && !match('}')) {
            throwUnexpected(lookahead);
        }
    }

    // Return true if provided expression is LeftHandSideExpression

    function isLeftHandSide(expr) {
        return expr.type === Syntax.Identifier || expr.type === Syntax.MemberExpression;
    }

    // 11.1.4 Array Initialiser

    function parseArrayInitialiser() {
        var elements = [], startToken;

        startToken = lookahead;
        expect('[');

        while (!match(']')) {
            if (match(',')) {
                lex();
                elements.push(null);
            } else {
                elements.push(parseAssignmentExpression());

                if (!match(']')) {
                    expect(',');
                }
            }
        }

        lex();

        return delegate.markEnd(delegate.createArrayExpression(elements), startToken);
    }

    // 11.1.5 Object Initialiser

    function parsePropertyFunction(param, first) {
        var previousStrict, body, startToken;

        previousStrict = strict;
        startToken = lookahead;
        body = parseFunctionSourceElements();
        if (first && strict && isRestrictedWord(param[0].name)) {
            throwErrorTolerant(first, Messages.StrictParamName);
        }
        strict = previousStrict;
        return delegate.markEnd(delegate.createFunctionExpression(null, param, [], body), startToken);
    }

    function parseObjectPropertyKey() {
        var token, startToken;

        startToken = lookahead;
        token = lex();

        // Note: This function is called only from parseObjectProperty(), where
        // EOF and Punctuator tokens are already filtered out.

        if (token.type === Token.StringLiteral || token.type === Token.NumericLiteral) {
            if (strict && token.octal) {
                throwErrorTolerant(token, Messages.StrictOctalLiteral);
            }
            return delegate.markEnd(delegate.createLiteral(token), startToken);
        }

        return delegate.markEnd(delegate.createIdentifier(token.value), startToken);
    }

    function parseObjectProperty() {
        var token, key, id, value, param, startToken;

        token = lookahead;
        startToken = lookahead;

        if (token.type === Token.Identifier) {

            id = parseObjectPropertyKey();

            // Property Assignment: Getter and Setter.

            if (token.value === 'get' && !match(':')) {
                key = parseObjectPropertyKey();
                expect('(');
                expect(')');
                value = parsePropertyFunction([]);
                return delegate.markEnd(delegate.createProperty('get', key, value), startToken);
            }
            if (token.value === 'set' && !match(':')) {
                key = parseObjectPropertyKey();
                expect('(');
                token = lookahead;
                if (token.type !== Token.Identifier) {
                    expect(')');
                    throwErrorTolerant(token, Messages.UnexpectedToken, token.value);
                    value = parsePropertyFunction([]);
                } else {
                    param = [ parseVariableIdentifier() ];
                    expect(')');
                    value = parsePropertyFunction(param, token);
                }
                return delegate.markEnd(delegate.createProperty('set', key, value), startToken);
            }
            expect(':');
            value = parseAssignmentExpression();
            return delegate.markEnd(delegate.createProperty('init', id, value), startToken);
        }
        if (token.type === Token.EOF || token.type === Token.Punctuator) {
            throwUnexpected(token);
        } else {
            key = parseObjectPropertyKey();
            expect(':');
            value = parseAssignmentExpression();
            return delegate.markEnd(delegate.createProperty('init', key, value), startToken);
        }
    }

    function parseObjectInitialiser() {
        var properties = [], property, name, key, kind, map = {}, toString = String, startToken;

        startToken = lookahead;

        expect('{');

        while (!match('}')) {
            property = parseObjectProperty();

            if (property.key.type === Syntax.Identifier) {
                name = property.key.name;
            } else {
                name = toString(property.key.value);
            }
            kind = (property.kind === 'init') ? PropertyKind.Data : (property.kind === 'get') ? PropertyKind.Get : PropertyKind.Set;

            key = '$' + name;
            if (Object.prototype.hasOwnProperty.call(map, key)) {
                if (map[key] === PropertyKind.Data) {
                    if (strict && kind === PropertyKind.Data) {
                        throwErrorTolerant({}, Messages.StrictDuplicateProperty);
                    } else if (kind !== PropertyKind.Data) {
                        throwErrorTolerant({}, Messages.AccessorDataProperty);
                    }
                } else {
                    if (kind === PropertyKind.Data) {
                        throwErrorTolerant({}, Messages.AccessorDataProperty);
                    } else if (map[key] & kind) {
                        throwErrorTolerant({}, Messages.AccessorGetSet);
                    }
                }
                map[key] |= kind;
            } else {
                map[key] = kind;
            }

            properties.push(property);

            if (!match('}')) {
                expect(',');
            }
        }

        expect('}');

        return delegate.markEnd(delegate.createObjectExpression(properties), startToken);
    }

    // 11.1.6 The Grouping Operator

    function parseGroupExpression() {
        var expr;

        expect('(');

        expr = parseExpression();

        expect(')');

        return expr;
    }


    // 11.1 Primary Expressions

    function parsePrimaryExpression() {
        var type, token, expr, startToken;

        if (match('(')) {
            return parseGroupExpression();
        }

        if (match('[')) {
            return parseArrayInitialiser();
        }

        if (match('{')) {
            return parseObjectInitialiser();
        }

        type = lookahead.type;
        startToken = lookahead;

        if (type === Token.Identifier) {
            expr =  delegate.createIdentifier(lex().value);
        } else if (type === Token.StringLiteral || type === Token.NumericLiteral) {
            if (strict && lookahead.octal) {
                throwErrorTolerant(lookahead, Messages.StrictOctalLiteral);
            }
            expr = delegate.createLiteral(lex());
        } else if (type === Token.Keyword) {
            if (matchKeyword('function')) {
                return parseFunctionExpression();
            }
            if (matchKeyword('this')) {
                lex();
                expr = delegate.createThisExpression();
            } else {
                throwUnexpected(lex());
            }
        } else if (type === Token.BooleanLiteral) {
            token = lex();
            token.value = (token.value === 'true');
            expr = delegate.createLiteral(token);
        } else if (type === Token.NullLiteral) {
            token = lex();
            token.value = null;
            expr = delegate.createLiteral(token);
        } else if (match('/') || match('/=')) {
            if (typeof extra.tokens !== 'undefined') {
                expr = delegate.createLiteral(collectRegex());
            } else {
                expr = delegate.createLiteral(scanRegExp());
            }
            peek();
        } else {
            throwUnexpected(lex());
        }

        return delegate.markEnd(expr, startToken);
    }

    // 11.2 Left-Hand-Side Expressions

    function parseArguments() {
        var args = [];

        expect('(');

        if (!match(')')) {
            while (index < length) {
                args.push(parseAssignmentExpression());
                if (match(')')) {
                    break;
                }
                expect(',');
            }
        }

        expect(')');

        return args;
    }

    function parseNonComputedProperty() {
        var token, startToken;

        startToken = lookahead;
        token = lex();

        if (!isIdentifierName(token)) {
            throwUnexpected(token);
        }

        return delegate.markEnd(delegate.createIdentifier(token.value), startToken);
    }

    function parseNonComputedMember() {
        expect('.');

        return parseNonComputedProperty();
    }

    function parseComputedMember() {
        var expr;

        expect('[');

        expr = parseExpression();

        expect(']');

        return expr;
    }

    function parseNewExpression() {
        var callee, args, startToken;

        startToken = lookahead;
        expectKeyword('new');
        callee = parseLeftHandSideExpression();
        args = match('(') ? parseArguments() : [];

        return delegate.markEnd(delegate.createNewExpression(callee, args), startToken);
    }

    function parseLeftHandSideExpressionAllowCall() {
        var previousAllowIn, expr, args, property, startToken;

        startToken = lookahead;

        previousAllowIn = state.allowIn;
        state.allowIn = true;
        expr = matchKeyword('new') ? parseNewExpression() : parsePrimaryExpression();
        state.allowIn = previousAllowIn;

        for (;;) {
            if (match('.')) {
                property = parseNonComputedMember();
                expr = delegate.createMemberExpression('.', expr, property);
            } else if (match('(')) {
                args = parseArguments();
                expr = delegate.createCallExpression(expr, args);
            } else if (match('[')) {
                property = parseComputedMember();
                expr = delegate.createMemberExpression('[', expr, property);
            } else {
                break;
            }
            delegate.markEnd(expr, startToken);
        }

        return expr;
    }

    function parseLeftHandSideExpression() {
        var previousAllowIn, expr, property, startToken;

        startToken = lookahead;

        previousAllowIn = state.allowIn;
        expr = matchKeyword('new') ? parseNewExpression() : parsePrimaryExpression();
        state.allowIn = previousAllowIn;

        while (match('.') || match('[')) {
            if (match('[')) {
                property = parseComputedMember();
                expr = delegate.createMemberExpression('[', expr, property);
            } else {
                property = parseNonComputedMember();
                expr = delegate.createMemberExpression('.', expr, property);
            }
            delegate.markEnd(expr, startToken);
        }

        return expr;
    }

    // 11.3 Postfix Expressions

    function parsePostfixExpression() {
        var expr, token, startToken = lookahead;

        expr = parseLeftHandSideExpressionAllowCall();

        if (lookahead.type === Token.Punctuator) {
            if ((match('++') || match('--')) && !peekLineTerminator()) {
                // 11.3.1, 11.3.2
                if (strict && expr.type === Syntax.Identifier && isRestrictedWord(expr.name)) {
                    throwErrorTolerant({}, Messages.StrictLHSPostfix);
                }

                if (!isLeftHandSide(expr)) {
                    throwErrorTolerant({}, Messages.InvalidLHSInAssignment);
                }

                token = lex();
                expr = delegate.markEnd(delegate.createPostfixExpression(token.value, expr), startToken);
            }
        }

        return expr;
    }

    // 11.4 Unary Operators

    function parseUnaryExpression() {
        var token, expr, startToken;

        if (lookahead.type !== Token.Punctuator && lookahead.type !== Token.Keyword) {
            expr = parsePostfixExpression();
        } else if (match('++') || match('--')) {
            startToken = lookahead;
            token = lex();
            expr = parseUnaryExpression();
            // 11.4.4, 11.4.5
            if (strict && expr.type === Syntax.Identifier && isRestrictedWord(expr.name)) {
                throwErrorTolerant({}, Messages.StrictLHSPrefix);
            }

            if (!isLeftHandSide(expr)) {
                throwErrorTolerant({}, Messages.InvalidLHSInAssignment);
            }

            expr = delegate.createUnaryExpression(token.value, expr);
            expr = delegate.markEnd(expr, startToken);
        } else if (match('+') || match('-') || match('~') || match('!')) {
            startToken = lookahead;
            token = lex();
            expr = parseUnaryExpression();
            expr = delegate.createUnaryExpression(token.value, expr);
            expr = delegate.markEnd(expr, startToken);
        } else if (matchKeyword('delete') || matchKeyword('void') || matchKeyword('typeof')) {
            startToken = lookahead;
            token = lex();
            expr = parseUnaryExpression();
            expr = delegate.createUnaryExpression(token.value, expr);
            expr = delegate.markEnd(expr, startToken);
            if (strict && expr.operator === 'delete' && expr.argument.type === Syntax.Identifier) {
                throwErrorTolerant({}, Messages.StrictDelete);
            }
        } else {
            expr = parsePostfixExpression();
        }

        return expr;
    }

    function binaryPrecedence(token, allowIn) {
        var prec = 0;

        if (token.type !== Token.Punctuator && token.type !== Token.Keyword) {
            return 0;
        }

        switch (token.value) {
        case '||':
            prec = 1;
            break;

        case '&&':
            prec = 2;
            break;

        case '|':
            prec = 3;
            break;

        case '^':
            prec = 4;
            break;

        case '&':
            prec = 5;
            break;

        case '==':
        case '!=':
        case '===':
        case '!==':
            prec = 6;
            break;

        case '<':
        case '>':
        case '<=':
        case '>=':
        case 'instanceof':
            prec = 7;
            break;

        case 'in':
            prec = allowIn ? 7 : 0;
            break;

        case '<<':
        case '>>':
        case '>>>':
            prec = 8;
            break;

        case '+':
        case '-':
            prec = 9;
            break;

        case '*':
        case '/':
        case '%':
            prec = 11;
            break;

        default:
            break;
        }

        return prec;
    }

    // 11.5 Multiplicative Operators
    // 11.6 Additive Operators
    // 11.7 Bitwise Shift Operators
    // 11.8 Relational Operators
    // 11.9 Equality Operators
    // 11.10 Binary Bitwise Operators
    // 11.11 Binary Logical Operators

    function parseBinaryExpression() {
        var marker, markers, expr, token, prec, stack, right, operator, left, i;

        marker = lookahead;
        left = parseUnaryExpression();

        token = lookahead;
        prec = binaryPrecedence(token, state.allowIn);
        if (prec === 0) {
            return left;
        }
        token.prec = prec;
        lex();

        markers = [marker, lookahead];
        right = parseUnaryExpression();

        stack = [left, token, right];

        while ((prec = binaryPrecedence(lookahead, state.allowIn)) > 0) {

            // Reduce: make a binary expression from the three topmost entries.
            while ((stack.length > 2) && (prec <= stack[stack.length - 2].prec)) {
                right = stack.pop();
                operator = stack.pop().value;
                left = stack.pop();
                expr = delegate.createBinaryExpression(operator, left, right);
                markers.pop();
                marker = markers[markers.length - 1];
                delegate.markEnd(expr, marker);
                stack.push(expr);
            }

            // Shift.
            token = lex();
            token.prec = prec;
            stack.push(token);
            markers.push(lookahead);
            expr = parseUnaryExpression();
            stack.push(expr);
        }

        // Final reduce to clean-up the stack.
        i = stack.length - 1;
        expr = stack[i];
        markers.pop();
        while (i > 1) {
            expr = delegate.createBinaryExpression(stack[i - 1].value, stack[i - 2], expr);
            i -= 2;
            marker = markers.pop();
            delegate.markEnd(expr, marker);
        }

        return expr;
    }


    // 11.12 Conditional Operator

    function parseConditionalExpression() {
        var expr, previousAllowIn, consequent, alternate, startToken;

        startToken = lookahead;

        expr = parseBinaryExpression();

        if (match('?')) {
            lex();
            previousAllowIn = state.allowIn;
            state.allowIn = true;
            consequent = parseAssignmentExpression();
            state.allowIn = previousAllowIn;
            expect(':');
            alternate = parseAssignmentExpression();

            expr = delegate.createConditionalExpression(expr, consequent, alternate);
            delegate.markEnd(expr, startToken);
        }

        return expr;
    }

    // 11.13 Assignment Operators

    function parseAssignmentExpression() {
        var token, left, right, node, startToken;

        token = lookahead;
        startToken = lookahead;

        node = left = parseConditionalExpression();

        if (matchAssign()) {
            // LeftHandSideExpression
            if (!isLeftHandSide(left)) {
                throwErrorTolerant({}, Messages.InvalidLHSInAssignment);
            }

            // 11.13.1
            if (strict && left.type === Syntax.Identifier && isRestrictedWord(left.name)) {
                throwErrorTolerant(token, Messages.StrictLHSAssignment);
            }

            token = lex();
            right = parseAssignmentExpression();
            node = delegate.markEnd(delegate.createAssignmentExpression(token.value, left, right), startToken);
        }

        return node;
    }

    // 11.14 Comma Operator

    function parseExpression() {
        var expr, startToken = lookahead;

        expr = parseAssignmentExpression();

        if (match(',')) {
            expr = delegate.createSequenceExpression([ expr ]);

            while (index < length) {
                if (!match(',')) {
                    break;
                }
                lex();
                expr.expressions.push(parseAssignmentExpression());
            }

            delegate.markEnd(expr, startToken);
        }

        return expr;
    }

    // 12.1 Block

    function parseStatementList() {
        var list = [],
            statement;

        while (index < length) {
            if (match('}')) {
                break;
            }
            statement = parseSourceElement();
            if (typeof statement === 'undefined') {
                break;
            }
            list.push(statement);
        }

        return list;
    }

    function parseBlock() {
        var block, startToken;

        startToken = lookahead;
        expect('{');

        block = parseStatementList();

        expect('}');

        return delegate.markEnd(delegate.createBlockStatement(block), startToken);
    }

    // 12.2 Variable Statement

    function parseVariableIdentifier() {
        var token, startToken;

        startToken = lookahead;
        token = lex();

        if (token.type !== Token.Identifier) {
            throwUnexpected(token);
        }

        return delegate.markEnd(delegate.createIdentifier(token.value), startToken);
    }

    function parseVariableDeclaration(kind) {
        var init = null, id, startToken;

        startToken = lookahead;
        id = parseVariableIdentifier();

        // 12.2.1
        if (strict && isRestrictedWord(id.name)) {
            throwErrorTolerant({}, Messages.StrictVarName);
        }

        if (kind === 'const') {
            expect('=');
            init = parseAssignmentExpression();
        } else if (match('=')) {
            lex();
            init = parseAssignmentExpression();
        }

        return delegate.markEnd(delegate.createVariableDeclarator(id, init), startToken);
    }

    function parseVariableDeclarationList(kind) {
        var list = [];

        do {
            list.push(parseVariableDeclaration(kind));
            if (!match(',')) {
                break;
            }
            lex();
        } while (index < length);

        return list;
    }

    function parseVariableStatement() {
        var declarations;

        expectKeyword('var');

        declarations = parseVariableDeclarationList();

        consumeSemicolon();

        return delegate.createVariableDeclaration(declarations, 'var');
    }

    // kind may be `const` or `let`
    // Both are experimental and not in the specification yet.
    // see http://wiki.ecmascript.org/doku.php?id=harmony:const
    // and http://wiki.ecmascript.org/doku.php?id=harmony:let
    function parseConstLetDeclaration(kind) {
        var declarations, startToken;

        startToken = lookahead;

        expectKeyword(kind);

        declarations = parseVariableDeclarationList(kind);

        consumeSemicolon();

        return delegate.markEnd(delegate.createVariableDeclaration(declarations, kind), startToken);
    }

    // 12.3 Empty Statement

    function parseEmptyStatement() {
        expect(';');
        return delegate.createEmptyStatement();
    }

    // 12.4 Expression Statement

    function parseExpressionStatement() {
        var expr = parseExpression();
        consumeSemicolon();
        return delegate.createExpressionStatement(expr);
    }

    // 12.5 If statement

    function parseIfStatement() {
        var test, consequent, alternate;

        expectKeyword('if');

        expect('(');

        test = parseExpression();

        expect(')');

        consequent = parseStatement();

        if (matchKeyword('else')) {
            lex();
            alternate = parseStatement();
        } else {
            alternate = null;
        }

        return delegate.createIfStatement(test, consequent, alternate);
    }

    // 12.6 Iteration Statements

    function parseDoWhileStatement() {
        var body, test, oldInIteration;

        expectKeyword('do');

        oldInIteration = state.inIteration;
        state.inIteration = true;

        body = parseStatement();

        state.inIteration = oldInIteration;

        expectKeyword('while');

        expect('(');

        test = parseExpression();

        expect(')');

        if (match(';')) {
            lex();
        }

        return delegate.createDoWhileStatement(body, test);
    }

    function parseWhileStatement() {
        var test, body, oldInIteration;

        expectKeyword('while');

        expect('(');

        test = parseExpression();

        expect(')');

        oldInIteration = state.inIteration;
        state.inIteration = true;

        body = parseStatement();

        state.inIteration = oldInIteration;

        return delegate.createWhileStatement(test, body);
    }

    function parseForVariableDeclaration() {
        var token, declarations, startToken;

        startToken = lookahead;
        token = lex();
        declarations = parseVariableDeclarationList();

        return delegate.markEnd(delegate.createVariableDeclaration(declarations, token.value), startToken);
    }

    function parseForStatement() {
        var init, test, update, left, right, body, oldInIteration;

        init = test = update = null;

        expectKeyword('for');

        expect('(');

        if (match(';')) {
            lex();
        } else {
            if (matchKeyword('var') || matchKeyword('let')) {
                state.allowIn = false;
                init = parseForVariableDeclaration();
                state.allowIn = true;

                if (init.declarations.length === 1 && matchKeyword('in')) {
                    lex();
                    left = init;
                    right = parseExpression();
                    init = null;
                }
            } else {
                state.allowIn = false;
                init = parseExpression();
                state.allowIn = true;

                if (matchKeyword('in')) {
                    // LeftHandSideExpression
                    if (!isLeftHandSide(init)) {
                        throwErrorTolerant({}, Messages.InvalidLHSInForIn);
                    }

                    lex();
                    left = init;
                    right = parseExpression();
                    init = null;
                }
            }

            if (typeof left === 'undefined') {
                expect(';');
            }
        }

        if (typeof left === 'undefined') {

            if (!match(';')) {
                test = parseExpression();
            }
            expect(';');

            if (!match(')')) {
                update = parseExpression();
            }
        }

        expect(')');

        oldInIteration = state.inIteration;
        state.inIteration = true;

        body = parseStatement();

        state.inIteration = oldInIteration;

        return (typeof left === 'undefined') ?
                delegate.createForStatement(init, test, update, body) :
                delegate.createForInStatement(left, right, body);
    }

    // 12.7 The continue statement

    function parseContinueStatement() {
        var label = null, key;

        expectKeyword('continue');

        // Optimize the most common form: 'continue;'.
        if (source.charCodeAt(index) === 0x3B) {
            lex();

            if (!state.inIteration) {
                throwError({}, Messages.IllegalContinue);
            }

            return delegate.createContinueStatement(null);
        }

        if (peekLineTerminator()) {
            if (!state.inIteration) {
                throwError({}, Messages.IllegalContinue);
            }

            return delegate.createContinueStatement(null);
        }

        if (lookahead.type === Token.Identifier) {
            label = parseVariableIdentifier();

            key = '$' + label.name;
            if (!Object.prototype.hasOwnProperty.call(state.labelSet, key)) {
                throwError({}, Messages.UnknownLabel, label.name);
            }
        }

        consumeSemicolon();

        if (label === null && !state.inIteration) {
            throwError({}, Messages.IllegalContinue);
        }

        return delegate.createContinueStatement(label);
    }

    // 12.8 The break statement

    function parseBreakStatement() {
        var label = null, key;

        expectKeyword('break');

        // Catch the very common case first: immediately a semicolon (U+003B).
        if (source.charCodeAt(index) === 0x3B) {
            lex();

            if (!(state.inIteration || state.inSwitch)) {
                throwError({}, Messages.IllegalBreak);
            }

            return delegate.createBreakStatement(null);
        }

        if (peekLineTerminator()) {
            if (!(state.inIteration || state.inSwitch)) {
                throwError({}, Messages.IllegalBreak);
            }

            return delegate.createBreakStatement(null);
        }

        if (lookahead.type === Token.Identifier) {
            label = parseVariableIdentifier();

            key = '$' + label.name;
            if (!Object.prototype.hasOwnProperty.call(state.labelSet, key)) {
                throwError({}, Messages.UnknownLabel, label.name);
            }
        }

        consumeSemicolon();

        if (label === null && !(state.inIteration || state.inSwitch)) {
            throwError({}, Messages.IllegalBreak);
        }

        return delegate.createBreakStatement(label);
    }

    // 12.9 The return statement

    function parseReturnStatement() {
        var argument = null;

        expectKeyword('return');

        if (!state.inFunctionBody) {
            throwErrorTolerant({}, Messages.IllegalReturn);
        }

        // 'return' followed by a space and an identifier is very common.
        if (source.charCodeAt(index) === 0x20) {
            if (isIdentifierStart(source.charCodeAt(index + 1))) {
                argument = parseExpression();
                consumeSemicolon();
                return delegate.createReturnStatement(argument);
            }
        }

        if (peekLineTerminator()) {
            return delegate.createReturnStatement(null);
        }

        if (!match(';')) {
            if (!match('}') && lookahead.type !== Token.EOF) {
                argument = parseExpression();
            }
        }

        consumeSemicolon();

        return delegate.createReturnStatement(argument);
    }

    // 12.10 The with statement

    function parseWithStatement() {
        var object, body;

        if (strict) {
            // TODO(ikarienator): Should we update the test cases instead?
            skipComment();
            throwErrorTolerant({}, Messages.StrictModeWith);
        }

        expectKeyword('with');

        expect('(');

        object = parseExpression();

        expect(')');

        body = parseStatement();

        return delegate.createWithStatement(object, body);
    }

    // 12.10 The swith statement

    function parseSwitchCase() {
        var test, consequent = [], statement, startToken;

        startToken = lookahead;
        if (matchKeyword('default')) {
            lex();
            test = null;
        } else {
            expectKeyword('case');
            test = parseExpression();
        }
        expect(':');

        while (index < length) {
            if (match('}') || matchKeyword('default') || matchKeyword('case')) {
                break;
            }
            statement = parseStatement();
            consequent.push(statement);
        }

        return delegate.markEnd(delegate.createSwitchCase(test, consequent), startToken);
    }

    function parseSwitchStatement() {
        var discriminant, cases, clause, oldInSwitch, defaultFound;

        expectKeyword('switch');

        expect('(');

        discriminant = parseExpression();

        expect(')');

        expect('{');

        cases = [];

        if (match('}')) {
            lex();
            return delegate.createSwitchStatement(discriminant, cases);
        }

        oldInSwitch = state.inSwitch;
        state.inSwitch = true;
        defaultFound = false;

        while (index < length) {
            if (match('}')) {
                break;
            }
            clause = parseSwitchCase();
            if (clause.test === null) {
                if (defaultFound) {
                    throwError({}, Messages.MultipleDefaultsInSwitch);
                }
                defaultFound = true;
            }
            cases.push(clause);
        }

        state.inSwitch = oldInSwitch;

        expect('}');

        return delegate.createSwitchStatement(discriminant, cases);
    }

    // 12.13 The throw statement

    function parseThrowStatement() {
        var argument;

        expectKeyword('throw');

        if (peekLineTerminator()) {
            throwError({}, Messages.NewlineAfterThrow);
        }

        argument = parseExpression();

        consumeSemicolon();

        return delegate.createThrowStatement(argument);
    }

    // 12.14 The try statement

    function parseCatchClause() {
        var param, body, startToken;

        startToken = lookahead;
        expectKeyword('catch');

        expect('(');
        if (match(')')) {
            throwUnexpected(lookahead);
        }

        param = parseVariableIdentifier();
        // 12.14.1
        if (strict && isRestrictedWord(param.name)) {
            throwErrorTolerant({}, Messages.StrictCatchVariable);
        }

        expect(')');
        body = parseBlock();
        return delegate.markEnd(delegate.createCatchClause(param, body), startToken);
    }

    function parseTryStatement() {
        var block, handlers = [], finalizer = null;

        expectKeyword('try');

        block = parseBlock();

        if (matchKeyword('catch')) {
            handlers.push(parseCatchClause());
        }

        if (matchKeyword('finally')) {
            lex();
            finalizer = parseBlock();
        }

        if (handlers.length === 0 && !finalizer) {
            throwError({}, Messages.NoCatchOrFinally);
        }

        return delegate.createTryStatement(block, [], handlers, finalizer);
    }

    // 12.15 The debugger statement

    function parseDebuggerStatement() {
        expectKeyword('debugger');

        consumeSemicolon();

        return delegate.createDebuggerStatement();
    }

    // 12 Statements

    function parseStatement() {
        var type = lookahead.type,
            expr,
            labeledBody,
            key,
            startToken;

        if (type === Token.EOF) {
            throwUnexpected(lookahead);
        }

        if (type === Token.Punctuator && lookahead.value === '{') {
            return parseBlock();
        }

        startToken = lookahead;

        if (type === Token.Punctuator) {
            switch (lookahead.value) {
            case ';':
                return delegate.markEnd(parseEmptyStatement(), startToken);
            case '(':
                return delegate.markEnd(parseExpressionStatement(), startToken);
            default:
                break;
            }
        }

        if (type === Token.Keyword) {
            switch (lookahead.value) {
            case 'break':
                return delegate.markEnd(parseBreakStatement(), startToken);
            case 'continue':
                return delegate.markEnd(parseContinueStatement(), startToken);
            case 'debugger':
                return delegate.markEnd(parseDebuggerStatement(), startToken);
            case 'do':
                return delegate.markEnd(parseDoWhileStatement(), startToken);
            case 'for':
                return delegate.markEnd(parseForStatement(), startToken);
            case 'function':
                return delegate.markEnd(parseFunctionDeclaration(), startToken);
            case 'if':
                return delegate.markEnd(parseIfStatement(), startToken);
            case 'return':
                return delegate.markEnd(parseReturnStatement(), startToken);
            case 'switch':
                return delegate.markEnd(parseSwitchStatement(), startToken);
            case 'throw':
                return delegate.markEnd(parseThrowStatement(), startToken);
            case 'try':
                return delegate.markEnd(parseTryStatement(), startToken);
            case 'var':
                return delegate.markEnd(parseVariableStatement(), startToken);
            case 'while':
                return delegate.markEnd(parseWhileStatement(), startToken);
            case 'with':
                return delegate.markEnd(parseWithStatement(), startToken);
            default:
                break;
            }
        }

        expr = parseExpression();

        // 12.12 Labelled Statements
        if ((expr.type === Syntax.Identifier) && match(':')) {
            lex();

            key = '$' + expr.name;
            if (Object.prototype.hasOwnProperty.call(state.labelSet, key)) {
                throwError({}, Messages.Redeclaration, 'Label', expr.name);
            }

            state.labelSet[key] = true;
            labeledBody = parseStatement();
            delete state.labelSet[key];
            return delegate.markEnd(delegate.createLabeledStatement(expr, labeledBody), startToken);
        }

        consumeSemicolon();

        return delegate.markEnd(delegate.createExpressionStatement(expr), startToken);
    }

    // 13 Function Definition

    function parseFunctionSourceElements() {
        var sourceElement, sourceElements = [], token, directive, firstRestricted,
            oldLabelSet, oldInIteration, oldInSwitch, oldInFunctionBody, startToken;

        startToken = lookahead;
        expect('{');

        while (index < length) {
            if (lookahead.type !== Token.StringLiteral) {
                break;
            }
            token = lookahead;

            sourceElement = parseSourceElement();
            sourceElements.push(sourceElement);
            if (sourceElement.expression.type !== Syntax.Literal) {
                // this is not directive
                break;
            }
            directive = source.slice(token.start + 1, token.end - 1);
            if (directive === 'use strict') {
                strict = true;
                if (firstRestricted) {
                    throwErrorTolerant(firstRestricted, Messages.StrictOctalLiteral);
                }
            } else {
                if (!firstRestricted && token.octal) {
                    firstRestricted = token;
                }
            }
        }

        oldLabelSet = state.labelSet;
        oldInIteration = state.inIteration;
        oldInSwitch = state.inSwitch;
        oldInFunctionBody = state.inFunctionBody;

        state.labelSet = {};
        state.inIteration = false;
        state.inSwitch = false;
        state.inFunctionBody = true;

        while (index < length) {
            if (match('}')) {
                break;
            }
            sourceElement = parseSourceElement();
            if (typeof sourceElement === 'undefined') {
                break;
            }
            sourceElements.push(sourceElement);
        }

        expect('}');

        state.labelSet = oldLabelSet;
        state.inIteration = oldInIteration;
        state.inSwitch = oldInSwitch;
        state.inFunctionBody = oldInFunctionBody;

        return delegate.markEnd(delegate.createBlockStatement(sourceElements), startToken);
    }

    function parseParams(firstRestricted) {
        var param, params = [], token, stricted, paramSet, key, message;
        expect('(');

        if (!match(')')) {
            paramSet = {};
            while (index < length) {
                token = lookahead;
                param = parseVariableIdentifier();
                key = '$' + token.value;
                if (strict) {
                    if (isRestrictedWord(token.value)) {
                        stricted = token;
                        message = Messages.StrictParamName;
                    }
                    if (Object.prototype.hasOwnProperty.call(paramSet, key)) {
                        stricted = token;
                        message = Messages.StrictParamDupe;
                    }
                } else if (!firstRestricted) {
                    if (isRestrictedWord(token.value)) {
                        firstRestricted = token;
                        message = Messages.StrictParamName;
                    } else if (isStrictModeReservedWord(token.value)) {
                        firstRestricted = token;
                        message = Messages.StrictReservedWord;
                    } else if (Object.prototype.hasOwnProperty.call(paramSet, key)) {
                        firstRestricted = token;
                        message = Messages.StrictParamDupe;
                    }
                }
                params.push(param);
                paramSet[key] = true;
                if (match(')')) {
                    break;
                }
                expect(',');
            }
        }

        expect(')');

        return {
            params: params,
            stricted: stricted,
            firstRestricted: firstRestricted,
            message: message
        };
    }

    function parseFunctionDeclaration() {
        var id, params = [], body, token, stricted, tmp, firstRestricted, message, previousStrict, startToken;

        startToken = lookahead;

        expectKeyword('function');
        token = lookahead;
        id = parseVariableIdentifier();
        if (strict) {
            if (isRestrictedWord(token.value)) {
                throwErrorTolerant(token, Messages.StrictFunctionName);
            }
        } else {
            if (isRestrictedWord(token.value)) {
                firstRestricted = token;
                message = Messages.StrictFunctionName;
            } else if (isStrictModeReservedWord(token.value)) {
                firstRestricted = token;
                message = Messages.StrictReservedWord;
            }
        }

        tmp = parseParams(firstRestricted);
        params = tmp.params;
        stricted = tmp.stricted;
        firstRestricted = tmp.firstRestricted;
        if (tmp.message) {
            message = tmp.message;
        }

        previousStrict = strict;
        body = parseFunctionSourceElements();
        if (strict && firstRestricted) {
            throwError(firstRestricted, message);
        }
        if (strict && stricted) {
            throwErrorTolerant(stricted, message);
        }
        strict = previousStrict;

        return delegate.markEnd(delegate.createFunctionDeclaration(id, params, [], body), startToken);
    }

    function parseFunctionExpression() {
        var token, id = null, stricted, firstRestricted, message, tmp, params = [], body, previousStrict, startToken;

        startToken = lookahead;
        expectKeyword('function');

        if (!match('(')) {
            token = lookahead;
            id = parseVariableIdentifier();
            if (strict) {
                if (isRestrictedWord(token.value)) {
                    throwErrorTolerant(token, Messages.StrictFunctionName);
                }
            } else {
                if (isRestrictedWord(token.value)) {
                    firstRestricted = token;
                    message = Messages.StrictFunctionName;
                } else if (isStrictModeReservedWord(token.value)) {
                    firstRestricted = token;
                    message = Messages.StrictReservedWord;
                }
            }
        }

        tmp = parseParams(firstRestricted);
        params = tmp.params;
        stricted = tmp.stricted;
        firstRestricted = tmp.firstRestricted;
        if (tmp.message) {
            message = tmp.message;
        }

        previousStrict = strict;
        body = parseFunctionSourceElements();
        if (strict && firstRestricted) {
            throwError(firstRestricted, message);
        }
        if (strict && stricted) {
            throwErrorTolerant(stricted, message);
        }
        strict = previousStrict;

        return delegate.markEnd(delegate.createFunctionExpression(id, params, [], body), startToken);
    }

    // 14 Program

    function parseSourceElement() {
        if (lookahead.type === Token.Keyword) {
            switch (lookahead.value) {
            case 'const':
            case 'let':
                return parseConstLetDeclaration(lookahead.value);
            case 'function':
                return parseFunctionDeclaration();
            default:
                return parseStatement();
            }
        }

        if (lookahead.type !== Token.EOF) {
            return parseStatement();
        }
    }

    function parseSourceElements() {
        var sourceElement, sourceElements = [], token, directive, firstRestricted;

        while (index < length) {
            token = lookahead;
            if (token.type !== Token.StringLiteral) {
                break;
            }

            sourceElement = parseSourceElement();
            sourceElements.push(sourceElement);
            if (sourceElement.expression.type !== Syntax.Literal) {
                // this is not directive
                break;
            }
            directive = source.slice(token.start + 1, token.end - 1);
            if (directive === 'use strict') {
                strict = true;
                if (firstRestricted) {
                    throwErrorTolerant(firstRestricted, Messages.StrictOctalLiteral);
                }
            } else {
                if (!firstRestricted && token.octal) {
                    firstRestricted = token;
                }
            }
        }

        while (index < length) {
            sourceElement = parseSourceElement();
            /* istanbul ignore if */
            if (typeof sourceElement === 'undefined') {
                break;
            }
            sourceElements.push(sourceElement);
        }
        return sourceElements;
    }

    function parseProgram() {
        var body, startToken;

        skipComment();
        peek();
        startToken = lookahead;
        strict = false;

        body = parseSourceElements();
        return delegate.markEnd(delegate.createProgram(body), startToken);
    }

    function filterTokenLocation() {
        var i, entry, token, tokens = [];

        for (i = 0; i < extra.tokens.length; ++i) {
            entry = extra.tokens[i];
            token = {
                type: entry.type,
                value: entry.value
            };
            if (extra.range) {
                token.range = entry.range;
            }
            if (extra.loc) {
                token.loc = entry.loc;
            }
            tokens.push(token);
        }

        extra.tokens = tokens;
    }

    function tokenize(code, options) {
        var toString,
            token,
            tokens;

        toString = String;
        if (typeof code !== 'string' && !(code instanceof String)) {
            code = toString(code);
        }

        delegate = SyntaxTreeDelegate;
        source = code;
        index = 0;
        lineNumber = (source.length > 0) ? 1 : 0;
        lineStart = 0;
        length = source.length;
        lookahead = null;
        state = {
            allowIn: true,
            labelSet: {},
            inFunctionBody: false,
            inIteration: false,
            inSwitch: false,
            lastCommentStart: -1
        };

        extra = {};

        // Options matching.
        options = options || {};

        // Of course we collect tokens here.
        options.tokens = true;
        extra.tokens = [];
        extra.tokenize = true;
        // The following two fields are necessary to compute the Regex tokens.
        extra.openParenToken = -1;
        extra.openCurlyToken = -1;

        extra.range = (typeof options.range === 'boolean') && options.range;
        extra.loc = (typeof options.loc === 'boolean') && options.loc;

        if (typeof options.comment === 'boolean' && options.comment) {
            extra.comments = [];
        }
        if (typeof options.tolerant === 'boolean' && options.tolerant) {
            extra.errors = [];
        }

        try {
            peek();
            if (lookahead.type === Token.EOF) {
                return extra.tokens;
            }

            token = lex();
            while (lookahead.type !== Token.EOF) {
                try {
                    token = lex();
                } catch (lexError) {
                    token = lookahead;
                    if (extra.errors) {
                        extra.errors.push(lexError);
                        // We have to break on the first error
                        // to avoid infinite loops.
                        break;
                    } else {
                        throw lexError;
                    }
                }
            }

            filterTokenLocation();
            tokens = extra.tokens;
            if (typeof extra.comments !== 'undefined') {
                tokens.comments = extra.comments;
            }
            if (typeof extra.errors !== 'undefined') {
                tokens.errors = extra.errors;
            }
        } catch (e) {
            throw e;
        } finally {
            extra = {};
        }
        return tokens;
    }

    function parse(code, options) {
        var program, toString;

        toString = String;
        if (typeof code !== 'string' && !(code instanceof String)) {
            code = toString(code);
        }

        delegate = SyntaxTreeDelegate;
        source = code;
        index = 0;
        lineNumber = (source.length > 0) ? 1 : 0;
        lineStart = 0;
        length = source.length;
        lookahead = null;
        state = {
            allowIn: true,
            labelSet: {},
            inFunctionBody: false,
            inIteration: false,
            inSwitch: false,
            lastCommentStart: -1
        };

        extra = {};
        if (typeof options !== 'undefined') {
            extra.range = (typeof options.range === 'boolean') && options.range;
            extra.loc = (typeof options.loc === 'boolean') && options.loc;
            extra.attachComment = (typeof options.attachComment === 'boolean') && options.attachComment;

            if (extra.loc && options.source !== null && options.source !== undefined) {
                extra.source = toString(options.source);
            }

            if (typeof options.tokens === 'boolean' && options.tokens) {
                extra.tokens = [];
            }
            if (typeof options.comment === 'boolean' && options.comment) {
                extra.comments = [];
            }
            if (typeof options.tolerant === 'boolean' && options.tolerant) {
                extra.errors = [];
            }
            if (extra.attachComment) {
                extra.range = true;
                extra.comments = [];
                extra.bottomRightStack = [];
                extra.trailingComments = [];
                extra.leadingComments = [];
            }
        }

        try {
            program = parseProgram();
            if (typeof extra.comments !== 'undefined') {
                program.comments = extra.comments;
            }
            if (typeof extra.tokens !== 'undefined') {
                filterTokenLocation();
                program.tokens = extra.tokens;
            }
            if (typeof extra.errors !== 'undefined') {
                program.errors = extra.errors;
            }
        } catch (e) {
            throw e;
        } finally {
            extra = {};
        }

        return program;
    }

    // Sync with *.json manifests.
    exports.version = '1.2.2';

    exports.tokenize = tokenize;

    exports.parse = parse;

    // Deep copy.
   /* istanbul ignore next */
    exports.Syntax = (function () {
        var name, types = {};

        if (typeof Object.create === 'function') {
            types = Object.create(null);
        }

        for (name in Syntax) {
            if (Syntax.hasOwnProperty(name)) {
                types[name] = Syntax[name];
            }
        }

        if (typeof Object.freeze === 'function') {
            Object.freeze(types);
        }

        return types;
    }());

}));
/* vim: set sw=4 ts=4 et tw=80 : */

if (IS_NODE) {
  esprima = exports;
  module.exports = exports = root;
} else {
  esprima = global.esprima;
  global.esprima = globalEsprima;
}

/*!
 * Различные таблицы и константы SS
 */

// Общие разделители директивы
// >>>

var LEFT_BLOCK = "{";
var RIGHT_BLOCK = "}";

// <<<
// Дополнительные разделители директивы
// >>>

var ADV_LEFT_BLOCK = "#";
var I18N = "`";

var SINGLE_COMMENT = "///";
var JS_DOC = "/**";

var MULT_COMMENT_START = "/*";
var MULT_COMMENT_END = "*/";

var commentMap = (function () {
  var _commentMap = {};

  _defineProperty(_commentMap, SINGLE_COMMENT, SINGLE_COMMENT);

  _defineProperty(_commentMap, MULT_COMMENT_START, MULT_COMMENT_START);

  _defineProperty(_commentMap, MULT_COMMENT_END, MULT_COMMENT_END);

  return _commentMap;
})();

/**
 * @param {string} str
 * @param {number} i
 * @return {(string|boolean)}
 */
function returnComment(str, i) {
  return commentMap[str.substr(i, SINGLE_COMMENT.length)] || commentMap[str.substr(i, MULT_COMMENT_START.length)] || commentMap[str.substr(i, MULT_COMMENT_END.length)] || false;
}

var includeDirMap = {
  "${": true,
  "#{": true
};

var includeDirLength;

forIn(includeDirMap, function (el, key) {
  includeDirLength = key.length;
  return false;
});

var baseShortMap = {
  "-": true,
  "#": true
};

var shortMap = {};

forIn(baseShortMap, function (el, key) {
  shortMap[key] = true;
});

// <<<
// Модификаторы контекста
// >>>

var L_MOD = "#";
var G_MOD = "@";

var modMap = (function () {
  var _modMap = {};

  _defineProperty(_modMap, L_MOD, true);

  _defineProperty(_modMap, G_MOD, true);

  return _modMap;
})();

// <<<
// Константы Jade-Like синтаксиса
// >>>

var CONCAT_COMMAND = "&";
var CONCAT_END = ".";
var IGNORE_COMMAND = "|";
var INLINE_COMMAND = " :: ";

// <<<
// Механизм фильтров
// >>>

var FILTER = "|";

// <<<
// Различные таблицы констант
// >>>

var sysConst = {
  "__IS_NODE__": true,
  "__EXPORTS__": true,
  "__HAS_EXPORTS__": true,
  "__INIT__": true,
  "__ROOT__": true,
  "__CALLEE__": true,
  "__ARGUMENTS__": true,
  "__BLOCKS__": true,
  "__RESULT__": true,
  "__COMMENT_RESULT__": true,
  "__CDATA__": true,
  "__RETURN__": true,
  "__RETURN_VAL__": true,
  "__NODE__": true,
  "__I_PROTO__": true,
  "__I__": true,
  "__ATTR_J__": true,
  "__ATTR_STR__": true,
  "__ATTR_TMP__": true,
  "__LENGTH__": true,
  "__KEYS__": true,
  "__KEY__": true,
  "__APPEND__": true,
  "__FILTERS__": true,
  "__VARS__": true,
  "__LOCAL__": true,
  "__THIS__": true,
  "__INCLUDE__": true,
  "$_": true,
  "$0": true
};
/*!
 * Основные глобальные переменные библиотеки
 */

var rgxpCache = {};
var globalCache = {}, globalFnCache = {};

var cache = {}, table = {};

var blockCache = {};
var protoCache = {}, fromProtoCache = {};

var constCache = {}, fromConstCache = {};

var routerCache = {
  "block": blockCache,
  "const": constCache,
  "proto": protoCache
};

var routerFromCache = {
  "const": fromConstCache,
  "proto": fromProtoCache
};

var scopeCache = {
  "template": {},
  "proto": {},
  "block": {}
};

var outputCache = {};
var argsCache = {}, argsResCache = {};

var extMap = {}, extListCache = {};

var replacers = {}, sys = {}, block = {}, text = {}, inside = {}, after = {}, aliases = {}, groups = {}, groupsList = [], ends = {}, chains = {}, bem = {}, write = {};
/*!
 * Набор базовых макросов
 */

var defMacros = {
  "@quotes": {
    "\"": [["«", "»"], ["‘", "’"]],
    "'": [["“", "”"], ["„", "“"]]
  },

  "@shorts": {
    "(c)": "©",
    "(tm)": "™",

    "+-": "±",

    "[v]": "☑",
    "[x]": "☒",
    "[_]": "☐",

    "...": {
      inline: true,
      value: "…"
    },

    "-": {
      inline: true,
      value: "−"
    },

    "--": {
      inline: true,
      value: "—"
    }
  },

  "@adv": {
    "%lorem%": "Lorem ipsum dolor sit amet, consectetur adipisicing elit. " + "Dolor dolores error facilis iusto magnam nisi praesentium voluptas. " + "Delectus laudantium minus quia sapiente sunt temporibus voluptates! " + "Explicabo iusto molestias quis voluptatibus."
  },

  "@symbols": {
    "\\n": "\\n",
    "\\r": "\\r",
    "\\t": "\\t",
    "\\s": "&nbsp;"
  }
};
/*!
 * API для работы с аргументами функций
 */

/**
 * Вернуть массив аргументов функции
 * из заданной строки
 *
 * @param {string} str - исходная строка
 * @return {!Array}
 */
DirObj.prototype.getFnArgs = function (str) {
  var res = [], params = false;

  var pOpen = 0, arg = "";

  for (var i = -1; ++i < str.length;) {
    var el = str[i];

    if (pOpen ? bMap[el] : el === "(") {
      pOpen++;
      params = true;

      if (pOpen === 1) {
        continue;
      }
    } else if (pOpen ? closeBMap[el] : el === ")") {
      pOpen--;

      if (!pOpen) {
        break;
      }
    }

    if (el === "," && pOpen === 1) {
      res.push(arg.trim());
      arg = "";
      continue;
    }

    if (pOpen) {
      arg += el;
    }
  }

  if (pOpen) {
    this.error("invalid \"" + this.name + "\" declaration");
    return [];
  }

  if (arg) {
    res.push(arg.trim());
  }

  res.params = params;
  return res;
};

/**
 * Произвести анализ заданной строки
 * на наличие аргументов функции и вернуть результат
 *
 * @param {string} str - исходная строка
 * @param {string} type - тип функции (template, proto и т.д.)
 * @param {?string=} [opt_tplName] - название шаблона
 * @param {?string=} [opt_parentTplName] - название родительского шаблона
 * @param {?string= }[opt_name] - пользовательское название функции (для proto, block и т.д.)
 * @return {{str: string, list: !Array, defParams: string, scope: (string|undefined)}}
 */
DirObj.prototype.prepareArgs = function (str, type, opt_tplName, opt_parentTplName, opt_name) {
  opt_tplName = this.tplName;
  var struct = this.structure;
  var argsList = this.getFnArgs(str), params = argsList.params;

  var parentArgs, argsTable;

  if (!argsCache[opt_tplName]) {
    argsCache[opt_tplName] = {};
    argsResCache[opt_tplName] = {};
  }

  if (!argsCache[opt_tplName][type]) {
    argsCache[opt_tplName][type] = {};
    argsResCache[opt_tplName][type] = {};
  }

  if (opt_name) {
    if (opt_parentTplName && argsCache[opt_parentTplName][type]) {
      parentArgs = argsCache[opt_parentTplName][type][opt_name];
    }

    if (argsCache[opt_tplName][type][opt_name]) {
      var tmp = argsResCache[opt_tplName][type][opt_name], list = tmp.list;

      for (var i = -1; ++i < list.length;) {
        struct.vars[list[i][2]] = {
          value: list[i][0],
          scope: this.scope.length
        };
      }

      return tmp;
    } else {
      argsTable = argsCache[opt_tplName][type][opt_name] = {};
    }
  } else {
    if (opt_parentTplName) {
      parentArgs = argsCache[opt_parentTplName][type];
    }

    argsTable = argsCache[opt_tplName][type];
  }

  var scope;
  for (var i = -1; ++i < argsList.length;) {
    var arg = argsList[i].split("=");
    arg[0] = arg[0].trim();

    if (arg.length > 1) {
      arg[1] = arg.slice(1).join("=").trim();
      arg.splice(2, arg.length);
    }

    if (scopeModRgxp.test(arg[0])) {
      if (scope) {
        this.error("invalid \"" + this.name + "\" declaration");

        return {
          params: false,
          str: "",
          list: [],
          defParams: "",
          scope: void 0
        };
      } else {
        scope = arg[0].replace(scopeModRgxp, "");
      }
    }

    argsTable[arg[0]] = {
      i: i,
      key: arg[0],
      value: arg[1] && this.pasteDangerBlocks(arg[1].trim()),
      scope: scope
    };
  }

  forIn(parentArgs, function (el, key) {
    var aKey = undefined;
    if (scopeModRgxp.test(key)) {
      aKey = key.replace(scopeModRgxp, "");
    } else {
      aKey = "@" + key;
    }

    var rKey = argsTable[key] ? key : aKey;

    var current = argsTable[rKey], cVal = current && current.value === void 0;

    if (argsTable[rKey]) {
      if (!scope && el.scope) {
        scope = el.scope;
        argsTable[rKey].scope = scope;
      }

      if (cVal) {
        argsTable[rKey].value = el.value;
      }
    } else {
      argsTable[key] = {
        local: true,
        i: el.i,
        key: key,
        value: el.value !== void 0 ? el.value : "void 0"
      };
    }
  });

  argsList = [];
  var localVars = [];

  forIn(argsTable, function (el) {
    if (el.local) {
      localVars[el.i] = el;
    } else {
      argsList[el.i] = el;
    }
  });

  var consts = constCache[this.tplName], constsCache = {};

  var decl = "", defParams = "";

  var locals = [];

  for (var i = -1; ++i < localVars.length;) {
    var el = localVars[i];

    if (!el) {
      continue;
    }

    el.key = el.key.replace(scopeModRgxp, "");
    var old = el.key;

    if (opt_name) {
      el.key = this.declVar(el.key, true);
    }

    locals.push([el.key, el.value, old]);

    defParams += "var " + el.key + " = " + this.prepareOutput(this.replaceDangerBlocks(el.value), true) + ";";
    struct.vars[el.key] = {
      value: el.key,
      scope: this.scope.length
    };
  }

  var args = [], needArgs = type === "proto";

  if (needArgs) {
    for (var i = -1; ++i < argsList.length;) {
      if (argsList[i].key === "arguments") {
        needArgs = false;
        break;
      }
    }

    if (needArgs) {
      argsList.push({
        i: argsList.length,
        key: "arguments"
      });
    }
  }

  for (var i = -1; ++i < argsList.length;) {
    var el = argsList[i];

    el.key = el.key.replace(scopeModRgxp, "");
    var old = el.key;

    if (consts[old] && opt_name) {
      constsCache[old] = consts[old];
      delete consts[old];
    }

    if (opt_name) {
      el.key = this.declVar(el.key, true);
    }

    args.push([el.key, el.value, old]);

    decl += el.key;

    if (el.value !== void 0) {
      defParams += "" + el.key + " = arguments[" + i + "] = " + el.key + " != null ? " + el.key + " : " + this.prepareOutput(this.replaceDangerBlocks(el.value), true) + ";";
    }

    if (i !== argsList.length - 1) {
      decl += ",";
    }
  }

  if (needArgs) {
    var tmp = args.pop();
    args = args.concat(locals);
    args.push(tmp);
    args["__SNAKESKIN_TMP__needArgs"] = true;
  } else {
    args = args.concat(locals);
  }

  struct.params._consts = constsCache;

  var res = {
    params: params,
    str: decl,
    list: args,
    scope: scope,
    defParams: defParams
  };

  if (opt_name) {
    argsResCache[opt_tplName][type][opt_name] = res;
  }

  return res;
};
/*!
 * API для работы с кешем шаблонов
 */

/**
 * Вернуть объект кеша вывода заданного блока
 *
 * @param {string} type - тип блока (block, proto и т.д.)
 * @param {?string=} [opt_tplName] - название шаблона
 * @return {Object}
 */
DirObj.prototype.getBlockOutput = function (type, opt_tplName) {
  opt_tplName = opt_tplName || this.tplName;
  var output = outputCache[opt_tplName];

  if (!output) {
    return null;
  }

  if (!output[type]) {
    output[type] = {};
  }

  return output[type];
};

/**
 * (Пере)инициализировать кеш для шаблона
 *
 * @param {string} tplName - название шаблона
 * @return {!DirObj}
 */
DirObj.prototype.initTemplateCache = function (tplName) {
  protoCache[tplName] = {};
  blockCache[tplName] = {};
  constCache[tplName] = {};

  fromProtoCache[tplName] = 0;
  fromConstCache[tplName] = 0;

  this.consts = [];
  this.bemRef = "";

  this.strongSpace = 0;
  this.sysSpace = false;
  this.chainSpace = false;
  this.space = !this.tolerateWhitespace;

  return this;
};
Snakeskin.DirObj = DirObj;

/**
 * Объект управления директивами
 *
 * @constructor
 * @implements {$$SnakeskinDirObj}
 *
 * @param {string} src - исходный текст шаблона
 * @param {!Object} params - дополнительные параметры
 * @param {?function(!Error)=} [params.onError] - функция обратного вызова для обработки ошибок при трансляции
 *
 * @param {boolean} params.useStrict - если false, то шаблоны компилируются без 'use strict';
 * @param {boolean} params.throws - если true, то в случае ошибки и отсутствия обработчика ошибок -
 *     будет сгенерирована ошибка
 *
 * @param {string} params.exports - тип экспорта шаблонов
 * @param {boolean} params.inlineIterators - если true, то итераторы forEach и forIn
 *     будут развёрнуты в циклы
 *
 * @param {boolean} params.autoReplace - если false, то Snakeskin не делает дополнительных преобразований
 *     последовательностей
 *
 * @param {Object=} [params.macros] - таблица символов для преобразования последовательностей
 * @param {?string=} [params.renderAs] - тип рендеринга шаблонов, доступные варианты:
 *
 *     1) placeholder - все шаблоны рендерятся как placeholder-ы;
 *     2) interface - все шаблоны рендерятся как interface-ы;
 *     3) template - все шаблоны рендерятся как template-ы.
 *
 * @param {string|boolean} [params.doctype] - тип генерируемого документа HTML:
 *     1) html;
 *     2) xml.
 *
 * @param {boolean} params.localization - если false, то блоки ` ... ` не заменяются на вызов i18n
 * @param {string} params.i18nFn - название функции для i18n
 * @param {Object=} [params.language] - таблица фраз для локализации (найденные фразы будут заменены по ключу)
 *
 * @param {string} params.lineSeparator - символ перевода строки
 * @param {boolean} params.tolerateWhitespace - если true, то пробельные символы
 *     вставляются "как есть"
 *
 * @param {boolean} params.replaceUndef - если false, то на вывод значений через директиву output
 *     не будет накладываться фильтр undef
 *
 * @param {boolean} params.escapeOutput - если false, то на вывод значений через директиву output
 *     не будет накладываться фильтр html
 *
 * @param {string} params.bemFilter - название используемого фильтра для БЭМ
 * @param {string} params.renderMode - режим рендеринга шаблонов, доступные варианты:
 *
 *     1) stringConcat - рендеринг шаблона в строку с простой конкатенацией через оператор сложения;
 *     2) stringBuffer - рендеринг шаблона в строку с конкатенацией через Snakeskin.StringBuffer;
 *     3) dom - рендеринг шаблона в набор команд из DOM API.
 *
 * @param {Array=} [params.lines] - массив строк шаблона (листинг)
 * @param {DirObj=} [params.parent] - ссылка на родительский объект
 *
 * @param {?boolean=} [params.needPrfx] - если true, то директивы декларируются как #{ ... }
 * @param {RegExp=} [params.ignore] - регулярное выражение, которое задаёт пробельные символы для игнорирования
 *
 * @param {Array=} [params.scope] - область видимости (контекст) директив
 * @param {Object=} [params.vars] - объект локальных переменных
 * @param {Array=} [params.consts] - массив деклараций констант
 *
 * @param {Object=} [params.proto] - объект корневого прототипа
 * @param {Object=} [params.info] - дополнительная информация о запуске
 *     (используется для сообщений об ошибках)
 */
function DirObj(src, params) {
  for (var key in this) {
    if (this[key] && this[key].init) {
      this[key] = this[key].init();
    }
  }

  /** @type {DirObj} */
  this.parent = params.parent;

  /** @type {boolean} */
  this.throws = params.throws;

  /** @type {boolean} */
  this.useStrict = params.useStrict;

  /** @type {?function(!Error)} */
  this.onError = params.onError || null;

  /** @type {!Array} */
  this.scope = params.scope || [];

  /** @type {Object} */
  this.proto = params.proto;

  /** @type {Object} */
  this.info = params.info;

  /** @type {boolean} */
  this.needPrfx = params.needPrfx || false;

  /** @type {!Array} */
  this.lines = params.lines || [""];

  /** @type {string} */
  this.lineSeparator = params.lineSeparator;

  /** @type {string} */
  this.renderMode = params.renderMode;

  /** @type {boolean} */
  this.tolerateWhitespace = params.tolerateWhitespace;

  /** @type {boolean} */
  this.inlineIterators = params.inlineIterators;

  /** @type {(string|boolean)} */
  this.doctype = params.doctype;

  /** @type {boolean} */
  this.replaceUndef = params.replaceUndef;

  /** @type {boolean} */
  this.escapeOutput = params.escapeOutput;

  /** @type {(?string|undefined)} */
  this.renderAs = params.renderAs;

  /** @type {string} */
  this.exports = params.exports;

  /** @type {boolean} */
  this.autoReplace = params.autoReplace !== false;

  /** @type {(Object|undefined)} */
  this.macros = params.macros;

  /** @type {string} */
  this.bemFilter = params.bemFilter;

  /** @type {boolean} */
  this.localization = params.localization;

  /** @type {string} */
  this.i18nFn = params.i18nFn;

  /** @type {(Object|undefined)} */
  this.language = params.language;

  /** @type {(RegExp|undefined)} */
  this.ignore = params.ignore;

  /**
   * Стек изменяемых параметров
   * (те параметры, которые можно изменить директивой)
   * @type {!Array}
   */
  this.params = [{
    "@root": true,
    "renderMode": this.renderMode,
    "inlineIterators": this.inlineIterators,
    "doctype": this.doctype,
    "escapeOutput": this.escapeOutput,
    "renderAs": this.renderAs,
    "replaceUndef": this.replaceUndef,
    "autoReplace": this.autoReplace,
    "macros": this.macros,
    "localization": this.localization,
    "i18nFn": this.i18nFn,
    "bemFilter": this.bemFilter,
    "language": this.language,
    "ignore": this.ignore,
    "tolerateWhitespace": this.tolerateWhitespace
  }];

  if (params.consts) {
    /** @type {(Array|undefined)} */
    this.consts = params.consts;
  }

  /**
   * Если true, то трансляция сбрасывается
   * @type {boolean}
   */
  this.brk = false;

  /**
   * Название активной директивы
   * @type {?string}
   */
  this.name = null;

  /**
   * Таблица директив, которые могут идти после исходной
   * @type {Object}
   */
  this.after = null;

  /**
   * Если false, то шаблон не вставляется в результирующую JS строку
   * @type {boolean}
   */
  this.canWrite = true;

  // Флаги работы с пробельными символами
  // >>>

  /** @type {boolean} */
  this.space = false;

  /** @type {boolean} */
  this.skipSpace = false;

  /** @type {boolean} */
  this.prevSpace = false;

  /** @type {boolean} */
  this.chainSpace = false;

  /** @type {number} */
  this.strongSpace = 0;

  /** @type {boolean} */
  this.sysSpace = false;

  /** @type {number} */
  this.freezeLine = 0;

  /** @type {boolean} */
  this.attr = false;

  /** @type {boolean} */
  this.attrEscape = false;

  // <<<

  /**
   * Номер активной итерации
   * @type {number}
   */
  this.i = -1;

  /**
   * Дерево блоков (прототипы, блоки, константы)
   * @type {Object}
   */
  this.blockStructure = null;

  /**
   * Таблица блоков (прототипы, блоки, константы)
   * @type {Object}
   */
  this.blockTable = null;

  /**
   * Кеш внешних блоков и прототипов
   * @type {!Object}
   */
  this.preDefs = {};

  /**
   * Название активного внешнего прототипа или блока
   * @type {?string}
   */
  this.outerLink = null;

  /**
   * Структура шаблонов
   * @type {!Object}
   */
  this.structure = {
    name: "root",

    /** @type {?{name: string, parent: Object, params: !Object, stack: !Array, vars: Object, children: Array, sys: boolean, strong: boolean}} */
    parent: null,

    params: {},
    stack: [],

    vars: params.vars || {},
    children: [],

    sys: false,
    strong: false
  };

  /**
   * Если true, то директива не имеет закрывающей части
   * @type {?boolean}
   */
  this.inline = null;

  /**
   * Если true, то директива считается текстовой
   * @type {boolean}
   */
  this.text = false;

  /**
   * Содержимое скобок (Escaper)
   * @type {!Array}
   */
  this.quotContent = [];

  /**
   * Содержимое директив (для replaceTplVars)
   * @type {!Array}
   */
  this.dirContent = [];

  /**
   * Содержимое блоков cdata
   * @type {!Array}
   */
  this.cDataContent = [];

  /**
   * Таблица подключённых файлов
   * @type {!Object}
   */
  this.files = {};

  /**
   * Объект модуля
   * @type {{exports, require, id, key, root, filename, parent, children, loaded}}
   */
  this.module = {
    exports: {},
    require: IS_NODE ? require : null,

    id: 0,
    key: [],

    root: null,
    filename: this.info["file"],
    parent: IS_NODE ? module : null,

    children: [],
    loaded: true
  };

  /**
   * Исходный текст шаблона
   * @type {string}
   */
  this.source = this.replaceCData(String(src));

  /**
   * Результирующий JS код
   * @type {string}
   */
  this.res = "";

  if (!this.proto) {
    this.res += /* cbws */"This code is generated automatically, don't alter it. */(function () {" + (this.useStrict ? "'use strict';" : "") + "var __IS_NODE__ = false,__HAS_EXPORTS__ = typeof exports !== 'undefined',__EXPORTS__ = __HAS_EXPORTS__ ? exports : this;try {__IS_NODE__ = 'object' === typeof process && Object.prototype.toString.call(process) === '[object process]';} catch (ignore) {}var Snakeskin = (__IS_NODE__ ? global : this).Snakeskin;function __INIT__(obj) {Snakeskin = Snakeskin ||(obj instanceof Object ? obj : void 0);if (__HAS_EXPORTS__) {delete __EXPORTS__.init;}if (__IS_NODE__) {Snakeskin = Snakeskin || require(obj);}__EXEC__.call(__EXPORTS__);return __EXPORTS__;}if (__HAS_EXPORTS__) {__EXPORTS__.init = __INIT__;}function __EXEC__() {var __ROOT__ = this,self = this;var __APPEND__ = Snakeskin.appendChild,__FILTERS__ = Snakeskin.Filters,__VARS__ = Snakeskin.Vars,__LOCAL__ = Snakeskin.LocalVars;" + this.multiDeclVar("$_") + "";
  }
}
/*!
 * API для работы с директивами
 */

/**
 * Декларировать начало блочной директивы
 *
 * @param {?string=} opt_name - название директивы
 * @param {Object=} [opt_params] - дополнительные параметры
 * @param {Object=} [opt_vars] - локальные переменные директивы
 * @return {!DirObj}
 */
DirObj.prototype.startDir = function (opt_name, opt_params, opt_vars) {
  var _this = this;
  opt_vars = opt_vars || {};

  opt_name = this.name = opt_name || this.name;

  opt_params = opt_params || {};
  this.inline = false;

  var vars = opt_vars || {}, struct = this.structure;

  // Установка ссылок на локальные переменные родительской директивы
  forIn(struct.vars, function (el, key) {
    vars[key] = el;
    vars[key].inherited = true;
  });

  var obj = {
    name: opt_name,
    parent: struct,

    params: opt_params,
    stack: [],

    vars: vars,
    children: [],

    sys: Boolean(sys[opt_name]),
    strong: false
  };

  struct.children.push(obj);
  this.structure = obj;

  var bStruct = this.blockStructure, bTable = this.blockTable;

  if (bStruct && this.getGroup("blockInherit")[opt_name]) {
    var deep;
    (function () {
      var parent = _this.parentTplName, key = "" + opt_name + "_" + opt_params.name, sub = undefined;

      if (bTable[key] && bTable[key] !== true) {
        sub = bTable[key];
        sub.parent = bStruct;
      } else {
        sub = {
          name: opt_name,
          parent: bStruct,
          params: opt_params,
          children: []
        };

        if (bTable[key] === true) {
          sub.drop = true;
        }

        bTable[key] = sub;
        deep = function (obj) {
          for (var i = -1; ++i < obj.length;) {
            var el = obj[i], _key = "" + el.name + "_" + el.params.name;

            if (bTable[_key]) {
              bTable[_key].drop = true;
            } else {
              bTable[_key] = true;
            }

            if (el.children) {
              deep(el.children);
            }
          }
        };

        if (parent && table[parent][key] && table[parent][key].children) {
          deep(table[parent][key].children);
        }
      }

      bStruct.children.push(sub);
      _this.blockStructure = sub;
    })();
  }

  return this;
};

/**
 * Декларировать начало строчной директивы
 *
 * @param {?string=} opt_name - название директивы
 * @param {Object=} [opt_params] - дополнительные параметры
 * @return {!DirObj}
 */
DirObj.prototype.startInlineDir = function (opt_name, opt_params) {
  opt_params = opt_params || {};
  opt_name = this.name = opt_name || this.name;

  var obj = {
    name: opt_name,
    parent: this.structure,

    params: opt_params,
    stack: [],

    vars: null,
    children: null,

    sys: Boolean(sys[opt_name]),
    strong: false
  };

  this.inline = true;
  this.structure.children.push(obj);
  this.structure = obj;

  var bStruct = this.blockStructure, bTable = this.blockTable;

  if (this.blockStructure && this.getGroup("inlineInherit")[opt_name]) {
    var key = "" + opt_name + "_" + opt_params.name, sub = undefined;

    if (bTable[key] && bTable[key] !== true) {
      sub = bTable[key];
      sub.parent = bStruct;
    } else {
      sub = {
        name: opt_name,
        parent: bStruct,
        params: opt_params
      };

      if (bTable[key] === true) {
        sub.drop = true;
      }
    }

    bTable[key] = sub;
    bStruct.children.push(sub);
    this.blockStructure = sub;
  }

  return this;
};

/**
 * Декларировать конец директивы
 * @return {!DirObj}
 */
DirObj.prototype.endDir = function () {
  if (this.blockStructure && this.getGroup("blockInherit")[this.structure.name]) {
    this.blockStructure = this.blockStructure.parent;
  }

  this.structure = this.structure.parent;
  return this;
};
/*!
 * API для обработки ошибок трансляции
 */

/**
 * Вывести дополнительную информацию об ошибке
 * @return {string}
 */
DirObj.prototype.genErrorAdvInfo = function () {
  var nl = this.lineSeparator;
  var info = this.info, str = "";

  if (!info) {
    return str;
  }

  forIn(info, function (el, key) {
    if (el == null) {
      return;
    }

    if (el.innerHTML) {
      str += "" + key + ": (class: " + (el.className || "undefined") + ", id: " + (el.id || "undefined") + "), ";
    } else {
      str += "" + key + ": " + el + ", ";
    }
  });

  str = str.replace(/, $/, "");
  var line = info["line"];

  var cutRgxp = /\/\*!!= (.*?) =\*\//g, privateRgxp = new RegExp("" + ADV_LEFT_BLOCK + "?" + LEFT_BLOCK + "__.*?__.*?" + RIGHT_BLOCK, "g"), styleRgxp = /\t|[ ]{4}/g;

  if (line) {
    var prfx = "", max = 0;

    for (var i = 8; i--;) {
      var pos = line - i - 2, prev = this.lines[pos];

      var space = new Array(String(line - 1).length - String(pos).length + 1).join(" ");

      if (prev != null) {
        prev = prev.replace(styleRgxp, "  ").replace(privateRgxp, "").replace(cutRgxp, "$1");

        var _part = undefined;

        if (prev.trim()) {
          _part = "" + nl + "  " + (pos + 1) + " " + space + "" + prev;
        } else {
          _part = "" + nl + "  ...";
        }

        prfx += _part;
        if (max < _part.length) {
          max = _part.length;
        }
      }
    }

    var current = this.lines[line - 1].replace(styleRgxp, "  ").replace(privateRgxp, "").replace(cutRgxp, "$1");

    var part = "> " + line + " " + current;
    var sep = new Array(Math.max(max, part.length) || 5).join("-");

    str += nl + sep + prfx + nl + part + nl + sep;
  }

  return str;
};

/**
 * @private
 * @type {?boolean}
 */
DirObj.prototype._error = null;

/**
 * Генерировать заданную ошибку
 * @param {string} msg - сообщение ошибки
 */
DirObj.prototype.error = function (msg) {
  if (this._error) {
    return;
  }

  this._error = true;
  var report = "" + msg + ", " + this.genErrorAdvInfo(), error = new Error(report);

  error.name = "SnakeskinError";
  this.brk = true;

  if (this.proto) {
    this.parent.brk = true;
  }

  if (this.onError) {
    this.onError(error);
  } else {
    if (typeof console === "undefined" || typeof console.error !== "function" || this.throws) {
      throw error;
    }

    console.error("SnakeskinError: " + report);
  }
};
/*!
 * Методы и функции для экранирования
 */

var sysEscapeMap = (function () {
  var _sysEscapeMap = {
    "\\": true };

  _defineProperty(_sysEscapeMap, I18N, true);

  _defineProperty(_sysEscapeMap, LEFT_BLOCK, true);

  _defineProperty(_sysEscapeMap, ADV_LEFT_BLOCK, true);

  _defineProperty(_sysEscapeMap, SINGLE_COMMENT.charAt(0), true);

  _defineProperty(_sysEscapeMap, MULT_COMMENT_START.charAt(0), true);

  _defineProperty(_sysEscapeMap, CONCAT_COMMAND, true);

  _defineProperty(_sysEscapeMap, CONCAT_END, true);

  _defineProperty(_sysEscapeMap, IGNORE_COMMAND, true);

  _defineProperty(_sysEscapeMap, INLINE_COMMAND.trim().charAt(0), true);

  return _sysEscapeMap;
})();

forIn(baseShortMap, function (el, key) {
  sysEscapeMap[key.charAt(0)] = true;
});

var strongSysEscapeMap = (function () {
  var _strongSysEscapeMap = {
    "\\": true };

  _defineProperty(_strongSysEscapeMap, SINGLE_COMMENT.charAt(0), true);

  _defineProperty(_strongSysEscapeMap, MULT_COMMENT_START.charAt(0), true);

  return _strongSysEscapeMap;
})();

var includeSysEscapeMap = {};
includeSysEscapeMap["\\"] = true;

forIn(includeDirMap, function (el, key) {
  includeSysEscapeMap[key.charAt(0)] = true;
});

var escapeMap = {
  "\"": true,
  "'": true,
  "/": true
};

var escapeEndMap = {
  "-": true,
  "+": true,
  "*": true,
  "%": true,
  "~": true,
  ">": true,
  "<": true,
  "^": true,
  ",": true,
  ";": true,
  "=": true,
  "|": true,
  "&": true,
  "!": true,
  "?": true,
  ":": true,
  "(": true,
  "{": true,
  "[": true
};

var escapeEndWords = {
  "typeof": true,
  "void": true,
  "instanceof": true,
  "delete": true,
  "in": true,
  "new": true
};

var bMap = {
  "(": true,
  "[": true,
  "{": true
};

var closeBMap = {
  ")": true,
  "]": true,
  "}": true
};

var pMap = {
  "(": true,
  "[": true
};

var closePMap = {
  ")": true,
  "]": true
};

var backSlashRgxp = /\\/g, singleQRgxp = /'/g, qRgxp = /"/g;

function escapeBackslash(str) {
  return String(str).replace(backSlashRgxp, "\\\\");
}

function escapeSingleQuote(str) {
  return String(str).replace(singleQRgxp, "\\'");
}

function escapeDoubleQuote(str) {
  return String(str).replace(qRgxp, "\\\"");
}

function applyDefEscape(str) {
  return escapeNextLine(String(str).replace(backSlashRgxp, "\\\\").replace(singleQRgxp, "\\'"));
}

var nRgxp = /\n/g, rRgxp = /\r/g;

function escapeNextLine(str) {
  return String(str).replace(nRgxp, "\\n").replace(rRgxp, "\\r");
}

var Escaper, globalEscaper = global.Escaper;

/* istanbul ignore next */
/*!
 * Escaper v2.1.5
 * https://github.com/kobezzza/Escaper
 *
 * Released under the MIT license
 * https://github.com/kobezzza/Escaper/blob/master/LICENSE
 *
 * Date: Tue, 06 Jan 2015 18:16:12 GMT
 */

(function () {
"use strict";

var Escaper = {
  VERSION: [2, 1, 5]
};

if (typeof define === "function" && define["amd"]) {
  define([], function () {
    return Escaper;
  });
} else if (typeof exports === "object") {
  module.exports = exports = Escaper;
} else {
  this.Escaper = Escaper;
}

var stringLiterals = {
  "\"": true,
  "'": true,
  "`": true
};

var literals = {
  "/": true
};

for (var key in stringLiterals) {
  if (!stringLiterals.hasOwnProperty(key)) {
    continue;
  }

  literals[key] = true;
}

var singleComments = {
  "//": true
};

var multComments = {
  "/*": true,
  "/**": true,
  "/*!": true
};

var keyArr = [], finalMap = {};

for (var key in literals) {
  if (!literals.hasOwnProperty(key)) {
    continue;
  }

  keyArr.push(key);
  finalMap[key] = true;
}

for (var key in singleComments) {
  if (!singleComments.hasOwnProperty(key)) {
    continue;
  }

  keyArr.push(key);
  finalMap[key] = true;
}

for (var key in multComments) {
  if (!multComments.hasOwnProperty(key)) {
    continue;
  }

  keyArr.push(key);
  finalMap[key] = true;
}

var rgxpFlagsMap = {
  "g": true,
  "m": true,
  "i": true,
  "y": true,
  "u": true
};

var rgxpFlags = [];
for (var key in rgxpFlagsMap) {
  if (!rgxpFlagsMap.hasOwnProperty(key)) {
    continue;
  }

  rgxpFlags.push(key);
}

var escapeEndMap = {
  "-": true,
  "+": true,
  "*": true,
  "%": true,
  "~": true,
  ">": true,
  "<": true,
  "^": true,
  ",": true,
  ";": true,
  "=": true,
  "|": true,
  "&": true,
  "!": true,
  "?": true,
  ":": true,
  "(": true,
  "{": true,
  "[": true
};

var escapeEndWordMap = {
  "typeof": true,
  "void": true,
  "instanceof": true,
  "delete": true,
  "in": true,
  "new": true
};

var cache = {}, content = [];

/**
 * @param {!Object} obj
 * @param {!Object} p
 * @param {(boolean|number)} val
 */
function mix(obj, p, val) {
  for (var key in obj) {
    if (!obj.hasOwnProperty(key)) {
      continue;
    }

    if (key in p === false) {
      p[key] = val;
    }
  }
}

/**
 * Стек содержимого
 * @type {!Array}
 */
Escaper.quotContent = content;

var uSRgxp = /[^\s\/]/, wRgxp = /[a-z]/, sRgxp = /\s/, nRgxp = /\r|\n/;

var symbols, snakeskinRgxp;

Escaper.snakeskinRgxp = Escaper.snakeskinRgxp || null;
Escaper.symbols = Escaper.symbols || null;

/**
 * Заметить блоки вида ' ... ', " ... ", ` ... `, / ... /, // ..., /* ... *\/ на
 * __ESCAPER_QUOT__номер_ в указанной строке
 *
 * @param {string} str - исходная строка
 * @param {(Object|boolean)=} opt_withCommentsOrParams - таблица вырезаемых последовательностей:
 *
 *     (если установить значение параметру -1, то он будет полностью вырезаться,
 *     т.е. без возможности обратной замены, иначе true/false - включить/исключить последовательность)
 *
 *     *) @all - вырезаются все последовательности
 *     *) @comments - вырезаются все виды комментариев
 *     *) @strings - вырезаются все виды литералов строк
 *     *) @literals - вырезаются все виды литералов строк и регулярных выражений
 *     *) `
 *     *) '
 *     *) "
 *     *) /
 *     *) //
 *     *) /*
 *     *) /**
 *     *) /*!
 *
 *     ИЛИ если логическое значение, то вырезаются литералы с комментариями (true) / литералы (false)
 *
 * @param {Array=} opt_quotContent - стек содержимого
 * @param {?boolean=} [opt_snakeskin] - если true, то при экранировании учитываются конструкции Snakeskin
 * @return {string}
 */
Escaper.replace = function (str, opt_withCommentsOrParams, opt_quotContent, opt_snakeskin) {
  symbols = symbols || Escaper.symbols || Escaper["symbols"] || "a-z";

  snakeskinRgxp = snakeskinRgxp || Escaper.snakeskinRgxp || Escaper["snakeskinRgxp"] || new RegExp("[!$" + symbols + "_]", "i");

  var isObj = opt_withCommentsOrParams instanceof Object;
  var p = isObj ? Object(opt_withCommentsOrParams) : {};

  var withComments = false;
  if (typeof opt_withCommentsOrParams === "boolean") {
    withComments = Boolean(opt_withCommentsOrParams);
  }

  if ("@comments" in p) {
    mix(multComments, p, p["@comments"]);
    mix(singleComments, p, p["@comments"]);
    delete p["@comments"];
  }

  if ("@strings" in p) {
    mix(stringLiterals, p, p["@strings"]);
    delete p["@strings"];
  }

  if ("@literals" in p) {
    mix(literals, p, p["@literals"]);
    delete p["@literals"];
  }

  if ("@all" in p) {
    mix(finalMap, p, p["@all"]);
    delete p["@all"];
  }

  var cacheKey = "";
  for (var i = -1; ++i < keyArr.length;) {
    var el = keyArr[i];

    if (multComments[el] || singleComments[el]) {
      p[el] = withComments || p[el];
    } else {
      p[el] = p[el] || !isObj;
    }

    cacheKey += "" + p[el] + ",";
  }

  var initStr = str;
  var stack = opt_quotContent || content;

  if (stack === content && cache[cacheKey] && cache[cacheKey][initStr]) {
    return cache[cacheKey][initStr];
  }

  var begin = false, end = true;

  var escape = false, comment = false;

  var selectionStart = 0, block = false;

  var templateVar = 0, filterStart = false;

  var cut, label;

  var part = "", rPart = "";

  for (var i = -1; ++i < str.length;) {
    var el = str.charAt(i), next = str.charAt(i + 1);

    var word = str.substr(i, 2), extWord = str.substr(i, 3);

    if (!comment) {
      if (!begin) {
        if (el === "/") {
          if (singleComments[word] || multComments[word]) {
            if (singleComments[extWord] || multComments[extWord]) {
              comment = extWord;
            } else {
              comment = word;
            }
          }

          if (comment) {
            selectionStart = i;
            continue;
          }
        }

        if (escapeEndMap[el] || escapeEndWordMap[rPart]) {
          end = true;
          rPart = "";
        } else if (uSRgxp.test(el)) {
          end = false;
        }

        if (wRgxp.test(el)) {
          part += el;
        } else {
          rPart = part;
          part = "";
        }

        var skip = false;
        if (opt_snakeskin) {
          if (el === "|" && snakeskinRgxp.test(next)) {
            filterStart = true;
            end = false;
            skip = true;
          } else if (filterStart && sRgxp.test(el)) {
            filterStart = false;
            end = true;
            skip = true;
          }
        }

        if (!skip) {
          if (escapeEndMap[el]) {
            end = true;
          } else if (uSRgxp.test(el)) {
            end = false;
          }
        }
      }

      // Блоки [] внутри регулярного выражения
      if (begin === "/" && !escape) {
        if (el === "[") {
          block = true;
        } else if (el === "]") {
          block = false;
        }
      }

      if (!begin && templateVar) {
        if (el === "}") {
          templateVar--;
        } else if (el === "{") {
          templateVar++;
        }

        if (!templateVar) {
          el = "`";
        }
      }

      if (begin === "`" && !escape && word === "${") {
        el = "`";
        i++;
        templateVar++;
      }

      if (finalMap[el] && (el !== "/" || end) && !begin) {
        begin = el;
        selectionStart = i;
      } else if (begin && (el === "\\" || escape)) {
        escape = !escape;
      } else if (finalMap[el] && begin === el && !escape && (begin !== "/" || !block)) {
        if (el === "/") {
          for (var j = -1; ++j < rgxpFlags.length;) {
            if (rgxpFlagsMap[str.charAt(i + 1)]) {
              i++;
            }
          }
        }

        begin = false;
        end = false;

        if (p[el]) {
          cut = str.substring(selectionStart, i + 1);

          if (p[el] === -1) {
            label = "";
          } else {
            label = "__ESCAPER_QUOT__" + stack.length + "_";
            stack.push(cut);
          }

          str = str.substring(0, selectionStart) + label + str.substring(i + 1);
          i += label.length - cut.length;
        }
      }
    } else if (nRgxp.test(next) && singleComments[comment] || multComments[el + str.charAt(i - 1)] && i - selectionStart > 2 && multComments[comment]) {
      if (p[comment]) {
        cut = str.substring(selectionStart, i + 1);

        if (p[comment] === -1) {
          label = "";
        } else {
          label = "__ESCAPER_QUOT__" + stack.length + "_";
          stack.push(cut);
        }

        str = str.substring(0, selectionStart) + label + str.substring(i + 1);
        i += label.length - cut.length;
      }

      comment = false;
    }
  }

  if (stack === content) {
    cache[cacheKey] = cache[cacheKey] || {};
    cache[cacheKey][initStr] = str;
  }

  return str;
};

var pasteRgxp = /__ESCAPER_QUOT__(\d+)_/g;

/**
 * Заметить __ESCAPER_QUOT__номер_ в указанной строке на реальное содержимое
 *
 * @param {string} str - исходная строка
 * @param {Array=} opt_quotContent - стек содержимого
 * @return {string}
 */
Escaper.paste = function (str, opt_quotContent) {
  var stack = opt_quotContent || content;
  return str.replace(pasteRgxp, function (sstr, pos) {
    return stack[pos];
  });
};
}).call(new Function('return this')());

if (IS_NODE) {
  Escaper = exports;
  module.exports = exports = root;
} else {
  Escaper = global.Escaper;
  global.Escaper = globalEscaper;
}

Escaper.snakeskinRgxp = filterStartRgxp;
var escaperRgxp = /^__ESCAPER_QUOT__\d+_/;

/**
 * Заметить блоки вида ' ... ', " ... ", / ... /, ` ... `, // ..., /* ... *\/ на
 * __ESCAPER_QUOT__номер_ в указанной строке
 *
 * @param {string} str - исходная строка
 * @return {string}
 */
DirObj.prototype.replaceDangerBlocks = function (str) {
  return Escaper.replace(str, true, this.quotContent, true);
};

/**
 * Заметить __ESCAPER_QUOT__номер_ в указанной строке на реальное содержимое
 *
 * @param {string} str - исходная строка
 * @return {string}
 */
DirObj.prototype.pasteDangerBlocks = function (str) {
  return Escaper.paste(str, this.quotContent);
};

var tplsVarsRgxp = /__SNAKESKIN__(\d+)_/g;

/**
 * Заметить __SNAKESKIN__номер_ в указанной строке на реальное содержимое
 *
 * @param {string} str - исходная строка
 * @return {string}
 */
DirObj.prototype.pasteTplVarBlocks = function (str) {
  var _this2 = this;
  return str.replace(tplsVarsRgxp, function (sstr, pos) {
    return _this2.dirContent[pos];
  });
};
var uid;

/**
 * Выполнить заданную строку как JavaScript
 *
 * @param {string} str - исходная строка
 * @return {?}
 */
DirObj.prototype.evalStr = function (str) {
  str = this.pasteDangerBlocks(str);
  var module = this.module;
  var filename = module.filename, dirname;

  if (IS_NODE) {
    dirname = require("path").dirname(filename);
    return new Function("Snakeskin", "__FILTERS__", "__VARS__", "__LOCAL__", "module", "exports", "require", "__dirname", "__filename", str).call(root, Snakeskin, Snakeskin.Filters, Snakeskin.Vars, Snakeskin.LocalVars, module, module.exports, require, dirname, filename);
  } else {
    return new Function("Snakeskin", "__FILTERS__", "__VARS__", "__LOCAL__", str).call(root, Snakeskin, Snakeskin.Filters, Snakeskin.Vars, Snakeskin.LocalVars);
  }
};

/**
 * Выполнить заданную строку как JavaScript
 * и вернуть результат
 *
 * @param {string} str - исходная строка
 * @return {?}
 */
DirObj.prototype.returnEvalVal = function (str) {
  return this.evalStr("return " + str);
};
/**
 * Вернуть полное тело заданного шаблона
 * при наследовании
 *
 * @param {string} tplName - название шаблона
 * @return {string}
 */
DirObj.prototype.getFullBody = function (tplName) {
  var protoLength = "proto".length, constLength = 1;

  var isDecl = [];
  forIn(this.getGroup("inherit"), function (el, key) {
    isDecl.push(key);
  });

  var length = isDecl.length * 2, is = {};

  for (var i = -1, j = 0; ++i < isDecl.length;) {
    is[i + j] = isDecl[i];
    j++;
    is[i + j] = "" + isDecl[i] + "_add";
  }

  var parentTpl = extMap[tplName], res = cache[parentTpl];

  var alb = ADV_LEFT_BLOCK, lb = LEFT_BLOCK, rb = RIGHT_BLOCK;

  if (!this.tolerateWhitespace) {
    res += "" + alb + "" + lb + "__&-__" + rb;
  }

  var from = 0, advDiff = [];

  var sornFn = function (a, b) {
    return a.val - b.val;
  };
  var tb = table[tplName], k;

  var el, prev;

  var newFrom, blockDiff;

  for (var i = -1; ++i < length;) {
    var type = is[i];

    if (routerCache[type]) {
      k = "" + type + "_";

      el = routerCache[type][tplName];
      prev = routerCache[type][parentTpl];

      if (routerFromCache[type]) {
        from = routerFromCache[type][parentTpl];
        newFrom = null;
      }
    }

    for (var key in el) {
      if (!el.hasOwnProperty(key)) {
        continue;
      }

      // Сдвиг относительно
      // родительской позиции элемента
      var adv = 0;

      var current = el[key], parent = !tb[k + key].drop && prev[key];

      var _block = cache[tplName].substring(current.from, current.to);

      // Разница между дочерним и родительским блоком
      if (parent) {
        if (parent.output != null && current.output == null && i % 2 === 0) {
          current.output = parent.output;

          if (type === "const") {
            _block += current.output;
          } else {
            this.getBlockOutput(type, tplName)[key] = current.output;
          }
        }

        blockDiff = _block.length - cache[parentTpl].substring(parent.from, parent.to).length;
      }

      var diff = parent ? parent.from : from;

      advDiff.sort(sornFn);

      for (var j = -1; ++j < advDiff.length;) {
        if (advDiff[j].val <= diff) {
          adv += advDiff[j].adv;
        } else {
          break;
        }
      }

      // Переопределение
      if (parent && i % 2 === 0) {
        if (type !== "block" && (type !== "const" || !current.block)) {
          newFrom = parent.from + adv + _block.length;
          from += blockDiff;

          if (newFrom > from) {
            from = newFrom + (type === "proto" ? protoLength : constLength);
          }
        }

        res = res.substring(0, parent.from + adv) + _block + res.substring(parent.to + adv);

        advDiff.push({
          val: parent.from,
          adv: blockDiff
        });

        // Добавление
      } else if (!parent) {
        if (type === "block_add") {
          res += _block;
        } else if (type === "const_add" || type === "proto_add") {
          // Случай, если в дочернем шаблоне нет перекрытий,
          // но есть добавления нового
          if (newFrom === null) {
            newFrom = from;
            from += adv;
          }

          _block = type === "const_add" ? "" + (current.needPrfx ? alb : "") + "" + lb + "" + _block + "" + rb : _block;

          res = res.substring(0, from) + _block + res.substring(from);

          advDiff.push({
            val: newFrom,
            adv: _block.length
          });

          from = from + _block.length;
        }
      }
    }
  }

  return res;
};
/*!
 * API для работы с Jade-Like синтаксисом
 */

(function () {
  var alb = ADV_LEFT_BLOCK, lb = LEFT_BLOCK, rb = RIGHT_BLOCK;

  var commandRgxp = /([^\s]+).*/, nonBlockCommentRgxp = /([^\\])\/\/\/(\s?)(.*)/, rightPartRgxp = new RegExp("(?:" + alb + "?" + lb + "__&-__" + rb + "|)\\s*$"), rightWSRgxp = /\s*$/, lastSymbolRgxp = new RegExp("(" + alb + "|\\\\)$");

  var endDirInit, needSpace, nl;

  /**
   * Вернуть объект-описание преобразованной части шаблона из
   * Jade-Like синтаксиса в стандартный
   *
   * @param {string} str - исходная строка
   * @param {number} i - номер начальной итерации
   * @return {{str: string, length: number, error: (boolean|null|undefined)}}
   */
  DirObj.prototype.toBaseSyntax = function (str, i) {
    needSpace = !this.tolerateWhitespace;
    nl = this.lineSeparator;
    endDirInit = false;

    var clrL = 0, init = true, spaces = 0, space = "";

    var struct, res = "";

    var length = 0, tSpace = 0;

    function f(struct, obj) {
      if (struct.block) {
        if (chains[struct.name] && chains[struct.name][obj.name]) {
          obj.block = true;
          obj.name = struct.name;
        } else if (ends[struct.name] && ends[struct.name][obj.name]) {
          obj.block = false;
        } else {
          var rightSpace = rightWSRgxp.exec(res)[0];
          res = res.replace(rightPartRgxp, "") + genEndDir(struct, struct.space);

          if (rightSpace && needSpace) {
            res += "" + struct.adv + "" + lb + "__&-__" + rb;
          }

          res += rightSpace;
        }
      } else {
        endDirInit = false;
      }
    }

    for (var j = i - 1; ++j < str.length;) {
      length++;

      var el = str.charAt(j), next = str.charAt(j + 1);

      var next2str = str.substr(j, 2), diff2str = str.substr(j + 1, 2);

      if (nextLineRgxp.test(el)) {
        tSpace++;

        if (next2str === "\r\n") {
          continue;
        }

        if (clrL) {
          if (clrL === 1 && needSpace) {
            res += "" + alb + "" + lb + "__&-__" + rb;
          }

          res += el;
        }

        clrL++;
        init = true;

        spaces = 0;
        space = nl;
      } else if (init) {
        if (whiteSpaceRgxp.test(el)) {
          spaces++;
          space += el;
          tSpace++;
        } else {
          var nextSpace = false, diff = undefined;

          init = false;
          clrL = 0;

          if (el === alb) {
            diff = shortMap[diff2str] ? 3 : shortMap[next] ? 2 : 1;
          } else {
            diff = shortMap[next2str] ? 2 : 1;
          }

          var char = str.charAt(j + diff);
          nextSpace = !char || whiteSpaceRgxp.test(char);

          var dir = (shortMap[el] || shortMap[next2str]) && nextSpace, decl = getLineDesc(str, nextSpace && baseShortMap[el] || el === IGNORE_COMMAND ? j + 1 : j, Boolean(dir), next2str === MULT_COMMENT_START);

          if (!decl) {
            this.error("invalid syntax");
            return {
              str: "",
              length: 0,
              error: true
            };
          }

          var replacer = undefined;

          if (el === alb) {
            replacer = replacers[diff2str] || replacers[next] || replacers[next2str] || replacers[el];
          } else {
            replacer = replacers[next2str] || replacers[el];
          }

          if (replacer) {
            decl.name = replacer(decl.name).replace(commandRgxp, "$1");
          }

          var adv = el === alb ? alb : "";

          var s = dir ? adv + lb : "", e = dir ? rb : "";

          var obj = {
            dir: dir,
            name: decl.name,
            spaces: spaces,
            space: space,
            parent: null,
            block: dir && block[decl.name],
            text: !dir || text[decl.name],
            adv: adv
          };

          if (struct) {
            if (struct.spaces < spaces && struct.block) {
              obj.parent = struct;

              if (!obj.adv && struct.adv) {
                obj.block = false;
                adv = alb;
              }
            } else if (struct.spaces === spaces || struct.spaces < spaces && !struct.block) {
              obj.parent = struct.parent;

              if (!obj.adv && struct.parent && struct.parent.adv) {
                obj.block = false;
                adv = alb;
              }

              f(struct, obj);
              if (!struct.parent) {
                return {
                  str: res,
                  length: length - tSpace - 1
                };
              }
            } else {
              while (struct.spaces >= spaces) {
                f(struct, obj);
                struct = struct.parent;

                if (!struct) {
                  return {
                    str: res,
                    length: length - tSpace - 1
                  };
                }
              }

              obj.parent = struct;
            }
          }

          var parts = undefined, txt = undefined;

          decl.command = decl.command.replace(lastSymbolRgxp, "\\$1");

          if (dir) {
            if (decl.sComment) {
              parts = [decl.command];
            } else {
              parts = this.replaceDangerBlocks(decl.command).split(INLINE_COMMAND);

              for (var z = -1; ++z < parts.length;) {
                parts[z] = this.pasteDangerBlocks(parts[z]);
              }
            }

            txt = parts.slice(1).join(INLINE_COMMAND);
            txt = txt && txt.trim();
          }

          struct = obj;
          res += space;

          if (needSpace && (obj.text || !Snakeskin.Directions[obj.name])) {
            res += "" + adv + "" + lb + "__&-__" + rb;
          }

          res += s + (dir ? parts[0] : decl.command).replace(nonBlockCommentRgxp, "$1/*$2$3$2*/") + e;
          endDirInit = false;

          var tmp = decl.length - 1;
          tSpace = 0;

          length += tmp;
          j += tmp;

          if (dir && txt) {
            var inline = {
              dir: false,
              spaces: spaces + 1,
              space: "",
              parent: obj,
              block: false,
              adv: ""
            };

            inline.parent = obj;
            struct = inline;
            res += txt;
          }
        }
      }
    }

    while (struct) {
      if (struct.block) {
        res += genEndDir(struct, struct.space);
      }

      struct = struct.parent;
    }

    return {
      str: res,
      length: length
    };
  };

  /**
   * Вернуть строку окончания блоковой директивы
   *
   * @param {!Object} dir - объект-описание директивы
   * @param {string} space - доступное свободное пространство
   * @return {string}
   */
  function genEndDir(dir, space) {
    var s = dir.adv + lb, tmp;

    if (needSpace) {
      tmp = "" + (endDirInit ? "" : "" + s + "__&+__" + rb) + "" + nl;
    } else {
      tmp = nl + (space || "").substring(1);
    }

    endDirInit = true;
    return "" + tmp + "" + s + "__end__" + rb + "" + s + "__cutLine__" + rb;
  }

  /**
   * Вернуть объект описание строки в Jade-Like синтаксисе
   *
   * @param {string} str - исходная строка
   * @param {number} i - номер начальной итерации
   * @param {boolean} dir - если true, то идёт декларация директивы
   * @param {boolean} comment - если true, то идёт декларация мультистрочного комментария
   * @return {{command: string, length: number, name: string, lastEl: string, sComment: boolean}}
   */
  function getLineDesc(str, i, dir, comment) {
    var res = "", name = "";

    var lastEl = "", lastElI = 0, length = -1;

    var escape = false;
    var sComment = false, inline = false;

    var bOpen = false, bEnd = true, bEscape = false;

    var part = "", rPart = "";

    var concatLine = false, nmBrk = null;

    for (var j = i - 1; ++j < str.length;) {
      var currentEscape = escape, el = str.charAt(j);

      if (!bOpen && (el === "\\" || escape)) {
        escape = !escape;
      }

      length++;
      if (nextLineRgxp.test(el)) {
        if (!comment && !bOpen) {
          rPart = sComment ? "" : part;

          part = "";
        }

        var prevEl = lastEl, brk = false;

        lastEl = "";
        if (comment || sComment && concatLine) {
          res += el;
        } else if (!sComment && dir) {
          var dirStart = whiteSpaceRgxp.test(str.charAt(j - 2));

          var literal = undefined;
          brk = dirStart && prevEl === CONCAT_END;

          if (dirStart && (prevEl === CONCAT_COMMAND && res !== CONCAT_COMMAND || brk)) {
            literal = prevEl;
            res = res.substring(0, lastElI - 1) + res.substring(lastElI + 1);
          } else if (concatLine && !bOpen) {
            res += el;
          }

          if (concatLine && !brk) {
            continue;
          }

          if (literal === CONCAT_COMMAND) {
            concatLine = true;

            if (!bOpen) {
              res += el;
            }

            continue;
          }
        }

        if (comment || concatLine && !brk) {
          sComment = false;
          continue;
        }

        return {
          command: res,
          length: length,
          name: name,
          lastEl: lastEl,
          sComment: !inline && sComment
        };
      } else {
        if (!bOpen && !currentEscape) {
          var commentType = returnComment(str, j);

          if (comment) {
            comment = commentType !== MULT_COMMENT_END;
          } else if (!sComment) {
            comment = commentType === MULT_COMMENT_START;

            if (!comment) {
              sComment = commentType === SINGLE_COMMENT;
            }
          }
        }

        if (!comment && !sComment) {
          if (!bOpen) {
            if (escapeEndMap[el] || escapeEndWords[rPart]) {
              bEnd = true;
            } else if (bEndRgxp.test(el)) {
              bEnd = false;
            }

            if (escapeEndMap[el] || escapeEndWords[rPart]) {
              bEnd = true;
            } else if (bEndRgxp.test(el)) {
              bEnd = false;
            }

            if (partRgxp.test(el)) {
              part += el;
            } else {
              rPart = part;
              part = "";
            }

            if (dir && !inline) {
              inline = str.substr(j, INLINE_COMMAND.length) === INLINE_COMMAND;
            }
          }

          if (escapeMap[el] && (el !== "/" || bEnd) && !bOpen) {
            bOpen = el;
          } else if (bOpen && (el === "\\" || bEscape)) {
            bEscape = !bEscape;
          } else if (escapeMap[el] && bOpen === el && !bEscape) {
            bOpen = false;
            bEnd = false;
          }
        }

        var _needSpace = lineWhiteSpaceRgxp.test(el);

        if (_needSpace) {
          if (nmBrk === false) {
            nmBrk = true;
          }
        } else {
          lastEl = el;
          lastElI = res.length;
        }

        if (!nmBrk && !_needSpace) {
          if (nmBrk === null) {
            nmBrk = false;
          }

          name += el;
        }

        if (nmBrk !== null) {
          res += el;
        }
      }
    }

    if (dir && lastEl === CONCAT_END && whiteSpaceRgxp.test(res.charAt(lastElI - 1))) {
      res = res.substring(0, lastElI) + res.substring(lastElI + 1);
    }

    return {
      command: res,
      length: length,
      name: name,
      lastEl: lastEl,
      sComment: !inline && sComment
    };
  }
})();
/*!
 * API для организации микрошаблонов внутри директивы
 */

/**
 * Разбить строку по пробелам и вернуть массив
 * (учитываются директивы)
 *
 * @param {string} str - исходная строка
 * @return {!Array}
 */
function splitBySpace(str) {
  var escape = false;
  var res = [""], bOpen = 0, bStart = false;

  for (var i = -1; ++i < str.length;) {
    var currentEscape = escape;
    var el = str.charAt(i), part = str.substr(i, includeDirLength);

    if (el === "\\" || escape) {
      escape = !escape;
    }

    if (!currentEscape && includeDirMap[part]) {
      i += includeDirLength - 1;
      res[res.length - 1] += part;

      bStart = true;
      bOpen++;

      continue;
    }

    if (bStart) {
      if (el === LEFT_BLOCK) {
        bOpen++;
      } else if (el === RIGHT_BLOCK) {
        bOpen--;
      }
    }

    if (el === " " && !bOpen) {
      res.push("");
    }

    if (el !== " " || bOpen) {
      res[res.length - 1] += el;
    }
  }

  return res;
}

/**
 * Заменить ${ ... } или #{ ... } в указанной строке на значение вывода
 *
 * @param {string} str - исходная строка
 * @param {?boolean=} opt_sys - если true, то запуск функции считается системным вызовом
 * @param {?boolean=} opt_replace - если true, то директивы экранируются (заменяются на __SNAKESKIN__\d+_)
 * @return {string}
 */
DirObj.prototype.replaceTplVars = function (str, opt_sys, opt_replace) {
  str = this.pasteDangerBlocks(str);

  var start = 0;
  var begin = 0, dir = "", res = "";

  var escape = false, comment = false;

  var bOpen = false, bEnd = true, bEscape = false;

  var part = "", rPart = "";

  var nextLineMap = {
    "n": "\n",
    "r": "\r"
  };

  for (var i = -1; ++i < str.length;) {
    var currentEscape = escape, pos = i;

    var el = str.charAt(i), next = str.charAt(i + 1);

    if (str.substr(i, 2) === "\r\n") {
      continue;
    }

    if (begin) {
      if (!bOpen) {
        if (el === "\\" && strongSysEscapeMap[next] || escape) {
          escape = !escape;
        }

        if (escape) {
          continue;
        }

        if (el === "\\" && nextLineMap[next]) {
          el = nextLineMap[next];
          i++;
        }

        // Обработка комментариев
        if (!currentEscape) {
          var commentType = returnComment(str, pos);

          if (commentType) {
            if (!comment) {
              comment = commentType;
              i += commentType.length - 1;
            } else if (commentType === MULT_COMMENT_END && comment === MULT_COMMENT_START) {
              comment = false;
              i += commentType.length - 1;
              continue;
            }
          } else if (nextLineRgxp.test(el) && comment === SINGLE_COMMENT) {
            comment = false;
          }
        }

        if (comment) {
          continue;
        }

        if (escapeEndMap[el] || escapeEndWords[rPart]) {
          bEnd = true;
        } else if (bEndRgxp.test(el)) {
          bEnd = false;
        }

        if (partRgxp.test(el)) {
          part += el;
        } else {
          rPart = part;
          part = "";
        }

        if (el === LEFT_BLOCK) {
          begin++;
        } else if (el === RIGHT_BLOCK) {
          begin--;
        }
      }

      if (escapeMap[el] && (el !== "/" || bEnd) && !bOpen) {
        bOpen = el;
      } else if (bOpen && (el === "\\" || bEscape)) {
        bEscape = !bEscape;
      } else if (escapeMap[el] && bOpen === el && !bEscape) {
        bOpen = false;
        bEnd = false;
      }

      if (begin) {
        dir += el;
      } else {
        escape = false;

        var tmp = "' + " + this.prepareOutput(this.replaceDangerBlocks(dir).trim() || "''", opt_sys) + " + '";

        if (opt_replace) {
          res += "__SNAKESKIN__" + this.dirContent.length + "_";
          this.dirContent.push(tmp);
        } else {
          res += tmp;
        }
      }
    } else {
      if (el === "\\" && includeSysEscapeMap[next] || escape) {
        escape = !escape;
      }

      if (escape) {
        continue;
      }

      if (!currentEscape && includeDirMap[str.substr(pos, includeDirLength)]) {
        begin++;
        dir = "";

        start = i;
        i += includeDirLength - 1;

        escape = false;
        continue;
      }

      res += el !== "\\" || currentEscape ? applyDefEscape(el) : escapeSingleQuote(el);
    }
  }

  return res;
};
/*!
 * Различные вспомогательные методы и функции
 */

/**
 * Вернуть истинное имя директивы
 *
 * @param {?string} name - исходное имя
 * @return {?string}
 */
function getName(name) {
  return aliases[name] || name;
}

/**
 * Вернуть список названий шаблонов,
 * которые участвуют в цепи наследования указанного
 *
 * @param {string} name - имя шаблона
 * @return {!Array}
 */
function getExtList(name) {
  if (extListCache[name]) {
    return extListCache[name].slice();
  }

  var res = [];
  while (name = extMap[name]) {
    res.unshift(name);
  }

  extListCache[name] = res;
  return res.slice();
}

/**
 * Очистить кеш областей видимости заданного шаблона
 * @param {string} name - имя шаблона
 */
function clearScopeCache(name) {
  forIn(scopeCache, function (cluster, key) {
    if (key === "template") {
      if (cluster[name] && cluster[name].parent) {
        delete cluster[name].parent.children[name];
      }
    } else {
      forIn(cluster[name], function (el) {
        if (el.parent) {
          delete el.parent.children[name];
        }
      });
    }

    delete cluster[name];
  });
}

/**
 * Вернуть имя функции из заданной строки
 *
 * @param {string} str - исходная строка
 * @param {?boolean=} opt_empty - если true, то допускается "пустое" имя
 * @return {string}
 */
DirObj.prototype.getFnName = function (str, opt_empty) {
  var tmp = /^[^(]+/.exec(str), val = tmp ? tmp[0].trim() : "";

  if (!opt_empty && !val) {
    this.error("invalid \"" + this.name + "\" declaration");
  }

  return val;
};

/**
 * Вернуть значение разницы длины команды с учётом типа декларации директивы
 *
 * @param {number} length - исходная длина
 * @return {number}
 */
DirObj.prototype.getDiff = function (length) {
  return length + Number(this.needPrfx) + 1;
};

var dirGroupCache = {};

/**
 * Клонировать заданный объект
 *
 * @param {?} obj - исходный объект
 * @return {?}
 */
function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Вернуть таблицу названий директивы,
 * которые принадлежат к заданным группам
 *
 * @param {...string} names - название группы
 * @return {!Object}
 */
DirObj.prototype.getGroup = function (names) {
  var _arguments = arguments;
  var cacheKey = null, inline = Boolean(this.inlineIterators);

  if (JSON_SUPPORT) {
    var args = [];

    for (var i = -1; ++i < arguments.length;) {
      args.push(arguments[i]);
    }

    cacheKey = args.join();
    if (dirGroupCache[inline] && dirGroupCache[inline][cacheKey]) {
      return clone(dirGroupCache[inline][cacheKey]);
    }
  }

  var map = {}, ignore = {};

  for (var i = -1; ++i < arguments.length;) {
    (function () {
      var name = _arguments[i], group = groups[name];

      if (name === "callback" && inline) {
        forIn(groups["inlineIterator"], function (el, key) {
          ignore[key] = true;
        });
      }

      forIn(group, function (el, key) {
        if (ignore[key]) {
          return;
        }

        map[key] = true;
      });
    })();
  }

  if (JSON_SUPPORT) {
    dirGroupCache[inline] = dirGroupCache[inline] || {};
    dirGroupCache[inline][cacheKey] = clone(map);
  }

  return map;
};

/**
 * Сбросить слой параметров компиляции
 * @return {!DirObj}
 */
DirObj.prototype.popParams = function () {
  var _this3 = this;
  this.params.pop();

  forIn(this.params[this.params.length - 1], function (el, key) {
    _this3[key] = el;
  });

  return this;
};

/**
 * Заменить %fileName% в заданной строке на имя активного файла
 *
 * @param {string} str - исходная строка
 * @return {string}
 */
DirObj.prototype.replaceFileName = function (str) {
  var _this4 = this;
  var file = this.info["file"], basename;

  str = this.replaceDangerBlocks(str.replace(/(.?)%fileName%/g, function (sstr, $1) {
    if (!file) {
      _this4.error("placeholder %fileName% can't be used without \"file\" option");
      return "";
    }

    if (!IS_NODE) {
      _this4.error("placeholder %fileName% can't be used with live compilation in browser");
      return "";
    }

    if (!basename) {
      var path = require("path");
      basename = path.basename(file, path.extname(file));
    }

    var str = basename;

    if ($1) {
      if ($1 !== ".") {
        str = "" + $1 + "'" + str + "'";
      } else {
        str = $1 + str;
      }
    }

    return str;
  }));

  return str;
};

var nmRgxp = /\.|\[/, nmssRgxp = /^\[/, nmsRgxp = /\[/g, nmeRgxp = /]/g;

/**
 * Подготовить заданную строку декларации имени шаблона
 * (вычисление выражений и т.д.)
 *
 * @param {string} name - исходная строка
 * @return {string}
 */
DirObj.prototype.prepareNameDecl = function (name) {
  name = this.replaceFileName(name);
  if (nmRgxp.test(name)) {
    var tmpArr = name.replace(nmssRgxp, "%").replace(nmsRgxp, ".%").replace(nmeRgxp, "").split(".");

    var str = "", length = tmpArr.length;

    for (var i = -1; ++i < length;) {
      var el = tmpArr[i], custom = el.charAt(0) === "%";

      if (custom) {
        el = el.substring(1);
      }

      if (custom) {
        str += /* cbws */"['" + applyDefEscape(this.returnEvalVal(this.prepareOutput(el, true))) + "']";

        continue;
      }

      str += str ? "." + el : el;
    }

    name = str;
  }

  return name.trim();
};
/*!
 * API для обработки JS-like конструкций в шаблоне
 * (фильтры, scope и т.д.)
 */

(function () {
  var blackWords = {
    "+": true,
    "++": true,
    "-": true,
    "--": true,
    "~": true,
    "~~": true,
    "!": true,
    "!!": true,
    "break": true,
    "case": true,
    "catch": true,
    "continue": true,
    "delete": true,
    "do": true,
    "else": true,
    "false": true,
    "finnaly": true,
    "for": true,
    "function": true,
    "if": true,
    "in": true,
    "of": true,
    "instanceof": true,
    "new": true,
    "null": true,
    "return": true,
    "switch": true,
    "this": true,
    "throw": true,
    "true": true,
    "try": true,
    "typeof": true,
    "var": true,
    "const": true,
    "let": true,
    "void": true,
    "while": true,
    "with": true,
    "class": true,
    "debugger": true,
    "interface": true
  };

  var unaryBlackWords = {
    "new": true,
    "typeof": true,
    "instanceof": true,
    "in": true
  };

  var undefUnaryBlackWords = {
    "new": true
  };

  var comboBlackWords = {
    "var": true,
    "const": true,
    "let": true
  };

  var nextWordCharRgxp = new RegExp("[" + G_MOD + "" + L_MOD + "$+\\-~!" + w + "[\\]().]");

  /**
   * Вернуть целое слово из заданной строки, начиная с указанной позиции
   *
   * @param {string} str - исходная строка
   * @param {number} pos - начальная позиция
   * @return {{word: string, finalWord: string, unary: string}}
   */
  DirObj.prototype.getWord = function (str, pos) {
    var word = "", res = "", nres = "";

    var pCount = 0, diff = 0;

    var start = 0, pContent = null;

    var unary, unaryStr = "";

    for (var i = pos, j = 0; i < str.length; i++, j++) {
      var el = str.charAt(i);

      if (pCount || nextWordCharRgxp.test(el) || el === " " && (unary = unaryBlackWords[word])) {
        if (el === " ") {
          word = "";
        } else {
          word += el;
        }

        if (unary) {
          unaryStr = unaryStr || res;

          unary = false;
        }

        if (pContent !== null && (pCount > 1 || pCount === 1 && !closePMap[el])) {
          pContent += el;
        }

        if (pMap[el]) {
          if (pContent === null) {
            start = j + 1;
            pContent = "";
          }

          pCount++;
        } else if (closePMap[el]) {
          if (pCount) {
            pCount--;

            if (!pCount) {
              if (nres) {
                nres = nres.substring(0, start + diff) + (pContent && this.prepareOutput(pContent, true, null, null, true)) + nres.substring(j + diff + pContent.length);
              } else {
                nres = res.substring(0, start) + (pContent && this.prepareOutput(pContent, true, null, null, true)) + res.substring(j);
              }

              diff = nres.length - res.length;
              pContent = null;
            }
          } else {
            break;
          }
        }

        res += el;
        if (nres) {
          nres += el;
        }
      } else {
        break;
      }
    }

    return {
      word: res,
      finalWord: nres || res,
      unary: unaryStr
    };
  };

  /**
   * Вернуть true, если указанное слово является свойством в литерале объекта
   *
   * @param {string} str - исходная строка
   * @param {number} start - начальная позиция слова
   * @param {number} end - конечная позиция слова
   * @return {boolean}
   */
  function isSyOL(str, start, end) {
    var res;

    for (var i = start; i--;) {
      var el = str.charAt(i);

      if (!whiteSpaceRgxp.test(el)) {
        res = el === "?";
        break;
      }
    }

    if (!res) {
      for (var i = end; i < str.length; i++) {
        var el = str.charAt(i);

        if (!whiteSpaceRgxp.test(el)) {
          return el === ":";
        }
      }
    }

    return false;
  }

  /**
   * Вернуть true, если следующий непробельный символ
   * в указанной строке равен присвоению (=)
   *
   * @param {string} str - исходная строка
   * @param {number} pos - начальная позиция
   * @return {boolean}
   */
  function isNextAssign(str, pos) {
    for (var i = pos; i < str.length; i++) {
      var el = str.charAt(i);

      if (!whiteSpaceRgxp.test(el)) {
        return el === "=" && str.charAt(i + 1) !== "=";
      }
    }

    return false;
  }

  var unMap = {
    "!html": true,
    "!undef": true
  };

  var unUndefLabel = "{undef}", unUndefRgxp = new RegExp(unUndefLabel, "g");

  var ssfRgxp = /__FILTERS__\./;
  var nextCharRgxp = new RegExp("[" + G_MOD + "" + L_MOD + "$+\\-~!" + w + "]"), newWordRgxp = new RegExp("[^" + G_MOD + "" + L_MOD + "$" + w + "[\\].]");

  var numRgxp = /[0-9]/, modRgxp = new RegExp("" + L_MOD + "(?:\\d+|)"), strongModRgxp = new RegExp("" + L_MOD + "(\\d+)");

  var multPropRgxp = /\[|\./, firstPropRgxp = /([^.[]+)(.*)/;

  var propValRgxp = /[^-+!(]+/;
  var exprimaHackFn = function (str) {
    return str.trim().replace(/^\[(?!\s*])/, "$[").replace(/\byield\b/g, "").replace(/(?:break|continue) [_]{2,}I_PROTO__[${w}]+;/, "");
  };

  var wrapRgxp = /^\s*\{/, dangerRgxp = /\)\s*(?:{|=>)/, functionRgxp = /\bfunction\b/;

  /**
   * Подготовить указанную команду к выводу:
   * осуществляется привязка к scope и инициализация фильтров
   *
   * @param {string} command - исходный текст команды
   * @param {?boolean=} opt_sys - если true, то запуск функции считается системным вызовом
   * @param {?boolean=} opt_iSys - если true, то запуск функции считается вложенным системным вызовом
   * @param {?boolean=} opt_breakFirst - если true, то первое слово в команде пропускается
   * @param {?boolean=} opt_validate - если false, то полученная конструкция не валидируется
   * @return {string}
   */
  DirObj.prototype.prepareOutput = function (command, opt_sys, opt_iSys, opt_breakFirst, opt_validate) {
    var _this5 = this;
    var tplName = this.tplName, struct = this.structure;

    if (dangerRgxp.test(command)) {
      this.error("unsupported syntax");
      return "";
    }

    // ОПРЕДЕЛЕНИЯ:
    // Скобка = (

    var res = command;

    // Количество открытых скобок в строке
    // (скобки открытые внутри фильтра не считаются)
    var pCount = 0;

    // Количество открытых скобок внутри фильтра:
    // |foo (1 + 2) / 3
    var pCountFilter = 0;

    // Массив позиций открытия и закрытия скобок (pCount),
    // идёт в порядке возрастания от вложенных к внешним блокам, например:
    // ((a + b)) => [[1, 7], [0, 8]]
    var pContent = [];

    // true, если идёт декларация фильтра
    var filterStart = false;

    // true, если идёт фильтр-враппер, т.е.
    // (2 / 3)|round
    var filterWrapper = false;

    // Массивы итоговых фильтров и истинных фильтров,
    // например:
    // {with foo}
    //     {bar |ucfisrt bar()|json}
    // {end}
    //
    // rvFilter => ['ucfisrt bar()', 'json']
    // filter => ['ucfisrt foo.bar()', 'json']
    var filter = [], rvFilter = [];

    // true, то можно рассчитывать слово
    var nword = !opt_breakFirst;

    // Количество слов для пропуска
    var posNWord = 0;

    // Область видимости
    var scope = this.scope, useWith = Boolean(scope.length);

    // Сдвиги
    var addition = 0, wordAddEnd = 0, filterAddEnd = 0;

    // true, если применяется фильтр !html
    var unEscape = !this.escapeOutput;

    // true, если применяется фильтр !undef
    var unUndef = !this.replaceUndef, globalUnUndef = unUndef;

    var vars = struct.children ? struct.vars : struct.parent.vars;

    var ref = this.hasBlock("block", true), type;

    if (ref) {
      ref = ref.params.name;
      type = "block";
    } else if (this.proto) {
      ref = this.proto.name;
      type = "proto";
    }

    if (ref && !scopeCache[type][tplName]) {
      ref = false;
    }

    function search(obj, val, extList) {
      if (!obj) {
        return false;
      }

      var def = vars["" + val + "_" + obj.id];

      if (def) {
        return def;
      } else if (extList.length && obj.children[extList[0]]) {
        return search(obj.children[extList.shift()], val, extList);
      }

      return false;
    }

    var replacePropVal = function (sstr) {
      var def = vars[sstr];

      if (!def) {
        var refCache = ref && scopeCache[type][tplName][ref];

        if (!refCache || refCache.parent && (!refCache.overridden || _this5.hasParent("__super__"))) {
          if (refCache) {
            def = search(refCache.root, sstr, getExtList(String(tplName)));
          }

          var tplCache = tplName && scopeCache["template"][tplName];

          if (!def && tplCache && tplCache.parent) {
            def = search(tplCache.root, sstr, getExtList(String(tplName)));
          }
        }

        if (!def && refCache) {
          def = vars["" + sstr + "_" + refCache.id];
        }

        if (!def) {
          def = vars["" + sstr + "_" + _this5.module.id] || vars["" + sstr + "_00"];
        }
      }

      if (def) {
        return def.value;
      }

      return sstr;
    };

    function addScope(str) {
      if (multPropRgxp.test(str)) {
        var fistProp = firstPropRgxp.exec(str);
        fistProp[1] = fistProp[1].replace(propValRgxp, replacePropVal);
        str = fistProp.slice(1).join("");
      } else {
        str = str.replace(propValRgxp, replacePropVal);
      }

      return str;
    }

    if (!command) {
      this.error("invalid syntax");
      return "";
    }

    var commandLength = command.length, end = commandLength - 1;

    var cacheLink = replacePropVal("$_");
    var isFilter, breakNum;

    for (var i = -1; ++i < commandLength;) {
      var el = command.charAt(i), next = command.charAt(i + 1), nNext = command.charAt(i + 2);

      if (!breakNum) {
        if (el === "(") {
          // Скобка открылась внутри декларации фильтра
          if (filterStart) {
            pCountFilter++;
          } else {
            pContent.unshift([i + wordAddEnd]);
            pCount++;
          }
        }

        // Расчёт scope:
        // флаг nword показывает, что началось новое слово;
        // флаг posNWord показывает, сколько новых слов нужно пропустить
        if (nword && !posNWord && nextCharRgxp.test(el)) {
          var nextStep = this.getWord(command, i);
          var word = nextStep.word, finalWord = nextStep.finalWord;

          var uAdd = wordAddEnd + addition, vres = undefined;

          // true,
          // если полученное слово не является зарезервированным (blackWordMap),
          // не является фильтром,
          // не является числом,
          // не является константой замены Escaper,
          // не является названием свойства в литерале объекта ({свойство: )
          var canParse = !blackWords[word] && !pCountFilter && !ssfRgxp.test(word) && !isFilter && isNaN(Number(word)) && !escaperRgxp.test(word) && !isSyOL(command, i, i + word.length);

          if (canParse && functionRgxp.test(word)) {
            this.error("unsupported syntax");
            return "";
          }

          // Экспорт числовых литералов
          if (numRgxp.test(el)) {
            vres = finalWord;

            // Экспорт глобальный и супер глобальных переменных
          } else if ((useWith && !modMap[el] || el === G_MOD && (useWith ? next === G_MOD : true)) && canParse) {
            if (useWith) {
              vres = next === G_MOD ? finalWord.substring(2) : finalWord;

              // Супер глобальная переменная внутри with
              if (next === G_MOD) {
                vres = "__VARS__" + concatProp(vres);
              } else {
                vres = addScope(vres);
              }

              // Супер глобальная переменная вне with
            } else {
              vres = "__VARS__" + concatProp(finalWord.substring(next === G_MOD ? 2 : 1));
            }
          } else {
            var rfWord = finalWord.replace(modRgxp, "");

            if (canParse && useWith && modMap[el]) {
              if (el === G_MOD) {
                rfWord = rfWord.substring(1);
              }

              var num = 0;

              // Уточнение scope
              if (el === L_MOD) {
                var val = strongModRgxp.exec(finalWord);
                num = val ? val[1] : 1;
              }

              if (num && scope.length - num <= 0) {
                vres = addScope(rfWord);
              } else {
                vres = addScope(scope[scope.length - 1 - num]) + concatProp(rfWord);
              }
            } else {
              if (canParse) {
                vres = addScope(rfWord);
              } else if (tplName && rfWord === "this" && !this.hasParent(this.getGroup("selfThis"))) {
                vres = "__THIS__";
              } else {
                vres = rfWord;
              }
            }
          }

          if (canParse && isNextAssign(command, i + word.length) && tplName && constCache[tplName] && constCache[tplName][vres]) {
            this.error("constant \"" + vres + "\" is already defined");
            return "";
          }

          // Данное слово является составным системным,
          // т.е. пропускаем его и следующее за ним
          if (comboBlackWords[finalWord]) {
            posNWord = 2;
          } else if (canParse && (!opt_sys || opt_iSys) && !filterStart && (!nextStep.unary || undefUnaryBlackWords[nextStep.unary]) && !globalUnUndef) {
            vres = "" + unUndefLabel + "(" + vres + ")";
          }

          wordAddEnd += vres.length - word.length;
          nword = false;

          if (filterStart) {
            var last = filter.length - 1;
            filter[last] += vres;
            rvFilter[last] += word;
            filterAddEnd += vres.length - word.length;
          } else {
            res = res.substring(0, i + uAdd) + vres + res.substring(i + word.length + uAdd);
          }

          // Дело сделано, теперь с чистой совестью матаем на позицию:
          // за один символ до конца слова
          i += word.length - 2;
          breakNum = 1;

          continue;

          // Возможно, скоро начнётся новое слово,
          // для которого можно посчитать scope
        } else if (newWordRgxp.test(el)) {
          nword = true;

          if (posNWord) {
            posNWord--;
          }
        }

        if (!filterStart) {
          if (el === ")") {
            // Закрылась скобка, а последующие 2 символа не являются фильтром
            if (next !== FILTER || !filterStartRgxp.test(nNext)) {
              if (pCount) {
                pCount--;
              }

              pContent.shift();
              continue;
            } else {
              filterWrapper = true;
            }
          }

          // Составление тела фильтра
        } else if (el !== ")" || pCountFilter) {
          var last = filter.length - 1;
          filter[last] += el;
          rvFilter[last] += el;
        }
      }

      if (i === end && pCount && !filterWrapper && el !== ")") {
        this.error("missing closing or opening parenthesis in the template");
        return "";
      }

      // Закрылся локальный или глобальный фильтр
      if (filterStart && !pCountFilter && (el === ")" && !breakNum || i === end)) {
        var pos = pContent[0];
        var fAdd = wordAddEnd - filterAddEnd + addition, fBody = res.substring(pos[0] + (pCount ? addition : 0), pos[1] + fAdd);

        var arr = [];
        for (var j = -1; ++j < filter.length;) {
          var f = filter[j];

          if (!unMap[f]) {
            arr.push(f);

            if (f.split(" ")[0] === "default") {
              unUndef = true;
            }
          } else {
            if (f === "!html" && (!pCount || filterWrapper)) {
              unEscape = true;
            } else if (f === "!undef") {
              unUndef = true;
            }
          }
        }

        filter = arr;
        var resTmp = fBody.trim();

        if (!resTmp) {
          resTmp = "void 0";
        }

        for (var j = -1; ++j < filter.length;) {
          var params = filter[j].split(" "), input = params.slice(1).join(" ").trim();

          var current = params.shift().split("."), f = "";

          for (var k = -1; ++k < current.length;) {
            f += "['" + current[k] + "']";
          }

          resTmp = "(" + cacheLink + " = __FILTERS__" + f + (filterWrapper || !pCount ? ".call(this," : "") + resTmp + (input ? "," + input : "") + (filterWrapper || !pCount ? ")" : "") + ")";
        }

        resTmp = resTmp.replace(unUndefRgxp, unUndef ? "" : "__FILTERS__.undef");
        unUndef = globalUnUndef;

        var fstr = rvFilter.join().length + 1;
        res = pCount ? res.substring(0, pos[0] + addition) + resTmp + res.substring(pos[1] + fAdd + fstr) : resTmp;

        pContent.shift();
        filter = [];
        rvFilter = [];
        filterStart = false;

        if (pCount) {
          pCount--;
          filterWrapper = false;
        }

        wordAddEnd += resTmp.length - fBody.length - fstr;

        if (!pCount) {
          addition += wordAddEnd - filterAddEnd;
          wordAddEnd = 0;
          filterAddEnd = 0;
        }
      }

      // Закрылась скобка внутри фильтра
      if (el === ")" && pCountFilter && !breakNum) {
        pCountFilter--;

        if (!pCountFilter) {
          var last = filter.length - 1, _cache = filter[last];

          filter[last] = this.prepareOutput(_cache, true, null, true, false);
          var length = filter[last].length - _cache.length;

          wordAddEnd += length;
          filterAddEnd += length;

          if (i === end) {
            i--;
            breakNum = 1;
          }
        }
      }

      isFilter = el === FILTER;
      if (breakNum) {
        breakNum--;
      }

      // Через 2 итерации начнётся фильтр
      if (next === FILTER && filterStartRgxp.test(nNext)) {
        nword = false;

        if (!filterStart) {
          if (pCount) {
            pContent[0].push(i + 1);
          } else {
            pContent.push([0, i + 1]);
          }
        }

        filterStart = true;
        if (!pCountFilter) {
          filter.push(nNext);
          rvFilter.push(nNext);
          i += 2;
        }
      } else if (i === 0 && el === FILTER && filterStartRgxp.test(next)) {
        nword = false;

        if (!filterStart) {
          pContent.push([0, i]);
        }

        filterStart = true;
        if (!pCountFilter) {
          filter.push(next);
          rvFilter.push(next);
          i++;
        }
      }
    }

    res = res.replace(unUndefRgxp, "__FILTERS__.undef");

    if (wrapRgxp.test(res)) {
      res = "(" + res + ")";
    }

    if (opt_validate !== false) {
      try {
        esprima.parse(exprimaHackFn(res));
      } catch (err) {
        this.error(err.message.replace(/.*?: (\w)/, function (sstr, $1) {
          return $1.toLowerCase();
        }));
        return "";
      }
    }

    if (!unEscape && !opt_sys) {
      res = "__FILTERS__.html(" + res + ", " + this.attr + ", " + this.attrEscape + ")";
    }

    return res;
  };
})();
/*!
 * API для организации очереди выполнения
 */

/**
 * Добавить функцию в очередь выполнения
 *
 * @param {function(this:DirObj)} fn - исходная функция
 * @return {!DirObj}
 */
DirObj.prototype.toQueue = function (fn) {
  this.structure.stack.push(fn);
  return this;
};

/**
 * Выполнить все функции, которые стоят в очереди
 * @return {!DirObj}
 */
DirObj.prototype.applyQueue = function () {
  var stack = this.structure.stack;

  for (var i = -1; ++i < stack.length;) {
    stack[i].call(this);
    stack.shift();
    i--;
  }

  return this;
};
/*!
 * Методы и функции для записи в результирующий JS
 */

/**
 * Вернуть строку начала конкатенации c __RESULT__
 * @return {string}
 */
DirObj.prototype.$ = function () {
  if (this.domComment) {
    return "__COMMENT_RESULT__ +=";
  }

  switch (this.renderMode) {
    case "stringBuffer":
      return "__RESULT__.push(";

    case "dom":
      return "__APPEND__(__RESULT__[__RESULT__.length - 1],";

    default:
      return "__RESULT__ +=";
  }
};

/**
 * Вернуть строку окончания конкатенации c __RESULT__
 * @return {string}
 */
DirObj.prototype.$$ = function () {
  if (this.domComment) {
    return "";
  }

  switch (this.renderMode) {
    case "stringBuffer":
      return ")";

    case "dom":
      return ")";

    default:
      return "";
  }
};

/**
 * Вернуть строку конкатенации c __RESULT__
 *
 * @param {?string=} [opt_str] - исходная строка
 * @return {string}
 */
DirObj.prototype.wrap = function (opt_str) {
  return this.$() + (opt_str || "") + this.$$() + ";";
};

/**
 * Вернуть текст добавления узла в стек
 * (для renderMode == dom)
 *
 * @param {?boolean=} opt_inline - если true, то узел считается inline
 * @return {string}
 */
DirObj.prototype.returnPushNodeDecl = function (opt_inline) {
  return ( /* cbws */"" + this.wrap("__NODE__") + "" + (opt_inline ? "" : "__RESULT__.push(__NODE__);") + "__NODE__ = null;"
  );
};

/**
 * Вернуть строку возврата содержимого шаблона
 * @return {string}
 */
DirObj.prototype.returnResult = function () {
  switch (this.renderMode) {
    case "stringBuffer":
      return "__RESULT__.join('')";

    case "dom":
      return "__RESULT__[0]";

    default:
      return "__RESULT__";
  }
};

/**
 * Вернуть строку декларации содержимого шаблона
 * @return {string}
 */
DirObj.prototype.declResult = function () {
  switch (this.renderMode) {
    case "stringBuffer":
      return "new Snakeskin.StringBuffer()";

    case "dom":
      return "[document.createDocumentFragment()]";

    default:
      return "''";
  }
};

/**
 * Заменить блоки CDATA в заданной строке
 *
 * @param {string} str
 * @return {string}
 */
DirObj.prototype.replaceCData = function (str) {
  var _this6 = this;
  var s = ADV_LEFT_BLOCK + LEFT_BLOCK, e = RIGHT_BLOCK;

  return str.replace(new RegExp("" + s + "cdata" + e + "([\\s\\S]*?)" + s + "(?:\\/cdata|end cdata)" + e, "g"), function (sstr, data) {
    _this6.cDataContent.push(data);
    return "" + (
    // Количество добавляемых строк
    "" + s + "__appendLine__ " + (data.match(new RegExp(nextLineRgxp.source, "g")) || "").length + "" + e) + (

    // Метка для замены CDATA
    "__CDATA__" + (_this6.cDataContent.length - 1) + "_");
  });
};

/**
 * Декларировать конец файла шаблонов
 *
 * @param {?string} cacheKey - кеш-ключ
 * @param {(Date|string)} label - заголовок файла шаблонов
 * @retur {!DirObj}
 */
DirObj.prototype.end = function (cacheKey, label) {
  var _this7 = this;
  label = label || "";
  switch (this.renderMode) {
    case "stringBuffer":
      this.res = this.res.replace(/__RESULT__\.push\(''\);/g, "");
      break;

    case "dom":
      this.res = this.res.replace(/__APPEND__\(__RESULT__\[__RESULT__\.length - 1],''\);/g, "");
      break;

    default:
      this.res = this.res.replace(/__RESULT__ \+= '';/g, "");
      break;
  }

  var includes = "";

  if (this.module.key.length) {
    includes = JSON.stringify(this.module.key);
  }

  this.res = this.pasteDangerBlocks(this.res).replace(/__CDATA__(\d+)_/g, function (sstr, pos) {
    return escapeNextLine(_this7.cDataContent[pos].replace(new RegExp(nextLineRgxp.source, "g"), _this7.lineSeparator)).replace(/'/g, "&#39;");
  });

  this.res = "/* Snakeskin v" + Snakeskin.VERSION.join(".") + ", key <" + cacheKey + ">, label <" + label.valueOf() + ">, includes <" + includes + ">, generated at <" + new Date().valueOf() + ">." + this.lineSeparator + "   " + this.res;
  this.res += /* cbws */"}if (!__IS_NODE__ && !__HAS_EXPORTS__) {__INIT__();}}).call(this);";

  return this;
};

/**
 * Вернуть true,
 * если возможна запись в результирующую строку JavaScript
 * @return {boolean}
 */
DirObj.prototype.isSimpleOutput = function () {
  if (getName(this.name) !== "end" && this.strong) {
    this.error("directive \"" + this.structure.name + "\" can not be used with a \"" + this.strong + "\"");
    return false;
  }

  return !this.parentTplName && !this.protoStart && !this.outerLink && (!this.proto || !this.proto.parentTplName);
};

/**
 * Вернуть true,
 * если возможна проверка валидности директивы
 * @return {boolean}
 */
DirObj.prototype.isReady = function () {
  return !this.protoStart && (!this.proto || !this.proto.parentTplName);
};

/**
 * Вернуть true,
 * если ситуация соответствует условию:
 *     не обработка тела прототипа && не внешний прототип &&
 *     (
 *         не вложенный блок или прототип в родительской структуре ||
 *         standalone шаблон
 *     )
 *
 * @return {boolean}
 */
DirObj.prototype.isAdvTest = function () {
  var res = !this.proto && !this.outerLink && (this.parentTplName && !this.hasParentBlock({
    "block": true,
    "proto": true
  }) || !this.parentTplName);

  return Boolean(res);
};

/**
 * Добавить указанную строку в результирующую строку JavaScript
 *
 * @param {string=} str - исходная строка
 * @param {?boolean=} opt_interface - если true, то идёт запись интерфейса шаблона
 * @param {(boolean|number)=} [opt_jsDoc] - позиция предыдущей декларации jsDoc или false
 * @return {boolean}
 */
DirObj.prototype.save = function (str, opt_interface, opt_jsDoc) {
  if (str === void 0) {
    return false;
  }

  if (!this.tplName || write[this.tplName] !== false || opt_interface) {
    if (opt_jsDoc) {
      var pos = Number(opt_jsDoc);
      this.res = this.res.substring(0, pos) + str + this.res.substring(pos);
    } else {
      this.res += str;
    }

    return true;
  }

  return false;
};

/**
 * Добавить указанную строку в результирующую строку JavaScript
 * (с проверкой this.isSimpleOutput())
 *
 * @param {string=} str - исходная строка
 * @return {boolean}
 */
DirObj.prototype.append = function (str) {
  if (!this.isSimpleOutput()) {
    return false;
  }

  return this.save(str);
};

/**
 * Выполнить заданную функцию, если возможна запись в результирующую строку
 * (this.isSimpleOutput())
 *
 * @param {function(this:DirObj)} callback - функция обратного вызова
 * @return {boolean}
 */
DirObj.prototype.mod = function (callback) {
  if (!this.isSimpleOutput()) {
    return false;
  }

  if (!this.tplName || write[this.tplName] !== false) {
    callback.call(this);
    return true;
  }

  return false;
};
/*!
 * API для работы с деревом шаблона
 */

/**
 * Проверить наличие указанной директивы в цепочке структуры,
 * начиная с активной
 *
 * @param {(string|!Object)} name - название директивы или таблица названий
 * @param {Object=} opt_obj - проверяемый объект
 * @param {?boolean=} opt_returnObj - если true, то в качестве ответа
 *     вернётся ссылка на найденный объект (если таковой есть)
 *
 * @return {(boolean|string|!Object)}
 */
DirObj.prototype.has = function (name, opt_obj, opt_returnObj) {
  var obj = opt_obj || this.structure;

  while (true) {
    var nm = obj.name;

    if (name[nm] || nm === name) {
      if (name[nm]) {
        return opt_returnObj ? obj : nm;
      }

      return opt_returnObj ? obj : true;
    } else if (obj.parent && obj.parent.name !== "root") {
      obj = obj.parent;
    } else {
      return false;
    }
  }
};

/**
 * Проверить наличие указанной директивы в цепочке структуры
 * (начальная активная директива исключается)
 *
 * @param {(string|!Object)} name - название директивы или таблица названий
 * @param {?boolean=} opt_returnObj - если true, то в качестве ответа
 *     вернётся ссылка на найденный объект (если таковой есть)
 *
 * @return {(boolean|string|!Object)}
 */
DirObj.prototype.hasParent = function (name, opt_returnObj) {
  if (this.structure.parent) {
    return this.has(name, this.structure.parent, opt_returnObj);
  }

  return false;
};

/**
 * Проверить наличие указанной директивы в цепочке блочной структуры
 *
 * @param {(string|!Object)} name - название директивы или таблица названий
 * @param {?boolean=} opt_returnObj - если true, то в качестве ответа
 *     вернётся ссылка на найденный объект (если таковой есть)
 *
 * @return {(boolean|string|!Object)}
 */
DirObj.prototype.hasBlock = function (name, opt_returnObj) {
  if (this.blockStructure) {
    return this.has(name, this.blockStructure, opt_returnObj);
  }

  return false;
};

/**
 * Проверить наличие указанной директивы в цепочке блочной структуры
 * (начальная активная директива исключается)
 *
 * @param {(string|!Object)} name - название директивы или таблица названий
 * @param {?boolean=} opt_returnObj - если true, то в качестве ответа
 *     вернётся ссылка на найденный объект (если таковой есть)
 *
 * @return {(boolean|string|!Object)}
 */
DirObj.prototype.hasParentBlock = function (name, opt_returnObj) {
  if (this.blockStructure && this.blockStructure.parent) {
    return this.has(name, this.blockStructure.parent, opt_returnObj);
  }

  return false;
};
/*!
 * API для работы с переменными
 */

/**
 * Декларировать указанную переменную
 *
 * @param {string} varName - название переменной
 * @param {boolean=} opt_callParams - если true, то переменная
 *     декларируется как параметр прототипа или вызываемого блока
 *
 * @return {string}
 */
DirObj.prototype.declVar = function (varName, opt_callParams) {
  opt_callParams = opt_callParams || false;
  var tplName = this.tplName, struct = this.structure;

  if (!opt_callParams && tplName && constCache[tplName][varName]) {
    this.error("variable \"" + varName + "\" is already defined as constant");
  }

  while (!struct.vars) {
    struct = struct.parent;
  }

  var tmp = struct.vars[varName];
  if (tmp && !tmp.inherited && struct.parent) {
    return tmp.value;
  }

  var realVar, id = this.module.id, global = false;

  if (importMap[struct.name]) {
    if (struct.name !== "root") {
      struct = struct.parent;
    }

    realVar = "__LOCAL__." + varName + "_" + id + "_" + uid;
    varName += "_" + id;
    global = true;
  } else {
    realVar = "__" + varName + "_" + (this.proto ? this.proto.name : "") + "_" + struct.name + "_" + this.i;
  }

  struct.vars[varName] = {
    value: realVar,
    id: id,
    global: global,
    scope: this.scope.length
  };

  if (tplName) {
    this.varCache[tplName][varName] = true;
  }

  return realVar;
};

/**
 * Парсить указанную строку декларации переменных, провести инициализацию,
 * и вернуть результирующий вариант для шаблона
 *
 * @param {string} str - исходная строка
 * @param {?boolean=} opt_end - если true, то в конце строки ставится ;
 * @param {?string=} [opt_init] - значение для инициализации переменной по умолчанию
 * @return {string}
 */
DirObj.prototype.multiDeclVar = function (str, opt_end, opt_init) {
  opt_end = opt_end !== false;
  opt_init = opt_init == null ? "void 0" : opt_init;

  var isSys = 0, cache = "";

  var fin = "var ", length = str.length, struct = this.structure;

  while (!struct.vars) {
    struct = struct.parent;
  }

  if (importMap[struct.name]) {
    fin = "";
  }

  for (var i = -1; ++i < length;) {
    var el = str.charAt(i);

    if (bMap[el]) {
      isSys++;
    } else if (closeBMap[el]) {
      isSys--;
    }

    if ((el === "," || i === length - 1) && !isSys) {
      if (i === length - 1) {
        cache += el;
      }

      var parts = cache.split("="), realVar = this.declVar(parts[0].trim());

      parts[0] = realVar + (opt_init || parts[1] ? "=" : "");
      parts[1] = parts[1] || opt_init;

      var val = parts.slice(1).join("=");
      fin += parts[0] + (val ? this.prepareOutput(val, true) : "") + ",";

      cache = "";
      continue;
    }

    cache += el;
  }

  if (isSys) {
    this.error("invalid \"" + this.name + "\" declaration");
  }

  return fin.slice(0, -1) + (opt_end ? ";" : "");
};

/**
 * Декларировать объект arguments
 * и вернуть строку декларации
 * @return {string}
 */
DirObj.prototype.declArguments = function () {
  return ( /* cbws */"var __ARGUMENTS__ = arguments;" + this.multiDeclVar("arguments = __ARGUMENTS__") + ""
  );
};

/**
 * Вернуть данные из кеша шаблонов
 *
 * @param {?string} cacheKey - кеш-ключ
 * @param {string} text - исходный текст шаблона
 * @param {!Object} params - параметры запуска
 * @param {!Object} ctx - объект контекста
 * @return {string}
 */
function returnCache(cacheKey, text, params, ctx) {
  if (IS_NODE && ctx !== NULL && globalFnCache[cacheKey] && globalFnCache[cacheKey][text]) {
    forIn(globalFnCache[cacheKey][text], function (el, key) {
      ctx[key] = el;
    });
  }

  if (globalCache[cacheKey] && globalCache[cacheKey][text]) {
    var _ret3 = (function () {
      var tmp = globalCache[cacheKey][text], skip = false;

      if (params.words) {
        if (!tmp.words) {
          skip = true;
        } else {
          forIn(tmp.words, function (el, key) {
            params.words[key] = el;
          });
        }
      }

      if (params.debug) {
        if (!tmp.debug) {
          skip = true;
        } else {
          forIn(tmp.debug, function (el, key) {
            params.debug[key] = el;
          });
        }
      }

      if (!skip) {
        return {
          v: tmp.text
        };
      }
    })();

    if (typeof _ret3 === "object") return _ret3.v;
  }
}

/**
 * Вернуть кеш-ключ
 *
 * @param {!Object} params - параметры запуска
 * @param {!Object} ctx - объект контекста
 * @return {?string}
 */
function returnCacheKey(params, ctx) {
  return params.language || params.macros ? null : [params.exports, ctx !== NULL, escapeNextLine(params.lineSeparator), params.doctype, params.tolerateWhitespace, params.inlineIterators, params.renderAs, params.renderMode, params.replaceUndef, params.escapeOutput, params.prettyPrint, params.ignore, params.autoReplace, params.localization, params.i18nFn, params.bemFilter, params.useStrict].join();
}

/**
 * Сохранить скомпилированные функции в кеше
 *
 * @param {?string} cacheKey - кеш-ключ
 * @param {string} text - исходный текст шаблона
 * @param {!Object} params - параметры запуска
 * @param {!Object} ctx - объект контекста
 * @return {string}
 */
function saveFnCache(cacheKey, text, params, ctx) {
  if (ctx !== NULL) {
    ctx["init"](Snakeskin);

    if (cacheKey && (params.cache || globalFnCache[cacheKey])) {
      if (!globalFnCache[cacheKey]) {
        globalFnCache[cacheKey] = {};
      }

      globalFnCache[cacheKey][text] = ctx;
    }
  }
}

/**
 * Сохранить полученный кеш
 *
 * @param {?string} cacheKey - кеш-ключ
 * @param {string} text - исходный текст шаблона
 * @param {!Object} params - параметры запуска
 * @param {!DirObj} dir - объект директивы
 * @return {string}
 */
function saveCache(cacheKey, text, params, dir) {
  if (cacheKey && (params.cache || globalCache[cacheKey])) {
    if (!globalCache[cacheKey]) {
      globalCache[cacheKey] = {};
    }

    globalCache[cacheKey][text] = {
      text: dir.res,
      words: params.words,
      debug: params.debug
    };
  }
}
var nextLineRgxp = /\r?\n|\r/, whiteSpaceRgxp = /\s/, lineWhiteSpaceRgxp = / |\t/;

var startWhiteSpaceRgxp = new RegExp("^[ \\t]*(?:" + nextLineRgxp.source + ")"), endWhiteSpaceRgxp = new RegExp("^(?:" + nextLineRgxp.source + ")[ \\t]*$");

var bEndRgxp = /[^\s\/]/, partRgxp = /[a-z]/, filterStartRgxp = new RegExp("[!$" + symbols + "_]");

var uid, NULL = {};

/**
 * Скомпилировать указанные шаблоны Snakeskin
 *
 * @param {(Element|string)} src - ссылка на DOM узел, где декларированы шаблоны,
 *     или исходный текст шаблонов
 *
 * @param {Object=} [opt_params] - дополнительные параметры запуска
 * @param {?string=} opt_params.exports - тип экспорта шаблонов
 *
 * @param {Object=} opt_params.context - контекст для сохранение скомпилированного шаблона
 *     (устанавливает экспорт commonJS)
 *
 * @param {Object=} [opt_params.vars] - таблица суперглобальных переменных,
 *     которые будут добавлены в Snakeskin.Vars
 *
 * @param {?boolean=} opt_params.cache - если false, то наличие шаблона в кеше не будет проверятся
 * @param {Object=} [opt_params.debug] - объект, который будет содержать в себе отладочную информацию
 *
 * @param {?function(!Error)=} [opt_params.onError] - функция обратного вызова для обработки ошибок трансляции
 * @param {?boolean=} opt_params.throws - если true, то в случае ошибки и отсутствия обработчика ошибок -
 *     будет выброшено исключение
 *
 * @param {?boolean=} opt_params.localization - если false, то блоки ` ... ` не заменяются на вызов i18n
 * @param {?string=} opt_params.i18nFn - название функции для i18n
 * @param {Object=} [opt_params.language] - таблица фраз для локализации (найденные фразы будут заменены по ключу)
 * @param {Object=} [opt_params.words] - таблица, которая будет заполнена всеми фразами для локализации,
 *     которые используются в шаблоне
 *
 * @param {RegExp=} [opt_params.ignore] - регулярное выражение, которое задаёт пробельные символы для игнорирования
 * @param {?boolean=} opt_params.autoReplace - если false, то Snakeskin не делает дополнительных преобразований
 *     последовательностей
 *
 * @param {Object=} [opt_params.macros] - таблица символов для преобразования последовательностей
 * @param {?string=} [opt_params.renderAs] - тип рендеринга шаблонов, доступные варианты:
 *
 *     1) placeholder - все шаблоны рендерятся как placeholder-ы;
 *     2) interface - все шаблоны рендерятся как interface-ы;
 *     3) template - все шаблоны рендерятся как template-ы.
 *
 * @param {?string=} opt_params.renderMode - режим рендеринга шаблонов, доступные варианты:
 *
 *     1) stringConcat - рендеринг шаблона в строку с простой конкатенацией через оператор сложения;
 *     2) stringBuffer - рендеринг шаблона в строку с конкатенацией через Snakeskin.StringBuffer;
 *     3) dom - рендеринг шаблона в набор команд из DOM API.
 *
 * @param {?string=} opt_params.lineSeparator - символ перевода строки
 * @param {?boolean=} opt_params.tolerateWhitespace - если true, то пробельные символы
 *     вставляются "как есть"
 *
 * @param {?boolean=} opt_params.inlineIterators - если true, то итераторы forEach и forIn
 *     будут развёрнуты в циклы
 *
 * @param {(string|boolean|null)=} opt_params.doctype - тип генерируемого документа HTML:
 *     1) html;
 *     2) xml.
 *
 * @param {?boolean=} opt_params.replaceUndef - если false, то на вывод значений через директиву output
 *     не будет накладываться фильтр undef
 *
 * @param {?boolean=} opt_params.escapeOutput - если false, то на вывод значений через директиву output
 *     не будет накладываться фильтр html
 *
 * @param {?boolean=} opt_params.useStrict - если false, то шаблоны компилируются без 'use strict';
 * @param {?string=} opt_params.bemFilter - название используемого фильтра для БЭМ
 * @param {?boolean=} [opt_params.prettyPrint] - если true, то полученный JS код шаблона
 *     отображается в удобном для чтения виде
 *
 * @param {Object=} [opt_info] - дополнительная информация о запуске (используется для сообщений об ошибках)
 * @param {?string=} [opt_info.file] - адрес исходного файла шаблонов
 *
 * @param {Object=} [opt_sysParams] - служебные параметры запуска
 * @param {?boolean=} opt_sysParams.cacheKey - если true, то возвращается кеш-ключ шаблона
 *
 * @param {Array=} [opt_sysParams.scope] - область видимости (контекст) директив
 * @param {Object=} [opt_sysParams.vars] - объект локальных переменных
 * @param {Array=} [opt_sysParams.consts] - массив деклараций констант
 *
 * @param {Object=} [opt_sysParams.proto] - объект настроек прототипа
 * @param {DirObj=} [opt_sysParams.parent] - ссылка на родительский объект
 *
 * @param {Array=} [opt_sysParams.lines] - массив строк шаблона (листинг)
 * @param {?boolean=} [opt_sysParams.needPrfx] - если true, то директивы декларируются как #{ ... }
 *
 * @return {(string|boolean|null)}
 */
Snakeskin.compile = function (src, opt_params, opt_info, opt_sysParams) {
  src = src || "";

  /** @type {{parent, proto, cacheKey, scope, vars, consts, needPrfx, lines}} */
  var sp = _.any(opt_sysParams || {});

  /** @type {{
  	exports,
  	onError,
  	renderAs,
  	prettyPrint,
  	renderMode,
  	lineSeparator,
  	inlineIterators,
  	tolerateWhitespace,
  	replaceUndef,
  	escapeOutput,
  	throws,
  	cache,
  	ignore,
  	autoReplace,
  	macros,
  	debug,
  	doctype,
  	useStrict,
  	bemFilter,
  	vars,
  	i18nFn,
  	localization,
  	language,
  	words,
  	context
  }} */
  var p = _.any(opt_params || {});

  // GCC экспорт
  // >>>

  var ctx = _(p.context, p["context"]) || NULL;

  p.exports = _(p.exports, p["exports"]) || "default";

  p.onError = _(p.onError, p["onError"]);
  p.renderAs = _(p.renderAs, p["renderAs"]);

  p.prettyPrint = _(p.prettyPrint, p["prettyPrint"]) || false;

  p.renderMode = _(p.renderMode, p["renderMode"]) || "stringConcat";

  var nl = p.lineSeparator = _(p.lineSeparator, p["lineSeparator"]) || "\n";

  p.inlineIterators = _(p.inlineIterators, p["inlineIterators"]) || false;
  p.tolerateWhitespace = _(p.tolerateWhitespace, p["tolerateWhitespace"]) || false;

  p.replaceUndef = _(p.replaceUndef, p["replaceUndef"]) !== false;
  p.escapeOutput = _(p.escapeOutput, p["escapeOutput"]) !== false;

  p.throws = _(p.throws, p["throws"]) || false;
  p.cache = _(p.cache, p["cache"]) !== false;

  p.ignore = _(p.ignore, p["ignore"]);
  p.autoReplace = _(p.autoReplace, p["autoReplace"]) || false;
  p.macros = _(p.macros, p["macros"]);

  p.debug = _(p.debug, p["debug"]);
  p.doctype = _(p.doctype, p["doctype"]);
  p.doctype = p.doctype !== false && (p.doctype || "xml");

  if (p.renderMode === "dom") {
    p.doctype = false;
  }

  p.useStrict = _(p.useStrict, p["useStrict"]) !== false;
  p.bemFilter = _(p.bemFilter, p["bemFilter"]) || "bem";
  p.vars = _(p.vars, p["vars"]) || {};

  forIn(p.vars, function (val, key) {
    Snakeskin.Vars[key] = val;
  });

  p.i18nFn = _(p.i18nFn, p["i18nFn"]) || "i18n";
  p.localization = _(p.localization, p["localization"]) !== false;
  p.language = _(p.language, p["language"]);

  var words = p.words = _(p.words, p["words"]);

  // <<<
  // Отладочная информация
  // >>>

  var info = opt_info || {};

  info["line"] = info["line"] || 1;
  info["file"] = _(info.file, info["file"]);

  var text;

  if (typeof src === "object" && "innerHTML" in src) {
    info["node"] = src;
    text = src.innerHTML.replace(startWhiteSpaceRgxp, "");
  } else {
    text = String(src);
  }

  // <<<
  // Работа с кешем
  // >>>

  var cacheKey = returnCacheKey(p, ctx);

  if (sp.cacheKey || sp["cacheKey"]) {
    return cacheKey;
  }

  if (p.cache) {
    var tmp = returnCache(cacheKey, text, p, ctx);

    if (tmp) {
      return tmp;
    }
  }

  // <<<
  // Работа с макросами
  // >>>

  var alb = ADV_LEFT_BLOCK, lb = LEFT_BLOCK, rb = RIGHT_BLOCK;

  var macros = {}, mGroups = {};

  var inlineMacro = {}, comboMacro = {};

  var blackMSymbolsRgxp = new RegExp("[<\\/>" + lb + "" + alb + "" + rb + "]");

  function clearMacroExpr() {
    expr = "";
    advExprPos = 0;
  }

  /**
   * @param {Object} obj
   * @param {?string=} [opt_include]
   * @param {?boolean=} [opt_init]
   */
  function setMacros(obj, opt_include, opt_init) {
    if (opt_init) {
      macros = {};
      mGroups = {};

      comboMacro = {};
      inlineMacro = {
        "\\": true
      };

      setMacros(defMacros);
    }

    if (obj == null) {
      obj = mGroups[opt_include];
      forIn(obj, function (el, key) {
        delete obj[key];
        delete macros[key];
        delete comboMacro[key];
      });
    } else {
      forIn(obj, function (el, key) {
        if (key.charAt(0) === "@" && !opt_include) {
          setMacros(el, key);
        } else {
          if (opt_include) {
            mGroups[opt_include] = mGroups[opt_include] || {};
          }

          if (el) {
            if (blackMSymbolsRgxp.test(key)) {
              throw new Error("Invalid macro \"" + key + "\"");
            }

            macros[key] = el.value || el;

            if (Array.isArray(macros[key])) {
              comboMacro[key] = true;
            }

            var inline = el["inline"] || el.inline;

            if (inline) {
              inlineMacro[key.charAt(0)] = true;
            }

            if (opt_include) {
              mGroups[opt_include][key] = macros[key];
            }
          } else {
            delete macros[key];
            delete comboMacro[key];

            if (opt_include) {
              delete mGroups[opt_include][key];
            }
          }
        }
      });
    }

    return macros;
  }

  if (sp.proto) {
    macros = p.macros;
  } else {
    setMacros(p.macros, null, true);
  }

  // <<<
  // Обработка подключений файлов
  // >>>

  var label = "";
  var dirname, filename;

  if (!sp.proto) {
    uid = Math.random().toString(16).replace("0.", "").substring(0, 5);

    Snakeskin.LocalVars.include = {};

    if (IS_NODE && info["file"]) {
      var path = require("path"), fs = require("fs");

      filename = info["file"] = path.normalize(path.resolve(info["file"]));

      dirname = path.dirname(filename);
      Snakeskin.LocalVars.include[filename] = "index";

      if (fs.existsSync(filename)) {
        label = fs.statSync(filename).mtime;
      }
    }
  }

  // <<<
  // Основная логика
  // >>>

  var dir = new DirObj(String(text), {
    info: info,
    onError: p.onError,

    parent: sp.parent,
    proto: sp.proto,
    scope: sp.scope,
    vars: sp.vars,
    consts: sp.consts,

    needPrfx: sp.needPrfx,
    lines: sp.lines,

    doctype: p.doctype,
    exports: p.exports,

    renderAs: p.renderAs,
    renderMode: p.renderMode,

    lineSeparator: nl,
    tolerateWhitespace: p.tolerateWhitespace,
    inlineIterators: p.inlineIterators,

    bemFilter: p.bemFilter,
    replaceUndef: p.replaceUndef,
    escapeOutput: p.escapeOutput,

    ignore: p.ignore,
    autoReplace: p.autoReplace,
    macros: macros,

    localization: p.localization,
    i18nFn: p.i18nFn,
    language: p.language,

    useStrict: p.useStrict,
    throws: p.throws
  });

  dir.setMacros = setMacros;

  // Если true, то идёт содержимое директивы,
  // т.е. { ... }
  var begin = false, pseudoI = false;

  var command = "";
  var commandTypeRgxp = /[^\s]+/, commandRgxp = /[^\s]+\s*/;

  var filterStart = false;

  // Количество открытых { внутри директивы
  var fakeBegin = 0;

  // Если true, то идёт запись простой строки
  var beginStr = false;

  // Если true, то предыдущий символ был не экранированный \
  var escape = false;

  // Если содержит значение отличное от false,
  // то значит идёт блок комметариев comment (///, /*, /**)
  var comment = false, commentStart = 0;

  // Если true, то значит идёт JSDoc
  var jsDoc = false, jsDocStart = false;

  // Флаги для обработки литералов строк и регулярных выражений внутри директивы
  var bOpen = false, bEnd, bEscape = false;

  var part = "", rPart = "";

  // Флаги для обработки XML тегов и атрибутов
  var tOpen = 0, tAttr = false, tAttrBegin = false, tAttrEscape = false;

  var tAttrBMap = {
    "\"": true,
    "'": true
  };

  // Флаги для обработки скобок при типографии
  var qOpen = 0, qType = null;

  var prfxI = 0;

  // Флаги для обработки символьных последовательностей
  var expr = "", exprPos = 0, advExprPos = 0;

  var prevCommentSpace = false, freezeI = 0, freezeTmp = 0;

  // Флаги для обработки строк-локализации
  var i18nStr = "", i18nStart = false, i18nDirStart = false;

  var clrL = true, templateMap = dir.getGroup("rootTemplate");

  /** @return {{macros, mGroups, inlineMacro, comboMacro, tOpen, tAttr, tAttrBegin, tAttrEscape, qOpen, qType, prfxI}} */
  dir.getCompileVars = function () {
    return {
      mGroups: mGroups,
      inlineMacro: inlineMacro,
      comboMacro: comboMacro,
      tOpen: tOpen,
      tAttr: tAttr,
      tAttrBegin: tAttrBegin,
      tAttrEscape: tAttrEscape,
      qOpen: qOpen,
      qType: qType,
      prfxI: prfxI
    };
  };

  /** @param {{macros, mGroups, inlineMacro, comboMacro, tOpen, tAttr, tAttrBegin, tAttrEscape, qOpen, qType, prfxI}} obj */
  dir.setCompileVars = function (obj) {
    mGroups = obj.mGroups;
    inlineMacro = obj.inlineMacro;
    comboMacro = obj.comboMacro;
    tOpen = obj.tOpen;

    tAttr = dir.attr = obj.tAttr;

    tAttrBegin = obj.tAttrBegin;
    tAttrEscape = dir.attrEscape = obj.tAttrEscape;

    qOpen = obj.qOpen;
    qType = obj.qType;
    prfxI = obj.prfxI;
  };

  if (sp.proto) {
    dir.setCompileVars(sp.parent.getCompileVars());
  }

  _loop: while (++dir.i < dir.source.length) {
    var _ret4 = (function () {
      var str = dir.source, struct = dir.structure;

      var el = str.charAt(dir.i), prev = str.charAt(dir.i - 1), next = str.charAt(dir.i + 1), next2str = str.substr(dir.i, 2);

      var rEl = el;
      var line = info["line"], lastLine = line - 1;

      var modLine = !dir.freezeLine && !dir.proto && dir.lines.length === line;

      if (freezeI) {
        freezeI--;
        modLine = false;
      }

      var nextLine = nextLineRgxp.test(el), currentClrL = clrL;

      if (nextLine) {
        if (next2str === "\r\n") {
          return "continue";
        }

        el = nl;
        clrL = true;
      }

      if (!dir.freezeLine) {
        if (nextLine) {
          if (modLine) {
            dir.lines[line] = "";
          }

          info["line"]++;
        } else if (modLine) {
          dir.lines[lastLine] += el;
        }
      }

      var currentEscape = escape;
      var isPrefStart = !currentEscape && !begin && el === alb && next === lb;

      if (whiteSpaceRgxp.test(el)) {
        // Внутри директивы
        if (begin) {
          if (bOpen) {
            el = escapeNextLine(el);
          } else {
            if (!dir.space) {
              el = " ";
              dir.space = true;
            } else if (!comment) {
              return "continue";
            }
          }

          // Простой ввод вне деклараций шаблона
        } else if (!dir.tplName) {
          // Для JSDoc все символы остаются неизменны,
          // а в остальных случаях они игнорируются
          if (!comment && !jsDoc) {
            return "continue";
          }

          // Простой ввод внутри декларации шаблона
        } else {
          if (!dir.space && !dir.chainSpace && !dir.strongSpace && !dir.sysSpace) {
            el = dir.ignore && dir.ignore.test(el) ? "" : el;

            if (el && !dir.tolerateWhitespace) {
              el = " ";
              dir.space = true;
            }
          } else if (!comment && !jsDoc) {
            return "continue";
          }
        }
      } else {
        clrL = false;

        if (!begin && !dir.chainSpace && !dir.strongSpace && !dir.sysSpace) {
          if (!currentEscape && (isPrefStart ? el === alb : el === lb)) {
            dir.prevSpace = dir.space;
          } else {
            dir.prevSpace = false;
          }
        }

        if (!comment) {
          prevCommentSpace = dir.space;
        }

        dir.space = false;
      }

      if (!bOpen) {
        // Обработка экранирования
        if (el === "\\" && sysEscapeMap[next] && (!begin || next === I18N) || escape) {
          escape = !escape;
        }

        if (escape) {
          return "continue";
        }

        // Обработка комментариев
        if (!currentEscape) {
          var _ret5 = (function () {
            var commentType = returnComment(str, dir.i), endComment = returnComment(str, dir.i - MULT_COMMENT_END.length + 1) === MULT_COMMENT_END;

            var map = (function () {
              var _map = {};

              _defineProperty(_map, SINGLE_COMMENT, true);

              _defineProperty(_map, MULT_COMMENT_START, true);

              return _map;
            })();

            if (map[commentType] || endComment) {
              if (!comment && !jsDoc) {
                if (commentType === SINGLE_COMMENT) {
                  comment = commentType;

                  if (modLine) {
                    dir.lines[lastLine] += commentType.substring(1);
                  }

                  dir.i += commentType.length - 1;
                } else if (commentType === MULT_COMMENT_START) {
                  if (str.substr(dir.i, JS_DOC.length) === JS_DOC && !begin) {
                    if (beginStr && dir.isSimpleOutput()) {
                      dir.save("'" + dir.$$() + ";");
                    }

                    beginStr = true;
                    jsDoc = true;
                    jsDocStart = dir.res.length;
                  } else {
                    comment = commentType;
                    commentStart = dir.i;

                    if (modLine) {
                      dir.lines[lastLine] += commentType.substring(1);
                    }

                    dir.i += commentType.length - 1;
                  }
                }
              } else if (endComment && dir.i - commentStart > MULT_COMMENT_START.length) {
                if (comment === MULT_COMMENT_START) {
                  comment = false;
                  dir.space = prevCommentSpace;
                  prevCommentSpace = false;
                  return {
                    v: "continue"
                  };
                } else if (beginStr) {
                  beginStr = false;
                }
              }
            } else if (nextLineRgxp.test(rEl) && comment === SINGLE_COMMENT) {
              comment = false;
              dir.space = prevCommentSpace;
              prevCommentSpace = false;
              return {
                v: "continue"
              };
            }
          })();

          if (typeof _ret5 === "object") return _ret5.v;
        }

        if (comment) {
          return "continue";
        }

        if (!jsDoc) {
          if (i18nStart) {
            if (!currentEscape && el === "\"" && !dir.language) {
              el = "\\\"";
            }

            if (currentEscape || el !== I18N) {
              if (pseudoI !== false) {
                return "continue";
              }

              i18nStr += el;

              if (dir.language) {
                return "continue";
              }
            }
          }

          // Начало управляющей конструкции
          // (не забываем следить за уровнем вложенностей {)
          if (isPrefStart || el === lb && (begin || !currentEscape)) {
            if (begin) {
              fakeBegin++;
            } else if (!dir.needPrfx || isPrefStart) {
              if (isPrefStart) {
                dir.i++;
                dir.needPrfx = true;

                if (modLine) {
                  dir.lines[lastLine] += lb;
                }
              }

              bEnd = true;
              begin = true;

              return "continue";
            }

            // Упраляющая конструкция завершилась
          } else if (el === rb && begin && (!fakeBegin || ! fakeBegin--)) {
            begin = false;

            var commandLength = command.length;
            command = command.trim();

            if (!command) {
              return "continue";
            }

            var short1 = command.charAt(0), short2 = command.substr(0, 2);

            var replacer = replacers[short2] || replacers[short1];

            if (replacer) {
              command = replacer(command);
            }

            var commandType = commandTypeRgxp.exec(command)[0], isConst = commandType === "const";

            commandType = Snakeskin.Directions[commandType] ? commandType : "const";

            clearMacroExpr();

            if (templateMap[commandType] && !sp.proto) {
              qOpen = 0;
              qType = null;
            }

            // Директивы начинающиеся с _ считаются приватными
            // и вырезаются из листинга
            if (!dir.proto && commandType.charAt(0) === "_") {
              var source = "" + alb + "?" + lb + "__.*?__.*?" + rb, rgxp = rgxpCache[source] || new RegExp(source);

              dir.lines[lastLine] = dir.lines[lastLine].replace(rgxp, "");

              rgxpCache[source] = rgxp;
            }

            command = dir.replaceDangerBlocks(isConst || commandType !== "const" ? command.replace(commandRgxp, "") : command);

            dir.space = dir.prevSpace;
            var fnRes = Snakeskin.Directions[commandType].call(dir, command, commandLength, commandType, jsDocStart);

            if (dir.brk) {
              return {
                v: false
              };
            }

            if (dir.needPrfx) {
              if (dir.inline !== false) {
                if (getName(commandType) === "end") {
                  if (prfxI) {
                    prfxI--;

                    if (!prfxI) {
                      dir.needPrfx = false;
                    }
                  } else {
                    dir.needPrfx = false;
                  }
                } else if (!prfxI) {
                  dir.needPrfx = false;
                }
              } else {
                prfxI++;
              }
            }

            if (dir.text && !dir.chainSpace && !dir.strongSpace) {
              dir.sysSpace = false;
              dir.space = dir.prevSpace = false;
            }

            if (dir.skipSpace) {
              dir.space = dir.prevSpace = true;
            }

            jsDocStart = false;
            dir.skipSpace = false;
            dir.text = false;

            if (fnRes === false) {
              begin = false;
              beginStr = false;
            }

            command = "";
            return "continue";
          } else if (dir.localization && !currentEscape && el === I18N) {
            if (i18nStart && i18nStr && words && !words[i18nStr]) {
              words[i18nStr] = i18nStr;
            }

            if (dir.language) {
              if (i18nStart) {
                var word = dir.language[i18nStr] || "";
                word = word.call ? word() : word;

                el = begin ? "'" + applyDefEscape(word) + "'" : word;

                i18nStart = false;
                i18nStr = "";
              } else {
                el = "";
                i18nStart = true;
              }
            } else {
              if (i18nStart) {
                i18nStart = false;
                i18nStr = "";

                if (begin) {
                  el = "\")";

                  if (i18nDirStart) {
                    freezeI += freezeTmp;
                    freezeTmp = 0;

                    dir.freezeLine--;
                    i18nDirStart = false;
                  }
                } else {
                  var advStr = "" + FILTER + "!html" + rb;
                  freezeTmp = advStr.length;

                  dir.source = str.substring(0, dir.i + 1) + advStr + str.substring(dir.i + 1);

                  dir.i = Number(pseudoI);
                  dir.freezeLine++;

                  pseudoI = false;
                  return "continue";
                }
              } else {
                i18nStart = true;

                if (begin) {
                  el = "" + dir.i18nFn + "(\"";
                } else {
                  var diff = Number(dir.needPrfx) + 1;

                  dir.source = str.substring(0, dir.i) + (dir.needPrfx ? alb : "") + lb + str.substring(dir.i);

                  pseudoI = dir.i - diff;
                  dir.i += diff;

                  i18nDirStart = true;
                  return "continue";
                }
              }
            }
          }
        }
      }

      // Запись команды
      if (begin) {
        if (beginStr && dir.isSimpleOutput()) {
          var prfx = "";

          if (dir.doctype && tAttr && !tAttrBegin) {
            prfx = "\"";
            tAttrBegin = true;
            tAttrEscape = true;
          }

          dir.save("" + prfx + "'" + dir.$$() + ";");
          beginStr = false;
        }

        // Обработка литералов строки и регулярных выражений внутри директивы
        if (!bOpen) {
          var skip = false;

          if (el === FILTER && filterStartRgxp.test(next)) {
            filterStart = true;
            bEnd = false;
            skip = true;
          } else if (filterStart && whiteSpaceRgxp.test(el)) {
            filterStart = false;
            bEnd = true;
            skip = true;
          }

          if (!skip) {
            if (escapeEndMap[el] || escapeEndWords[rPart]) {
              bEnd = true;
              rPart = "";
            } else if (bEndRgxp.test(el)) {
              bEnd = false;
            }

            if (partRgxp.test(el)) {
              part += el;
            } else {
              rPart = part;
              part = "";
            }
          }
        }

        if (!i18nStart) {
          if (escapeMap[el] && (el !== "/" || bEnd && command) && !bOpen) {
            bOpen = el;
          } else if (bOpen && (el === "\\" || bEscape)) {
            bEscape = !bEscape;
          } else if (escapeMap[el] && bOpen === el && !bEscape) {
            bOpen = false;
            bEnd = false;
          }
        }

        command += el;

        // Запись строки
      } else {
        if (jsDoc) {
          dir.save(el);
        } else if (!dir.tplName) {
          if (el === " ") {
            return "continue";
          }

          if (currentClrL && !dir.tplName && (shortMap[el] || shortMap[next2str])) {
            var adv = dir.lines[lastLine].length - 1, source = dir.toBaseSyntax(dir.source, dir.i - adv);

            if (source.error) {
              return {
                v: false
              };
            }

            dir.source = dir.source.substring(0, dir.i - adv) + source.str + dir.source.substring(dir.i + source.length - adv);

            dir.lines[lastLine] = dir.lines[lastLine].slice(0, -1);
            dir.i--;

            return "continue";
          }

          dir.error("text can't be used in the global space");
          return {
            v: false
          };
        } else {
          if (struct.strong && !inside[struct.name]["text"]) {
            if (el === " ") {
              dir.space = false;
              return "continue";
            }

            dir.error("directive \"text\" can't be used within the \"" + struct.name + "\"");
            return {
              v: false
            };
          }

          dir.startInlineDir("text");
          if (dir.isSimpleOutput()) {
            if (!beginStr) {
              dir.save("" + dir.$() + "'");
              beginStr = true;
            }

            if (dir.doctype) {
              if (el === "<") {
                tOpen++;
                clearMacroExpr();
              } else if (el === ">") {
                tOpen--;
                clearMacroExpr();
              }

              if (tAttr) {
                if (tAttrBegin && (tAttrEscape ? el === " " : tAttrBMap[el]) || !tOpen) {
                  tAttr = false;

                  if (tOpen) {
                    tAttrBegin = false;
                  }

                  if (tAttrEscape) {
                    el = "\"" + el;
                    tAttrEscape = false;
                  }

                  // Установка флага о начале декларации xml атрибута
                } else if (!tAttrBegin) {
                  tAttrBegin = true;
                  if (!tAttrBMap[el]) {
                    tAttrEscape = true;
                    el = "\"" + el;
                  }
                }

                // Начало декларации xml атрибута
              } else if (tOpen && el === "=") {
                tAttr = true;
              }

              dir.attr = Boolean(tOpen);
              dir.attrEscape = tAttrEscape;
            }

            if (dir.autoReplace) {
              if (!tOpen) {
                if (comboMacro[el]) {
                  var val = dir.macros[el];

                  if (!qType) {
                    qType = el;
                    el = val[0][0];
                    qOpen++;
                  } else if (el === qType) {
                    qType = null;
                    el = val[0][1];
                    qOpen = 0;
                  } else {
                    el = (val[1] || val[0])[qOpen % 2 ? 0 : 1];
                    qOpen++;
                  }

                  el = String(el.call ? el() : el);
                } else {
                  if (whiteSpaceRgxp.test(el)) {
                    clearMacroExpr();
                  } else if (inlineMacro[el] && !inlineMacro[prev] && !dir.macros[expr + el]) {
                    exprPos = dir.res.length;
                    expr = el;
                  } else {
                    if (!expr) {
                      exprPos = dir.res.length;
                    }

                    expr += el;
                  }
                }
              }

              if (dir.macros[expr]) {
                (function () {
                  var modStr = dir.res.substring(0, exprPos) + dir.res.substring(exprPos + expr.length + advExprPos);

                  var val = dir.macros[expr].call ? dir.macros[expr]() : dir.macros[expr];

                  val = String(val);
                  advExprPos += val.length;

                  dir.mod(function () {
                    dir.res = modStr;
                  });

                  dir.save(val);
                })();
              } else {
                dir.save(applyDefEscape(el));
              }
            } else {
              dir.save(applyDefEscape(el));
            }
          }

          dir.inline = null;
          dir.structure = dir.structure.parent;
        }

        if (jsDoc && !beginStr) {
          jsDoc = false;
          dir.space = true;
        }
      }
    })();

    switch (_ret4) {
      case "continue":
        continue _loop;
      default:
        if (typeof _ret4 === "object") return _ret4.v;
    }
  }


  // Если есть не закрытый XML тег,
  // то генерируем ошибку
  if (tOpen !== 0) {
    dir.error("invalid XML declaration");
    return false;
  }

  // Если количество открытых блоков не совпадает с количеством закрытых,
  // то генерируем ошибку
  if (begin || dir.structure.parent) {
    dir.error("missing closing or opening tag in the template");
    return false;
  }

  if (dir.proto) {
    sp.parent.setCompileVars(dir.getCompileVars());
    return dir.pasteDangerBlocks(dir.res);
  }

  // Если остались внешние декларации,
  // которые не были подключены к своему шаблону,
  // то генерируем ошибку
  for (var key in dir.preDefs) {
    if (!dir.preDefs.hasOwnProperty(key)) {
      continue;
    }

    dir.error("template \"" + key + "\" is not defined");
    return false;
  }

  dir.end(cacheKey, label);

  if (p.prettyPrint) {
    dir.res = beautify(dir.res);
    dir.res = dir.res.replace(new RegExp(nextLineRgxp.source, "g"), nl);
  }

  dir.res += nl;

  if (p.debug) {
    p.debug["code"] = dir.res;
    p.debug["files"] = dir.files;
  }

  try {
    // Компиляция на сервере
    if (IS_NODE) {
      if (ctx !== NULL) {
        new Function("module", "exports", "require", "__dirname", "__filename", dir.res)({
          exports: ctx,
          require: require,
          id: filename,
          filename: filename,
          parent: module,
          children: [],
          loaded: true
        }, ctx, require, dirname, filename);
      }

      // commonJS компиляция в браузере
    } else if (ctx !== NULL) {
      new Function("module", "exports", "global", dir.res)({
        exports: ctx
      }, ctx, root);

      // Живая компиляция в браузере
    } else {
      dir.evalStr(dir.res);
    }

    saveFnCache(cacheKey, text, p, ctx);
  } catch (err) {
    delete info["line"];
    delete info["template"];
    dir.error(err.message);
    return false;
  }

  saveCache(cacheKey, text, p, dir);

  // Если брайзер поддерживает FileAPI,
  // то подключаем скомпилированный шаблон как внешний скрипт
  if (!IS_NODE) {
    setTimeout(function () {
      try {
        var blob = new Blob([dir.res], {
          type: "application/javascript"
        });

        var script = document.createElement("script");
        script.src = URL.createObjectURL(blob);

        document.head.appendChild(script);
      } catch (ignore) {}
    }, 50);
  }

  return dir.res;
};
var aliasRgxp = /__(.*?)__/;

/**
 * Добавить новую директиву в пространство имён Snakeskin
 *
 * @param {string} name - название добавляемой директивы
 * @param {Object} params - дополнительные параметры
 *
 * @param {?boolean=} params.alias - если true, то директива считается псевдонимом
 *     (только для приватных директив)
 *
 * @param {?boolean=} params.text - если true, то декларируется,
 *     что директива выводится как текст
 *
 * @param {?string=} [params.placement] - если параметр задан, то делается проверка
 *     где именно размещена директива ('global', 'template', ...)
 *
 * @param {?boolean=} params.notEmpty - если true, то директива не может быть "пустой"
 * @param {(Array|string)=} [params.chain] - название главной директивы (цепи), к которой принадлежит директива,
 *     или массив названий
 *
 * @param {(Array|string)=} [params.end] - название главной директивы (цепи), которую заканчивает директива,
 *     или массив названий
 *
 * @param {(Array|string)=} [params.group] - название группы, к которой принадлежит директива,
 *     или массив названий
 *
 * @param {?boolean=} params.sys - если true, то директива считается системной
 *     (например, block или proto, т.е. которые участвуют только на этапе трансляции)
 *
 * @param {?boolean=} params.block - если true, то директива считается блочной
 *     (т.е. требует закрывающей директивы)
 *
 * @param {?boolean=} params.selfInclude - если false, то директива не может быть вложена
 *     в директиву схожего типа
 *
 * @param {Object=} [params.replacers] - таблица коротких сокращений директивы
 *     replacers: {
 *         // В ключе должно быть не более 2-х символов
 *         '?': (cmd) => cmd.replace(/^\?/, 'void ')
 *     }
 *
 * @param {Object=} [params.inside] - таблица директив, которые могут быть вложены в исходную
 *     inside: {
 *         'case': true,
 *         'default': true
 *     }
 *
 * @param {Object=} [params.after] - таблица директив, которые могут идти после исходной
 *     after: {
 *         'catch': true,
 *         'finally': true
 *     }
 *
 * @param {function(this:DirObj, string, number, string, (boolean|number))} constr - конструктор директивы
 * @param {?function(this:DirObj, string, number, string, (boolean|number))=} opt_destr - деструктор директивы
 */
Snakeskin.addDirective = function (name, params, constr, opt_destr) {
  params = params || {};

  forIn(params.replacers, function (el, key) {
    if (key.length > 2) {
      throw new Error("Invalid shorthand key \"" + key + "\" (key.length > 2)");
    }

    replacers[key] = el;

    if (key.charAt(0) !== "/") {
      shortMap[key] = true;
    }
  });

  after[name] = params.after;
  inside[name] = params.inside;
  sys[name] = Boolean(params.sys);
  block[name] = Boolean(params.block);
  text[name] = Boolean(params.text);

  if (params.alias) {
    aliases[name] = name.replace(aliasRgxp, "$1");
  }

  if (params.group) {
    var group = Array.isArray(params.group) ? params.group : [params.group];

    for (var i = -1; ++i < group.length;) {
      if (!groups[group[i]]) {
        groups[group[i]] = {};
        groupsList[group[i]] = [];
      }

      groups[group[i]][name] = true;
      groupsList[group[i]].push("\"" + name + "\"");
    }
  }

  if (params.chain) {
    var chain = Array.isArray(params.chain) ? params.chain : [params.chain];

    for (var i = -1; ++i < chain.length;) {
      if (!chains[chain[i]]) {
        chains[chain[i]] = {};
      }

      chains[chain[i]][name] = true;
    }
  }

  if (params.end) {
    var chain = Array.isArray(params.end) ? params.end : [params.end];

    for (var i = -1; ++i < chain.length;) {
      if (!ends[chain[i]]) {
        ends[chain[i]] = {};
      }

      ends[chain[i]][name] = true;
    }
  }

  params.selfInclude = params.selfInclude !== false;

  if (!params.selfInclude) {
    params.block = true;
  }

  Snakeskin.Directions[name] = function (command, commandLength, type, jsDoc) {
    var dir = this;
    var sourceName = getName(name), dirName = getName(name);

    if (dir.ctx) {
      dirName = dir.name || dirName;
      dir = dir.ctx;
    }

    var ignore = groups["ignore"][dirName], struct = dir.structure;

    dir.name = dirName;
    switch (params.placement) {
      case "template":
        if (!struct.parent) {
          dir.error("directive \"" + dirName + "\" can be used only within a " + groupsList["template"].join(", "));
        }

        break;

      case "global":
        if (struct.parent) {
          dir.error("directive \"" + dirName + "\" can be used only within the global space");
        }

        break;

      default:
        if (params.placement && dir.hasParent(params.placement)) {
          dir.error("directive \"" + dirName + "\" can be used only within a \"" + params.placement + "\"");
        }
    }

    if (params.notEmpty && !command) {
      return dir.error("directive \"" + dirName + "\" should have a body");
    }

    if (struct.strong) {
      if (inside[struct.name][dirName]) {
        dir.chainSpace = false;
      } else if (!ignore && sourceName === dirName && dirName !== "end") {
        return dir.error("directive \"" + dirName + "\" can't be used within the \"" + struct.name + "\"");
      }
    }

    if (!params.selfInclude && dir.has(dirName)) {
      return dir.error("directive \"" + dirName + "\" can't be used within the \"" + dirName + "\"");
    }

    if (params.text) {
      dir.text = true;
    }

    var from = dir.res.length;

    constr.call(dir, command, commandLength, type, jsDoc);

    if (dir.structure.params._from === void 0) {
      dir.structure.params._from = from;
    }

    var newStruct = dir.structure;

    if (inside[dirName]) {
      newStruct.strong = true;
      dir.chainSpace = true;
    }

    if (dirName === sourceName) {
      if (struct === newStruct) {
        if (!ignore && after[struct.name] && !after[struct.name][dirName]) {
          return dir.error("directive \"" + dirName + "\" can't be used after the \"" + struct.name + "\"");
        }
      } else {
        var siblings = sourceName === "end" ? newStruct.children : newStruct.parent && newStruct.parent.children;

        if (siblings) {
          var j = 1, prev = undefined;

          while ((prev = siblings[siblings.length - j]) && (prev.name === "text" || prev === newStruct)) {
            j++;
          }

          if (!ignore && prev && after[prev.name] && !after[prev.name][dirName]) {
            return dir.error("directive \"" + dirName + "\" can't be used after the \"" + prev.name + "\"");
          }
        }
      }
    }

    dir.applyQueue();

    if (dir.inline === true) {
      baseEnd.call(dir);

      if (opt_destr) {
        opt_destr.call(dir, command, commandLength, type, jsDoc);
      }

      dir.inline = null;
      dir.structure = dir.structure.parent;

      if (dir.blockStructure && dir.blockStructure.name === "const") {
        dir.blockStructure = dir.blockStructure.parent;
      }
    }
  };

  Snakeskin.Directions["" + name + "End"] = opt_destr;
  var baseEnd = Snakeskin.Directions["" + name + "BaseEnd"] = function () {
    var _this8 = this;
    var params = this.structure.params;

    if (params._scope) {
      this.scope.pop();
    }

    forIn(params._consts, function (el, key) {
      constCache[_this8.tplName][key] = el;
    });

    var res = params._res ? params._res : this.res;

    var from = params._from, to = res.length;

    if (from == null) {
      return;
    }

    var parent = this.structure.parent;

    if ((!parent || parent.name === "root") && !this.getGroup("define")[name] && from !== to) {
      try {
        this.evalStr(res.substring(from, to));
      } catch (err) {
        return this.error(err.message);
      }

      if (fsStack.length) {
        this.source = this.source.substring(0, this.i + 1) + this.replaceCData(fsStack.join("")) + this.source.substring(this.i + 1);

        fsStack.splice(0, fsStack.length);
      }
    }
  };
};

/**
 * Декларировать аргументы функции callback
 * и вернуть строку декларации
 *
 * @param {(!Array|string)} parts - строка аргументов или массив параметров директивы
 * @return {string}
 */
DirObj.prototype.declCallbackArgs = function (parts) {
  var args = ((Array.isArray(parts) ? parts[2] || parts[1] : parts) || "").split(","), scope;

  for (var i = -1; ++i < args.length;) {
    var el = args[i].trim(), mod = scopeModRgxp.test(el);

    if (mod) {
      if (scope) {
        this.error("invalid \"" + this.name + "\" declaration");
      } else {
        el = el.replace(scopeModRgxp, "");
      }
    }

    if (el) {
      args[i] = this.declVar(el, true);

      if (mod) {
        scope = args[i];
      }
    }
  }

  if (scope) {
    this.scope.push(scope);
    this.structure.params._scope = true;
  }

  return args.join(",");
};

Snakeskin.addDirective("callback", {
  block: true,
  group: "callback",
  replacers: {
    "()": function (cmd) {
      return cmd.replace("()", "callback ");
    }
  }
}, function (command) {
  var parts = command.split("=>");

  if (!parts.length || parts.length > 2) {
    return this.error("invalid \"" + this.name + "\" declaration");
  }

  this.startDir();
  if (this.isReady()) {
    var async = this.getGroup("async"), parent = this.structure.parent;

    this.structure.params.insideAsync = async[parent.name];
    var children = parent.children, length = 0;

    for (var i = -1; ++i < children.length;) {
      if (children[i].name === "callback") {
        length++;
      }

      if (length > 1) {
        break;
      }
    }

    this.append( /* cbws */"" + (async[parent.name] && length > 1 ? ", " : "") + "(function (" + this.declCallbackArgs(parts) + ") {" + this.declArguments() + "");
  }
}, function () {
  this.append("})" + (this.structure.params.insideAsync ? "" : ";"));
});

Snakeskin.addDirective("final", {
  block: true,
  group: ["callback", "basicAsync"],

  chain: ["parallel", "series", "waterfall"]
}, function (command) {
  var async = this.getGroup("series");

  if (!async[this.structure.name]) {
    return this.error("directive \"" + this.name + "\" can be used only with a \"" + groupsList["series"].join(", ") + "\"");
  }

  var parts = command.split("=>");

  if (!parts.length || parts.length > 2) {
    return this.error("invalid \"" + this.name + "\" declaration");
  }

  this.startDir();
  if (this.isReady()) {
    this.append( /* cbws */"], function (" + this.declCallbackArgs(parts) + ") {" + this.declArguments() + "");
  }
}, function () {
  this.append("});");
  this.endDir();
});

(function () {
  var series = ["parallel", "series", "waterfall"];

  for (var i = -1; ++i < series.length;) {
    Snakeskin.addDirective(series[i], {
      block: true,
      group: ["async", "Async", "series"],

      inside: {
        "callback": true,
        "final": true
      }
    }, function (command, commandLength, type) {
      this.startDir();
      this.append("" + this.prepareOutput("async", true) + "." + type + "([");
    }, function () {
      this.append("]);");
    });
  }

  var async = ["whilst", "doWhilst", "forever"];

  for (var i = -1; ++i < async.length;) {
    Snakeskin.addDirective(async[i], {
      block: true,
      group: ["async", "Async"],

      inside: {
        "callback": true
      }
    }, function (command, commandLength, type) {
      this.startDir();
      this.append("" + this.prepareOutput("async", true) + "." + type + "(");
    }, function () {
      this.append(");");
    });
  }
})();

Snakeskin.addDirective("when", {
  block: true,
  notEmpty: true,

  group: ["async", "basicAsync"],

  inside: {
    "callback": true
  }
}, function (command) {
  this.startDir();
  this.append("" + this.prepareOutput(command, true) + ".then(");
}, function () {
  this.append(");");
});


(function () {
  Snakeskin.addDirective("attr", {
    placement: "template",
    notEmpty: true,
    text: true
  }, function (command) {
    this.startInlineDir();
    if (this.isReady()) {
      var str = "", _groups = this.splitAttrsGroup(command);

      for (var i = -1; ++i < _groups.length;) {
        var el = _groups[i];

        str += this.returnAttrDecl(el.attr, el.group, el.separator);
      }

      this.append(str);
    }
  });

  var escapeEqRgxp = /===|==|([\\]+)=/g, escapeOrRgxp = /\|\||([\\]+)\|/g;

  var unEscapeEqRgxp = /__SNAKESKIN_EQ__(\d+)_(\d+)_/g, unEscapeOrRgxp = /__SNAKESKIN_OR__(\d+)_(\d+)_/g;

  function escapeEq(sstr, $1) {
    if ($1 && $1.length % 2 === 0) {
      return sstr;
    }

    return "__SNAKESKIN_EQ__" + sstr.split("=").length + "_" + $1.length + "_";
  }

  function escapeOr(sstr, $1) {
    if ($1 && $1.length % 2 === 0) {
      return sstr;
    }

    return "__SNAKESKIN_OR__" + sstr.split("|").length + "_" + $1.length + "_";
  }

  function unEscapeEq(ignore, $1, $2) {
    return new Array(Number($2)).join("\\") + new Array(Number($1)).join("=");
  }

  function unEscapeOr(ignore, $1, $2) {
    return new Array(Number($2)).join("\\") + new Array(Number($1)).join("|");
  }

  /**
   * Вернуть строку декларации XML атрибутов
   *
   * @param {string} str - исходная строка
   * @param {?string=} [opt_group] - название группы
   * @param {?string=} opt_separator - разделитель группы
   * @param {?boolean=} opt_classLink - если true, то значения для атрибута class
   *     будут сохраняться во временную переменную
   *
   * @return {string}
   */
  DirObj.prototype.returnAttrDecl = function (str, opt_group, opt_separator, opt_classLink) {
    var rAttr = this.attr, rEscape = this.attrEscape;

    this.attr = true;
    this.attrEscape = true;

    opt_group = opt_group || "";
    opt_separator = opt_separator || "-";

    str = str.replace(escapeHTMLRgxp, escapeHTML).replace(escapeOrRgxp, escapeOr);

    var parts = str.split("|"), res = "", ref = this.bemRef;

    var s = ADV_LEFT_BLOCK + LEFT_BLOCK, e = RIGHT_BLOCK;

    for (var i = -1; ++i < parts.length;) {
      parts[i] = parts[i].replace(unEscapeOrRgxp, unEscapeOr).replace(escapeEqRgxp, escapeEq);

      var arg = parts[i].split("="), empty = arg.length !== 2;

      if (empty) {
        if (this.doctype === "xml") {
          arg[1] = arg[0];
          empty = false;
        } else {
          arg[1] = "";
        }
      }

      arg[0] = arg[0].trim().replace(unEscapeEqRgxp, unEscapeEq);
      arg[1] = arg[1].trim().replace(unEscapeEqRgxp, unEscapeEq);

      res += /* cbws */"var __ATTR_STR__ = '',__ATTR_J__ = 0;";

      if (opt_group) {
        arg[0] = opt_group + opt_separator + arg[0];
      } else {
        arg[0] = arg[0].charAt(0) === "-" ? "data-" + arg[0].slice(1) : arg[0];
      }

      arg[0] = "'" + this.pasteTplVarBlocks(arg[0]) + "'";
      var vals = splitBySpace(arg[1]);

      for (var j = -1; ++j < vals.length;) {
        var val = vals[j].trim();

        if (parentLinkRgxp.test(val) && ref) {
          val = "" + s + "'" + ref + "'" + FILTER + "" + this.bemFilter + " '" + val.substring("&amp;".length) + "',$0" + e;
          val = this.pasteDangerBlocks(this.replaceTplVars(val));
        }

        val = "'" + this.pasteTplVarBlocks(val) + "'";

        res += /* cbws */"if ((" + val + ") != null && (" + val + ") !== '') {__ATTR_STR__ += __ATTR_J__ ? ' ' + " + val + " : " + val + ";__ATTR_J__++;}";
      }

      res += "if ((" + arg[0] + ") != null && (" + arg[0] + ") != '') {";
      var tmp = /* cbws */"if (__NODE__) {__NODE__.setAttribute(" + arg[0] + ", " + empty + " ? " + arg[0] + " : __ATTR_STR__ );} else {" + this.wrap("' ' + " + arg[0] + " + (" + empty + " ? '' : '=\"' + __ATTR_STR__ + '\"')") + "}";

      if (opt_classLink) {
        res += /* cbws */"if (__ATTR_TMP__[(" + arg[0] + ")] != null) {__ATTR_TMP__[(" + arg[0] + ")] += __ATTR_STR__;} else {" + tmp + "}";
      } else {
        res += tmp;
      }

      res += "}";
    }

    this.attr = rAttr;
    this.attrEscape = rEscape;

    return res;
  };

  /**
   * Разбить строку декларации атрибута на группы
   *
   * @param {string} str - исходная строка
   * @return {!Array}
   */
  DirObj.prototype.splitAttrsGroup = function (str) {
    var rAttr = this.attr, rEscape = this.attrEscape;

    this.attr = true;
    this.attrEscape = true;

    str = this.replaceTplVars(str, false, true);
    var groups = [];

    var group = "", attr = "", sep = "";

    var pOpen = 0;
    var separator = {
      "-": true,
      ":": true,
      "_": true
    };

    for (var i = -1; ++i < str.length;) {
      var el = str.charAt(i), next = str.charAt(i + 1);

      if (!pOpen) {
        if (separator[el] && next === "(") {
          pOpen++;
          i++;
          sep = el;
          continue;
        }

        if (el === "(") {
          pOpen++;
          sep = "";
          continue;
        }
      }

      if (pOpen) {
        if (el === "(") {
          pOpen++;
        } else if (el === ")") {
          pOpen--;

          if (!pOpen) {
            groups.push({
              group: Snakeskin.Filters.html(group, true).trim(),
              separator: sep,
              attr: attr.trim()
            });

            group = "";
            attr = "";
            sep = "";

            i++;
            continue;
          }
        }
      }

      if (!pOpen) {
        group += el;
      } else {
        attr += el;
      }
    }

    if (group && !attr) {
      groups.push({
        group: null,
        separator: null,
        attr: group.trim()
      });
    }

    this.attr = rAttr;
    this.attrEscape = rEscape;

    return groups;
  };
})();


Snakeskin.addDirective("setBEM", {
  placement: "global",
  notEmpty: true
}, function (command) {
  this.startInlineDir();
  var parts = command.match(/([^,]+),\s+(.*)/);

  try {
    bem[parts[1]] = this.evalStr("{" + this.prepareOutput(parts[2], true, null, null, false) + "}");
  } catch (ignore) {
    return this.error("invalid \"" + this.name + "\" declaration");
  }
});

Snakeskin.addDirective("bem", {
  block: true,
  placement: "template",
  notEmpty: true,
  text: true
}, function (command) {
  this.startDir(null, {
    tag: /^\(/.test(command) ? /\((.*?)\)/.exec(command)[1] : null
  });

  var params = this.structure.params;

  command = params.tag ? command.replace(/^[^)]+\)(.*)/, "$1") : command;

  var parts = command.trim().split(","), bemName = parts[0];

  parts[0] += "'";
  command = parts.join(",");

  params.original = bem[bemName] && bem[bemName].tag;

  if (this.isReady()) {
    var str = undefined, tag = params.tag || params.original || "div", desc = "{name: \\'" + this.replaceTplVars(command.replace(/\s+/g, " ")) + "}";

    if (this.renderMode === "dom") {
      str = /* cbws */"__NODE__ = document.createElement('" + tag + "');__NODE__.className = 'i-block';__NODE__.setAttribute('data-params', '" + desc + "');" + this.returnPushNodeDecl() + "";
    } else {
      str = this.wrap( /* cbws */"'<" + tag + "class=\"i-block\"data-params=\"" + desc + "\">'");
    }

    this.append(str);
  }
}, function () {
  var params = this.structure.params, str;

  if (this.renderMode == "dom") {
    str = "__RESULT__.pop();";
  } else {
    str = this.wrap("'</" + (params.tag || params.original || "div") + ">'");
  }

  this.append(str);
});


var callBlockNameRgxp = new RegExp("^[^" + symbols + "_$][^" + w + "$]*|[^" + w + "$]+", "i");

Snakeskin.addDirective("block", {
  sys: true,
  block: true,
  notEmpty: true,
  group: ["template", "inherit", "define", "blockInherit"]
}, function (command, commandLength) {
  var name = this.getFnName(command), tplName = this.tplName;

  if (!name) {
    return this.error("invalid \"" + this.name + "\" name");
  }

  var parts = name.split("->");

  if (parts[1]) {
    name = parts[1].trim();

    if (!tplName) {
      if (this.structure.parent) {
        this.error("directive \"outer block\" can be used only within the global space");
        return;
      }

      try {
        tplName = this.tplName = this.prepareNameDecl(parts[0]);
      } catch (err) {
        return this.error(err.message);
      }

      if (tplName in extMap) {
        delete extMap[tplName];
        clearScopeCache(tplName);
      }

      var desc = this.preDefs[tplName] = this.preDefs[tplName] || {
        text: ""
      };

      desc.startLine = this.info["line"];
      desc.i = this.i + 1;

      this.outerLink = name;
      this.protoStart = true;
    }
  } else if (!this.outerLink && !this.tplName) {
    return this.error("directive \"" + this.name + "\" can be used only within a " + groupsList["template"].join(", "));
  }

  if (!name || !tplName || callBlockNameRgxp.test(name)) {
    return this.error("invalid \"" + this.name + "\" declaration");
  }

  var scope = scopeCache[this.name][tplName] = scopeCache[this.name][tplName] || {};

  var parentScope, parentTplName = extMap[tplName];

  if (parentTplName) {
    parentScope = scopeCache[this.name][parentTplName] = scopeCache[this.name][parentTplName] || {};
  }

  var current = scope[name];
  if (!scope[name]) {
    current = scope[name] = {
      id: this.module.id,
      children: {}
    };
  }

  if (!this.outerLink && !current.root) {
    var parent = parentScope && parentScope[name];

    current.parent = parent;
    current.overridden = Boolean(parentTplName && this.parentTplName);
    current.root = parent ? parent.root : scope[name];

    if (parent) {
      parent.children[tplName] = scope[name];
    }
  }

  var start = this.i - this.startTemplateI;
  this.startDir(null, {
    name: name,
    from: this.outerLink ? this.i - this.getDiff(commandLength) : start + 1
  });

  var struct = this.structure, dir = String(this.name);

  var params, output;

  if (name !== command) {
    var ouptupCache = this.getBlockOutput(dir);

    if (ouptupCache) {
      output = command.split("=>")[1];
      params = ouptupCache[name];

      if (output != null) {
        params = ouptupCache[name] = output;
      }
    }
  }

  if (this.isAdvTest()) {
    if (blockCache[tplName][name]) {
      return this.error("block \"" + name + "\" is already defined");
    }

    var args = this.prepareArgs(command, dir, null, this.parentTplName, name);

    if (args.params && callBlockNameRgxp.test(name)) {
      return this.error("invalid \"" + this.name + "\" declaration");
    }

    this.structure.params.args = args.params;
    blockCache[tplName][name] = {
      from: start - this.getDiff(commandLength),
      needPrfx: this.needPrfx,
      args: args,
      output: output
    };

    if (args.scope) {
      this.scope.push(args.scope);
      struct.params._scope = true;
    }
  }

  if (this.isSimpleOutput()) {
    var args = blockCache[tplName][name].args;

    if (args.params) {
      var fnDecl = "__BLOCKS__." + name;
      struct.params.fn = fnDecl;

      this.save( /* cbws */"if (!" + fnDecl + ") {" + fnDecl + " = function (" + args.str + ") {var __RESULT__ = " + this.declResult() + ";" + this.declArguments() + "function getTplResult(opt_clear) {var res = " + this.returnResult() + ";if (opt_clear) {__RESULT__ = " + this.declResult() + ";}return res;}function clearTplResult() {__RESULT__ = " + this.declResult() + ";}" + args.defParams + "");

      if (params != null) {
        var str = "", vars = struct.vars;

        struct.vars = struct.parent.vars;
        params = this.getFnArgs("(" + params + ")");

        for (var i = -1; ++i < params.length;) {
          str += "" + this.prepareOutput(params[i], true) + ",";
        }

        struct.vars = vars;
        str = str.slice(0, -1);
        struct.params.params = str;
      }
    }
  }
}, function (command, commandLength) {
  var params = this.structure.params, diff = this.getDiff(commandLength);

  var s = (this.needPrfx ? ADV_LEFT_BLOCK : "") + LEFT_BLOCK, e = RIGHT_BLOCK;

  if (this.outerLink === params.name) {
    var obj = this.preDefs[this.tplName], nl = this.lineSeparator, i = Number(obj.i);

    obj.text += /* cbws */"" + nl + "" + this.source.substring(params.from, i) + "" + s + "__cutLine__" + e + "" + s + "__switchLine__ " + obj.startLine + "" + e + "" + this.source.substring(i, this.i - diff) + "" + s + "__end__" + e + "" + nl + "" + this.source.substring(this.i - diff, this.i + 1) + "" + s + "__cutLine__" + e + "";

    this.outerLink = null;
    this.tplName = null;
    this.protoStart = false;

    return;
  }

  var block = blockCache[this.tplName][params.name];

  if (this.isSimpleOutput() && params.fn) {
    this.save( /* cbws */"return " + this.returnResult() + ";};}" + (params.params != null ? this.wrap("" + params.fn + "(" + params.params + ")") : "") + "");
  }

  if (this.isAdvTest()) {
    if (!block) {
      return this.error("invalid \"block\" declaration");
    }

    var start = this.i - this.startTemplateI;
    block.to = start + 1;
    block.content = this.source.substring(this.startTemplateI).substring(params.from, start - diff);
  }
});


Snakeskin.addDirective("call", {
  placement: "template",
  notEmpty: true,
  text: true,
  replacers: {
    "^=": function (cmd) {
      return cmd.replace("^=", "call ");
    }
  }
}, function (command) {
  this.startInlineDir();
  if (this.isReady()) {
    this.append(this.wrap(this.prepareOutput(command, true)));
  }
});

Snakeskin.addDirective("callBlock", {
  placement: "template",
  notEmpty: true,
  text: true,
  replacers: {
    "~=": function (cmd) {
      return cmd.replace("~=", "callBlock ");
    }
  }
}, function (command) {
  this.startInlineDir();
  if (this.isReady()) {
    var name = this.getFnName(command), str = undefined;

    if (name === "&") {
      var tmp = this.hasBlock("block", true);

      if (tmp) {
        str = tmp.params.fn + this.prepareOutput(command.replace(name, ""), true);
      } else {
        return this.error("invalid \"" + this.name + "\" declaration");
      }
    } else {
      str = this.prepareOutput("__BLOCKS__." + command, true);
    }

    this.append(this.wrap(str));
  }
});


(function () {
  var lib = {
    "angularjs": {
      "google": function (v) {
        return ( /* cbws */"<script type=\"text/javascript\" src=\"http://ajax.googleapis.com/ajax/libs/angularjs/" + v + "/angular.min.js\"></script>"
        );
      },

      "yandex": function (v) {
        return ( /* cbws */"<script type=\"text/javascript\" src=\"http://yastatic.net/angularjs/" + v + "/angular.min.js\"></script>"
        );
      }
    },

    "dojo": {
      "google": function (v) {
        return ( /* cbws */"<script type=\"text/javascript\" src=\"http://ajax.googleapis.com/ajax/libs/dojo/" + v + "/dojo/dojo.js\"></script>"
        );
      },

      "yandex": function (v) {
        return ( /* cbws */"<script type=\"text/javascript\" src=\"http://yastatic.net/dojo/" + v + "/dojo/dojo.js\"></script>"
        );
      }
    },

    "extcore": {
      "google": function (v) {
        return ( /* cbws */"<script type=\"text/javascript\" src=\"http://ajax.googleapis.com/ajax/libs/ext-core/" + v + "/ext-core.js\"></script>"
        );
      },

      "yandex": function (v) {
        return ( /* cbws */"<script type=\"text/javascript\" src=\"http://yastatic.net/ext-core/" + v + "/ext-core.min.js\"></script>"
        );
      }
    },

    "jquery": {
      "google": function (v) {
        return ( /* cbws */"<script type=\"text/javascript\" src=\"http://ajax.googleapis.com/ajax/libs/jquery/" + v + "/jquery.min.js\"></script>"
        );
      },

      "yandex": function (v) {
        return ( /* cbws */"<script type=\"text/javascript\" src=\"http://yastatic.net/jquery/" + v + "/jquery.min.js\"></script>"
        );
      }
    },

    "jquerymobile": {
      "google": function (v, e) {
        return ( /* cbws */"<link type=\"text/css\" rel=\"stylesheet\" href=\"http://ajax.googleapis.com/ajax/libs/jquerymobile/" + v + "/jquery.mobile.min.css\"" + e + "><script type=\"text/javascript\" src=\"http://ajax.googleapis.com/ajax/libs/jquerymobile/" + v + "/jquery.mobile.min.js\"></script>"
        );
      },

      "yandex": function (v, e) {
        return ( /* cbws */"<link type=\"text/css\" rel=\"stylesheet\" href=\"http://yastatic.net/jquery/mobile/" + v + "/jquery.mobile.min.css\"" + e + "><script type=\"text/javascript\" src=\"http://yastatic.net/jquery/mobile/" + v + "/jquery.mobile.min.js\"></script>"
        );
      }
    },

    "jqueryui": {
      "google": function (v, e) {
        return ( /* cbws */"<link type=\"text/css\" rel=\"stylesheet\" href=\"http://ajax.googleapis.com/ajax/libs/jqueryui/" + v + "/themes/smoothness/jquery-ui.css\"" + e + "><script type=\"text/javascript\" src=\"http://ajax.googleapis.com/ajax/libs/jqueryui/" + v + "/jquery-ui.min.js\"></script>"
        );
      },

      "yandex": function (v, e) {
        return ( /* cbws */"<link type=\"text/css\" rel=\"stylesheet\" href=\"http://yastatic.net/jquery-ui/" + v + "/themes/smoothness/jquery-ui.min.css\"" + e + "><script type=\"text/javascript\" src=\"http://yastatic.net/jquery-ui/" + v + "/jquery-ui.min.js\"></script>"
        );
      }
    },

    "mootools": {
      "google": function (v) {
        return ( /* cbws */"<script type=\"text/javascript\" src=\"http://ajax.googleapis.com/ajax/libs/mootools/" + v + "/mootools-yui-compressed.js\"></script>"
        );
      },

      "yandex": function (v) {
        return ( /* cbws */"<script type=\"text/javascript\" src=\"http://yastatic.net/mootools/" + v + "/mootools.min.js\"></script>"
        );
      }
    },

    "prototype": {
      "google": function (v) {
        return ( /* cbws */"<script type=\"text/javascript\" src=\"http://ajax.googleapis.com/ajax/libs/prototype/" + v + "/prototype.js\"></script>"
        );
      },

      "yandex": function (v) {
        return ( /* cbws */"<script type=\"text/javascript\" src=\"http://yastatic.net/prototype/" + v + "/prototype.min.js\"></script>"
        );
      }
    },

    "script.aculo.us": {
      "google": function (v) {
        return ( /* cbws */"<script type=\"text/javascript\" src=\"http://ajax.googleapis.com/ajax/libs/scriptaculous/" + v + "/scriptaculous.js\"></script>"
        );
      },

      "yandex": function (v) {
        return ( /* cbws */"<script type=\"text/javascript\" src=\"http://yastatic.net/scriptaculous/" + v + "/min/scriptaculous.js\"></script>"
        );
      }
    },

    "swfobject": {
      "google": function (v) {
        return ( /* cbws */"<script type=\"text/javascript\" src=\"http://ajax.googleapis.com/ajax/libs/swfobject/" + v + "/swfobject.js\"></script>"
        );
      },

      "yandex": function (v) {
        return ( /* cbws */"<script type=\"text/javascript\" src=\"http://yastatic.net/swfobject/" + v + "/swfobject.min.js\"></script>"
        );
      }
    },

    "three.js": {
      "google": function (v) {
        return ( /* cbws */"<script type=\"text/javascript\" src=\"http://ajax.googleapis.com/ajax/libs/threejs/" + v + "/three.min.js\"></script>"
        );
      }
    },

    "webfontloader": {
      "google": function (v) {
        return ( /* cbws */"<script type=\"text/javascript\" src=\"http://ajax.googleapis.com/ajax/libs/webfont/" + v + "/webfont.js\"></script>"
        );
      }
    },

    "bootstrap": {
      "yandex": function (v, e) {
        return ( /* cbws */"<link type=\"text/css\" rel=\"stylesheet\" href=\"http://yastatic.net/bootstrap/" + v + "/css/bootstrap.min.css\"" + e + "><script type=\"text/javascript\" src=\"http://yastatic.net/bootstrap/" + v + "/js/bootstrap.min.js\"></script>"
        );
      },

      "maxcdn": function (v, e) {
        return ( /* cbws */"<link type=\"text/css\" rel=\"stylesheet\" href=\"http://maxcdn.bootstrapcdn.com/bootstrap/" + v + "/css/bootstrap.min.css\"" + e + "><script type=\"text/javascript\" src=\"http://maxcdn.bootstrapcdn.com/bootstrap/" + v + "/js/bootstrap.min.js\"></script>"
        );
      }
    },

    "fontawesome": {
      "maxcdn": function (v, e) {
        return ( /* cbws */"<link type=\"text/css\" rel=\"stylesheet\" href=\"http://maxcdn.bootstrapcdn.com/font-awesome/" + v + "/css/font-awesome.min.css\"" + e + ">"
        );
      }
    },

    "underscore.js": {
      "yandex": function (v) {
        return ( /* cbws */"<script type=\"text/javascript\" src=\"http://yastatic.net/underscore/" + v + "/underscore-min.js\"></script>"
        );
      }
    },

    "lodash": {
      "yandex": function (v) {
        return ( /* cbws */"<script type=\"text/javascript\" src=\"http://yastatic.net/lodash/" + v + "/lodash.min.js\"></script>"
        );
      }
    }
  };

  function first(obj) {
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        return obj[key];
      }
    }
  }

  Snakeskin.addDirective("cdn", {
    placement: "template",
    notEmpty: true,
    text: true
  }, function (command) {
    var parts = splitBySpace(command), cdn = parts.slice(1).join(" "), val = parts[0].split("@");

    if (!val[1]) {
      return this.error("missing version");
    }

    cdn = cdn && cdn.toLowerCase();
    val[0] = val[0].toLowerCase();

    if (!lib[val[0]]) {
      return this.error("requested library is not found");
    }

    this.append(this.wrap(
    /* cbws */"'" + (cdn ? lib[val[0]][cdn] || first(lib[val[0]]) : first(lib[val[0]]))(val[1], this.doctype === "xml" ? "/" : "") + "'"));
  });
})();


/**
 * Если true, то идёт декларация XML комментария
 * в режиме рендеринга dom
 * @type {boolean}
 */
DirObj.prototype.domComment = false;

Snakeskin.addDirective("comment", {
  block: true,
  selfInclude: false,
  placement: "template",
  replacers: {
    "@!": function (cmd) {
      return cmd.replace("@!", "comment ");
    },
    "/@": function (cmd) {
      return cmd.replace("/@", "end comment");
    }
  }
}, function (command) {
  this.startDir(null, {
    conditional: Boolean(command)
  });

  var str;

  if (this.renderMode === "dom") {
    this.domComment = true;
    str = "__COMMENT_RESULT__ = '';";
  } else {
    str = this.wrap("'<!--'");
  }

  if (command) {
    str += this.wrap("'[if " + this.replaceTplVars(command) + "]>'");
  }

  this.append(str);
}, function () {
  var comment = this.structure.params.conditional ? " <![endif]" : "", str;

  if (this.renderMode === "dom") {
    str = this.wrap("'" + comment + "'");
    this.domComment = false;
    str += /* cbws */"__NODE__ = document.createComment(__COMMENT_RESULT__);" + this.returnPushNodeDecl(true) + "__COMMENT_RESULT__ = '';";
  } else {
    str = this.wrap("'" + comment + "-->'");
  }

  this.append(str);
});


(function () {
  /**
   * Преобразовать заданное значение в объект
   *
   * @param {?} val - объект, строка для парсинга или URL
   * @param {?string=} [opt_base] - базовый URL
   * @param {?function(string)=} [opt_onFileExists] - функция обратного вызова,
   *     если исходный объект - путь к существующему файлу
   *
   * @return {!Object}
   */
  Snakeskin.toObj = function (val, opt_base, opt_onFileExists) {
    if (typeof val !== "string") {
      return val;
    }

    var res;

    if (IS_NODE) {
      var path = require("path"), fs = require("fs"), old = val;

      try {
        if (opt_base) {
          val = path.resolve(path.dirname(opt_base), val);
        }

        val = path.normalize(path.resolve(val));

        if (fs.existsSync(val)) {
          if (opt_onFileExists) {
            opt_onFileExists(val);
          }

          var content = fs.readFileSync(val).toString();

          try {
            res = JSON.parse(content);
          } catch (ignore) {
            try {
              res = new Function("return " + content)();
            } catch (ignore) {
              delete require["cache"][require["resolve"](val)];
              res = require(val);
            }
          }

          return Object(res || {});
        } else {
          val = old;
        }
      } catch (ignore) {
        val = old;
      }
    }

    try {
      res = JSON.parse(val);
    } catch (ignore) {
      try {
        res = new Function("return " + val)();
      } catch (ignore) {
        res = {};
      }
    }

    return Object(res || {});
  };

  /**
   * Расширить объект a объектом b
   * (глубокое расширение)
   *
   * @param {!Object} a
   * @param {!Object} b
   * @return {!Object}
   */
  function extend(a, b) {
    forIn(b, function (el, key) {
      if (a[key] instanceof Object && el instanceof Object) {
        extend(a[key], el);
      } else {
        a[key] = el;
      }
    });

    return a;
  }

  /**
   * Вернуть объект, расширенный с помощью заданных объектов
   *
   * @param {!Object} base - базовый расширяющий объект
   * @param {Object=} [opt_adv] - дополнительный расширяющий объект
   * @param {Object=} [opt_initial] - объект инициализации
   * @return {!Object}
   */
  function mix(base, opt_adv, opt_initial) {
    var obj = opt_initial || {};

    forIn(opt_adv, function (el, key) {
      obj[key] = el;
    });

    return extend(obj, base);
  }

  function setSSFlag(command) {
    var _this9 = this;
    this.startInlineDir();

    var file = this.info["file"], init = false;

    var root = this.params[0], last = this.params[this.params.length - 1], params = last;

    var cache, parentCache, tplName = this.tplName;

    if (tplName) {
      cache = outputCache[tplName]["flag"] = outputCache[tplName]["flag"] || {};

      if (this.parentTplName) {
        parentCache = outputCache[this.parentTplName] && outputCache[this.parentTplName]["flag"];
      }
    }

    if (last["@root"] || file && last["@file"] !== file || tplName && last["@tplName"] !== tplName) {
      (function () {
        init = true;
        params = {
          "@file": file,
          "@tplName": tplName
        };

        var inherit = function (obj) {
          forIn(obj, function (el, key) {
            if (key.charAt(0) !== "@" && key in root) {
              params[key] = _this9[key] = el;

              if (cache) {
                cache[key] = el;
              }
            }
          });
        };

        inherit(last);
        if (parentCache) {
          inherit(parentCache);
        }

        _this9.params.push(params);
      })();
    }

    var flag, value;

    if (Array.isArray(command)) {
      flag = command[0];
      value = command[1];
    } else {
      var parts = command.split(" ");
      flag = parts[0];

      try {
        value = this.returnEvalVal(parts.slice(1).join(" "));
      } catch (err) {
        return this.error(err.message);
      }
    }

    var includeMap = {
      "language": true,
      "macros": true
    };

    if (flag === "renderAs" && tplName) {
      return this.error("flag \"renderAs\" can't be used in the template declaration");
    }

    if (flag in root) {
      if (includeMap[flag]) {
        value = mix(Snakeskin.toObj(value, file, function (src) {
          var root = _this9.module.root || _this9.module;
          root.key.push([src, require("fs").statSync(src).mtime.valueOf()]);
          _this9.files[src] = true;
        }), init ? params[flag] : null, init ? null : params[flag]);

        if (flag === "macros") {
          try {
            value = this.setMacros(value, null, init);
          } catch (err) {
            return this.error(err.message);
          }
        }
      }

      params[flag] = this[flag] = value;

      if (cache) {
        cache[flag] = value;
      }
    } else if (flag.charAt(0) !== "@") {
      return this.error("unknown compiler flag \"" + flag + "\"");
    }
  }

  Snakeskin.addDirective("setSSFlag", {
    placement: "global",
    group: "define",
    notEmpty: true,
    replacers: {
      "@=": function (cmd) {
        return cmd.replace("@=", "setSSFlag ");
      }
    }
  }, setSSFlag);

  Snakeskin.addDirective("__setSSFlag__", {
    group: "define",
    notEmpty: true,
    replacers: {
      "@=": function (cmd) {
        return cmd.replace("@=", "setSSFlag ");
      }
    }
  }, setSSFlag);
})();


(function () {
  var constNameRgxp = /\[(['"`])(.*?)\1]/g, propAssignRgxp = /[.\[]/;

  Snakeskin.addDirective("const", {
    group: ["inherit", "inlineInherit"]
  }, function (command, commandLength, type) {
    var output = false;

    if (command.slice(-1) === "?") {
      output = true;
      command = command.slice(0, -1);
    }

    var tplName = this.tplName, source = "^[$" + symbols + "_" + (!this.scope.length ? L_MOD : "") + "][$" + w + "[\\].\\s]*=[^=]";

    var rgxp = rgxpCache[source] || new RegExp(source, "i");
    rgxpCache[source] = rgxp;

    if (type === "global" || (!tplName || rgxp.test(command)) && type !== "output") {
      if (tplName && type !== "global") {
        var parts = command.split("="), prop = parts[0] && parts[0].trim();

        if (!parts[1] || !parts[1].trim()) {
          return this.error("invalid \"constant\" declaration");
        }

        var name = this.pasteDangerBlocks(prop);

        if (name.charAt(0) === L_MOD) {
          return this.error("can't declare constant \"" + name.substring(1) + "\" with the context modifier (" + L_MOD + ")");
        }

        name = name.replace(constNameRgxp, ".$2");
        this.startInlineDir("const", {
          name: name
        });

        if (this.isReady()) {
          if (!propAssignRgxp.test(prop)) {
            this.consts.push("var " + prop + ";");
          }

          if (output) {
            this.text = true;
            this.append(this.wrap("" + prop + " = " + this.prepareOutput(parts.slice(1).join("=")) + ";"));
          } else {
            this.append("" + prop + " = " + this.prepareOutput(parts.slice(1).join("="), true) + ";");
          }
        }

        if (this.isAdvTest()) {
          if (constCache[tplName][name]) {
            return this.error("constant \"" + name + "\" is already defined");
          }

          if (this.varCache[tplName][name]) {
            return this.error("constant \"" + name + "\" is already defined as variable");
          }

          if (sysConst[name]) {
            return this.error("can't declare constant \"" + name + "\", try another name");
          }

          var start = this.i - this.startTemplateI;
          var parent = undefined, parentTpl = this.parentTplName;

          if (parentTpl) {
            parent = constCache[parentTpl][name];
          }

          var insideCallBlock = this.hasParentBlock({
            "block": true,
            "proto": true
          }, true);

          if (insideCallBlock && insideCallBlock.name === "block" && !insideCallBlock.params.args) {
            insideCallBlock = false;
          }

          constCache[tplName][name] = {
            from: start - commandLength,
            to: start,
            block: Boolean(insideCallBlock || parentTpl && parent && parent.block),
            needPrfx: this.needPrfx,
            output: output ? "?" : null
          };

          if (!insideCallBlock) {
            fromConstCache[tplName] = start + 1;
          }
        }
      } else {
        this.startInlineDir("global");
        var desc = isAssign(command, true);

        if (!desc) {
          return this.error("invalid \"" + this.name + "\" declaration");
        }

        var mod = G_MOD + G_MOD;

        if (command.charAt(0) !== G_MOD) {
          command = mod + command;
        } else {
          command = command.replace(scopeModRgxp, mod);
        }

        if (output && tplName) {
          this.text = true;
          this.append(this.wrap("" + this.prepareOutput(desc.key, true) + " = " + this.prepareOutput(desc.value) + ";"));
        } else {
          this.save("" + this.prepareOutput(command, true) + ";");
        }
      }
    } else {
      this.startInlineDir("output");
      this.text = true;

      if (!tplName) {
        return this.error("Directive \"" + this.name + "\" can be used only within a " + groupsList["template"].join(", "));
      }

      if (this.isReady()) {
        var desc = isAssign(command);

        if (desc) {
          if (output) {
            this.append(this.wrap("" + this.prepareOutput(desc.key, true) + " = " + this.prepareOutput(desc.value) + ";"));
          } else {
            this.text = false;
            this.append("" + this.prepareOutput(command, true) + ";");
          }

          return;
        }

        this.append(this.wrap(this.prepareOutput(command)));
      }
    }
  });

  Snakeskin.addDirective("output", {
    placement: "template",
    notEmpty: true,
    text: true
  }, function () {
    Snakeskin.Directions["const"].apply(this, arguments);
  });

  Snakeskin.addDirective("global", {
    notEmpty: true
  }, function () {
    Snakeskin.Directions["const"].apply(this, arguments);
  });

  /**
   * Вернуть объект-описание выражения,
   * если в строке идёт присвоение значения переменной или свойству,
   * или false
   *
   * @param {string} str - исходная строка
   * @param {?boolean=} opt_global - если true, то идёт проверка суперглобальной переменной
   * @return {({key: string, value: string}|boolean)}
   */
  function isAssign(str, opt_global) {
    var source = "^[" + G_MOD + "" + L_MOD + "$" + symbols + "_" + (opt_global ? "[" : "") + "]", key = "" + source + "[i";

    var rgxp = rgxpCache[key] || new RegExp(source, "i");
    rgxpCache[key] = rgxp;

    if (!rgxp.test(str)) {
      return false;
    }

    var prop = "";
    var count = 0, eq = false;

    var advEqMap = {
      "+": true,
      "-": true,
      "*": true,
      "/": true,
      "^": true,
      "~": true,
      "|": true,
      "&": true
    };

    var bAdvMap = {
      "<": true,
      ">": true
    };

    for (var i = -1; ++i < str.length;) {
      var el = str.charAt(i);
      prop += el;

      if (bMap[el]) {
        count++;
        continue;
      } else if (closeBMap[el]) {
        count--;
        continue;
      }

      var prev = str.charAt(i - 1), next = str.charAt(i + 1);

      if (!eq && !count && (el === "=" && next !== "=" && prev !== "=" && !advEqMap[prev] && !bAdvMap[prev] || advEqMap[el] && next === "=" || bAdvMap[el] && bAdvMap[next] && str.charAt(i + 2) === "=")) {
        var diff = 1;

        if (advEqMap[el]) {
          diff = 2;
        } else if (bAdvMap[el]) {
          diff = 3;
        }

        return {
          key: prop.slice(0, -1),
          value: str.substring(i + diff)
        };
      }

      eq = el === "=";
    }

    return false;
  }
})();


Snakeskin.addDirective("break", {}, function (command) {
  var combo = this.getGroup("cycle", "async");
  combo["proto"] = true;

  var cycles = this.getGroup("cycle"), async = this.getGroup("async");

  var inside = this.has(combo), insideCallback = this.has(this.getGroup("callback")), insideProto = inside === "proto" || this.proto;

  if (!cycles[inside] && !async[inside] && !insideProto) {
    return this.error("directive \"" + this.name + "\" can be used only with a cycles, \"proto\" or an async series");
  }

  this.startInlineDir();
  if (!this.tolerateWhitespace) {
    this.skipSpace = true;
  }

  if (this.isReady()) {
    if (command === "proto") {
      if (!insideProto) {
        return this.error("proto is not defined");
      }

      if (insideCallback) {
        return this.error("can't break proto inside a callback");
      }

      this.append(this.prepareOutput("break __I_PROTO__;", true));
      return;
    }

    if (cycles[inside]) {
      if (inside === insideCallback) {
        this.append("return false;");
      } else {
        this.append("break;");
      }
    } else if (async[inside]) {
      var val = command ? this.prepareOutput(command, true) : "false";

      if (inside === "waterfall") {
        this.append("return arguments[arguments.length - 1](" + val + ");");
      } else {
        this.append( /* cbws */"if (typeof arguments[0] === 'function') {return arguments[0](" + val + ");}return false;");
      }
    } else {
      this.append(this.prepareOutput("break __I_PROTO__;", true));
    }
  }
});

Snakeskin.addDirective("continue", {}, function (command) {
  var combo = this.getGroup("cycle", "async");
  combo["proto"] = true;

  var cycles = this.getGroup("cycle"), async = this.getGroup("async");

  var inside = this.has(combo), insideCallback = this.has(this.getGroup("callback")), insideProto = inside === "proto" || this.proto;

  if (!cycles[inside] && !async[inside] && !insideProto) {
    return this.error("directive \"" + this.name + "\" can be used only with a cycles, \"proto\" or an async series");
  }

  this.startInlineDir();
  if (!this.tolerateWhitespace) {
    this.skipSpace = true;
  }

  if (this.isReady()) {
    if (command === "proto") {
      if (!insideProto) {
        return this.error("proto is not defined");
      }

      if (insideCallback) {
        return this.error("can't continue proto inside a callback");
      }

      this.append(this.prepareOutput("continue __I_PROTO__;", true));
      return;
    }

    if (cycles[inside]) {
      if (inside === insideCallback) {
        this.append("return;");
      } else {
        this.append("continue;");
      }
    } else if (async[inside]) {
      var val = command ? "null," + this.prepareOutput(command, true) : "";

      if (inside === "waterfall") {
        this.append("return arguments[arguments.length - 1](" + val + ");");
      } else {
        this.append( /* cbws */"if (typeof arguments[0] === 'function') {return arguments[0](" + val + ");}return;");
      }
    } else {
      this.append(this.prepareOutput("continue __I_PROTO__;", true));
    }
  }
});


(function () {
  var varDeclRgxp = /\bvar\b/, splitDeclRgxp = /;/, forRgxp = /\s*(var|)\s+(.*?)\s+(in|of)\s+(.*)/;

  Snakeskin.addDirective("for", {
    block: true,
    notEmpty: true,
    group: "cycle"
  }, function (command) {
    this.startDir();

    if (splitDeclRgxp.test(command)) {
      var parts = command.split(";");

      if (parts.length !== 3) {
        return this.error("invalid \"" + this.name + "\" declaration");
      }

      if (this.isReady()) {
        var decl = varDeclRgxp.test(parts[0]) ? this.multiDeclVar(parts[0].replace(varDeclRgxp, "")) : this.prepareOutput(parts[0], true);

        parts[1] = parts[1] && "(" + parts[1] + ")";
        parts[2] = parts[2] && "(" + parts[2] + ")";

        this.append("for (" + (decl + this.prepareOutput(parts.slice(1).join(";"), true)) + ") {");
      }
    } else {
      var parts = forRgxp.exec(command);

      if (!parts) {
        return this.error("invalid \"" + this.name + "\" declaration");
      }

      if (this.isReady()) {
        var decl = parts[1] ? this.multiDeclVar(parts[2], false, "") : this.prepareOutput(parts[2], true);

        this.append("for (" + decl + " " + parts[3] + " " + this.prepareOutput(parts[4], true) + ") {");
      }
    }
  }, function () {
    this.append("}");
  });

  Snakeskin.addDirective("while", {
    block: true,
    notEmpty: true,
    group: "cycle",
    end: "do"
  }, function (command) {
    if (this.structure.name == "do") {
      this.structure.params.chain = true;

      if (this.isReady()) {
        this.append("} while (" + this.prepareOutput(command, true) + ");");
      }

      Snakeskin.Directions["end"].call(this);
    } else {
      this.startDir();
      if (this.isReady()) {
        this.append("while (" + this.prepareOutput(command, true) + ") {");
      }
    }
  }, function () {
    this.append("}");
  });

  Snakeskin.addDirective("do", {
    block: true,
    group: "cycle",
    after: {
      "while": true,
      "end": true
    }
  }, function () {
    this.startDir();
    this.append("do {");
  }, function () {
    if (!this.structure.params.chain) {
      this.append("} while (true);");
    }
  });

  Snakeskin.addDirective("repeat", {
    block: true,
    group: "cycle",
    after: {
      "until": true,
      "end": true
    }
  }, function () {
    this.startDir();
    this.append("do {");
  }, function () {
    if (!this.structure.params.chain) {
      this.append("} while (true);");
    }
  });

  Snakeskin.addDirective("until", {
    placement: "template",
    notEmpty: true,
    end: "repeat"
  }, function (command) {
    if (this.structure.name !== "repeat") {
      return this.error("directive \"" + this.name + "\" can be used only with a \"repeat\"");
    }

    this.structure.params.chain = true;

    if (this.isReady()) {
      this.append("} while (" + this.prepareOutput(command, true) + ");");
    }

    Snakeskin.Directions["end"].call(this);
  });
})();


Snakeskin.addDirective("data", {
  placement: "template",
  notEmpty: true,
  text: true,
  replacers: {
    "=": function (cmd) {
      return cmd.replace("=", "data ");
    }
  }
}, function (command) {
  this.startInlineDir();
  if (this.isReady()) {
    this.append(this.wrap("'" + this.replaceTplVars(command) + "'"));
  }
});

(function () {
  var declStartRgxp = /^\{+/, declEndRgxp = /\}+$/;

  Snakeskin.addDirective("decl", {
    placement: "template",
    notEmpty: true,
    text: true,
    replacers: {
      "{": function (cmd) {
        return cmd.replace("{", "decl ");
      }
    }
  }, function (command) {
    this.startInlineDir();
    if (this.isReady()) {
      var code = this.replaceTplVars(command);
      var start = declStartRgxp.exec(code) || [""];

      var end = declEndRgxp.exec(code) || [""];

      var add = undefined;
      try {
        add = new Array(end[0].length - start[0].length + 1).join("{");
      } catch (ignore) {
        return this.error("invalid \"" + this.name + "\" declaration");
      }

      this.append(this.wrap("'{" + (add + code) + "}'"));
    }
  });
})();


(function () {
  var types = {
    "html": "<!DOCTYPE html>",
    "xml": "<?xml version=\"1.0\" encoding=\"utf-8\" ?>",
    "transitional": "<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Transitional//EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\">",
    "strict": "<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Strict//EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd\">",
    "frameset": "<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Frameset//EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-frameset.dtd\">",
    "1.1": "<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.1//EN\" \"http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd\">",
    "basic": "<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML Basic 1.1//EN\" \"http://www.w3.org/TR/xhtml-basic/xhtml-basic11.dtd\">",
    "mobile": "<!DOCTYPE html PUBLIC \"-//WAPFORUM//DTD XHTML Mobile 1.2//EN\" \"http://www.openmobilealliance.org/tech/DTD/xhtml-mobile12.dtd\">",
    "mathml 1.0": "<!DOCTYPE math SYSTEM \"http://www.w3.org/Math/DTD/mathml1/mathml.dtd\">",
    "mathml 2.0": "<!DOCTYPE math PUBLIC \"-//W3C//DTD MathML 2.0//EN\" \"http://www.w3.org/Math/DTD/mathml2/mathml2.dtd\">",
    "svg 1.0": "<!DOCTYPE svg PUBLIC \"-//W3C//DTD SVG 1.0//EN\" \"http://www.w3.org/TR/2001/REC-SVG-20010904/DTD/svg10.dtd\">",
    "svg 1.1 full": "<!DOCTYPE svg PUBLIC \"-//W3C//DTD SVG 1.1//EN\" \"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd\">",
    "svg 1.1 basic": "<!DOCTYPE svg PUBLIC \"-//W3C//DTD SVG 1.1 Basic//EN\" \"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11-basic.dtd\">",
    "svg 1.1 tiny": "<!DOCTYPE svg PUBLIC \"-//W3C//DTD SVG 1.1 Tiny//EN\" \"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11-tiny.dtd\">"
  };

  Snakeskin.addDirective("doctype", {
    placement: "template"
  }, function (command) {
    if (this.renderMode === "dom") {
      return this.error("directive \"" + this.name + "\" can't be used with a \"dom\" render mode");
    }

    var type = (command || "html").toLowerCase();

    if (!types[type]) {
      return this.error("invalid doctype");
    }

    this.startInlineDir();

    if (!this.tolerateWhitespace) {
      this.skipSpace = true;
    }

    this.append(this.wrap("'" + types[type] + "'"));
  });
})();


Snakeskin.addDirective("end", {
  replacers: {
    "/": function (cmd) {
      return cmd.replace(/^\//, "end ");
    }
  }
}, function (command) {
  var _this10 = this;
  var struct = this.structure, name = struct.name;

  if (!struct.parent) {
    return this.error("invalid call \"end\"");
  }

  if (command && command !== name) {
    var group = this.getGroup("rootTemplate");
    if (!(this.renderAs && group[name] && group[command])) {
      return this.error("invalid closing directive, expected: \"" + name + "\", declared: \"" + command + "\"");
    }
  }

  if (inside[name]) {
    this.chainSpace = struct.parent.strong;
  }

  var destruct = Snakeskin.Directions["" + name + "End"], isSimpleOutput = this.isSimpleOutput();

  if (destruct) {
    destruct.apply(this, arguments);
  } else if (!struct.sys && isSimpleOutput) {
    this.save("};");
  }

  Snakeskin.Directions["" + name + "BaseEnd"].apply(this, arguments);
  this.endDir();

  struct = this.structure;
  name = struct.name;

  if (this.deferReturn && isSimpleOutput) {
    var async = this.getGroup("async");

    if (this.getGroup("callback")[name]) {
      var parent = struct.parent.name;

      if (async[parent]) {
        var basicAsync = this.getGroup("basicAsync");

        if (basicAsync[name] || basicAsync[parent]) {
          this.save( /* cbws */"if (__RETURN__) {return false;}");
        } else if (parent === "waterfall") {
          this.save( /* cbws */"if (__RETURN__) {return arguments[arguments.length - 1](__RETURN_VAL__);}");
        } else {
          this.save( /* cbws */"if (__RETURN__) {if (typeof arguments[0] === 'function') {return arguments[0](__RETURN_VAL__);}return false;}");
        }

        this.deferReturn = 0;
      } else if (this.deferReturn > 1) {
        this.save( /* cbws */"if (__RETURN__) {return false;}");
      }

      if (this.deferReturn !== 0) {
        this.deferReturn++;
      }
    } else if (!async[name]) {
      this.save( /* cbws */"if (__RETURN__) {return __RETURN_VAL__;}");

      this.deferReturn = 0;
    }
  }

  this.toQueue(function () {
    _this10.startInlineDir();
  });
});

Snakeskin.addDirective("__end__", {
  alias: true
}, function () {
  Snakeskin.Directions["end"].apply(this, arguments);
});


Snakeskin.addDirective("eval", {
  sys: true,
  block: true,
  placement: "global"
}, function () {
  this.startDir(null, {
    from: this.res.length
  });
}, function () {
  var params = this.structure.params;
  params._res = this.res;
  this.res = this.res.substring(0, params.from);
});


Snakeskin.addDirective("head", {
  sys: true,
  block: true,
  placement: "global",
  group: "define"
}, function () {
  this.startDir();
});


var importMap = {
  "root": true,
  "head": true
};

Snakeskin.addDirective("import", {
  notEmpty: true
}, function (command) {
  if (!importMap[this.structure.name]) {
    return this.error("directive \"" + this.name + "\" can be used only within the global space or a \"head\"");
  }

  var parts = command.split("="), obj = parts[0].trim();

  if (parts.length < 2) {
    return this.error("invalid \"" + this.name + "\" declaration");
  }

  this.startInlineDir();
  if (this.module.id === 0) {
    var key = "" + obj + "_00_" + uid;

    this.save( /* cbws */"var " + key + " = __LOCAL__." + key + " = " + this.prepareOutput(parts.slice(1).join("="), true) + ";");

    var _root = this.structure;

    while (_root.name !== "root") {
      _root = _root.parent;
    }

    _root.vars["" + obj + "_00"] = {
      value: "__LOCAL__." + key,
      scope: 0
    };
  }
});


Snakeskin.addDirective("include", {
  notEmpty: true
}, function (command) {
  if (this.tplName || this.hasParent("head")) {
    return this.error("directive \"" + this.name + "\" can't be used within a " + groupsList["template"].join(", ") + " or a \"head\"");
  }

  this.startInlineDir(null, {
    from: this.res.length
  });

  var parts = command.split(" as ");

  if (!parts[0]) {
    return this.error("invalid \"" + this.name + "\" declaration");
  }

  var path = this.prepareOutput(parts[0], true), type = parts[1] ? "'" + parts[1].trim() + "'" : "''";

  if (path !== void 0 && type !== void 0) {
    this.save( /* cbws */"Snakeskin.include('" + escapeBackslash(this.info["file"] || "") + "'," + this.pasteDangerBlocks(path) + ",'" + escapeNextLine(this.lineSeparator) + "'," + type + ");");
  }
}, function () {
  if (this.hasParent("eval")) {
    return;
  }

  this.res = this.res.substring(0, this.structure.params.from);
});

Snakeskin.addDirective("__setFile__", {}, function (command) {
  command = this.pasteDangerBlocks(command);

  var module = {
    exports: {},
    require: require,

    id: this.module.id + 1,
    key: null,

    filename: command,
    parent: this.module,
    root: this.module.root || this.module,

    children: [],
    loaded: true
  };

  module.root.key.push([command, require("fs").statSync(command).mtime.valueOf()]);

  this.module.children.push(module);
  this.module = module;

  this.info["file"] = command;
  this.files[command] = true;

  this.save(this.multiDeclVar("$_"));
});

Snakeskin.addDirective("__endSetFile__", {}, function () {
  var file = this.module.filename;

  this.module = this.module.parent;
  this.info["file"] = this.module.filename;

  if (this.params[this.params.length - 1]["@file"] === file) {
    this.popParams();
  }
});


(function () {
  var $COverloadRgxp = /=>>/g;

  Snakeskin.addDirective("forEach", {
    block: true,
    notEmpty: true,
    group: ["cycle", "callback", "inlineIterator"]
  }, function (command) {
    var _this11 = this;
    command = command.replace($COverloadRgxp, "=>=>");
    var parts = command.split("=>"), obj = parts[0];

    if (!parts.length || parts.length > (this.inlineIterators ? 2 : 3)) {
      return this.error("invalid \"" + this.name + "\" declaration");
    }

    this.startDir(parts.length === 3 ? "$forEach" : null, {
      params: parts[2] ? parts[1] : null
    });

    if (this.isReady()) {
      var _ret8 = (function () {
        if (!_this11.inlineIterators) {
          if (parts.length === 3) {
            _this11.append( /* cbws */"" + _this11.prepareOutput("$C(" + parts[0] + ")", true) + ".forEach(function (" + _this11.declCallbackArgs(parts) + ") {" + _this11.declArguments() + "");
          } else {
            _this11.append( /* cbws */"Snakeskin.forEach(" + _this11.prepareOutput(parts[0], true) + ",function (" + _this11.declCallbackArgs(parts[1]) + ") {" + _this11.declArguments() + "");
          }

          return {
            v: undefined
          };
        }

        var tmpObj = _this11.multiDeclVar("__I_OBJ__ = " + obj), cacheObj = _this11.prepareOutput("__I_OBJ__", true);

        var objLength = _this11.multiDeclVar("__KEYS__ = Object.keys ? Object.keys(__I_OBJ__) : null"), _keys = _this11.prepareOutput("__KEYS__", true);

        var args = parts[1] ? parts[1].trim().split(",") : [];

        if (args.length >= 6) {
          objLength += /* cbws */"" + _this11.multiDeclVar("__LENGTH__ = __KEYS__ ? __KEYS__.length : 0") + "if (!" + _keys + ") {" + _this11.multiDeclVar("__LENGTH__ = 0") + "for (" + _this11.multiDeclVar("__KEY__", false) + " in " + cacheObj + ") {if (!" + cacheObj + ".hasOwnProperty(" + _this11.prepareOutput("__KEY__", true) + ")) {continue;}" + _this11.prepareOutput("__LENGTH__++;", true) + "}}";
        }

        var resStr = /* cbws */"" + tmpObj + "if (" + cacheObj + ") {if (Array.isArray(" + cacheObj + ")) {" + _this11.multiDeclVar("__LENGTH__ =  __I_OBJ__.length") + "for (" + (_this11.multiDeclVar("__I__ = -1") + _this11.prepareOutput("++__I__ < __LENGTH__;", true)) + ") {";

        resStr += (function () {
          var str = "";

          for (var i = -1; ++i < args.length;) {
            var tmp = args[i];

            switch (i) {
              case 0:
                tmp += " = __I_OBJ__[__I__]";
                break;

              case 1:
                tmp += " = __I__";
                break;

              case 2:
                tmp += " = __I_OBJ__";
                break;

              case 3:
                tmp += " = __I__ === 0";
                break;

              case 4:
                tmp += " = __I__ === __LENGTH__ - 1";
                break;

              case 5:
                tmp += " = __LENGTH__";
                break;
            }

            str += _this11.multiDeclVar(tmp);
          }

          return str;
        })();

        var end = /* cbws */"} else {" + objLength + "if (" + _keys + ") {" + _this11.multiDeclVar("__LENGTH__ = __KEYS__.length") + "for (" + (_this11.multiDeclVar("__I__ = -1") + _this11.prepareOutput("++__I__ < __LENGTH__;", true)) + ") {";

        end += (function () {
          var str = "";

          for (var i = -1; ++i < args.length;) {
            var tmp = args[i];

            switch (i) {
              case 0:
                tmp += " = __I_OBJ__[__KEYS__[__I__]]";
                break;

              case 1:
                tmp += " = __KEYS__[__I__]";
                break;

              case 2:
                tmp += " = __I_OBJ__";
                break;

              case 3:
                tmp += " = __I__";
                break;

              case 4:
                tmp += " = __I__ === 0";
                break;

              case 5:
                tmp += " = __I__ === __LENGTH__ - 1";
                break;

              case 6:
                tmp += " = __LENGTH__";
                break;
            }

            str += _this11.multiDeclVar(tmp);
          }

          return str;
        })();

        var oldEnd = /* cbws */"} else {" + _this11.multiDeclVar("__I__ = -1") + "for (" + _this11.multiDeclVar("__KEY__", false) + " in " + cacheObj + ") {if (!" + cacheObj + ".hasOwnProperty(" + _this11.prepareOutput("__KEY__", true) + ")) {continue;}" + _this11.prepareOutput("__I__++;", true) + "";

        oldEnd += (function () {
          var str = "";

          for (var i = -1; ++i < args.length;) {
            var tmp = args[i];

            switch (i) {
              case 0:
                tmp += " = __I_OBJ__[__KEY__]";
                break;

              case 1:
                tmp += " = __KEY__";
                break;

              case 2:
                tmp += " = __I_OBJ__";
                break;

              case 3:
                tmp += " = __I__";
                break;

              case 4:
                tmp += " = __I__ === 0";
                break;

              case 5:
                tmp += " = __I__ === __LENGTH__ - 1";
                break;

              case 6:
                tmp += " = __LENGTH__";
                break;
            }

            str += _this11.multiDeclVar(tmp);
          }

          return str;
        })();

        _this11.append(resStr);
        _this11.structure.params = {
          from: _this11.res.length,
          end: end,
          oldEnd: oldEnd
        };
      })();

      if (typeof _ret8 === "object") return _ret8.v;
    }
  }, function () {
    if (this.isReady()) {
      var params = this.structure.params;

      if (this.inlineIterators) {
        var part = this.res.substring(params.from);

        this.append("} " + (params.end + part) + " } " + (params.oldEnd + part) + " }}}}");
      } else {
        if (params.params) {
          this.append("}, " + this.prepareOutput(params.params, true) + ");");
        } else {
          this.append("});");
        }
      }
    }
  });

  Snakeskin.addDirective("$forEach", {
    block: true,
    notEmpty: true,
    group: ["cycle", "callback", "selfThis"]
  }, function (command) {
    var parts = command.split("=>");

    if (!parts.length || parts.length > 3) {
      return this.error("invalid \"" + this.name + "\" declaration");
    }

    this.startDir(null, {
      params: parts[2] ? parts[1] : null
    });

    if (this.isReady()) {
      this.append( /* cbws */"" + this.prepareOutput("$C(" + parts[0] + ")", true) + ".forEach(function (" + this.declCallbackArgs(parts) + ") {" + this.declArguments() + "");
    }
  }, function () {
    if (this.isReady()) {
      var params = this.structure.params.params;

      if (params) {
        this.append("}, " + this.prepareOutput(params, true) + ");");
      } else {
        this.append("});");
      }
    }
  });

  Snakeskin.addDirective("forIn", {
    block: true,
    notEmpty: true,
    group: ["cycle", "callback", "inlineIterator"]
  }, function (command) {
    var _this12 = this;
    var parts = command.split("=>"), obj = parts[0];

    if (!parts.length || parts.length > 2) {
      return this.error("invalid \"" + this.name + "\" declaration");
    }

    this.startDir();
    if (this.isReady()) {
      var _ret9 = (function () {
        if (!_this12.inlineIterators) {
          _this12.append( /* cbws */"Snakeskin.forIn(" + _this12.prepareOutput(parts[0], true) + ",function (" + _this12.declCallbackArgs(parts[1]) + ") {" + _this12.declArguments() + "");

          return {
            v: undefined
          };
        }

        var objLength = "";
        var args = parts[1] ? parts[1].trim().split(",") : [];

        var tmpObj = _this12.multiDeclVar("__I_OBJ__ = " + obj), cacheObj = _this12.prepareOutput("__I_OBJ__", true);

        if (args.length >= 6) {
          objLength += /* cbws */"" + _this12.multiDeclVar("__LENGTH__ = 0") + "for (" + _this12.multiDeclVar("key", false) + " in " + cacheObj + ") {" + _this12.prepareOutput("__LENGTH__++;", true) + "}";
        }

        var resStr = /* cbws */"" + tmpObj + "if (" + cacheObj + ") {" + objLength + "" + _this12.multiDeclVar("__I__ = -1") + "for (" + _this12.multiDeclVar("__KEY__", false) + " in " + cacheObj + ") {" + _this12.prepareOutput("__I__++;", true) + "";

        resStr += (function () {
          var str = "";

          for (var i = -1; ++i < args.length;) {
            var tmp = args[i];

            switch (i) {
              case 0:
                tmp += " = __I_OBJ__[__KEY__]";
                break;

              case 1:
                tmp += " = __KEY__";
                break;

              case 2:
                tmp += " = __I_OBJ__";
                break;

              case 3:
                tmp += " = __I__";
                break;

              case 4:
                tmp += " = __I__ === 0";
                break;

              case 5:
                tmp += " = __I__ === __LENGTH__ - 1";
                break;

              case 6:
                tmp += " = __LENGTH__";
                break;
            }

            str += _this12.multiDeclVar(tmp);
          }

          return str;
        })();

        _this12.append(resStr);
      })();

      if (typeof _ret9 === "object") return _ret9.v;
    }
  }, function () {
    if (this.isReady()) {
      this.append(this.inlineIterators ? "}}" : "});");
    }
  });
})();


(function () {
  var types = {
    "css": {
      "type": "text/css",
      "rel": "stylesheet"
    },

    "acss": {
      "type": "text/css",
      "rel": "alternate stylesheet"
    }
  };

  var typesStr = {
    dom: {},

    string: {}
  };

  forIn(types, function (el, key) {
    forIn(el, function (el, attr) {
      typesStr.dom[key] = typesStr.dom[key] || "";
      typesStr.dom[key] += "__NODE__." + attr + " = '" + el + "';";
      typesStr.string[key] = typesStr.string[key] || "";
      typesStr.string[key] += " " + attr + "=\"" + el + "\"";
    });
  });

  Snakeskin.addDirective("link", {
    placement: "template",
    block: true,
    selfInclude: false
  }, function (command) {
    this.startDir();
    this.skipSpace = true;

    if (this.autoReplace) {
      this.autoReplace = false;
      this.structure.params.autoReplace = true;
    }

    if (this.isReady()) {
      if (command) {
        command = command.replace(emptyCommandParamsRgxp, "css $1");
      } else {
        command = "css";
      }

      var parts = splitBySpace(command), type = parts[0], dom = !this.domComment && this.renderMode === "dom";

      var str = undefined;
      if (dom) {
        str = /* cbws */"__NODE__ = document.createElement('link');" + (typesStr.dom[type.toLowerCase()] || "") + "" + this.wrap("__NODE__") + "__RESULT__.push(__NODE__);";
      } else {
        str = this.wrap("'<link " + (typesStr.string[type] || this.replaceTplVars(type)).trim() + "'");
      }

      this.append(str);

      if (parts.length > 1) {
        /** @type {!Array} */
        var args = _.any([].slice.call(arguments));

        args[0] = parts.slice(1).join(" ");
        args[1] = args[0].length;

        Snakeskin.Directions["attr"].apply(this, args);
        this.inline = false;
      }

      if (dom) {
        str = "__NODE__.href =";
      } else {
        str = this.wrap("' href=\"'");
      }

      this.append(str);
    }
  }, function () {
    if (!this.tolerateWhitespace) {
      this.skipSpace = true;
    }

    if (this.structure.params.autoReplace) {
      this.autoReplace = true;
    }

    var str = undefined;

    if (!this.domComment && this.renderMode === "dom") {
      str = /* cbws */"__RESULT__.pop();__NODE__ = null;";
    } else {
      str = this.wrap("'\"" + (this.doctype === "xml" ? "/" : "") + ">'");
    }

    this.append(str);
  });
})();


Snakeskin.addDirective("if", {
  block: true,
  notEmpty: true,
  group: "if"
}, function (command) {
  this.startDir();
  if (this.isReady()) {
    this.append("if (" + this.prepareOutput(command, true) + ") {");
  }
}, function () {
  this.append("}");
});

Snakeskin.addDirective("unless", {
  block: true,
  notEmpty: true,
  group: "if"
}, function (command) {
  this.startDir();
  if (this.isReady()) {
    this.append("if (!(" + this.prepareOutput(command, true) + ")) {");
  }
}, function () {
  this.append("}");
});

Snakeskin.addDirective("elseIf", {
  notEmpty: true,
  chain: ["if", "unless"]
}, function (command) {
  if (!this.getGroup("if")[this.structure.name]) {
    return this.error("directive \"" + this.name + "\" can be used only with a " + groupsList["if"].join(", "));
  }

  if (this.isReady()) {
    this.append("} else if (" + this.prepareOutput(command, true) + ") {");
  }
});

Snakeskin.addDirective("elseUnless", {
  notEmpty: true,
  chain: ["if", "unless"]
}, function (command) {
  if (!this.getGroup("if")[this.structure.name]) {
    return this.error("directive \"" + this.name + "\" can be used only with a " + groupsList["if"].join(", "));
  }

  if (this.isReady()) {
    this.append("} else if (!(" + this.prepareOutput(command, true) + ")) {");
  }
});

Snakeskin.addDirective("else", {
  chain: ["if", "unless"]
}, function (command) {
  if (!this.getGroup("if")[this.structure.name]) {
    return this.error("directive \"" + this.name + "\" can be used only with a " + groupsList["if"].join(", "));
  }

  if (command) {
    var parts = command.split(" "), unless = parts[0] === "unless" ? "!" : "";

    if (unless || parts[0] === "if") {
      parts = parts.slice(1);
    }

    this.append("} else if (" + unless + "(" + this.prepareOutput(parts.join(" "), true) + ")) {");
  } else {
    this.append("} else {");
  }
});

Snakeskin.addDirective("switch", {
  block: true,
  notEmpty: true,
  inside: {
    "case": true,
    "default": true
  }
}, function (command) {
  this.startDir();
  if (this.isReady()) {
    this.append("switch (" + this.prepareOutput(command, true) + ") {");
  }
}, function () {
  this.append("}");
});

Snakeskin.addDirective("case", {
  block: true,
  notEmpty: true,
  replacers: {
    ">": function (cmd) {
      return cmd.replace(">", "case ");
    },
    "/>": function (cmd) {
      return cmd.replace("/>", "end case");
    }
  }
}, function (command) {
  this.startDir();

  if (this.structure.parent.name !== "switch") {
    return this.error("directive \"" + this.name + "\" can be used only within a \"switch\"");
  }

  if (this.isReady()) {
    this.append("case " + this.prepareOutput(command, true) + ": {");
  }
}, function () {
  this.append("} break;");
});

Snakeskin.addDirective("default", {
  block: true
}, function () {
  this.startDir();

  if (this.structure.parent.name !== "switch") {
    return this.error("directive \"" + this.name + "\" can be used only within a \"switch\"");
  }

  this.append("default: {");
}, function () {
  this.append("}");
});


Snakeskin.addDirective("plain", {
  sys: true,
  placement: "template",
  block: true,
  selfInclude: false
}, function () {
  this.startDir();

  if (this.autoReplace) {
    this.autoReplace = false;
    this.structure.params.enabled = true;
  }
}, function () {
  if (this.structure.params.enabled) {
    this.autoReplace = true;
  }
});


Snakeskin.addDirective("__setError__", {}, function (command) {
  this.error(this.pasteDangerBlocks(command));
});

Snakeskin.addDirective("__appendLine__", {
  group: "ignore"
}, function (command) {
  if (!this.structure.parent) {
    return this.error("directive \"cdata\" only be used only within a " + groupsList["template"].join(", "));
  }

  this.startInlineDir("cdata");
  this.isSimpleOutput();

  var val = parseInt(command, 10), line = this.info["line"];

  this.info["line"] += val;
  if (!this.proto) {
    for (var i = -1; ++i < val;) {
      this.lines[line + i] = "";
    }
  }
});

Snakeskin.addDirective("__setLine__", {
  group: "ignore"
}, function (command) {
  this.startInlineDir();
  if (!this.freezeLine) {
    this.info["line"] = parseInt(command, 10);
  }
});

Snakeskin.addDirective("__cutLine__", {
  group: "ignore"
}, function () {
  this.startInlineDir();
  if (!this.freezeLine) {
    this.lines.pop();
    this.info["line"]--;
  }
});

Snakeskin.addDirective("__sp__", {
  group: "ignore",
  text: true
}, function () {
  this.startInlineDir();
});

Snakeskin.addDirective("__switchLine__", {
  group: "ignore"
}, function (command) {
  var val = parseInt(command, 10);

  this.startDir(null, {
    line: this.info["line"]
  });

  if (!this.freezeLine) {
    this.info["line"] = val;
  }
}, function () {
  if (!this.freezeLine) {
    var length = this.info["line"] = this.structure.params.line;

    for (var i = this.lines.length - 1; ++i < length;) {
      this.lines.push("");
    }
  }
});


/**
 * Если true, то значит идёт декларация прототипа
 * @type {boolean}
 */
DirObj.prototype.protoStart = false;

/**
 * Индекс анонимных прототипов
 * @type {number}
 */
DirObj.prototype.anonI = 0;

/**
 * Вернуть строку декларации заданных аргументов прототипа
 *
 * @param {!Array.<!Array>} protoArgs - массив аргументов прототипа [название, значение по умолчанию]
 * @param {!Array} args - массив заданных аргументов
 * @return {string}
 */
DirObj.prototype.returnProtoArgs = function (protoArgs, args) {
  var tmp = [];
  var str = "", length = protoArgs.length;

  for (var i = -1; ++i < length;) {
    var val = this.prepareOutput(args[i] || "void 0", true);

    var arg = protoArgs[i][0], def = protoArgs[i][1];

    if (def !== void 0) {
      def = this.prepareOutput(def, true);
    }

    arg = arg.replace(scopeModRgxp, "");

    if (protoArgs["__SNAKESKIN_TMP__needArgs"] && i === length - 1) {
      if (length - 1 < args.length) {
        tmp = tmp.concat(args.slice(length - 1, args.length));
      }

      str += /* cbws */"var " + arg + " = [" + tmp.join() + "];" + arg + ".callee = __CALLEE__;";
    } else {
      tmp.push(arg);
      str += /* cbws */"var " + arg + " = " + (def !== void 0 ? val ? "" + val + " != null ? " + val + " : " + this.prepareOutput(def, true) : def : val || "void 0") + ";";
    }
  }

  return str;
};

var anonRgxp = /^__ANONYMOUS__/, callProtoRgxp = /=>/;

Snakeskin.addDirective("proto", {
  sys: true,
  block: true,
  notEmpty: true,
  group: ["template", "define", "inherit", "blockInherit"]
}, function (command, commandLength) {
  var name = this.getFnName(command, true), tplName = this.tplName;

  if (!name) {
    if (!tplName || !callProtoRgxp.test(command)) {
      return this.error("invalid \"" + this.name + "\" name");
    }

    name = "__ANONYMOUS__" + this.anonI;
    this.anonI++;

    var tmpLength = command.length;
    command = name + this.source.substring(this.i - tmpLength, this.i);
    commandLength += name.length;

    this.source = this.source.substring(0, this.i - tmpLength) + name + this.source.substring(this.i - tmpLength);

    this.i += name.length;
  }

  var parts = name.split("->");

  if (parts[1]) {
    name = parts[1].trim();

    if (!tplName) {
      if (this.structure.parent) {
        this.error("directive \"outer proto\" can be used only within the global space");
        return;
      }

      try {
        tplName = this.tplName = this.prepareNameDecl(parts[0]);
      } catch (err) {
        return this.error(err.message);
      }

      if (tplName in extMap) {
        delete extMap[tplName];
        clearScopeCache(tplName);
      }

      var desc = this.preDefs[tplName] = this.preDefs[tplName] || {
        text: ""
      };

      desc.startLine = this.info["line"];
      desc.i = this.i + 1;

      this.outerLink = name;
    }
  } else if (!this.outerLink && !this.tplName) {
    return this.error("directive \"" + this.name + "\" can be used only within a " + groupsList["template"].join(", "));
  }

  if (!name || !tplName || callBlockNameRgxp.test(name)) {
    return this.error("invalid \"" + this.name + "\" declaration");
  }

  var scope = scopeCache[this.name][tplName] = scopeCache[this.name][tplName] || {};

  var parentScope, parentTplName = extMap[tplName];

  if (parentTplName) {
    parentScope = scopeCache[this.name][parentTplName] = scopeCache[this.name][parentTplName] || {};
  }

  var current = scope[name];
  if (!scope[name]) {
    current = scope[name] = {
      id: this.module.id,
      children: {}
    };
  }

  if (!this.outerLink && !current.root) {
    var parent = parentScope && parentScope[name];

    current.parent = parent;
    current.overridden = Boolean(parentTplName && this.parentTplName);
    current.root = parent ? parent.root : scope[name];

    if (parent) {
      parent.children[tplName] = scope[name];
    }
  }

  var start = this.i - this.startTemplateI;
  this.startDir(null, {
    name: name,
    startTemplateI: this.i + 1,
    from: this.i - this.getDiff(commandLength),
    fromBody: start + 1,
    line: this.info["line"],
    sysSpace: this.sysSpace,
    strongSpace: this.strongSpace,
    chainSpace: this.chainSpace,
    space: this.space
  });

  if (this.isAdvTest()) {
    var dir = String(this.name);

    if (protoCache[tplName][name] && !anonRgxp.test(name)) {
      return this.error("proto \"" + name + "\" is already defined");
    }

    var output = command.split("=>")[1], ouptupCache = this.getBlockOutput(dir);

    if (output != null) {
      ouptupCache[name] = output;
    }

    var args = this.prepareArgs(command, dir, null, this.parentTplName, name);

    protoCache[tplName][name] = {
      length: commandLength,
      from: start - this.getDiff(commandLength),
      args: args.list,
      scope: args.scope,
      calls: {},
      needPrfx: this.needPrfx,
      output: output
    };
  }

  if (!this.parentTplName) {
    this.protoStart = true;
  }
}, function (command, commandLength) {
  var tplName = this.tplName, struct = this.structure;

  var vars = struct.vars, params = struct.params, name = params.name, diff = this.getDiff(commandLength);

  var s = (this.needPrfx ? ADV_LEFT_BLOCK : "") + LEFT_BLOCK, e = RIGHT_BLOCK;

  var space = this.space, nl = this.lineSeparator;

  this.sysSpace = params.sysSpace;
  this.strongSpace = params.strongSpace;
  this.chainSpace = params.chainSpace;
  this.space = params.space;

  if (this.outerLink === name) {
    var obj = this.preDefs[tplName], i = Number(obj.i);

    obj.text += /* cbws */"" + nl + "" + this.source.substring(params.from, i) + "" + s + "__cutLine__" + e + "" + s + "__switchLine__ " + obj.startLine + "" + e + "" + this.source.substring(i, this.i - diff) + "" + s + "__end__" + e + "" + nl + "" + this.source.substring(this.i - diff, this.i + 1) + "" + s + "__cutLine__" + e + "";

    this.outerLink = null;
    this.tplName = null;

    if (!this.hasParentBlock("proto")) {
      this.protoStart = false;
    }
  } else if (!this.outerLink) {
    var proto = protoCache[tplName][name], start = this.i - this.startTemplateI;

    if (this.isAdvTest()) {
      var scope = proto.scope;

      proto.to = start + 1;
      proto.content = this.source.substring(this.startTemplateI).substring(params.fromBody, start - diff);

      fromProtoCache[tplName] = this.i - this.startTemplateI + 1;

      // Рекурсивно анализируем прототипы блоков
      proto.body = Snakeskin.compile(("" + s + "template " + tplName + "()" + e + (scope ? "" + s + "with " + scope + "" + e : "") + ("" + s + "var __I_PROTO__ = 1" + e) + ("" + s + "__protoWhile__ __I_PROTO__--" + e) + ("" + s + "__setLine__ " + params.line + "" + e) + this.source.substring(params.startTemplateI, this.i - diff) + ("" + s + "__end__" + e) + (scope ? "" + s + "end" + e : "") + ("" + s + "end" + e)).trim(), {
        inlineIterators: this.inlineIterators,
        renderMode: this.renderMode,
        replaceUndef: this.replaceUndef,
        escapeOutput: this.escapeOutput,
        doctype: this.doctype,
        autoReplace: this.autoReplace,
        macros: this.macros,
        language: this.language,
        localization: this.localization,
        lineSeparator: this.lineSeparator,
        tolerateWhitespace: this.tolerateWhitespace,
        throws: this.throws
      }, null, {
        parent: this,
        lines: this.lines.slice(),
        needPrfx: this.needPrfx,
        scope: this.scope.slice(),
        vars: struct.vars,
        consts: this.consts,
        proto: {
          name: name,
          recursive: params.recursive,
          parentTplName: this.parentTplName,
          pos: this.res.length,
          ctx: this,
          sysSpace: this.sysSpace,
          strongSpace: this.strongSpace,
          chainSpace: this.chainSpace,
          space: this.space
        }
      });
    }

    // Применение обратных прототипов
    var back = this.backTable[name];
    if (back && !back.protoStart) {
      var args = proto.args, fin = true;

      for (var i = -1; ++i < back.length;) {
        var el = back[i];

        if (this.canWrite) {
          if (!el.outer) {
            this.res = this.res.substring(0, el.pos) + this.returnProtoArgs(args, el.args) + protoCache[tplName][name].body + this.res.substring(el.pos);
          } else {
            struct.vars = el.vars;
            el.argsStr = this.returnProtoArgs(args, el.args);
            struct.vars = vars;
            fin = false;
          }
        }
      }

      if (fin) {
        delete this.backTable[name];
        this.backTableI--;
      }
    }

    if (this.protoStart && !this.outerLink && !this.hasParentBlock("proto")) {
      this.protoStart = false;
    }

    if (proto) {
      var ouptupCache = this.getBlockOutput("proto");
      if (ouptupCache[name] != null && this.isSimpleOutput()) {
        struct.vars = struct.parent.vars;

        this.save(this.returnProtoArgs(proto.args, this.getFnArgs("(" + ouptupCache[name] + ")")) + proto.body);

        struct.vars = vars;
      }

      this.text = !space;
    }
  }
});

/**
 * Таблица обратных вызовов прототипа
 */
DirObj.prototype.backTable = {
  init: function init() {
    return {};
  }
};

/**
 * Количество обратных вызовов прототипа
 * (когда apply до декларации вызываемого прототипа)
 * @type {number}
 */
DirObj.prototype.backTableI = 0;

Snakeskin.addDirective("apply", {
  placement: "template",
  notEmpty: true,
  text: true,
  replacers: {
    "+=": function (cmd) {
      return cmd.replace("+=", "apply ");
    }
  }
}, function (command) {
  this.startInlineDir();
  if (this.isSimpleOutput()) {
    var tplName = this.tplName;
    var name = this.getFnName(command), args = this.getFnArgs(command);

    if (name === "&" && this.proto) {
      name = this.proto.name;
    }

    var _cache2 = protoCache[tplName];
    var proto = _cache2[name], argsStr = "";

    if (proto) {
      argsStr = this.returnProtoArgs(proto.args, args);
    }

    var selfProto = this.proto;
    if (selfProto && proto && proto.calls[selfProto.name]) {
      return this.error("invalid form of recursion for the proto (apply \"" + name + "\" inside \"" + selfProto.name + "\")");
    }

    // Рекурсивный вызов прототипа
    if (selfProto && selfProto.name === name) {
      this.save(argsStr + this.prepareOutput("__I_PROTO__++", true) + ";");

      // Попытка применить не объявленный прототип
      // (запоминаем место вызова, чтобы вернуться к нему,
      //     когда прототип будет объявлен)
    } else if (!proto || !proto.body) {
      var back = this.backTable;

      if (!back[name]) {
        back[name] = [];
        back[name].protoStart = this.protoStart;
        this.backTableI++;
      }

      var rand = Math.random().toString(), key = "" + tplName.replace(/([.\[])/g, "\\$1") + "_" + name + "_" + rand.replace(".", "\\.");

      back[name].push({
        proto: selfProto ? _cache2[selfProto.name] : null,

        pos: this.res.length,
        label: new RegExp("\\/\\* __APPLY__" + key + " \\*\\/"),

        args: args,
        recursive: Boolean(proto)
      });

      this.save("/* __APPLY__" + tplName + "_" + name + "_" + rand + " */");

      if (selfProto && !proto) {
        _cache2[selfProto.name].calls[name] = true;
      }
    } else {
      this.save(argsStr + proto.body);
    }
  }
});

Snakeskin.addDirective("__protoWhile__", {}, function (command) {
  this.startDir();
  if (this.isSimpleOutput()) {
    var i = this.prepareOutput("__I_PROTO__", true);
    protoCache[this.tplName][this.proto.name].i = i;
    this.save("" + i + ":while (" + this.prepareOutput(command, true) + ") {");
  }
}, function () {
  if (this.isSimpleOutput()) {
    this.save("}");
  }
});


/**
 * Количество отложенных return
 * @type {number}
 */
DirObj.prototype.deferReturn = 0;

Snakeskin.addDirective("return", {
  placement: "template"
}, function (command) {
  this.startInlineDir();
  if (!this.tolerateWhitespace) {
    this.skipSpace = true;
  }

  if (this.isReady()) {
    var cb = this.hasParent(this.getGroup("callback"));
    var val = command ? this.prepareOutput(command, true) : this.returnResult();

    if (cb) {
      var str = "";
      var def = /* cbws */"__RETURN__ = true;__RETURN_VAL__ = " + val + ";";

      var asyncParent = undefined;
      if (cb === "callback") {
        asyncParent = this.hasParent(this.getGroup("async"));
      }

      if (asyncParent) {
        if (this.getGroup("Async")[asyncParent]) {
          str += def;

          if (asyncParent === "waterfall") {
            str += "return arguments[arguments.length - 1](__RETURN_VAL__);";
          } else {
            str += /* cbws */"if (typeof arguments[0] === 'function') {return arguments[0](__RETURN_VAL__);}return false;";
          }
        } else {
          str += "return false;";
        }
      } else {
        if (!this.getGroup("basicAsync")[cb]) {
          str += /* cbws */"__RETURN__ = true;__RETURN_VAL__ = " + val + ";";
        }

        str += "return false;";
        this.deferReturn = cb !== "final" ? 1 : 0;
      }

      this.append(str);
    } else {
      this.append("return " + val + ";");
    }
  }
});


(function () {
  var types = {
    "js": "text/javascript",
    "dart": "application/dart",
    "coffee": "application/coffeescript",
    "ts": "application/typescript",
    "cljs": "application/clojurescript",
    "ls": "application/livescript",
    "json": "application/json",
    "html": "text/html"
  };

  Snakeskin.addDirective("script", {
    placement: "template",
    block: true,
    selfInclude: false
  }, function (command) {
    this.startDir();

    if (!this.tolerateWhitespace) {
      this.skipSpace = true;
    }

    if (this.autoReplace) {
      this.autoReplace = false;
      this.structure.params.autoReplace = true;
    }

    if (this.isReady()) {
      if (command) {
        command = command.replace(emptyCommandParamsRgxp, "js $1");
      } else {
        command = "js";
      }

      var parts = splitBySpace(command), type = parts[0], dom = !this.domComment && this.renderMode === "dom";

      var str = undefined, desc = types[type.toLowerCase()] || this.replaceTplVars(type);

      if (dom) {
        str = /* cbws */"__NODE__ = document.createElement('script');__NODE__.type = '" + desc + "';";
      } else {
        str = this.wrap("'<script type=\"" + desc + "\"'");
      }

      this.append(str);

      if (parts.length > 1) {
        /** @type {!Array} */
        var args = _.any([].slice.call(arguments));

        args[0] = parts.slice(1).join(" ");
        args[1] = args[0].length;

        Snakeskin.Directions["attr"].apply(this, args);
        this.inline = false;
      }

      if (dom) {
        str = this.returnPushNodeDecl();
      } else {
        str = this.wrap("'>'");
      }

      this.append(str);
    }
  }, function () {
    if (!this.tolerateWhitespace) {
      this.skipSpace = true;
    }

    if (this.structure.params.autoReplace) {
      this.autoReplace = true;
    }

    var str = undefined;

    if (!this.domComment && this.renderMode === "dom") {
      str = "__RESULT__.pop();";
    } else {
      str = this.wrap("'</script>'");
    }

    this.append(str);
  });
})();


Snakeskin.addDirective("set", {
  notEmpty: true
}, function (command) {
  this.startInlineDir();

  if (!this.getGroup("rootTemplate")[this.structure.parent.name]) {
    return this.error("directive \"" + this.name + "\" can be used only within the top level of template");
  }

  var parts = command.split(" ");

  if (parts.length < 2) {
    return this.error("invalid \"" + this.name + "\" declaration");
  }

  if (parts[0] === "&") {
    this.bemRef = this.replaceTplVars(parts.slice(1).join(" "));
  }
});


Snakeskin.addDirective("ignoreWhitespaces", {
  placement: "template",
  replacers: {
    "&": function (cmd) {
      return cmd.replace("&", "ignoreWhitespaces ");
    }
  }
}, function () {
  this.startInlineDir();
  this.space = true;
  this.prevSpace = true;
});

Snakeskin.addDirective("ignoreAllWhitespaces", {
  placement: "template",
  replacers: {
    "&+": function (cmd) {
      return cmd.replace("&+", "ignoreAllWhitespaces ");
    }
  }
}, function () {
  this.startInlineDir();
  this.strongSpace++;
});

Snakeskin.addDirective("unIgnoreAllWhitespaces", {
  placement: "template",
  replacers: {
    "&-": function (cmd) {
      return cmd.replace("&-", "unIgnoreAllWhitespaces ");
    }
  }
}, function () {
  this.startInlineDir();

  if (this.strongSpace) {
    this.strongSpace--;

    if (!this.strongSpace) {
      this.space = false;
    }
  }
});

Snakeskin.addDirective("__&+__", {
  group: "ignore"
}, function () {
  this.startInlineDir();
  if (!this.tolerateWhitespace) {
    this.sysSpace = true;
  }
});

Snakeskin.addDirective("__&-__", {
  group: "ignore"
}, function () {
  this.startInlineDir();
  if (!this.tolerateWhitespace) {
    this.sysSpace = false;
  }
});

Snakeskin.addDirective("sp", {
  text: true
}, function () {
  this.startInlineDir();
});


(function () {
  var types = {
    "css": "text/css"
  };

  Snakeskin.addDirective("style", {
    placement: "template",
    block: true,
    selfInclude: false
  }, function (command) {
    this.startDir();

    if (!this.tolerateWhitespace) {
      this.skipSpace = true;
    }

    if (this.autoReplace) {
      this.autoReplace = false;
      this.structure.params.autoReplace = true;
    }

    if (this.isReady()) {
      if (command) {
        command = command.replace(emptyCommandParamsRgxp, "css $1");
      } else {
        command = "css";
      }

      var parts = splitBySpace(command), type = parts[0], dom = !this.domComment && this.renderMode === "dom";

      var str = undefined, desc = types[type.toLowerCase()] || this.replaceTplVars(type);

      if (dom) {
        str = /* cbws */"__NODE__ = document.createElement('style');__NODE__.type = '" + desc + "';";
      } else {
        str = this.wrap("'<style type=\"" + desc + "\"'");
      }

      this.append(str);

      if (parts.length > 1) {
        /** @type {!Array} */
        var args = _.any([].slice.call(arguments));

        args[0] = parts.slice(1).join(" ");
        args[1] = args[0].length;

        Snakeskin.Directions["attr"].apply(this, args);
        this.inline = false;
      }

      if (dom) {
        str = this.returnPushNodeDecl();
      } else {
        str = this.wrap("'>'");
      }

      this.append(str);
    }
  }, function () {
    if (!this.tolerateWhitespace) {
      this.skipSpace = true;
    }

    if (this.structure.params.autoReplace) {
      this.autoReplace = true;
    }

    var str = undefined;

    if (!this.domComment && this.renderMode === "dom") {
      str = "__RESULT__.pop();";
    } else {
      str = this.wrap("'</style>'");
    }

    this.append(str);
  });
})();


Snakeskin.addDirective("super", {
  placement: "template"
}, function (command, commandLength) {
  this.startInlineDir();
  if (this.parentTplName && !this.outerLink) {
    var map = this.getGroup("inherit"), obj = this.blockStructure;

    var _cache3 = undefined, drop = undefined;

    while (true) {
      if (map[obj.name]) {
        var name = obj.params.name;

        _cache3 = routerCache[obj.name][this.parentTplName][name];
        drop = this.blockTable["" + obj.name + "_" + name].drop;

        if (_cache3) {
          break;
        }
      }

      if (obj.parent && obj.parent.name !== "root") {
        obj = obj.parent;
      } else {
        break;
      }
    }

    var s = (this.needPrfx ? ADV_LEFT_BLOCK : "") + LEFT_BLOCK, e = RIGHT_BLOCK;

    if (_cache3 && !drop) {
      var diff = this.getDiff(commandLength);

      this.source = this.source.substring(0, this.i - diff) + ("/*!!= " + s + "super" + e + " =*/" + s + "__super__ " + this.info["line"] + "" + e + "" + _cache3.content + "" + (!this.tolerateWhitespace ? "" + s + "__&-__" + e : "") + "" + s + "__end__" + e) + this.source.substring(this.i + 1);

      this.i -= diff + 1;
    }
  }
});

Snakeskin.addDirective("__super__", {
  group: "ignore"
}, function (command) {
  this.startDir();

  if (!command && !this.freezeLine) {
    this.lines.pop();
    this.info["line"]--;
  }

  if (!command || this.lines.length >= parseInt(command, 10)) {
    this.freezeLine++;
  }
}, function () {
  this.freezeLine--;
});


var emptyCommandParamsRgxp = /^([^\s]+?\(|\()/;

Snakeskin.addDirective("tag", {
  block: true,
  placement: "template",
  text: true,
  replacers: {
    "<": function (cmd) {
      return cmd.replace("<", "tag ");
    },
    "/<": function (cmd) {
      return cmd.replace("/<", "end tag");
    }
  }
}, function (command) {
  this.startDir(null, {
    bemRef: this.bemRef
  });

  if (!this.tolerateWhitespace) {
    this.skipSpace = true;
  }

  if (this.isReady()) {
    if (command) {
      command = command.replace(emptyCommandParamsRgxp, "div $1");
    } else {
      command = "div";
    }

    var parts = splitBySpace(command), desc = this.returnTagDesc(parts[0]);

    var params = this.structure.params;

    params.tag = desc.tag;
    params.block = inlineTagMap[desc.tag] !== void 0 ? !inlineTagMap[desc.tag] : !desc.inline;

    var _groups2 = this.splitAttrsGroup(parts.slice(1).join(" ")), dom = !this.domComment && this.renderMode === "dom";

    var str = /* cbws */"var __ATTR_TMP__ = {'class': ''};";

    if (dom) {
      str += /* cbws */"$0 = __NODE__ = document.createElement('" + desc.tag + "');";
    } else {
      str += this.wrap("'<" + desc.tag + "'");
    }

    for (var i = -1; ++i < _groups2.length;) {
      var el = _groups2[i];
      str += this.returnAttrDecl(el.attr, el.group, el.separator, true);
    }

    if (desc.id) {
      if (dom) {
        str += "__NODE__.id = '" + desc.id + "';";
      } else {
        str += this.wrap("' id=\"" + desc.id + "\"'");
      }
    }

    if (desc.classes.length) {
      str += /* cbws */"__ATTR_TMP__['class'] += (__ATTR_TMP__['class'] ? ' ' : '') + '" + desc.classes.join(" ") + "';";
    }

    if (dom) {
      str += /* cbws */"if (__ATTR_TMP__['class']) {__NODE__.className = __ATTR_TMP__['class'];}" + this.returnPushNodeDecl(!params.block) + "";
    } else {
      str += this.wrap( /* cbws */"(__ATTR_TMP__['class'] ? ' class=\"' + __ATTR_TMP__['class'] + '\"' : '') + '" + (!params.block && this.doctype === "xml" ? "/" : "") + ">'");
    }

    this.append(str);
  }
}, function () {
  var params = this.structure.params;

  this.bemRef = params.bemRef;
  this.prevSpace = false;

  if (params.block) {
    var str = undefined;

    if (!this.domComment && this.renderMode === "dom") {
      str = /* cbws */"__RESULT__.pop();$0 = __RESULT__.length > 1 ?__RESULT__[__RESULT__.length - 1] : void 0;";
    } else {
      str = this.wrap("'</" + params.tag + ">'");
    }

    this.append(str);
  }
});

var parentLinkRgxp = /^&/;

/**
 * Анализировать заданную строку декларации тега
 * и вернуть объект-описание
 *
 * @param {string} str - исходная строка
 * @return {{tag: string, id: string, classes: !Array, pseudo: !Array, inline: boolean}}
 */
DirObj.prototype.returnTagDesc = function (str) {
  str = this.replaceTplVars(str, false, true);

  var points = [], types = [], action = "";

  var tag = "", id = "", inline = false;

  var hasId = false;
  var pseudo = [], classes = [];

  var s = ADV_LEFT_BLOCK + LEFT_BLOCK, e = RIGHT_BLOCK;

  var bOpen = 0, bStart = false;

  var bMap = {
    "[": true,
    "]": true
  };

  var sys = {
    "#": true,
    ".": true,
    ":": true
  };

  var error = {
    tag: "",
    id: "",
    classes: [],
    pseudo: [],
    inline: false
  };

  for (var i = -1; ++i < str.length;) {
    var el = str.charAt(i);

    if (bMap[el]) {
      if (el === "[") {
        bOpen++;
        bStart = true;
      } else {
        bOpen--;
      }

      continue;
    }

    if (bStart && el !== ".") {
      this.error("invalid syntax");
      return error;
    } else {
      bStart = false;
    }

    if (sys[el] && (el !== "#" || !bOpen)) {
      if (el === "#") {
        if (hasId) {
          this.error("invalid syntax");
          return error;
        }

        hasId = true;
      }

      tag = tag || "div";
      action = el;

      if (el === ".") {
        // Обработка липких ссылок
        if (bOpen) {
          if (points.length) {
            for (var j = points.length; j--;) {
              var point = points[j];

              if (point) {
                if (point.stage < bOpen) {
                  var tmp = classes[j], pos = point.from;

                  if (point.val != null) {
                    tmp = tmp.replace(parentLinkRgxp, point.val);
                  }

                  while (points[pos] != null) {
                    var parent = points[pos];
                    tmp = tmp.replace(parentLinkRgxp, parent.val);
                    pos = parent.from;
                  }

                  points.push({
                    stage: bOpen,
                    val: tmp,
                    from: j
                  });

                  break;
                }
              } else {
                points.push({
                  stage: bOpen,
                  val: classes[j],
                  from: j
                });

                break;
              }
            }
          } else {
            points.push({
              stage: bOpen,
              val: null,
              from: null
            });
          }
        } else {
          points.push(null);
        }

        types.push(!bOpen);
        classes.push("");
      } else if (el === ":") {
        if (!inline) {
          inline = pseudo[pseudo.length - 1] === "inline";
        }

        pseudo.push("");
      }

      continue;
    }

    switch (action) {
      case "#":
        id += el;
        break;

      case ".":
        classes[classes.length - 1] += el;
        break;

      case ":":
        pseudo[pseudo.length - 1] += el;
        break;

      default:
        tag += el;
    }
  }

  if (bOpen) {
    this.error("invalid syntax");
    return error;
  }

  var ref = this.bemRef;

  for (var i = -1; ++i < classes.length;) {
    var el = classes[i], point = points[i];

    if (point && point.val != null) {
      el = el.replace(parentLinkRgxp, point.val);
    }

    if (parentLinkRgxp.test(el) && ref) {
      el = "" + s + "'" + ref + "'" + FILTER + "" + this.bemFilter + " '" + el.substring(1) + "',$0" + e;
      el = this.pasteDangerBlocks(this.replaceTplVars(el));
    } else if (el && types[i]) {
      ref = this.pasteTplVarBlocks(el);
    }

    classes[i] = this.pasteTplVarBlocks(el);
  }

  this.bemRef = ref;

  if (!inline) {
    inline = pseudo[pseudo.length - 1] === "inline";
  }

  return {
    tag: this.pasteTplVarBlocks(tag),
    id: this.pasteTplVarBlocks(id),
    classes: classes,
    pseudo: pseudo,
    inline: inline
  };
};


/**
 * Номер итерации,
 * где был декларирован активный шаблон
 * @type {number}
 */
DirObj.prototype.startTemplateI = 0;

/**
 * Номер строки,
 * где был декларирован активный шаблон
 * @type {?number}
 */
DirObj.prototype.startTemplateLine = null;

/**
 * True, если декларируется шаблон-генератор
 * @type {?boolean}
 */
DirObj.prototype.generator = null;

/**
 * Название активного шаблона
 * @type {?string}
 */
DirObj.prototype.tplName = null;

/**
 * Название родительского активного шаблона
 * @type {?string}
 */
DirObj.prototype.parentTplName = null;

/**
 * Массив декларированных констант
 * @type {Array}
 */
DirObj.prototype.consts = null;

/**
 * Название родительского BEM класса
 * @type {string}
 */
DirObj.prototype.bemRef = "";

var template = ["template", "interface", "placeholder"], scopeModRgxp = new RegExp("^" + G_MOD + "+");

function concatProp(str) {
  return str.charAt(0) === "[" ? str : "." + str;
}

for (var i = -1; ++i < template.length;) {
  (function (_i5) {
    Snakeskin.addDirective(template[i], {
      block: true,
      placement: "global",
      notEmpty: true,
      group: ["template", "rootTemplate", "define"]
    }, function (command, commandLength, type, jsDoc) {
      var _this13 = this;
      var lastName = "", proto = this.proto;

      var rank = {
        "template": 2,
        "interface": 1,
        "placeholder": 0
      };

      this.startDir(!proto && this.renderAs && rank[this.renderAs] < rank[type] ? this.renderAs : null);

      var iface = this.name === "interface";

      this.startTemplateI = this.i + 1;
      this.startTemplateLine = this.info["line"];

      var nameRgxp = new RegExp("^[^" + symbols + "_$[]", "i"), esprimaNameHackRgxp = new RegExp("[" + G_MOD + "" + L_MOD + "]", "g");

      var tmpTplName = this.getFnName(command), tplName = this.pasteDangerBlocks(tmpTplName);

      if (!proto) {
        tmpTplName = this.replaceFileName(tmpTplName);

        var prfx = "", pos = undefined;

        // Шаблон-генератор
        if (/\*/.test(tmpTplName)) {
          prfx = "*";
          tmpTplName = tmpTplName.replace(prfx, "");
        }

        tplName = this.pasteDangerBlocks(tmpTplName);
        this.generator = Boolean(prfx);

        try {
          if (!tplName || nameRgxp.test(tplName)) {
            throw false;
          }

          esprima.parse(tplName.replace(esprimaNameHackRgxp, ""));
        } catch (ignore) {
          return this.error("invalid \"" + this.name + "\" name");
        }

        if (tplName === "init") {
          return this.error("can't declare template \"" + tplName + "\", try another name");
        }

        this.info["template"] = this.tplName = tplName;

        if (this.name !== "template" && !write[tplName]) {
          write[tplName] = false;
        }

        // Для возможности удобного пост-парсинга,
        // каждая функция снабжается комментарием вида:
        // /* Snakeskin template: название шаблона; параметры через запятую */
        this.save(pos = "/* Snakeskin template: " + tplName + "; " + this.getFnArgs(command).join(",").replace(/=(.*?)(?:,|$)/g, "") + " */", iface, jsDoc);

        if (jsDoc) {
          jsDoc += pos.length;
        }

        var tmpArr = tmpTplName.replace(nmssRgxp, "%").replace(nmsRgxp, ".%").replace(nmeRgxp, "").split(".");

        var str = tmpArr[0], length = tmpArr.length, first = str.charAt(0), short = "";

        if (first === "%") {
          try {
            str = /* cbws */"['" + applyDefEscape(this.returnEvalVal(this.prepareOutput(str.substring(1), true))) + "']";
          } catch (err) {
            return this.error(err.message);
          }
        } else {
          short = str;
        }

        for (var _i = 0; ++_i < length;) {
          var el = tmpArr[_i], custom = el.charAt(0) === "%";

          if (custom) {
            el = el.substring(1);
          }

          var def = "this" + concatProp(str);

          this.save(pos = /* cbws */"if (" + def + " == null) {" + def + " = {};}" + (_i === 1 && short ? "var " + short + " = " + def + ";" : "") + "", iface, jsDoc);

          if (jsDoc) {
            jsDoc += pos.length;
          }

          if (custom) {
            try {
              str += /* cbws */"['" + applyDefEscape(this.returnEvalVal(this.prepareOutput(el, true))) + "']";
            } catch (err) {
              return this.error(err.message);
            }

            continue;
          } else if (_i === length - 1) {
            lastName = el;
          }

          str += "." + el;
        }

        tplName = str;
        this.save("" + (length === 1 && short ? "var " + short + " = " : "") + "this" + concatProp(tplName) + " = function " + prfx + "" + (length > 1 ? lastName : short) + "(", iface);
      }

      this.info["template"] = this.tplName = tplName;

      this.blockStructure = {
        name: "root",
        parent: null,
        children: []
      };

      this.blockTable = {};
      this.varCache[tplName] = {};

      if (proto) {
        this.sysSpace = proto.sysSpace;
        this.strongSpace = proto.strongSpace;
        this.chainSpace = proto.chainSpace;
        this.space = proto.space;
        return;
      }

      // Валидация шаблона для наследования
      var parentTplName;
      if (/\)\s+extends\s+/.test(command)) {
        try {
          parentTplName = /\)\s+extends\s+(.*?(?:@|$))/.exec(command)[1].replace(/\s*@$/, "");

          if (!parentTplName || nameRgxp.test(parentTplName)) {
            throw false;
          }

          esprima.parse(parentTplName.replace(esprimaNameHackRgxp, ""));
        } catch (ignore) {
          return this.error("invalid \"" + this.name + "\" name for extend");
        }

        try {
          parentTplName = this.parentTplName = this.prepareNameDecl(parentTplName);
        } catch (err) {
          return this.error(err.message);
        }

        if (cache[parentTplName] == null) {
          if (!this.renderAs || this.renderAs === "template") {
            return this.error("the specified template \"" + parentTplName + "\" for inheritance is not defined");
          }

          parentTplName = this.parentTplName = null;
        }
      }

      this.initTemplateCache(tplName);

      if (tplName in extMap) {
        clearScopeCache(tplName);
      }

      var scope = scopeCache["template"], parent = scope[parentTplName];

      scope[tplName] = {
        id: this.module.id,
        parent: parent,
        children: {}
      };

      scope[tplName].root = parent ? parent.root : scope[tplName];

      if (parent) {
        parent.children[tplName] = scope[tplName];
      }

      argsCache[tplName] = {};
      argsResCache[tplName] = {};
      outputCache[tplName] = {};

      extMap[tplName] = parentTplName;
      delete extListCache[tplName];

      var baseParams = {};

      if (!parentTplName) {
        forIn(this.params[this.params.length - 1], function (el, key) {
          if (key !== "renderAs" && key.charAt(0) !== "@" && el !== void 0) {
            baseParams[key] = el;
          }
        });
      }

      var flags = command.split("@=");

      if (parentTplName && flags.length === 1) {
        flags.push("@skip true");
      }

      for (var _i2 = 0; ++_i2 < flags.length;) {
        var el = flags[_i2].trim(), name = el.split(" ")[0];

        delete baseParams[name];
        Snakeskin.Directions["__setSSFlag__"].call(this, el);
      }

      forIn(baseParams, function (el, key) {
        Snakeskin.Directions["__setSSFlag__"].call(_this13, [key, el]);
      });

      var args = this.prepareArgs(command, "template", tplName, parentTplName);
      this.save("" + args.str + ") {", iface);

      if (args.scope) {
        this.scope.push(args.scope);
      }

      var predefs = ["callee", "blocks", "getTplResult", "clearTplResult", "$0", "TPL_NAME", "PARENT_TPL_NAME"];

      for (var _i3 = -1; ++_i3 < predefs.length;) {
        this.structure.vars[predefs[_i3]] = {
          value: predefs[_i3],
          scope: 0
        };
      }

      this.save( /* cbws */"var __THIS__ = this,__CALLEE__ = __ROOT__" + concatProp(tplName) + ",callee = __CALLEE__;if (!callee.Blocks) {var __BLOCKS__ = __CALLEE__.Blocks = {},blocks = __BLOCKS__;}var __RESULT__ = " + this.declResult() + ",__COMMENT_RESULT__,__NODE__,$0;function getTplResult(opt_clear) {var res = " + this.returnResult() + ";if (opt_clear) {__RESULT__ = " + this.declResult() + ";}return res;}function clearTplResult() {__RESULT__ = " + this.declResult() + ";}var __RETURN__ = false,__RETURN_VAL__;var TPL_NAME = \"" + escapeDoubleQuote(tplName) + "\",PARENT_TPL_NAME" + (parentTplName ? " = \"" + escapeDoubleQuote(parentTplName) + "\"" : "") + ";" + args.defParams + "");

      var preDefs = this.preDefs[tplName];

      // Подключение внешних блоков и прототипов
      if ((!extMap[tplName] || parentTplName) && preDefs) {
        this.source = this.source.substring(0, this.i + 1) + preDefs.text + this.source.substring(this.i + 1);

        delete this.preDefs[tplName];
      }
    }, function (command, commandLength) {
      var _this14 = this;
      var tplName = String(this.tplName), proto = this.proto;

      if (proto) {
        // Вызовы не объявленных прототипов внутри прототипа
        if (this.backTableI) {
          (function () {
            var ctx = proto.ctx;
            ctx.backTableI += _this14.backTableI;

            forIn(_this14.backTable, function (arr, key) {
              for (var _i4 = -1; ++_i4 < arr.length;) {
                var el = arr[_i4];
                el.pos += proto.pos;
                el.outer = true;
                el.vars = _this14.structure.vars;
              }

              ctx.backTable[key] = ctx.backTable[key] ? ctx.backTable[key].concat(arr) : arr;
            });
          })();
        }

        return;
      }

      var diff = this.getDiff(commandLength);

      cache[tplName] = this.source.substring(this.startTemplateI, this.i - diff);
      table[tplName] = this.blockTable;

      // Обработка наследования:
      // тело шаблона объединяется с телом родителя
      // и обработка шаблона начинается заново,
      // но уже как атомарного (без наследования)
      if (this.parentTplName) {
        this.info["line"] = this.startTemplateLine;
        this.lines.splice(this.startTemplateLine, this.lines.length);

        this.source = this.source.substring(0, this.startTemplateI) + this.getFullBody(tplName) + this.source.substring(this.i - diff);

        this.initTemplateCache(tplName);
        this.startDir(this.structure.name);

        this.i = this.startTemplateI - 1;
        this.parentTplName = null;

        this.blockTable = {};
        this.varCache[tplName] = {};

        return;
      }

      // Вызовы не объявленных прототипов
      if (this.backTableI) {
        forIn(this.backTable, function (arr, key) {
          for (var _i5 = -1; ++_i5 < arr.length;) {
            var el = arr[_i5];

            if (!el.outer) {
              continue;
            }

            var tmp = protoCache[tplName][key];
            if (!tmp) {
              return _this14.error("proto \"" + key + "\" is not defined");
            }

            _this14.res = _this14.res.substring(0, el.pos) + _this14.res.substring(el.pos).replace(el.label, (el.argsStr || "") + (el.recursive ? tmp.i + "++;" : tmp.body));
          }
        });

        this.backTable = {};
        this.backTableI = 0;
      }

      var iface = this.structure.name === "interface";

      if (iface) {
        this.save("};", true);
      } else {
        this.save( /* cbws */"" + this.consts.join("") + "return " + this.returnResult() + ";};Snakeskin.cache[\"" + escapeDoubleQuote(tplName) + "\"] = this" + concatProp(tplName) + ";");
      }

      this.save("/* Snakeskin template. */", iface);

      if (this.params[this.params.length - 1]["@tplName"] === this.tplName) {
        this.popParams();
      }

      this.canWrite = true;
      this.tplName = null;

      delete this.info["template"];

      if (this.scope.length) {
        this.scope.pop();
      }
    });
  })(i);
}


Snakeskin.addDirective("throw", {
  notEmpty: true
}, function (command) {
  this.startInlineDir();
  if (this.isReady()) {
    this.append("throw " + this.prepareOutput(command, true) + ";");
  }
});

Snakeskin.addDirective("try", {
  block: true,
  after: {
    "catch": true,
    "finally": true,
    "end": true
  }
}, function () {
  this.startDir();
  this.append("try {");
}, function () {
  if (this.structure.params.chain) {
    this.append("}");
  } else {
    this.append("} catch (ignore) {}");
  }
});

Snakeskin.addDirective("catch", {
  notEmpty: true,
  chain: "try"
}, function (command) {
  if (this.structure.name !== "try") {
    return this.error("directive \"" + this.name + "\" can be used only with a \"try\"");
  }

  this.structure.params.chain = true;

  if (this.isReady()) {
    this.append("} catch (" + this.declVar(command) + ") {");
  }
});

Snakeskin.addDirective("finally", {
  placement: "template",
  chain: "try"
}, function () {
  if (this.structure.name !== "try") {
    return this.error("directive \"" + this.name + "\" can be used only with a \"try\"");
  }

  this.structure.params.chain = true;
  this.append("} finally {");
});


/**
 * Таблица созданных переменных
 */
DirObj.prototype.varCache = {
  init: function init() {
    return {};
  }
};

Snakeskin.addDirective("var", {
  notEmpty: true,
  replacers: {
    ":": function (cmd) {
      return cmd.replace(":", "var ");
    }
  }
}, function (command) {
  this.startInlineDir();
  if (this.isReady()) {
    this.append(this.multiDeclVar(command));
  }
});


Snakeskin.addDirective("void", {
  notEmpty: true,
  replacers: {
    "?": function (cmd) {
      return cmd.replace("?", "void ");
    }
  }
}, function (command) {
  this.startInlineDir();
  if (this.isReady()) {
    this.append("" + this.prepareOutput(command, true) + ";");
  }
});


Snakeskin.addDirective("with", {
  sys: true,
  block: true,
  notEmpty: true
}, function (command) {
  this.startDir();
  this.scope.push(this.prepareOutput(command, true));
}, function () {
  this.scope.pop();
});


Snakeskin.addDirective("yield", {
  placement: "template"
}, function (command) {
  var cb = this.has(this.getGroup("callback"));

  if (cb) {
    return this.error("directive \"" + this.name + "\" can't be used within the \"" + cb + "\"");
  }

  if (!this.parentTplName && !this.generator && !this.proto && !this.outerLink) {
    return this.error("directive \"" + this.name + "\" can be used only with a generator");
  }

  this.startInlineDir();

  if (this.isReady()) {
    if (command) {
      this.append("yield " + this.prepareOutput(command, true) + ";");
    } else {
      this.append( /* cbws */"\n\t\t\t\t\tyield " + this.returnResult() + ";\n\t\t\t\t\t__RESULT__ = " + this.declResult() + ";\n\t\t\t\t");
    }
  }
});

var fsStack = [];

/**
 * Добавить содержимое файла в стек вставок в шаблон по заданному URL
 *
 * @param {string} base - базовый путь к файлу
 * @param {string} url - путь к файлу
 * @param {string} nl - символ перевода строки
 * @param {?string=} [opt_type] - тип рендеринга шаблонов
 * @return {(string|boolean)}
 */
Snakeskin.include = function (base, url, nl, opt_type) {
  if (!IS_NODE) {
    return false;
  }

  var fs = require("fs"), path = require("path"), glob = require("glob")["sync"];

  var s = ADV_LEFT_BLOCK + LEFT_BLOCK, e = RIGHT_BLOCK;

  try {
    var _ret12 = (function () {
      var extname = path.extname(url), include = Snakeskin.LocalVars.include;

      var src = path.resolve(path.dirname(base), url + (extname ? "" : ".ss"));

      (/\*/.test(src) ? glob(src) : [src]).forEach(function (src) {
        src = path.normalize(src);

        if (!include[src]) {
          include[src] = true;
          var file = fs.readFileSync(src).toString();

          fsStack.push("" + s + "__setFile__ " + src + "" + e + (opt_type ? "" + s + "__setSSFlag__ renderAs '" + opt_type + "'" + e : "") + ("" + (startWhiteSpaceRgxp.test(file) ? "" : nl)) + file + ("" + (endWhiteSpaceRgxp.test(file) ? "" : "" + nl + "" + s + "__cutLine__" + e)) + ("" + s + "__endSetFile__" + e));
        }
      });

      return {
        v: true
      };
    })();

    if (typeof _ret12 === "object") return _ret12.v;
  } catch (err) {
    fsStack.push("" + s + "__setError__ " + err.message + "" + e);
  }

  return false;
};


global["define"] = globalDefine;

if (typeof define === "function" && define["amd"]) {
  define([], function () {
    return Snakeskin;
  });
} else if (IS_NODE) {
  module.exports = exports = Snakeskin;
} else {
  global.Snakeskin = Snakeskin;
}
}).call(new Function('return this')(), this);
