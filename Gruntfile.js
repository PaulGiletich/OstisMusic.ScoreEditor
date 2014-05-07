module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect');

    grunt.initConfig({
        less: {
            "build/css/main.css": "less/**/*.less"
        },
        watch: {
            less: {
                // Which files to watch (all .less files recursively in the less directory)
                files: ['less/**/*.less'],
                tasks: ['less']
            }
        }
    });

    grunt.registerTask('default', [ 'less']);
};
