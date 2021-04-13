var gulp = require('gulp');
var clean = require('gulp-clean');
var run = require('gulp-run-command').default;

gulp.task(
  'clean',
  gulp.series(
    async () => {
      gulp
        .src('coverage-output/*', {
          read: false,
        })
        .pipe(clean());
    },
    async () => {
      gulp
        .src('.nyc_output/*', {
          read: false,
        })
        .pipe(clean());
    },
  ),
);

gulp.task('build', gulp.series('clean', run('ng build ')));

gulp.task(
  'instrument',
  gulp.series(
    'build',
    run(
      'node_modules/nyc/bin/nyc.js instrument dist coverage-output/angular-test --exclude-after-remap=false --exclude=dist/lib/** --exclude=dist/vendor.js --exclude=dist/styles-*.js --exclude=dist/scripts.js --exclude=dist/polyfills-*.js',
    ),
    async () => {
      gulp.src('coverage-output/angular-test/*').pipe(gulp.dest('dist/'));
    },
    async () => {
      gulp.src('src/**/*').pipe(gulp.dest('dist/root/src/'));
    },
  ),
);

gulp.task('start', run('npm run lite-server --max-old-space-size=4096'));

gulp.task(
  'report',
  run('node_modules/nyc/bin/nyc.js report --reporter=lcov --report-dir=coverage-output'),
);