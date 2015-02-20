// Load system modules

// Load modules
var Promise = require('bluebird');
var debug = require('debug')('models:photo');
var mongoose = require('mongoose');

// Load my modules
// var CommentSchema = require('./comment.js');
var VoteSchema = require('./vote.js');
var LikersSchema = require('./liker.js');

// Constant declaration


// Module variables declaration
var Schema = mongoose.Schema;

// Module initialization (at first load)

var PhotoSchema = new Schema({
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
   * Id of the post from the provider
   * @type {String}
   */
  providerId: {
    type: String,
    required: true,
    index: true
  },
  /**
   * Username of the image owner, can be an ID.
   *
   * @type {String}
   */
  username: {
    type: String,
    index: true,
    required: true
  },
  /**
   * The "short link".
   * @type {String}
   */
  shortLink: {
    type: String,
    index: true,
    required: true
  },
  /**
   * Raw URL of the image, used for display, must be accessible.
   * @type {String|URL}
   */
  imageUrl: {
    type: String,
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
   * The raw post from the provider.
   *
   * @type {Object}
   */
  raw: {},



  /**
   * Moderation flags.
   */
  /**
   * Flag indicating wether the post must be highlighted.
   * @type {Boolean}
   */
  highlighted: {
    type: Boolean,
    index: true,
    default: false
  },
  highlightedTimestamp: {
    type: Date
  },
  /**
   * Flag indicating wether the post must be rejected.
   * @type {Boolean}
   */
  rejected: {
    type: Boolean,
    index: true,
    default: false
  },
  rejectedTimestamp: {
    type: Date
  },
  /**
   * The post is in moderation.
   * @type {Boolean}
   */
  moderating: {
    type: Boolean,
    default: false
  },
  /**
   * The post has been moderated.
   * @type {Boolean}
   */
  moderated: {
    type: Boolean,
    index: true,
    default: false
  },
  moderatedTimestamp: {
    type: Date
  },

  liked: {
    type: Boolean,
    index: true
  },
  likedTimestamp: {
    type: Date
  },

  fixed: {
    type: Boolean,
    index: true
  },
  fixedTimestamp: {
    type: Date
  },


  /**
   * Post votes
   */
  votes: {
    type: [VoteSchema],
    default: []
  },
  /**
   * Platform votes.
   * @type {Array}
   */
  platform: {
    type: [VoteSchema],
    default: []
  },

  /**
   * The actual number of votes
   * @type {Number}
   */
  votesCount: {
    type: Number,
    index: true,
    required: true,
    default: 0
  },

  /**
   * Delta calculated each crawler cycle.
   * @type {Number}
   */
  delta: {
    type: Number,
    required: true,
    default: 0
  },
  /**
   * Daily delta
   * @type {Number}
   */
  dailyDelta: {
    type: Number,
    required: true,
    default: 0
  },

  /**
   * List of people that liked the photo
   * @type {Array}
   */
  likers: {
    type: [LikersSchema],
    default: []
  }
});

module.exports = PhotoSchema;

//  50 6F 77 65 72 65 64  62 79  56 6F 6C 6F 78