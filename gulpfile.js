var gulp = require('gulp');
var Karma = require('karma').Server;

var karmaConfig = {
    configFile: __dirname + '/karma.conf.js'
};

gulp.task('tdd', function(done) {
    new Karma(karmaConfig, done).start();
});
