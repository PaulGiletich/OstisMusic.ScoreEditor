module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('watch', [ 'watch' ]);

    grunt.initConfig({
        concat: {
            'build/js/ostis-score-editor.js': [
                'js/**/*.js'
            ]
        },
        uglify: {
            'build/js/ostis-score-editor.min.js': [
                'build/js/ostis-score-editor.js'
            ]
        },
        watch: {
            js: {
                files: ['js/**/*.js'],
                tasks: ['concat', 'uglify'],
                options: {
                    livereload: true
                }
            }
        }
    });

    grunt.registerTask('default', ['concat', 'uglify']);
};
