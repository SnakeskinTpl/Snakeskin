var __NEJS_THIS__ = this;
/**!
 * @status stable
 * @version 1.0.0
 */

module.exports = function (grunt) {
	
	grunt.initConfig({
		concat: {
			files: {
				'snakeskin.js': [
					'lib/core.js'
				]
			}
		},

		uglify: {
			files: {

			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');

	grunt.registerTask('default', ['concat']);
};