// Load system modules
var fs = require( 'fs' );
var path = require( 'path' );

// Load modules
var debug = require( 'debug' )( 'yourexpo:tag:volotest' );
var _ = require( 'lodash' );
var marked = require( 'marked' );
var moment = require( 'moment' );

// Load my modules





// Constant declaration
var DATE_FORMAT = 'YYYY-MM-DD';

// Module variables declaration
var topic1 = 'volo';
var topic2 = 'test';
var startDate = '2014-11-25';
var endDate = '2014-12-25';
var sampleId = 'v3zCA0xYyi';



var tag = 'EXPO2015'+topic1+topic2;


var exported = {
  tag: tag,
  topic1: topic1,
  topic2: topic2,
  startDate: moment( startDate, DATE_FORMAT ),
  endDate: moment( endDate, DATE_FORMAT ),
  sampleId: sampleId,
  description: '',

  locale: {}
};

function getProperty( name, locale ) {
  var object = exported;

  if( _.isString( locale ) && exported.locale[ locale ] ) {
    object = exported.locale[ locale ];
  }

  var value = object? object[ name ] : exported[ name ];

  return value;
}

// Module initialization (at first load)
exported.get = getProperty;



// Module exports
module.exports = exported;


//  50 6F 77 65 72 65 64  62 79  56 6F 6C 6F 78