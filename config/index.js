// Load system modules

// Load modules
var Promise = require( 'bluebird' );
var _ = require( 'lodash' );
var debug = require( 'debug' )( 'config:index' );

// Load my modules





// Constant declaration

// Module variables declaration
var config = {};


// Module initialization (at first load)
Promise.prototype.log = function( out, message /*, args... */ ) {
  var args = _.toArray( arguments ).slice( 2 );
  _.partial( out, message ).apply( null, args );
  return this;
};


// Facebook
// config.facebook = require( './facebook.json' );
// Twitter
config.twitter = require( './twitter.json' );
// Instagram
config.instagram = require( './instagram.json' );


// Crawler config
config.crawler = {
  minVotes: 50 // Min votes to post to the CS
};
// Gallery config
config.gallery = {
  minVotes: 50,
  maxImages: 20
};

// MongoDB configuration
config.mongo = {
  url: 'mongodb://localhost/YourExpo2015',
  collections: {
    post: 'Post',
    photo: 'Photo',
    user: 'User'
  }
};

// Web Server
config.server = {
  port: 4324,
  //hostname: 'volox.io',
  // externalUrl: 'http://volox.io/'
  externalUrl: 'http://expo2015.como.polimi.it/'
};

// CS
config.crowdSearcher = {
  url: 'http://localhost:4322',
  addObjectLocation: '/api/objects',
  taskId: '548189150b412c40510b952f'
};



// Module exports
module.exports = config;



//  50 6F 77 65 72 65 64  62 79  56 6F 6C 6F 78
