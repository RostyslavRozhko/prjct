module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		sass: {
		  dist: {
		    options: {
		      sourcemap: 'none'
		    },
		    files: [{
		      expand: true,
		      cwd: 'public/sass',
		      src: ['**/*.sass'],
		      dest: 'public/stylesheets',
		      ext: '.css'
		  }]
		  }
		},
		watch: {
			css: {
				files: '**/*.sass',
				tasks: ['sass']
			}
		}
	});
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-watch');
	
	grunt.registerTask('default',['watch']);
}