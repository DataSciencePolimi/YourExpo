// Load system modules

// Load modules
var Promise = require( 'bluebird' );
var debug = require( 'debug' )( 'models:comment' );
var mongoose = require( 'mongoose' );

// Load my modules


// Constant declaration


// Module variables declaration
var Schema = mongoose.Schema;

// Module initialization (at first load)

var CommentSchema = new Schema( {
  /**
   * The timestamp of the captured votes
   * @type {Date}
   */
  timestamp: {
    type: Date,
    required: true
  },

  id: {
    type: String,
    required: true,
    unique: true,
    index: true
  },

  postId: {
    type: String,
    required: true,
    index: true
  },

  username: {
    type: String,
    required: true,
    index: true
  },

  userId: {
    type: String,
    required: true,
    index: true
  },

  text: String
} );


module.exports = CommentSchema;

//  50 6F 77 65 72 65 64  62 79  56 6F 6C 6F 78