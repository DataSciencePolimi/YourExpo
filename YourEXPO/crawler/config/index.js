// Load system modules

// Load modules
var moment = require( 'moment' );
var debug = require( 'debug' )( 'crawler:config:index' );

// Load my modules





// Constant declaration

// Module variables declaration
var config = {};


// Module initialization (at first load)
/**
 * Crawler interval, aka update frequency
 * @type {Number|Milliseconds}
 */
config.INTERVAL = moment.duration( 1, 'hours' ).asMilliseconds();

/**
 * Max size of the queue before pushing to the CS.
 * @type {Number}
 */
config.MAX_QUEUE_SIZE = 10;

// Module exports
module.exports = config;



//  50 6F 77 65 72 65 64  62 79  56 6F 6C 6F 78