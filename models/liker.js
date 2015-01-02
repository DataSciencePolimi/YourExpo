// Load system modules

// Load modules
var Promise = require( 'bluebird' );
var debug = require( 'debug' )( 'models:likers' );
var mongoose = require( 'mongoose' );

// Load my modules


// Constant declaration


// Module variables declaration
var Schema = mongoose.Schema;

// Module initialization (at first load)

var LikersSchema = new Schema( {
  /**
   * The timestamp of the captured likers
   * @type {Date}
   */
  timestamp: {
    type: Date,
    required: true,
    default: Date.now
  },
  /**
   * The List of likers.
   * @type {String}
   */
  list: {
    type: [String],
    required: true
  }
} );


module.exports = LikersSchema;

//  50 6F 77 65 72 65 64  62 79  56 6F 6C 6F 78