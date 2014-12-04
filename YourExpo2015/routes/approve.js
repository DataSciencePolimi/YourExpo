// Load system modules

// Load modules
var debug = require('debug')('yourexpo:routes:approve');
var mongoose = require('mongoose');
// Load my modules
var rootConfig = require('../../config/');



// Constant declaration


// Module variables declaration


// Module initialization (at first load)


module.exports = function(req, res, next) {
  debug('Approve');

  var Model = mongoose.model(rootConfig.mongo.collections.photo);
  var id = req.body.id;

  Model
    .findById(id)
    .exec(function(err, photo) {
      if (err) throw new Error(err);

      photo.moderated = true;
      photo.moderating = false;

      photo.save(function(err) {
        if (err) throw new Error(err);

        res.json({});
      });

    });

};


//  50 6F 77 65 72 65 64  62 79  56 6F 6C 6F 78