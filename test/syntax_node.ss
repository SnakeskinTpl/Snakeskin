syntax_node_index
syntax_node_index2

###

- template syntax_node_index() @= tolerateWhitespace true @= autoReplace false
	# block foo
		jQuery(document).ready(function () {
			$.backstretch([
				'/static/assets/admin/pages/media/bg/1.jpg',
				'/static/assets/admin/pages/media/bg/2.jpg',
				'/static/assets/admin/pages/media/bg/3.jpg',
				'/static/assets/admin/pages/media/bg/4.jpg'
			], {
				fade: 1000,
				duration: 8000
			});
		});

- template syntax_node_index2() @= tolerateWhitespace true @= autoReplace false
	# block foo
		{if 1}
			- if 2
				#{&}
				# if 3
					jQuery(document).ready(function () {
						$.backstretch([
							'/static/assets/admin/pages/media/bg/1.jpg',
							'/static/assets/admin/pages/media/bg/2.jpg',
							'/static/assets/admin/pages/media/bg/3.jpg',
							'/static/assets/admin/pages/media/bg/4.jpg'
						], {
							fade: 1000,
							duration: 8000
						});
					});
	{&}
	- if 1
		1

###

		jQuery(document).ready(function () {
			$.backstretch([
				'/static/assets/admin/pages/media/bg/1.jpg',
				'/static/assets/admin/pages/media/bg/2.jpg',
				'/static/assets/admin/pages/media/bg/3.jpg',
				'/static/assets/admin/pages/media/bg/4.jpg'
			], {
				fade: 1000,
				duration: 8000
			});
		});

***

	{if 1}
			- if 2
				jQuery(document).ready(function () {
						$.backstretch([
							'/static/assets/admin/pages/media/bg/1.jpg',
							'/static/assets/admin/pages/media/bg/2.jpg',
							'/static/assets/admin/pages/media/bg/3.jpg',
							'/static/assets/admin/pages/media/bg/4.jpg'
						], {
							fade: 1000,
							duration: 8000
						});
					});


	1
