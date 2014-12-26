// Load system modules

// Load modules
var Promise = require( 'bluebird' );
var debug = require( 'debug' )( 'models:index' );
var mongoose = require( 'mongoose' );


// Load my modules
var config = require( '../config/' );
var ProfileSchema = require( './profile.js' );
var UserSchema = require( './user.js' );
var PhotoSchema = require( './photo.js' );
var PostSchema = require( './post.js' );

// Constant declaration


// Module variables declaration
function resolver( resolve, reject ) {
  mongoose.connect( config.mongo.url );

  var connection = mongoose.connection;

  connection.on( 'open', resolve );
  connection.on( 'error', reject );
}

// Module initialization (at first load)
Promise.promisifyAll( mongoose );

var collections = config.mongo.collections;
mongoose.model( collections.profile, ProfileSchema );
mongoose.model( collections.photo, PhotoSchema );
mongoose.model( collections.post, PostSchema );
// mongoose.model( collections.user, UserSchema );



module.exports = function() {
  var connectionPromise = new Promise( resolver );

  return connectionPromise;
};

//  50 6F 77 65 72 65 64  62 79  56 6F 6C 6F 78