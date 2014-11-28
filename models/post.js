// Load system modules

// Load modules
var Promise = require( 'bluebird' );
var debug = require( 'debug' )( 'models:post' );
var mongoose = require( 'mongoose' );

// Load my modules
var VoteSchema = require( './vote.js' );

// Constant declaration


// Module variables declaration
var Schema = mongoose.Schema;

// Module initialization (at first load)

var PostSchema = new Schema( {
  /**
   * The weekly tag associated to this post.
   * @type {String}
   */
  tag: {
    type: String,
    required: true,
    index: true
  },
  /**
   * Provider from where we got the image.
   * Can be `instagram`, `twitter`, etc
   *
   * @type {String}
   */
  provider: {
    type: String,
    required: true,
    index: true
  },
  /**
   * Id of the post from the provider
   * @type {String}
   */
  providerId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  /**
   * The "short link" of the Instagram post
   * @type {String|URL}
   */
  shortLink: {
    type: String,
    index: true,
    required: true
  },
  /**
   * The creation date of the post.
   * @type {Date}
   */
  creationDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  /**
   * The (instagram) post it refers to (just the "short link").
   * @type {String}
   */
  postLink: {
    type: String,
    required: true
  },
  /**
   * The raw post from the provider.
   *
   * @type {Object}
   */
  raw: {},

  /**
   * Votes.
   * @type {Array}
   */
  votes: {
    type: [VoteSchema],
    default: []
  }
} );

module.exports = PostSchema;

//  50 6F 77 65 72 65 64  62 79  56 6F 6C 6F 78