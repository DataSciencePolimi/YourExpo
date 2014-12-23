// Load system modules

// Load modules
var Promise = require( 'bluebird' );
var debug = require( 'debug' )( 'models:profile' );
var mongoose = require( 'mongoose' );

// Load my modules


// Constant declaration


// Module variables declaration
var Schema = mongoose.Schema;

// Module initialization (at first load)

var ProfileSchema = new Schema( {
  /**
   * Provider for the user.
   * Can be `instagram`, `facebook`, etc
   *
   * @type {String}
   */
  provider: {
    type: String,
    required: true,
    index: true
  },
  /**
   * Id from the provider
   * @type {String}
   */
  providerId: {
    type: String,
    required: true,
    index: true,
    unique: true
  },
  /**
   * Username from the provider
   * @type {String}
   */
  username: {
    type: String,
    index: true,
    required: true,
    //unique: true
  },
  /**
   * The creation date of the user
   * @type {Date}
   */
  creationDate: {
    type: Date,
    required: true,
    default: Date.now
  },

  /**
   * Additional information
   */
  fullName: String,
  profilePicture: String,
  email: String,
  token: String,
  profile: {}
}, {
  /**
   * Allow to save custom fields to the document
   * @type {Boolean}
   */
  strict: false
} );


module.exports = ProfileSchema;

//  50 6F 77 65 72 65 64  62 79  56 6F 6C 6F 78