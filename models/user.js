// Load system modules

// Load modules
var Promise = require( 'bluebird' );
var debug = require( 'debug' )( 'models:user' );
var mongoose = require( 'mongoose' );
var _ = require( 'lodash' );

// Load my modules
var tags = require( '../YourExpo2015/tags/index.js' );

// Constant declaration


// Module variables declaration
var Schema = mongoose.Schema;

// Module initialization (at first load)

var UserSchema = new Schema( {
  /**
   * Provider for the user.
   * Can be `instagram`, `facebook`, etc
   *
   * @type {String}
   */
  username: {
    type: String,
    index: true,
    unique: true,
    required: true
  },

  greeted: {
    type: Boolean,
    index: true
  },
  greetedTimestamp: {
    type: Date
  },

  followed: {
    type: Boolean,
    index: true
  },
  followedTimestamp: {
    type: Date
  },

  invited: {
    type: Boolean,
    index: true
  },
  invitedTimestamp: {
    type: Date
  }

}, {
  /**
   * Allow to save custom fields to the document
   * @type {Boolean}
   */
  strict: false
} );


_.each( tags, function( tag, name ) {
  var data = { name: name };
  var greetedName = _.template( 'greeted${name}', data );
  var greetedTimestampName = _.template( 'greeted${name}Timestamp', data );
  var likedName = _.template( 'likes${name}', data );
  var likedTimestampName = _.template( 'likes${name}Timestamp', data );

  var fields = {};

  fields[ greetedName ] = {
    type: Boolean,
    index: true
  };
  fields[ greetedTimestampName ] = {
    type: Date
  };
  fields[ likedName ] = {
    type: Boolean,
    index: true
  };
  fields[ likedTimestampName ] = {
    type: Date
  };

  // Add the new fields
  UserSchema.add( fields );
} );


/**
 * Model static methods
 */
UserSchema.statics.findOrCreateUser = function( username, callback ) {
  var Model = this;

  return Model
  .findOne()
  .where( 'username', username )
  .execAsync()
  .then( function( user ) {
     var notPresent = !user;

    if( notPresent ) {
      user = new Model( {
        username: username
      } );

      return user
      .saveAsync();
    }

    return [ user ];
  } )
  .spread( function( user ) {
    return user;
  } )
  .nodeify( callback );
};

/**
 * Model instance methods
 */


module.exports = UserSchema;

//  50 6F 77 65 72 65 64  62 79  56 6F 6C 6F 78