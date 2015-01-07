var gulp = require( 'gulp' );
var autoprefixer = require( 'gulp-autoprefixer' );



var paths = {
  cssSrc: 'public/style/*.css',
  css: 'public/css'
};


gulp.task( 'prefix', function() {
  return gulp.src( paths.cssSrc )
  .pipe( autoprefixer( {
    cascade: false,
    remove: true
  } ) )
  .pipe( gulp.dest( paths.css ) );
} );


// Rerun the task when a file changes
gulp.task( 'watch', function() {
  gulp.watch( paths.cssSrc, [ 'prefix' ] );
} );

gulp.task( 'default', [ 'watch', 'prefix' ] );