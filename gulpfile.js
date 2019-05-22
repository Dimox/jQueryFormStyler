var gulp         = require('gulp'),
		autoprefixer = require('gulp-autoprefixer'),
		browserSync  = require('browser-sync').create(),
		csscomb      = require('gulp-csscomb'),
		header       = require('gulp-header'),
		notify       = require('gulp-notify'),
		plumber      = require('gulp-plumber'),
		rename       = require('gulp-rename'),
		stylus       = require('gulp-stylus'),
		uglify       = require('gulp-uglify');

gulp.task('default:dist', ['stylus:dist']);
gulp.task('default:test', ['stylus:test', 'webserver:test']);

var pkg = require('./package.json');
var head = ['/* jQuery Form Styler v<%= pkg.version %> | (c) Dimox | https://github.com/Dimox/jQueryFormStyler */\n'];
var path = {
	test: '../test/',
	dist: 'dist/',
	src: {
		js: 'dist/jquery.formstyler.js',
		style: 'src/*.styl',
	},
};

gulp.task('minify-js', function() {
	gulp.src(path.src.js)
		.pipe(uglify())
		.pipe(header(head, {pkg}))
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest(path.dist));
});

gulp.task('stylus:dist', function() {
	gulp.src(path.src.style)
		.pipe(plumber({errorHandler: notify.onError("Ошибка: <%= error.message %>")}))
		.pipe(stylus())
		.pipe(autoprefixer({
			browsers: ['last 2 versions', 'ie 10', 'Safari 7']
		}))
		.pipe(csscomb())
		.pipe(gulp.dest(path.dist))
		.pipe(browserSync.stream())
	;
});

gulp.task('stylus:test', function() {
	gulp.src(path.src.style)
		.pipe(plumber({errorHandler: notify.onError("Ошибка: <%= error.message %>")}))
		.pipe(stylus())
		.pipe(autoprefixer({
			browsers: ['last 2 versions', 'ie 10', 'Safari 7']
		}))
		.pipe(csscomb())
		.pipe(gulp.dest(path.test))
		.pipe(browserSync.stream())
	;
});

gulp.task('webserver:test', ['watch:test'], function() {
	browserSync.init({
		server: {
			baseDir: path.test
		},
		scrollProportionally: false,
	});
});

gulp.task('watch:test', function() {
	browserSync.watch(path.src.style).on('change', function () { gulp.start('stylus:test'); });
});