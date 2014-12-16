
var $gallery = $( '.gallery' );
var votes = JSON.parse( localStorage.getItem( 'votes' ) || '{}' );

var START_IMAGES = 6;
var MORE_IMAGES = 6;


function setVoted( id ) {
  $( '.image[data-id="'+id+'"]', $gallery ).addClass( 'voted' );
  votes[ id ] = true;
  localStorage.setItem( 'votes', JSON.stringify( votes ) );
}



function lazyload() {

  var imagesToLoad = $( '.image:visible:not(.loaded)' ).map( function() {
    return $( this ).data( 'image' );
  } ).get();
  imagesToLoad = $.unique( imagesToLoad );


  $.each( imagesToLoad, function( i, url ) {
    var $destElements = $( '.image[data-image="'+url+'"]' );

    var $img = $( '<img/>' );
    $img.load( function() {
      $destElements.addClass( 'loaded' );
      $destElements.css( 'background-image', 'url("'+url+'")' );
    } );
    // Trigger image loading
    $img.prop( 'src', url );
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

  // No more images to find
  if( $myGallery.find( '.image:not(.loaded)' ).length===0 )
    $this.hide();
} );


$( '.likes' ).click( function( evt ) {
  evt.preventDefault();

  var id = $( this ).closest( '.image' ).data( 'id' );
  if( id && !votes[ id ] ) {
    var baseUrl = $( 'html > head > base' ).prop( 'href' );
    var url = baseUrl + 'like/' + id;
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