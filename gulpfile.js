var gulp = require('gulp'),
  connect = require('gulp-connect');

//Server
gulp.task('server', function() {
	connect.server({
    name: 'Dev App',
    root: 'src/page',
    port: 8000,
    livereload: true,
		open : true,
  });
});

gulp.task('html', function () {
  gulp.src('./src/page/*.html')
    .pipe(connect.reload());
});

gulp.task('watch', function () {
  gulp.watch(['./src/page/*.html'], ['html']);
});

gulp.task('serve',['server','watch'])
