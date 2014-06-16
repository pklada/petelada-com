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
      dist: {
        options: {
          sassDir: 'sass',
          cssDir: 'css'
        }
      },
      jekyll:{
        options: {
          sassDir: 'sass',
          cssDir: '_site/css'
        }
      }
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
        files:['sass/*.scss',
              'sass/core/*.scss',
              'sass/modules/*.scss'
        ],
        tasks:['compass']
      }
    },
    shell : {
        jekyllBuild : {
            command : "jekyll build --config _config.yml,_config-dev.yml"
        },
        jekyllServe : {
            command : "jekyll serve --config _config.yml"
        },
        jekyllServeDev : {
            command : "jekyll serve --config _config.yml,_config-dev.yml"
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
    },
    concurrent: {
        target: {
            tasks: ['watch', 'shell:jekyllServe'],
            options: {
                logConcurrentOutput: true
            }
        },
        dev: {
            tasks: ['watch', 'shell:jekyllServeDev'],
            options: {
                logConcurrentOutput: true
            }
        }
    },
    jekyll: {
      options: {
        serve: true
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
  grunt.loadNpmTasks('grunt-concurrent');
  grunt.loadNpmTasks('grunt-jekyll');

  // Default task.
  grunt.registerTask('default', ['jshint', 'watch']);
  grunt.registerTask('serve', ['concurrent']);
  grunt.registerTask('serve-dev', ['concurrent:dev']);

};
