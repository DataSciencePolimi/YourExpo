// Load system modules
var path = require( 'path' );

// Load modules
var moment = require( 'moment' );
var hbs = require( 'hbs' );

// Load my modules




// Constant declaration


// Module variables declaration


// Module initialization (at first load)


module.exports = function( app ) {
  var instance = hbs.create();
  var partialsPath = path.resolve( __dirname, '..', 'views', 'partials' );

  instance.localsAsTemplateData( app );
  instance.registerPartials( partialsPath );

  var blocks = {};

  instance.registerHelper( 'json', function( data ) {
    return JSON.stringify( data, null, 2 );
  } );

  instance.registerHelper( 'extend', function(name, context) {
    var block = blocks[name];
    if (!block)
      block = blocks[name] = [];
    block.push(context.fn(this)); // for older versions of handlebars, use block.push(context(this));
  } );

  instance.registerHelper( 'block', function(name) {
    var val = (blocks[name] || []).join('\n');
    // clear the block
    blocks[name] = [];
    return val;
  } );


  instance.registerHelper( 'date', function( data, format, locale ) {
    var localized = moment( data );
    localized.locale( locale || 'en' );
    return localized.format( format );
  } );

  return instance;
};


//  50 6F 77 65 72 65 64  62 79  56 6F 6C 6F 78