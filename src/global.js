/////////////////////////////////
//// Глобальные переменные замыкания
/////////////////////////////////

var // Кеш шаблонов
	cache = {},
	
	// Кеш блоков
	blockCache = {},
	protoCache = {},
	fromProtoCache = {},
	
	// Кеш переменных
	globalVarCache = {},
	varCache = {},
	fromVarCache = {},
	varICache = {},
	
	// Кеш входных параметров
	paramsCache = {},
	
	// Карта наследований
	extMap = {},
	// Стек CDATA
	cData = [],
	
	quote = {'"': true, '\'': true},
	
	// Системные константы
	sysConst = {
		'__SNAKESKIN_RESULT__': true,
		'__SNAKESKIN_CDATA__': true
	},
	
	error;