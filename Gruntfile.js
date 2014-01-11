var __NEJS_THIS__ = this;
/**!
 * @status stable
 * @version 1.0.0
 */

module.exports = function (grunt) {
	
	grunt.initConfig({
		concat: {
			compiler: {
				src: [
					'lib/es5shim.live.js',
					'lib/core.js',
					'lib/header.txt',
					'lib/filters.js',
					'lib/global.js',
					'lib/api.js',
					'node_modules/escaper/escaper.js',
					'lib/escape.js',
					'lib/inherit.js',
					'lib/error.js',
					'lib/compiler.js',
					'lib/directions.js',
					'lib/output.js',
					'lib/directions/*.js',
					'lib/footer.txt'
				],

				dest: 'build/snakeskin.js'
			},

			live: {
				src: [
					'lib/es5shim.live.js',
					'lib/core.js',
					'lib/header.txt',
					'lib/filters.js',
					'lib/footer.txt'
				],

				dest: 'build/snakeskin.live.js'
			}
		},

		uglify: {
			compiler: {
				src: 'build/snakeskin.js',
				dest: 'build/snakeskin.min.js'
			},

			live: {
				src: 'build/snakeskin.live.js',
				dest: 'build/snakeskin.live.min.js'
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');

	grunt.registerTask('default', ['concat', 'uglify']);
};