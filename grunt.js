/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    meta: {
      version: '0.0.3',
      banner: '/*! TabularBells - v<%= meta.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '* http://www.github.com/svjson/TabularBells/\n' +
        '* Copyright (c) <%= grunt.template.today("yyyy") %> ' +
        'Sven Johansson; Licensed MIT */'
    },
    qunit: {
      files: ['spec/**/*.html']
    },
    concat: {
      dist: {
        src: ['<banner:meta.banner>', 
	      'src/class/class.js',
	      'src/class/events.js',

	      'src/datasource/datasource.js',
	      'src/datasource/array-datasource.js',
	      'src/datasource/ajax-datasource.js',

	      'src/pagination/view/pagination-view.js',
	      'src/pagination/view/no-pagination-view.js',
	      'src/pagination/view/jquery-template-bar.js',

	      'src/pagination/pagination-strategy.js',
	      'src/pagination/no-pagination.js',
	      'src/pagination/pagination-bar.js',
	      
	      'src/columnmodel/basic-column-model.js',

	      'src/view.js',
	      'src/jquery-template-view.js',

	      'src/table/table.js',
	      'src/table/bootstrap-table.js'],  // '<file_strip_banner:lib/FILE_NAME.js>'],
	
        dest: 'dist/tabularbells-<%= meta.version %>.js'
      }
    },
    min: {
      dist: {
        src: ['<banner:meta.banner>', '<config:concat.dist.dest>'],
        dest: 'dist/tabularbells-<%= meta.version %>.min.js'
      }
    },
    watch: {
      files: '<config:lint.files>',
      tasks: 'lint qunit'
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        browser: true
      },
      globals: {
        jQuery: true
      }
    },
    uglify: {}
  });

  // Default task.
  grunt.registerTask('default', 'qunit concat min');

};
