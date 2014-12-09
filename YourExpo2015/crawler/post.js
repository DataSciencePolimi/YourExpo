// Load system modules
var url = require('url');

// Load modules
var Promise = require('bluebird');
var _ = require('lodash');
var rootConfig = require('../../config/');
var config = require('./config/');
var debug = require('debug')('crawler:postToCS');
var request = require('request');

// Load my modules



// Constant declaration
var MAX_QUEUE_SIZE = config.MAX_QUEUE_SIZE;
var MIN_VOTES_TO_POST = rootConfig.crawler.minVotes;
var csEnabled = rootConfig.crowdSearcher.enabled;
var csBaseUrl = rootConfig.crowdSearcher.url;
var addObjectPath = rootConfig.crowdSearcher.addObjectLocation;
var taskId = rootConfig.crowdSearcher.taskId;

// Module variables declaration
var queue = [];


// Module initialization (at first load)
Promise.promisifyAll(request);

// Module exports
module.exports = function postToCS(documents) {
  if( !csEnabled )
    return;

  if (!_.isArray(documents)) {
    documents = [documents];
  }


  _.each(documents, function(document) {

    // If the numer of likes is too little, do not post
    if (document.votesCount < MIN_VOTES_TO_POST)
      return;

    // Do not add the object if it's already been posted to the CS
    if (document.moderating || document.moderated)
      return;

    // Add to queue
    queue.push(document);
  });


  if (queue.length < MAX_QUEUE_SIZE)
    return;


  // Map the queue to the CS objects
  var objects = _.map(queue, function(data) {
    return {
      data: {
        id: data._id,
        url: data.imageUrl
      }
    };
  });

  var postUrl = url.resolve(csBaseUrl, addObjectPath);

  // Post to CS
  request
    .postAsync({
      url: postUrl,
      qs: {
        task: taskId
      },
      json: {
        objects: objects
      }
    })
    .then(function() {

      var promises = _.map(queue, function(element) {

        Promise.promisifyAll(element);
        element.moderating = true;
        return element.saveAsync();

      });

      return Promise
        .settle(promises);

    })
    .spread(function() {
      debug('Post done!');

      // Reset the queue
      queue = [];
    });
};



//  50 6F 77 65 72 65 64  62 79  56 6F 6C 6F 78