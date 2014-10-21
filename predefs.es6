/** @interface */
function Iterator() {

}

/**
 * @interface
 * @param {Array=} [opt_iterable]
 */
function WeakMap(opt_iterable) {

}

/**
 * @param {!Object} key
 * @param {?} value
 */
WeakMap.prototype.set = function (key, value) {

};

/**
 * @param {!Object} key
 * @return {?}
 */
WeakMap.prototype.get = function (key) {

};

/**
 * @param {!Object} key
 * @return {boolean}
 */
WeakMap.prototype.delete = function (key) {

};

/**
 * @interface
 * @param {Array=} [opt_iterable]
 */
function Map(opt_iterable) {

}

/**
 * @param {?} key
 * @param {?} value
 */
Map.prototype.set = function (key, value) {

};

/**
 * @param {?} key
 * @return {?}
 */
Map.prototype.get = function (key) {

};

/**
 * @param {?} key
 * @return {boolean}
 */
Map.prototype.has = function (key) {

};

/** @return {!Iterator} */
Map.prototype.keys = function () {

};

/**
 * @param {?} key
 * @return {boolean}
 */
Map.prototype.delete = function (key) {

};

Map.prototype.clear = function (key) {

};

/**
 * @interface
 * @param {Array=} [opt_iterable]
 */
function Set(opt_iterable) {

}

/**
 * @param {?} val
 */
Set.prototype.add = function (val) {

};

/**
 * @param {?} val
 * @return {boolean}
 */
Set.prototype.delete = function (val) {

};

/**
 * @param {?} val
 * @return {boolean}
 */
Set.prototype.has = function (val) {

};

/** @return {!Iterator} */
Set.prototype.values = function () {

};

/** @return {!Iterator} */
Set.prototype.keys = function () {

};

Set.prototype.clear = function () {

};

/**
 * @interface
 * @param {Array=} [opt_iterable]
 */
function WeakSet(opt_iterable) {

}

/**
 * @param {?} val
 */
WeakSet.prototype.add = function (val) {

};

/**
 * @param {?} val
 * @return {boolean}
 */
WeakSet.prototype.delete = function (val) {

};

/**
 * @param {?} val
 * @return {boolean}
 */
WeakSet.prototype.has = function (val) {

};
