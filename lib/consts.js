var IS_NODE = false;

try {
	IS_NODE = 'object' === typeof process && Object.prototype.toString.call(process) === '[object process]';

} catch (ignore) {

}

const JSON_SUPPORT = Boolean(typeof JSON !== 'undefined' && JSON.parse && JSON.stringify);
