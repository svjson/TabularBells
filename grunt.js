/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    meta: {
      version: '0.1.0',
      banner: '/*! JSTABLE - v<%= meta.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '* http://PROJECT_WEBSITE/\n' +
        '* Copyright (c) <%= grunt.template.today("yyyy") %> ' +
        'YOUR_NAME; Licensed MIT */'
    },
    qunit: {
      files: ['spec/**/*.html']
    },
    concat: {
      dist: {
        src: ['<banner:meta.banner>', 
	      'src/class.js',

	      'src/datasource.js',
	      'src/array-datasource.js',

	      'src/pagination/pagination-strategy.js',
	      'src/pagination/no-pagination.js',

	      'src/columnmodel/basic-column-model.js',

	      'src/view.js',
	      'src/jquery-template-view.js',

	      'src/table.js'],  // '<file_strip_banner:lib/FILE_NAME.js>'],
        dest: 'dist/jstable.js'
      }
    },
    min: {
      dist: {
        src: ['<banner:meta.banner>', '<config:concat.dist.dest>'],
        dest: 'dist/jstable.min.js'
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
