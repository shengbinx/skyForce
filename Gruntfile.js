module.exports = function (grunt) {
    var project = grunt.file.readJSON('package.json'),
        publish_tasks = ['uglify', 'cssmin'];
    // 项目配置
    function initConfig(){
        grunt.initConfig({
            pkg: grunt.file.readJSON('package.json'),
            uglify: {
                build: {
                    src: project.path.js + 'main.js',
                    dest: project.path.dist + project.current.version + '/js/skyForce.min.js'
                }
            },
            cssmin: {
                compress: {
                    files: {
                        "<%=pkg.path.dist%><%=pkg.current.version%>/css/skyForce.min.css": [
                            project.path.css + "*.css"
                        ]
                    }
                }
            }
        });
    }
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    initConfig();

    // 默认任务
    grunt.registerTask('publish', function (){
        project.current.version = "publish";
        grunt.task.run(publish_tasks);
    });
};