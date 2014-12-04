/* global $, localStorage */
/* exported changeLocale */


function getOS() {
  var userAgent = navigator.userAgent || navigator.vendor || window.opera;

  if( userAgent.match( /iPad/i ) || userAgent.match( /iPhone/i ) || userAgent.match( /iPod/i ) ) {
    return 'ios';
  } else if( userAgent.match( /Android/i ) ) {
    return 'android';
  } else {
    return 'desktop';
  }
}

function changeLocale( locale ) {
  $( '[lang]').hide();
  $( '[lang="'+locale+'"]').show();

  localStorage.setItem( 'lang', locale );
}


$( '.likes' ).click( function( evt ) {
  evt.preventDefault();

  var $this = $( this );
  var id = $this.closest( '.image' ).data( 'id' );
  var likes = Number( $this.attr( 'data-likes' ) );

  console.log( 'Like it: %s', id );
  $this.attr( 'data-likes', ++likes );

  return false;
} );


$( 'button.lang' ).click( function() {
  var locale = $( this ).data( 'lang' );
  changeLocale( locale );
} );

$( '.button-container > a.button' ).each( function() {
  var $this = $( this );

  var os = getOS();
  var osUrl = $this.data( os );

  if( osUrl )
    $this.prop( 'href', osUrl );
} );



var locale = localStorage.getItem( 'lang' ) || navigator.language || 'en';
if( locale!=='it' && locale!=='en')
  locale = 'en';

changeLocale( locale );