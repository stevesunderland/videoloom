module.exports = function(grunt) {
    grunt.initConfig({
      jade: {
        compile: {
          options: {
            pretty: true,
            data: grunt.file.readJSON("data.json")
          },
          files: {
            "index.html": ["jade/*.jade"]
          }
        }
      },
      less: {
        development: {
          options: {
            paths: ["static/css/"],
            sourceMap: true
          },
          files: {
            "app.css": "less/app.less"
          }
        },
      },
      // autoprefixer: {
      //   no_dest: {
      //     src: 'static/css/site.css'
      //   },
      // },
      watch: {
        all: {
          options:{
            livereload: true
          },
          files: ['jade/*.jade', 'jade/**/*.jade', 'less/*.less'],
          // tasks: ['jade', 'less', 'autoprefixer']
          tasks: ['jade', 'less']
        }
      }
    });

    // grunt.loadNpmTasks("grunt-autoprefixer");
    grunt.loadNpmTasks("grunt-contrib-jade");
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks("grunt-contrib-watch");

    grunt.registerTask('default', ['watch']);
};
