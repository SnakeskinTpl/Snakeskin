(() => {
	var types = {
		'html': '<!DOCTYPE html>',
		'xml': '<?xml version="1.0" encoding="utf-8" ?>',
		'transitional': '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">',
		'strict': '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">',
		'frameset': '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Frameset//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-frameset.dtd">',
		'1.1': '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">',
		'basic': '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML Basic 1.1//EN" "http://www.w3.org/TR/xhtml-basic/xhtml-basic11.dtd">',
		'mobile': '<!DOCTYPE html PUBLIC "-//WAPFORUM//DTD XHTML Mobile 1.2//EN" "http://www.openmobilealliance.org/tech/DTD/xhtml-mobile12.dtd">'
	};

	Snakeskin.addDirective(
		'doctype',

		{
			placement: 'template'
		},

		function (command) {
			if (this.renderMode === 'dom') {
				return this.error(`directive "${this.name}" can't be used with a "dom" render mode`);
			}

			var type = command.split(' ')[0] || 'html';

			if (!types[type]) {
				return this.error('invalid doctype');
			}

			this.startInlineDir();
			this.space = true;

			this.append(this.wrap(`'${types[type]}'`));
		}
	);
})();
