
var $gallery = $( '.gallery' );
var votes = JSON.parse( localStorage.getItem( 'votes' ) || '{}' );
var START_IMAGES = 10;
var MORE_IMAGES = 5;

function setVoted( id ) {
  $( '.image[data-id="'+id+'"]', $gallery ).addClass( 'voted' );
  votes[ id ] = true;
  localStorage.setItem( 'votes', JSON.stringify( votes ) );
}



function lazyload() {
  $( '.image:visible:not(.loaded)' ).each( function() {
    var $image = $( this );
    var imageUrl = $( this ).data( 'image' );

    var $img = $( '<img/>' );
    $img.prop( 'src', imageUrl );

    $img.load( function() {
      $image.addClass( 'loaded' );
      $image.css( 'background-image', 'url("'+imageUrl+'")' );
    } );
  } );
}


$( '.more-images' ).click( function() {
  var $this = $( this );
  var $myGallery = $this.closest( '.gallery' );

  var toShow = $myGallery.data( 'show' ) || START_IMAGES;
  toShow += MORE_IMAGES;
  $myGallery.find( '.image:lt('+toShow+')' ).show();
  $myGallery.data( 'show', toShow );
  lazyload();

  if( toShow>50 )
    $this.hide();
} );


$( '.likes' ).click( function( evt ) {
  evt.preventDefault();

  var id = $( this ).closest( '.image' ).data( 'id' );
  if( id && !votes[ id ] ) {
    var baseUrl = $( 'html > head > base' ).prop( 'href' );
    var url = baseUrl + 'vote/' + id;
    $.getJSON( url )
    .done( function() {
      setVoted( id );
    } )
    .fail( function() {
      console.error( 'Unable to vote :(' );
    } );
  }

  return false;
} );



// convet old votes
$.each( localStorage, function( key ) {
  var matches = key.match( /^voted_([0-9a-f]{24})$/i );
  if( matches ) {
    var id = matches[1];
    setVoted( id );
    delete localStorage[ key ];
  }
} );


$.each( votes, setVoted );

// Images
lazyload();