/**
 *
 *  Web Starter Kit
 *  Copyright 2015 Google Inc. All rights reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License
 *
 */

'use strict';

// Include gulp & tools we'll use
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var del = require('del');
var runSequence = require('run-sequence');
var browserSync = require('browser-sync');
var pagespeed = require('psi');
var reload = browserSync.reload;
var swPrecache = require('sw-precache');
var fs = require('fs');
var path = require('path');
var packageJson = require('./package.json');
var wiredep = require('wiredep').stream;

var appDirectory = '<%= appDir %>';

// Lint JavaScript
gulp.task('jshint', function () {
  return gulp.src([
      appDirectory + '/**/*.js',
      '!**/bower_components/**/*.js',
      '!**/*min.js'
    ])
    .pipe(reload({stream: true, once: true}))
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'))
    .pipe($.if(!browserSync.active, $.jshint.reporter('fail')));
});

// Optimize images
gulp.task('images', function () {
  return gulp.src(appDirectory + '/assets/images/**/*')
    .pipe($.cache($.imagemin({
      progressive: true,
      interlaced: true
    })))
    .pipe(gulp.dest('dist/assets/images'))
    .pipe($.size({title: 'images'}));
});

// Copy all files at the root level (app)
gulp.task('copy', function () {
  return gulp.src([
      appDirectory + '/*',
      '!' + appDirectory + '/*.html',
      'node_modules/apache-server-configs/dist/.htaccess'
    ], {
      dot: true
    })
    .pipe(gulp.dest('dist'))
    .pipe($.size({title: 'copy'}));
});

// Copy web fonts to dist
gulp.task('fonts', function () {
  return gulp.src([appDirectory + '/assets/fonts/**'])
    .pipe(gulp.dest('dist/assets/fonts'))
    .pipe($.size({title: 'fonts'}));
});

// Compile and automatically prefix stylesheets
gulp.task('styles', function () {

  var AUTOPREFIXER_BROWSERS = [
    'ie >= 10',
    'ie_mob >= 10',
    'ff >= 30',
    'chrome >= 34',
    'safari >= 7',
    'opera >= 23',
    'ios >= 7',
    'android >= 4.4',
    'bb >= 10'
  ];

  // For best performance, don't add Sass partials to `gulp.src`
  return gulp.src([
      appDirectory + '/assets/styles/**/*.scss',
      appDirectory + '/assets/styles/**/*.css',
      '!' + appDirectory + '/assets/styles/**/_*.scss'
    ])
    .pipe($.changed('.tmp/assets/styles', {extension: '.css'}))
    .pipe($.sourcemaps.init())
    .pipe($.sass({
      precision: 10,
      loadPath: [
        appDirectory + '/assets/styles'
      ]
    })
    .on('error', $.sass.logError))
    .pipe($.autoprefixer(AUTOPREFIXER_BROWSERS))
    .pipe(gulp.dest('.tmp/assets/styles'))
    // Concatenate and minify styles
    .pipe($.if('*.css', $.csso()))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest('dist/assets/styles'))
    .pipe($.size({title: 'styles'}));
});

// Concatenate and minify JavaScript
gulp.task('scripts', function () {
  var sources = [appDirectory + '/assets/scripts/main.js'];
  return gulp.src(sources)
    .pipe($.concat('main.min.js'))
    .pipe($.uglify({preserveComments: 'some'}))
    // Output files
    .pipe(gulp.dest('dist/assets/scripts'))
    .pipe($.size({title: 'scripts'}));
});

// Add bower dependencies
gulp.task('bower', function () {
  gulp.src([
      appDirectory + '/**/*.html'
    ])
    .pipe(wiredep())
    .pipe(gulp.dest(appDirectory));
    
  return gulp.src([
      appDirectory + '/assets/styles/**/*.{scss,sass}'
    ])
    .pipe(wiredep())
    .pipe(gulp.dest(appDirectory + '/assets/styles'));
});

// Scan your HTML for assets & optimize them
gulp.task('html', function () {
  var assets = $.useref.assets({searchPath: '{.tmp,' + appDirectory + '}'});

  return gulp.src(appDirectory + '/**/*.html')
    .pipe(assets)
    // Remove any unused CSS
    // Note: If not using the Style Guide, you can delete it from
    // the next line to only include styles your project uses.
    .pipe($.if('*.css', $.uncss({
      html: [
        appDirectory + '/index.html'
      ]
    })))

    // Concatenate and minify styles
    // In case you are still using useref build blocks
    .pipe($.if('*.css', $.csso()))
    .pipe(assets.restore())
    .pipe($.useref())

    // Minify any HTML
    .pipe($.if('*.html', $.minifyHtml()))
    // Output files
    .pipe(gulp.dest('dist'))
    .pipe($.size({title: 'html'}));
});

// Clean output directory
gulp.task('clean', del.bind(null, ['.tmp', 'dist/*', '!dist/.git'], {dot: true}));

// Watch files for changes & reload
gulp.task('serve', ['prepare'], function () {
  browserSync({
    notify: false,
    // Customize the BrowserSync console logging prefix
    logPrefix: 'B&CAG',
    // Run as an https by uncommenting 'https: true'
    // Note: this uses an unsigned certificate which on first access
    //       will present a certificate warning in the browser.
    // https: true,
    server: ['.tmp', appDirectory]
  });

  gulp.watch([appDirectory + '/**/*.html'], reload);
  gulp.watch([appDirectory + '/assets/styles/**/*.{scss,css}'],
    ['styles', reload]);
  gulp.watch([appDirectory + '/assets/scripts/**/*.js'], ['jshint']);
  gulp.watch([appDirectory + '/assets/images/**/*'], reload);
});


// Build and serve the output from the dist build
gulp.task('serve:dist', ['default'], function () {
  browserSync({
    notify: false,
    logPrefix: 'B&CAG',
    // Run as an https by uncommenting 'https: true'
    // Note: this uses an unsigned certificate which on first access
    //       will present a certificate warning in the browser.
    // https: true,
    server: 'dist',
    baseDir: 'dist'
  });
});

gulp.task('prepare', ['clean'], function (cb) {
  runSequence('bower', 'styles', cb);
});

// Build production files, the default task
gulp.task('default', ['clean'], function (cb) {
  runSequence(
    'prepare',
    ['jshint', 'html', 'scripts', 'images', 'fonts', 'copy'],
    'generate-service-worker',
    cb);
});

// Run PageSpeed Insights
gulp.task('pagespeed', function (cb) {
  // Update the below URL to the public URL of your site
  pagespeed.output('example.com', {
    strategy: 'mobile',
    // By default we use the PageSpeed Insights free (no API key) tier.
    // Use a Google Developer API key if you have one: http://goo.gl/RkN0vE
    // key: 'YOUR_API_KEY'
  }, cb);
});

// See http://www.html5rocks.com/en/tutorials/service-worker/introduction/ for
// an in-depth explanation of what service workers are and why you should care.
// Generate a service worker file that will provide offline functionality for
// local resources. This should only be done for the 'dist' directory, to allow
// live reload to work as expected when serving from the 'app' directory.
gulp.task('generate-service-worker', function (callback) {
  var rootDir = 'dist';

  swPrecache({
    // Used to avoid cache conflicts when serving on localhost.
    cacheId: packageJson.name || 'bits-co-app-generator',
    // URLs that don't directly map to single static files can be defined here.
    // If any of the files a URL depends on changes, then the URL's cache entry
    // is invalidated and it will be refetched.
    // Generally, URLs that depend on multiple files (such as layout templates)
    // should list all the files; a change in any will invalidate the cache.
    // In this case, './' is the top-level relative URL, and its response
    // depends on the contents of the file 'dist/index.html'.
    dynamicUrlToDependencies: {
      './': [path.join(rootDir, 'index.html')]
    },
    staticFileGlobs: [
      // Add/remove glob patterns to match your directory setup.
      rootDir + '/assets/fonts/**/*.woff',
      rootDir + '/assets/images/**/*',
      rootDir + '/assets/scripts/**/*.js',
      rootDir + '/assets/styles/**/*.css',
      rootDir + '/*.{html,json}'
    ],
    // Translates a static file path to the relative URL that it's served from.
    stripPrefix: path.join(rootDir, path.sep)
  }, function (error, serviceWorkerFileContents) {
    if (error) {
      return callback(error);
    }
    fs.writeFile(path.join(rootDir, 'service-worker.js'),
      serviceWorkerFileContents, function (error) {
      if (error) {
        return callback(error);
      }
      callback();
    });
  });
});

// Load custom tasks from the `tasks` directory
// try { require('require-dir')('tasks'); } catch (err) { console.error(err); }
