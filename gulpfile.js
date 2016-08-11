var gulp = require('gulp'),
  connect = require('gulp-connect');
var $ = require('gulp-load-plugins')();
//Server
gulp.task('server', function() {
	connect.server({
    name: 'Dev App',
    root: ['./','src/.tmp'],
    port: 8000,
    livereload: true,
		open : true,
  });
});

gulp.task('stylus',['inject'], function () {
  return gulp.src('./src/css/*.styl')
    .pipe($.stylus())
    .pipe(gulp.dest('./src/css/build'))
		.pipe(connect.reload())
});

gulp.task('html', ['inject'] , function () {
  gulp.src('./src/page/*.html')
    .pipe(connect.reload());
});

gulp.task('script', ['inject'] , function () {
  gulp.src('./src/js/*.js')
    .pipe(connect.reload());
});

gulp.task('watch', function () {
  gulp.watch(['./src/page/*.html'], ['html']);
	gulp.watch(['./src/css/*.styl'], ['stylus']);
	gulp.watch(['./src/js/*.js'], ['script']);
});

gulp.task('inject' , function(){
	var target = gulp.src('./src/page/index.html');
  var sources = gulp.src(['./src/**/**/*.css','./src/**/*.js'], {read: false});
  return target.pipe($.inject(sources))
    .pipe(gulp.dest('./src/.tmp/'));
})

gulp.task('serve',['server','watch','stylus','inject'])
