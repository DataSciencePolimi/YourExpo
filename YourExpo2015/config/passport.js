// Load system modules
var url = require( 'url' );

// Load modules
var mongoose = require( 'mongoose' );
var passport = require( 'passport' );
var debug = require( 'debug' )( 'config:passport' );
var InstagramStrategy = require( 'passport-instagram' ).Strategy;

// Load my modules
var config = require( '../../config/' );



// Constant declaration
var profileCollectionName = config.mongo.collections.profile;

// Module variables declaration
function instagramStrategyCallback( accessToken, refreshToken, profile, done ) {
  var Profile = mongoose.model( profileCollectionName );

  Profile
  .find()
  .where( 'provider', 'instagram' )
  .where( 'providerId', profile.id )
  .execAsync()
  .spread( function( user ) {

    if( !user ) {
      // Create one
      user = new Profile( {
        provider: 'instagram',
        providerId: profile.id,
        token: accessToken,
        refreshToken: refreshToken,
        profile: profile,
        username: profile.username,
        email: profile._json.data.email || '',
        fullName: profile._json.data.full_name,
        profilePicture: profile._json.data.profile_picture,
        bio: profile._json.data.bio || '',
      } );

      return user
      .saveAsync();
    }

    // Return
    return [user];
  } )
  .spread( function( user ) {
    return done( null, user );
  }, function( err ) {
    return done( err );
  } );
  //.nodeify( done, { spread: true } );
}



// Do nothing Jon Snow
module.exports = function( app ) {

  app.on( 'mount', function() {
    var callbackURL = url.resolve( app.baseUrl, 'auth/instagram/callback' );

    var instagramStrategy = new InstagramStrategy( {
      clientID: config.instagram.web.clientId,
      clientSecret: config.instagram.web.clientSecret,
      callbackURL: callbackURL
    }, instagramStrategyCallback );



    // Module initialization (at first load)
    /**
     * Serialize the user in the session.
     * @param  {Object}   user The user to serialize
     * @param  {Function} done Callback when finished
     */
    passport.serializeUser( function( user, done ) {
      // debug( 'Serializing user: %j', user );
      //
      done( null, user._id );
    } );
    /**
     * Deserialize the user from the session, get the Mongoose Profile.
     * @param  {String}   id   The id of the user.
     * @param  {Function} done Callback when finished.
     */
    passport.deserializeUser( function( id, done ) {
      // debug( 'Deserializing user: %s', id );
      //
      var Profile = mongoose.model( profileCollectionName );

      Profile
      .findById( id )
      .execAsync()
      .then( function( user ) {
        return done( null, user );
      }, function( err ) {
        return done( err );
      } );
    } );

    // Passport strategies
    passport.use( instagramStrategy );


  } );
};


//  50 6F 77 65 72 65 64  62 79  56 6F 6C 6F 78