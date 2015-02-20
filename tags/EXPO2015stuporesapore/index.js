// Load system modules
var fs = require( 'fs' );
var path = require( 'path' );

// Load modules
var debug = require( 'debug' )( 'yourexpo:tag:stuporesapore' );
var _ = require( 'lodash' );
var marked = require( 'marked' );
var moment = require( 'moment' );

// Load my modules





// Constant declaration
var DATE_FORMAT = 'YYYY-MM-DD';

// Module variables declaration
var topic1 = 'stupore';
var topic2 = 'sapore';
var startDate = '2015-01-03';
var endDate = '2015-01-10';
// var sampleId = 'wEkUiMtuzr';
var sampleId = 'y4DbbSNuwd';
var winnerPost = 'y4DbbSNuwd';


var tag = 'EXPO2015'+topic1+topic2;


function readMarkdown( file ) {
  var filePath = path.resolve( __dirname, file );
  var contents = fs.readFileSync( filePath, 'utf8' );
  return marked( contents );
}


var exported = {
  tag: tag,
  topic1: topic1,
  topic2: topic2,
  startDate: moment( startDate, DATE_FORMAT ).startOf( 'day' ),
  endDate: moment( endDate, DATE_FORMAT ).endOf( 'day' ),
  sampleId: sampleId,
  description: readMarkdown( 'description.md' ),

  winnerPost: winnerPost,
  winner1: 'cuocaxamore',
  winner2: 'timoebasilico',

  postcard: path.resolve( __dirname, 'postcard.jpg' ),

  locale: {
    en: {
      topic1: 'amazing',
      topic2: 'tasty',
      description: readMarkdown( 'description.en.md' ),
    }
  }
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