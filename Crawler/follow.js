// Load system modules

// Load modules
var Promise = require( 'bluebird' );
var _ = require( 'lodash' );
var debug = require( 'debug' )( 'follow' );
var mongoose = require( 'mongoose' );
var moment = require( 'moment' );


// Load my modules
// var tags = require( '../tags/' );
var config = require( '../config/' );
var initMongo = require( '../models/' );
var Instagram = require( './social/instagram.js' );


// Module variables declaration
var photoCollectionName = config.mongo.collections.photo;
var userCollectionName = config.mongo.collections.user;
var Photo = mongoose.model( photoCollectionName );
var User = mongoose.model( userCollectionName );

// Constant declaration

// Module variables declaration
var instagram = new Instagram( config.instagram.follow );


function handleFatalError( err ) {
  debug( 'Fatal error: %s', err.message );
  debug( err );

  return mongoose
  .disconnectAsync()
  .then( function() {
    process.exit( 1 );
  } );
}



function followUser( rawUser ) {
  debug( 'Following user %s', rawUser.userId );


  return instagram.followUser( rawUser.userId )
  .then( function addUser() {
    var user = new User( rawUser );

    user.followed = true;
    user.followedTimestamp = moment().utc().toDate();

    return user
    .saveAsync();
  } )
  .catch( function( err ) {
    debug( 'Follow error: %j', err );
  } );
}

function loop() {
  debug( 'Loop init' );
  var start = moment();


  User
  .find()
  .where( 'followed', true )
  .select( 'username' )
  .execAsync()
  .then( function mapUsernames( users ) {

    var usernames = _.map( users, 'username' );

    return usernames;
  } )
  .then( function getUsersToFollow( followedUsernames ) {
    debug( 'Followed usernames: %d', followedUsernames.length );

    return Photo
    .find()
    .where( 'raw.user.username' ).nin( followedUsernames )
    .select( 'raw.user' )
    .lean()
    .execAsync();
  } )
  .then( function( data ) {
    debug( 'Found %d users to follow', data.length );
    if( data.length===0 ) return data;

    data = _.pluck( data, 'raw' );
    data = _.pluck( data, 'user' );

    var users = _.uniq( data, 'id' );
    users = _.map( users, function( user ) {
      return {
        username: user.username,
        userId: user.id
      };
    } );

    return users;
  } )
  .then( function mapUsersToFollow( usersToFollow ) {
    if( usersToFollow.length===0 ) return;

    var promise = followUser( usersToFollow[ 0 ] );

    for( var i=1; i<usersToFollow.length; i++ ) {
      promise = promise
      .return( usersToFollow[ i ] )
      .then( followUser );
    }

    return promise;
  } )
  .then( function() {
    debug( 'Followed all users' );
  } )
  .then( function() {
    var diff = moment().diff( start, 'h', true );
    if( diff<1 ) {
      var interval = ( 1 - diff )*60*60;
      debug( 'Pausing for %d seconds', interval );

      return Promise
      .delay( interval*1000 );
    }
  } )
  .then( function() {
    debug( 'Loop ended' );

    setImmediate( loop );
  } );
}

// Module initialization (at first load)


// Entry point
initMongo()
.then( loop )
.catch( handleFatalError );

//  50 6F 77 65 72 65 64  62 79  56 6F 6C 6F 78