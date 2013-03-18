Snakeskin.Directions['with'] = function (command, commandLength, vars, adv) {
	vars.setPos('with', {
		scope: command,
		i: ++vars.beginI
	}, true);
};

Snakeskin.Directions['withEnd'] = function (command, commandLength, vars, adv) {
	vars.sysPosCache['withEnd'].pop();
};