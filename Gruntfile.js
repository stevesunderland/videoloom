module.exports = function(grunt) {
    grunt.initConfig({
      // connect: {
      //   server: {
      //     options: {
      //       port: 9001,
      //       base: 'static'
      //     }
      //   }
      // },
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
      watch: {
        all: {
          options:{
            livereload: true
          },
          files: ['jade/*.jade', 'jade/**/*.jade', 'less/*.less', 'app.js'],
          // tasks: ['jade', 'less', 'autoprefixer']
          tasks: ['jade', 'less']
        }
      }
    });

    // grunt.loadNpmTasks("grunt-autoprefixer");
    // grunt.loadNpmTasks("grunt-contrib-connect");
    grunt.loadNpmTasks("grunt-contrib-jade");
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks("grunt-contrib-watch");

    grunt.registerTask('default', ['watch', 'connect']);
};
