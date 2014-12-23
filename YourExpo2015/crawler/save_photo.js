// Load system modules

// Load modules
var Promise = require('bluebird');
var _ = require('lodash');
var debug = require('debug')('crawler:save:photo');
var mongoose = require('mongoose');
var moment = require('moment');

// Load my modules
var rootConfig = require('../../config/');
var config = require('./config/');
var actions = require('./actions.js');


// Constant declaration


// Module variables declaration
function savePhotos(tag, wrappedElements) {
  var Model = mongoose.model(rootConfig.mongo.collections.photo);
  debug('Saving %d photos to the DB', wrappedElements.length);

  var promises = _.map(wrappedElements, function(element) {

    return Model
      .findOne()
      .where('tag', tag)
      .where('providerId', element.providerId)
      .execAsync()
      .then(function(document) {

        var notPresent = !document;

        var votes = element.votes;
        delete element.votes;

        // Create
        if (notPresent) {

          document = new Model(element);
          document.tag = tag;
          document.votesCount = votes;
          debug('Creating document for %s', document.providerId);
        }

        // Add votes
        document.votes.push({
          votes: votes
        });

        // Calc deltas
        var delta = votes - document.votesCount;
        var dayOfYear = moment().dayOfYear();
        var dailyVotes = _.filter(document.votes, function(vote) {
          return dayOfYear === moment(vote.timestamp).dayOfYear();
        });

        var dailyDelta = _.last(dailyVotes).votes - _.first(dailyVotes).votes;


        document.delta = delta;
        document.dailyDelta = dailyDelta;
        document.votesCount = votes;

        return document
          .saveAsync();
      });
  });

  return Promise
    .settle(promises)
    .then(function(promiseList) {
      var toPost = [];

      _.each(promiseList, function(promise) {
        if (promise.isFulfilled()) {

          var object = promise.value()[0];

          toPost.push(object);
        }
      });

      return actions(toPost);


    })

  ;
}


// Module exports
module.exports = savePhotos;

//  50 6F 77 65 72 65 64  62 79  56 6F 6C 6F 78