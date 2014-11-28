// Load system modules

// Load modules
var Promise = require( 'bluebird' );
var debug = require( 'debug' )( 'models:vote' );
var mongoose = require( 'mongoose' );

// Load my modules


// Constant declaration


// Module variables declaration
var Schema = mongoose.Schema;

// Module initialization (at first load)

var VoteSchema = new Schema( {
  /**
   * The timestamp of the captured votes
   * @type {Date}
   */
  timestamp: {
    type: Date,
    required: true,
    default: Date.now
  },
  /**
   * The number pof votes, cumulative.
   * @type {Number|Integer}
   */
  votes: {
    type: Number,
    required: true
  }
} );


module.exports = VoteSchema;

//  50 6F 77 65 72 65 64  62 79  56 6F 6C 6F 78