var Promise = require( 'bluebird' );
Promise.longStackTraces();

var SIZE=1024*1024;

function crawlLoop() {
  var arr = [];
  for( var i=0; i<SIZE; i++ ) {
    arr.push( {} );
  }

  return Promise
  .resolve( arr )
  .then( crawlLoop );
  // .then( function() { setImmediate( crawlLoop ); } );
}

crawlLoop();
