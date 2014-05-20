/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
      ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
    // Task configuration.
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
        unused: true,
        boss: true,
        eqnull: true,
        browser: true,
        globals: {
          jQuery: true
        }
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      lib_test: {
        src: ['lib/**/*.js', 'test/**/*.js']
      }
    },
    compass: {
      dist: {}
    },
    watch: {
      html: {
        files:['_layouts/*.html',
              '_posts/*.markdown',
              '_config.yml',
              'index.html',
              '404.html'
        ],
        tasks:['shell:jekyllBuild']
      },
      css: {
        files:['sass/*.scss'],
        tasks:['compass']
      },
      options : {
          spawn : false,
          interrupt : true,
          atBegin : true,
          livereload : true
      }
    },
    shell : {
        jekyllBuild : {
            command : 'jekyll build'
        },
        jekyllServe : {
            command : 'jekyll serve'
        }
    },
    connect: {
      server: {
        options: {
          livereload: true,
          base: '_site/',
          port: 9009
        }
      }
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-connect');

  // Default task.
  grunt.registerTask('default', ['jshint', 'watch']);
  grunt.registerTask('serve', ['shell:jekyllBuild', 'connect:server', 'watch']);

};
