// Load system modules

// Load modules
var Promise = require( 'bluebird' );
var _ = require( 'lodash' );
var debug = require( 'debug' )( 'fixer' );
var mongoose = require( 'mongoose' );
var moment = require( 'moment' );
var argv = require( 'yargs' ).argv;


// Load my modules
var tags = require( '../tags/' );
var rootConfig = require('../../config/');
var config = require( './config/' );
var initMongo = require( '../../models/' );
var actions = require('./actions.js');




// Constant declaration

// Module variables declaration
var Model = mongoose.model(rootConfig.mongo.collections.photo);
var tag = argv._[ 0 ];
var tagObject;




// Module initialization (at first load)
function getData() {
  return Model
  .find()
  .select( '-raw' )
  .where( 'tag', tag )
  .where( 'liked' ).ne( true )
  .execAsync()
  .then( function( documents ) {
    debug( 'Fixing %d documents', documents.length );
    return actions( documents );
  } )
  ;
}



// Entry point

if( _.isUndefined( tags[ tag ] ) ) {
  debug( 'Tag "%s" not present in the configuration', tag );
  return;
}
tagObject = tags[ tag ];

Promise
.resolve()
.then( initMongo )
.catch( debug )
.then( getData )
.catch( debug )
.finally( function() {
  debug( 'Finished' );

  return mongoose
  .disconnectAsync();
} )
;

//  50 6F 77 65 72 65 64  62 79  56 6F 6C 6F 78