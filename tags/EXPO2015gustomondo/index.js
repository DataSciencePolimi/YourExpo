// Load system modules
var fs = require( 'fs' );
var path = require( 'path' );

// Load modules
var debug = require( 'debug' )( 'yourexpo:tag:gustomondo' );
var _ = require( 'lodash' );
var marked = require( 'marked' );
var moment = require( 'moment' );

// Load my modules





// Constant declaration
var DATE_FORMAT = 'YYYY-MM-DD';

// Module variables declaration
var topic1 = 'gusto';
var topic2 = 'mondo';
var startDate = '2015-01-10';
var endDate = '2015-01-17';
// var sampleId = 'wEkUiMtuzr';
var sampleId = 'zC48iEtu4L';
var winnerPost = 'zC48iEtu4L';


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
  winner1: 'daicuciniamo_conlaiaia',
  winner2: 'cook_eat_love',

  postcard: path.resolve( __dirname, 'postcard.jpg' ),

  locale: {
    en: {
      topic1: 'flavor',
      topic2: 'world',
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