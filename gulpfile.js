var browsersync = require('browser-sync');
var cp          = require('child_process');
var gulp        = require('gulp');
var gutil       = require('gulp-util');
var sass        = require('gulp-sass');

var paths = {
    html: {
        src: './app/**/*.html',
    },
    jekyll: {
        src: './app',
        dist: './_site',
    },
    markdown: {
        src: './app/**/*.markdown',
    },
    styles: {
        src: './app/_sass/**/*.scss',
        dist: './app/css',
    }
};

gulp.task(jekyllbuild);
gulp.task(reload);
gulp.task(serve);
gulp.task(styles);
gulp.task(watch);
gulp.task('default',
    gulp.series(
        styles,
        jekyllbuild,
        gulp.parallel(serve, watch))
);

function jekyllbuild(done) {
    browsersync.notify('building jekyll');
    return cp.spawn('jekyll.bat',  ['build'], {stdio: 'inherit'})
        .on('close', done);
}

function reload(cb) {
    browsersync.reload();
    cb();
}

function serve() {
    browsersync.init({
        server: paths.jekyll.dist,
        notify: true
    })
}

function styles() {
    return gulp.src(paths.styles.src)
        //  .pipe(sass().on('error', sass.logError))
        .pipe(sass())
        .pipe(gulp.dest(paths.jekyll.dist + '/css'))
        .pipe(gulp.dest(paths.styles.dist))
}

function watch() {
    gulp.watch(paths.styles.src).on('change', gulp.series(styles, reload));
    gulp.watch(paths.html.src).on('change', gulp.series(jekyllbuild, reload));
    gulp.watch(paths.markdown.src).on('change', gulp.series(jekyllbuild, reload));
}
