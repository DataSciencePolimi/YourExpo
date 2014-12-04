// Load system modules
var url = require( 'url' );

// Load modules
var moment = require( 'moment' );
var debug = require( 'debug' )( 'config:index' );

// Load my modules





// Constant declaration

// Module variables declaration
var config = {};


// Module initialization (at first load)

// Facebook
config.facebook = require( './facebook.json' );
// Twitter
config.twitter = require( './twitter.json' );
// Instagram
config.instagram = require( './instagram.json' );


// MongoDB configuration
config.mongo = {
  url: 'mongodb://localhost/YourEXPO2015',
  collections: {
    post: 'Post',
    photo: 'Photo',
    user: 'User'
  }
};

// Web Server
config.server = {
  port: 80,
  //hostname: 'volox.io',
  // externalUrl: 'http://volox.io/'
  externalUrl: 'http://131.175.59.93/'
};

// CS
config.crowdSearcher = {
  url: 'http://localhost:4322',
  addObjectLocation: '/api/objects',
  taskId: '546f1a90695672dc4e526991'
};



// Module exports
module.exports = config;



//  50 6F 77 65 72 65 64  62 79  56 6F 6C 6F 78