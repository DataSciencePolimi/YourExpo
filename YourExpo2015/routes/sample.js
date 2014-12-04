// Load system modules

// Load modules
var _ = require( 'lodash' );
var debug = require( 'debug' )( 'yourexpo:routes:vote' );
var mongoose = require( 'mongoose' );
var moment = require( 'moment' );

// Load my modules



// Constant declaration


// Module variables declaration
var instagramVotes = 0;
var facebookVotes = 0;
var twitterVotes = 0;
var numVotes = 100;


// Module initialization (at first load)


module.exports = function( req, res, next ) {
  var Model = mongoose.model( 'Post' );
  var id = req.params.id;

  debug( 'Fake data for: %s', id );

  Model
  .findById( id )
  .execAsync()
  .then( function( post ) {
    if( !post )
      throw new Error( 'Post not found' );


    var time = moment().utc();
    // Fake data
    _.times( numVotes, function() {
      instagramVotes += _.random( 0, 10 );
      facebookVotes += _.random( 0, 10 );
      twitterVotes += _.random( 0, 10 );

      time.add( _.random( 0, 24*60*60*1000 ), 'milliseconds' );

      post.instagram.push( {
        timestamp: time.clone().add( _.random( 0, 60*60*1000 ), 'milliseconds' ).toDate(),
        votes: instagramVotes
      } );

      post.twitter.push( {
        timestamp: time.clone().add( _.random( 0, 60*60*1000 ), 'milliseconds' ).toDate(),
        votes: twitterVotes
      } );

      post.facebook.push( {
        timestamp: time.clone().add( _.random( 0, 60*60*1000 ), 'milliseconds' ).toDate(),
        votes: facebookVotes
      } );

      post.platform.push( {
        timestamp: time.clone().add( _.random( 0, 60*60*1000 ), 'milliseconds' ).toDate(),
        votes: 1
      } );
    } );

    return post
    .saveAsync();
  } )
  .spread( function( post ) {
    return res.json( post );
  } )
  .catch( next );
};


//  50 6F 77 65 72 65 64  62 79  56 6F 6C 6F 78