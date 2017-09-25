// Load system modules

// Load modules
var Promise = require('bluebird');
var _ = require('lodash');
var debug = require('debug')('comment');
var mongoose = require('mongoose');
var moment = require('moment');


// Load my modules
// var tags = require( '../tags/' );
var config = require('../config/');
var initMongo = require('../models/');
var Instagram = require('./social/instagram.js');


// Module variables declaration
var photoCollectionName = config.mongo.collections.photo;
var commentCollectionName = config.mongo.collections.comment;
var Photo = mongoose.model(photoCollectionName);
var Comment = mongoose.model(commentCollectionName);

// Constant declaration

// Module variables declaration
var instagram = new Instagram({
  clientId: '46d455d0c0614e188ca56587d2a00881',
  clientSecret: '0d0ea9a858b748e8bc2938a09ab278f8'
});



function handleFatalError(err) {
  debug('Fatal error: %s', err.message);
  debug(err);

  return mongoose
    .disconnectAsync()
    .then(function() {
      process.exit(1);
    });
}


function convertComment(comment) {
  var date = moment.unix(1 * comment.created_time).utc().toDate();

  return new Comment({
    timestamp: date,
    id: comment.id,
    text: comment.text,
    username: comment.from.username,
    userId: comment.from.id,
    postId: this.id
  }).saveAsync();
}



var index = 0;

function getComments(photo) {
  debug('Getting comments for: %s', photo.providerId);

  return instagram
    .getComments(photo.providerId)
    .spread(function(comments) {
      debug('Comments [%d]', comments.length);

      if (comments.length === 0) return;

      var mappedComments = _.map(comments, convertComment, {
        id: photo.providerId
      });

      return Promise
        .settle(mappedComments);
    })
    .then(function() {
      index++;
      if (index > 4999) {
        index = 0;
        return Promise.delay(1000 * 60 * 60);
      }

    })
    .catch(function(err) {
      debug('Get comments error: %j', err);
    });
}

function loop() {
  debug('Loop init');

  Photo
    .find({
      tag: 'EXPO2015oggidomani'
    })
    .select('_id providerId')
    .execAsync()
    .then(function mapIdToPromises(photos) {
      if (photos.length === 0)
        return;

      var promise = getComments(photos[0]);

      for (var i = 1; i < photos.length; i++) {
        promise = promise
          .return(photos[i])
          .then(getComments);
      }

      return promise;
    })
    .then(function() {
      debug('Updated all photos');
    })
    .delay(1000 * 60 * 60) // 1 Hour
    .then(function() {
      debug('Loop ended');

      setImmediate(loop);
    });
}

// Module initialization (at first load)


// Entry point
initMongo()
  .then(loop)
  .catch(handleFatalError);

//  50 6F 77 65 72 65 64  62 79  56 6F 6C 6F 78