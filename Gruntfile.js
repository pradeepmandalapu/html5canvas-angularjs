module.exports = function(grunt) {

  grunt.initConfig({

	pkg: grunt.file.readJSON('package.json'),

    //validate js files 
    jshint: {
      options: {
        reporter: require('jshint-stylish')
      },
      all: ['Grunfile.js', 'src/components/**/*.js']
    },

    //uglify and minify js files
    uglify: {
     //options: {
       // banner: '/*\n <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> \n*/\n'
      //},
      build: {
        files: {
          'dist/js/components.min.js': 'src/components/**/*.js'
        }
      }
    },

    //minify css files
    cssmin: {
      options: {
        banner: '/*\n <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> \n*/\n'
      },
      build: {
        files: {
          'dist/css/style.min.css': 'src/css/style.css'
        }
      }
    },

    // configure watch 
    watch: {
      stylesheets: {
        files: ['src/**/*.css'],
        tasks: [ 'cssmin']
      },
      scripts: {
        files: 'src/**/*.js',
        tasks: ['jshint', 'uglify']
      }
    },
	
	// express server start
	express:{
		all:{
			options:{
				port:7777,
				hostname:'localhost',
				bases:['./src'],
				livereload: true
			}
		}
  }/*,
  forever: {
    server: {
      options: {
        index: ['./src'],
        logDir: 'logs',
        port:7777,
		hostname:'localhost',
      }
    }
  }*/
  });

  //load grunt plugins
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-express');
  grunt.loadNpmTasks('grunt-forever');
 
 
 //create tasks
  grunt.registerTask('serve-image', ['jshint','cssmin','uglify','express','watch']);
  grunt.registerTask('default', ['test', 'build']);
};