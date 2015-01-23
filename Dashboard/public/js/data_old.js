/* global $, tag, tagObject, moment, Highcharts */
/* exported changeLocale */


Date.parseDate = function( input, format ){
  return moment(input,format).toDate();
};
Date.prototype.dateFormat = function( format ){
  return moment(this).format(format);
};

var baseUrl = $( 'html > head > base' ).prop( 'href' );
var DATE_FORMAT = 'YYYY-MM-DD';
var TIME_FORMAT = 'HH:mm:ss';
var OUT_DATE_FORMAT = DATE_FORMAT+'_'+TIME_FORMAT;
var $from = $( '.from' );
var $to = $( '.to' );
var $users = $( '.users' );
var $photos = $( '.photos' );
var $mega = $( '.mega' );
var $spread = $( '.photo-spread' );
var $highUsers = $( '.highlighted-users' );
var $topUsers = $( '.top-users' );
var $trending = $( '.trending-photos' );
var $btn = $( '#btn' );





/*
var megaChart = $mega.highcharts( {
  title: {
    text: 'Mega chart'
  },
  xAxis: {
    title: {
      text: 'Date'
    },
    type: 'datetime',
    labels: {
      format: '{value:%Y-%m-%d}'
    }
  },
  yAxis: []
} ).highcharts();
*/

var photoChart = $spread.highcharts( {
  chart: {
    type: 'columnrange',
    zoomType: 'x'
  },
  title: {
    text: 'Photos'
  },
  tooltip: {
    pointFormat: 'Created by <em>{point.user}</em><br/>at <b>{point.x:%Y-%m-%d %H:%M}</b><br/>got <tt><b>{point.y}</b></tt> votes<br>',
  },
  /*
  xAxis: {
    title: {
      text: 'Date'
    },
    type: 'datetime',
    plotBands: [
    ],
    labels: {\
      format: '{value:%Y-%m-%d}'
    }
  },
  */
  yAxis: {
    title: {
      text: '# votes'
    },
    // type: 'linear',
    min: 0
  },
  series: [
    {
      name: 'Data',
      data: []
    }
  ]
} ).highcharts();
var trendingChart = $trending.highcharts( {
  chart: {
    type: 'column',
    zoomType: 'x'
  },
  title: {
    text: 'Top trending photos'
  },
  xAxis: {
    title: {
      text: 'Photos'
    },
    labels: {
      enabled: false
    }
  },
  yAxis: {
    title: {
      text: 'Likes delta'
    },
    min: 0
  },
  series: [
    {
      name: 'Delta',
      data: []
    }
  ]
} ).highcharts();
var topUsersChart = $topUsers.highcharts( {
  chart: {
    type: 'column',
    zoomType: 'x'
  },
  title: {
    text: 'Top posting users'
  },
  xAxis: {
    title: {
      text: 'Users'
    },
    labels: {
      enabled: false
    }
  },
  yAxis: {
    title: {
      text: '# photos'
    },
    min: 0
  },
  series: [
    {
      name: 'Total',
      data: []
    }
  ]
} ).highcharts();
var highlightedUsersChart = $highUsers.highcharts( {
  chart: {
    type: 'column',
    zoomType: 'x'
  },
  title: {
    text: 'Top highlighted users'
  },
  xAxis: {
    title: {
      text: 'Users'
    },
    labels: {
      enabled: false
    }
  },
  yAxis: {
    title: {
      text: '# photos'
    },
    type: 'linear',
    min: 0,
    minTick: 1
  },
  series: [
    {
      name: 'Highlighted',
      data: []
    }
  ]
} ).highcharts();


if( typeof(tagObject)!=='undefined' ) {
  photoChart.xAxis[0].addPlotBand( {
    color: '#BADA55',
    from: moment( tagObject.startDate ).utc().toDate(),
    to: moment( tagObject.endDate ).utc().toDate(),
    label: 'Active'
  } );
}



function createDatePlot( images, sort ) {
  sort = sort || 'date';

  var data = [];
  if( photoChart.voloData ) {
    data = photoChart.voloData;
  } else {
    $.each( images, function( i, img ) {
      var start = img.votesCount;
      var end = img.votesCount+Math.round( Math.random()*50 );
      // var end = img.votes[ img.votes.length-1 ].votes;

      data.push( {
        values: [ start, end ],
        start: start,
        end: end,
        delta: end-start,
        date: new Date( img.creationDate )
      } );
    } );

    photoChart.voloData = data;
  }


  data.sort( function( a, b ) {
    return b[ sort ]-a[ sort ];
  } );


  var elements = [];
  $.each( data, function( i, e ) {
    elements.push( e.values );
  } );

  photoChart.series[0].setData( elements, true );
}
$( '.photo-change' ).click( function() {
  var sort = $( this ).data( 'sort' );
  createDatePlot( photoChart.voloData, sort );
} );



function updateBasicInfo( images ) {
  var users = {};
  $.each( images, function( i, img ) {
    users[ img.username ] = true;
  } );
  var usernames = $.map( users, function( data, username ) {
    return username;
  } );


  $users.text( usernames.length );
  $photos.text( images.length );
}
function createTrendingPlot( images ) {
  var trendings = {};
  var data = [];

  $.each( images, function( i, img ) {
    var firstVote = img.votes[ 0 ].votes;
    var lastVote = img.votesCount;

    trendings[ img.shortLink ] = lastVote - firstVote;
  } );

  var ids = $.map( trendings, function( data, id ) {
    return id;
  } );

  // Sort the usernames based on 'total'
  ids.sort( function( id1, id2 ) {
    return trendings[ id2 ]-trendings[ id1 ];
  } );

  $.each( ids, function( i, id ) {
    data.push( trendings[ id ] );
  } );


  trendingChart.xAxis.categories = ids;
  trendingChart.series[ 0 ].setData( data );
}


function createTopUser( images ) {
  var users = {};
  var data = [];

  $.each( images, function( i, img ) {
    var user = img.username;
    if( !users[ user ] ) {
      users[ user ] = 1;
    } else {
      users[ user ] += 1;
    }
  } );

  var usernames = $.map( users, function( data, username ) {
    return username;
  } );

  usernames.sort( function( u1, u2 ) {
    return users[ u2 ]-users[ u1 ];
  } );

  $.each( usernames, function( i, username ) {
    data.push( users[ username ] );
  } );


  topUsersChart.xAxis.categories = usernames;
  topUsersChart.series[ 0 ].setData( data );
}
function createHighlightedUser( images ) {
  var users = {};
  var data = [];

  $.each( images, function( i, img ) {
    var user = img.username;

    if( !img.highlighted ) return;

    if( !users[ user ] ) {
      users[ user ] = 1;
    } else {
      users[ user ] += 1;
    }
  } );

  var usernames = $.map( users, function( data, username ) {
    return username;
  } );

  // Sort the usernames based on 'total'
  usernames.sort( function( u1, u2 ) {
    return users[ u2 ]-users[ u1 ];
  } );

  $.each( usernames, function( i, username ) {
    data.push( users[ username ] );
  } );


  highlightedUsersChart.xAxis.categories = usernames;
  highlightedUsersChart.series[ 0 ].setData( data );
}



function createMega( images ) {
  var testAxis = {
    title: {
      text: 'Total likes'
    },
    type: 'linear',
    min: 0
  };

  megaChart.addAxis( testAxis, false );

  var testSerie = {
    name: 'Likes',
    data: []
  };

  // Get all the votes
  var votes = [];
  $.each( images, function( i, image ) {
    votes = votes.concat( image.votes );
  } );

  votes.sort( function( a, b ) {
    var d1 = new Date( a.timestamp );
    var d2 = new Date( b.timestamp );
    return d1-d2;
  } );
  console.log( votes[0] );
  console.log( votes[ votes.length-1 ] );
}




function render( data ) {
  updateBasicInfo( data );
  createDatePlot( data );
  // createTrendingPlot( data );
  // createTopUser( data );
  // createHighlightedUser( data );


  // createMega( data );
}




var dataUrl = baseUrl+tag+'/data';


function requestData( from, to ) {
  $( '.modal' ).modal( 'show' );

  $.ajax( {
    url: dataUrl,
    dataType: 'json',
    data: {
      from: from,
      to: to
    },
    cache: false
  } )
  .done( function( response ) {
    var images = response.images;
    render( images );
  } )
  .fail( function( err ) {
    console.error( err );
  } )
  .always( function() {
    $( '.modal' ).modal( 'hide' );
  } )
  ;
}


$btn.click( function() {
  var from = $from.val();
  var to = $to.val();
  requestData( from, to );
} );


$from.datetimepicker( {
  format: OUT_DATE_FORMAT,
  formatTime: TIME_FORMAT,
  formatDate: DATE_FORMAT,
  onShow:function(  ){
   this.setOptions({
    maxDate: $to.val() ? $to.val() : false
   } );
  },
} );
$to.datetimepicker( {
  format: OUT_DATE_FORMAT,
  formatTime: TIME_FORMAT,
  formatDate: DATE_FORMAT,
  onShow:function(  ){
   this.setOptions({
    minDate: $from.val() ? $from.val() : false
   } );
  },
} );

requestData();