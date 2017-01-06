const gulp = require('gulp');
const runSequence = require('run-sequence');

require('./clean');
require('./handlebars');
require('./copy');

gulp.task('build', () => {
  return runSequence('clean', [
    'webpack',
    'handlebars',
    'copyHtml',
    'copyContent',
    'copyJs'
  ]);
});
