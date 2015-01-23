var fs = require( 'fs' );
var memwatch = require( 'memwatch' );
var heapdump = require( 'heapdump' );

var fileName = __dirname+'/memory/data-'+Date.now()+'.csv';
var heapdumpFileName = __dirname+'/memory/heapdump-';

fs.appendFileSync( fileName, 'num_full_gc,num_inc_gc,heap_compactions,usage_trend,estimated_base,current_base,min,max\n' );

memwatch.on( 'stats', function( stats ) {
  var info = [];
  info.push( stats[ 'num_full_gc' ] );
  info.push( stats[ 'num_inc_gc' ] );
  info.push( stats[ 'heap_compactions' ] );
  info.push( stats[ 'usage_trend' ] );
  info.push( stats[ 'estimated_base' ] );
  info.push( stats[ 'current_base' ] );
  info.push( stats[ 'min' ] );
  info.push( stats[ 'max' ] );

  fs.appendFile( fileName, info.join( ',' ) + '\n' );
} );

var index = 0;
module.exports = function() {
  index += 1;
  heapdump.writeSnapshot( heapdumpFileName+index+'.heapsnapshot' );
};