var gulp         = require('gulp');
var autoprefixer = require('gulp-autoprefixer');
var browsersync  = require('browser-sync');
var cp			 = require('child_process');
var concat       = require('gulp-concat');
var cssnano      = require('gulp-cssnano');
var sass         = require('gulp-sass');
var sourcemaps   = require('gulp-sourcemaps');
var uglify       = require('gulp-uglify');
var util		 = require('gulp-util');

var basePath = {
	src: 'app/src/',
	dist: 'app/dist/'
}
var assetsPath = {
	html: {
		src: basePath.src + '/**/*.html'
	},
	markdown: {
		src: basePath.src + '/**/*.md'
	},
	jekyll: {
		src: basePath.dist
	},
	scripts: {
		src: basePath.src + '/_js/**/*.js',
		dist: basePath.dist + '/js/'
	},
	styles: {
		src: basePath.src + '/_sass/**/*.scss',
		dist: basePath.dist + '/css/'
	}
}

gulp.task(build);
gulp.task(reload);
gulp.task(scripts);
gulp.task(serve);
gulp.task(styles);
gulp.task(watch);
gulp.task('default',
	gulp.series(
		build,
		scripts,
		styles,
		gulp.parallel(serve, watch)
	)
)

function scripts() {
	return gulp.src(assetsPath.scripts.src)
		.pipe(gulp.dest(assetsPath.scripts.dist))
		.pipe(browsersync.stream());
}

function styles() {
	return gulp.src(assetsPath.styles.src)
		.pipe(sass().on('error', sass.logError))
		.pipe(gulp.dest(assetsPath.styles.dist))
		.pipe(browsersync.stream());
}

function build(done) {
	return cp.spawn('jekyll.bat', ['build','--profile'], {stdio: 'inherit'}).on('close', done);
}

function reload() {
	browsersync.reload();
}

function serve() {
    browsersync.init({server: assetsPath.jekyll.src});
}

function watch() {
	gulp.watch(assetsPath.html.src).on('change', gulp.series(build, reload));
	gulp.watch(assetsPath.markdown.src).on('change', gulp.series(build, reload));
	gulp.watch(assetsPath.scripts.src).on('change', scripts);
	gulp.watch(assetsPath.styles.src).on('change', styles);
}
