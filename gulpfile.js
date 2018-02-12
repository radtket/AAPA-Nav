// initialize all of our variables
// let app;
// let base;
// let concat;
// let directory;
// let gulp;
// let gutil;
// let hostname;
// let path;
// let refresh;
// let sass;
// let uglify;
// let imagemin;
// let minifyCSS;
// let del;
// let browserSync;
// let autoprefixer;
// let gulpSequence;
// let shell;
// let sourceMaps;
// let plumber;
// load all of our dependencies// add more here if you want to include more libraries
const gulp = require('gulp');
const gutil = require('gulp-util');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const sass = require('gulp-sass');
const sassGlob = require('gulp-sass-glob');
const sourceMaps = require('gulp-sourcemaps');
const imagemin = require('gulp-imagemin');
const minifyCSS = require('gulp-minify-css');
const browserSync = require('browser-sync');
const autoprefixer = require('gulp-autoprefixer');
const gulpSequence = require('gulp-sequence').use(gulp);
const shell = require('gulp-shell');
const plumber = require('gulp-plumber');

const autoPrefixBrowserList = ['last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'];

gulp.task('browserSync', () => {
	browserSync({
		server: {
			baseDir: 'app/',
		},
		options: {
			reloadDelay: 250,
		},
		notify: false,
	});
});

// compressing images & handle SVG files
gulp.task('images', tmp => {
	gulp
		.src(['app/images/*.jpg', 'app/images/*.png'])
		// prevent pipe breaking caused by errors from gulp plugins
		.pipe(plumber())
		.pipe(imagemin({ optimizationLevel: 5, progressive: true, interlaced: true }))
		.pipe(gulp.dest('app/images'));
});

// compressing images & handle SVG files
gulp.task('images-deploy', () => {
	gulp
		.src(['app/images/**/*', '!app/images/README'])
		// prevent pipe breaking caused by errors from gulp plugins
		.pipe(plumber())
		.pipe(gulp.dest('dist/images'));
});

// compiling our Javascripts
gulp.task('scripts', () =>
	// this is where our dev JS scripts are
	gulp
		.src(['app/scripts/src/_includes/**/*.js', 'app/scripts/src/_vendor/**/*.js', 'app/scripts/src/**/*.js'])
		// prevent pipe breaking caused by errors from gulp plugins
		.pipe(plumber())
		// this is the filename of the compressed version of our JS
		.pipe(concat('app.js'))
		// catch errors
		.on('error', gutil.log)
		// where we will store our finalized, compressed script
		.pipe(gulp.dest('app/scripts'))
		// notify browserSync to refresh
		.pipe(browserSync.reload({ stream: true }))
);

// compiling our Javascripts for deployment
gulp.task('scripts-deploy', () =>
	// this is where our dev JS scripts are
	gulp
		.src(['app/scripts/src/_page/**/*.js'])
		// prevent pipe breaking caused by errors from gulp plugins
		.pipe(plumber())
		// this is the filename of the compressed version of our JS
		.pipe(concat('app.js'))
		// compress :D
		.pipe(uglify())
		// where we will store our finalized, compressed script
		.pipe(gulp.dest('dist/scripts'))
);

// compiling our SCSS files
gulp.task('styles', () =>
	// the initializer / master SCSS file, which will just be a file that imports everything
	gulp
		.src('app/styles/scss/site.scss')
		// prevent pipe breaking caused by errors from gulp plugins
		.pipe(
			plumber({
				errorHandler(err) {
					console.log(err);
					this.emit('end');
				},
			})
		)
		// get sourceMaps ready
		.pipe(sourceMaps.init())
		.pipe(sassGlob())
		// include SCSS and list every "include" folder
		.pipe(
			sass({
				errLogToConsole: true,
				includePaths: ['app/styles/scss/'],
			})
		)
		.pipe(
			autoprefixer({
				browsers: autoPrefixBrowserList,
				cascade: true,
			})
		)
		// catch errors
		.on('error', gutil.log)
		// the final filename of our combined css file
		.pipe(concat('styles.css'))
		// get our sources via sourceMaps
		.pipe(sourceMaps.write())
		// where to save our final, compressed css file
		.pipe(gulp.dest('app/styles'))
		// notify browserSync to refresh
		.pipe(browserSync.reload({ stream: true }))
);

// compiling our SCSS files for deployment
gulp.task('styles-deploy', () =>
	// the initializer / master SCSS file, which will just be a file that imports everything
	gulp
		.src('app/styles/scss/init.scss')
		.pipe(plumber())
		// include SCSS includes folder
		.pipe(sassGlob())
		.pipe(
			sass({
				includePaths: ['app/styles/scss'],
			})
		)
		.pipe(
			autoprefixer({
				browsers: autoPrefixBrowserList,
				cascade: true,
			})
		)
		// the final filename of our combined css file
		.pipe(concat('styles.css'))
		.pipe(minifyCSS())
		// where to save our final, compressed css file
		.pipe(gulp.dest('dist/styles'))
);

// basically just keeping an eye on all HTML files
gulp.task('html', () =>
	// watch any and all HTML files and refresh when something changes
	gulp
		.src('app/*.html')
		.pipe(plumber())
		.pipe(browserSync.reload({ stream: true }))
		// catch errors
		.on('error', gutil.log)
);

// migrating over all HTML files for deployment
gulp.task('html-deploy', () => {
	// grab everything, which should include htaccess, robots, etc
	gulp
		.src('app/*')
		// prevent pipe breaking caused by errors from gulp plugins
		.pipe(plumber())
		.pipe(gulp.dest('dist'));

	// grab any hidden files too
	gulp
		.src('app/.*')
		// prevent pipe breaking caused by errors from gulp plugins
		.pipe(plumber())
		.pipe(gulp.dest('dist'));

	gulp
		.src('app/fonts/**/*')
		// prevent pipe breaking caused by errors from gulp plugins
		.pipe(plumber())
		.pipe(gulp.dest('dist/fonts'));

	// grab all of the styles
	gulp
		.src(['app/styles/*.css', '!app/styles/styles.css'])
		// prevent pipe breaking caused by errors from gulp plugins
		.pipe(plumber())
		.pipe(gulp.dest('dist/styles'));
});

// cleans our dist directory in case things got deleted
gulp.task('clean', () => shell.task(['rm -rf dist']));

// create folders using shell
gulp.task('scaffold', () =>
	shell.task(['mkdir dist', 'mkdir dist/fonts', 'mkdir dist/images', 'mkdir dist/scripts', 'mkdir dist/styles'])
);

// this is our master task when you run `gulp` in CLI / Terminal
// this is the main watcher to use when in active development
//  this will:
//  startup the web server,
//  start up browserSync
//  compress all scripts and SCSS files
gulp.task('default', ['browserSync', 'scripts', 'styles'], () => {
	// a list of watchers, so it will watch all of the following files waiting for changes
	gulp.watch('app/scripts/src/**', ['scripts']);
	gulp.watch('app/styles/scss/**', ['styles']);
	gulp.watch('app/images/**', ['images']);
	gulp.watch('app/*.html', ['html']);
});

// this is our deployment task, it will set everything for deployment-ready files
gulp.task(
	'deploy',
	gulpSequence('clean', 'scaffold', ['scripts-deploy', 'styles-deploy', 'images-deploy'], 'html-deploy')
);
