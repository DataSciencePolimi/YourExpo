function lazyload() {

  var imagesToLoad = $( '.image' ).map( function() {
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


$( '.image' ).on( 'click', '.highlight', function( evt ) {
  var $image = $( evt.delegateTarget );
  var $highlight = $( this );
  var id = $image.data( 'id' );
  var highlighted = $highlight.hasClass( 'active' );
  var baseUrl = $( 'html > head > base' ).prop( 'href' );

  var url = baseUrl + 'highlight/' + id;
  $.ajax( {
    url: url,
    type: highlighted? 'DELETE' : 'POST',
    dataType: 'json'
  } )
  .done( function() {
    $highlight.toggleClass( 'active' );
    $image.find( '.overlay' ).addClass( 'active' );
  } )
  .fail( function() {
    console.error( 'Unable to highlight :(' );
  } );

} );


$( '.image' ).on( 'click', '.reject', function( evt ) {
  var $image = $( evt.delegateTarget );
  var $reject = $( this );
  var id = $image.data( 'id' );
  var rejected = $reject.hasClass( 'active' );
  var baseUrl = $( 'html > head > base' ).prop( 'href' );

  var url = baseUrl + 'reject/' + id;
  $.ajax( {
    url: url,
    type: rejected? 'DELETE' : 'POST',
    dataType: 'json'
  } )
  .done( function() {
    $reject.toggleClass( 'active' );
    $image.find( '.overlay' ).addClass( 'active' );
  } )
  .fail( function() {
    console.error( 'Unable to reject :(' );
  } );

} );


// Images
lazyload();