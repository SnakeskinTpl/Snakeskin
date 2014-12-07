var URL = {};

/**
 * @abstract
 * @param {!Blob} blob
 * @return {string}
 */
URL.createObjectURL = function (blob) {};

/**
 * @abstract
 * @param {string} url
 */
URL.revokeObjectURL = function (url) {};
