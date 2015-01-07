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
var $spread = $( '.photo-spread' );
var $highUsers = $( '.highlighted-users' );
var $topUsers = $( '.top-users' );
var $trending = $( '.trending-photos' );
var $btn = $( '#btn' );






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

    updateBasicInfo( images );
    createDatePlot( images );
    createTrendingPlot( images );
    createTopUser( images );
    createHighlightedUser( images );
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

var photoChart = $spread.highcharts( {
  chart: {
    type: 'scatter',
    zoomType: 'x'
  },
  title: {
    text: 'Photos'
  },
  tooltip: {
    pointFormat: 'Created by <em>{point.user}</em><br/>at <b>{point.x:%Y-%m-%d %H:%M}</b><br/>got <tt><b>{point.y}</b></tt> votes<br>',
  },
  xAxis: {
    title: {
      text: 'Date'
    },
    type: 'datetime',
    plotBands: [
      {
        color: '#BADA55',
        from: moment( tagObject.startDate ).utc().toDate(),
        to: moment( tagObject.endDate ).utc().toDate(),
        label: 'Active'
      }
    ],
    labels: {
      format: '{value:%Y-%m-%d}'
    }
  },
  yAxis: {
    title: {
      text: '# votes'
    },
    type: 'linear',
    min: 0
  },
  series: [
    {
      name: 'Photos',
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



function createDatePlot( images ) {
  var data = [];
  $.each( images, function( i, img ) {
    data.push( {
      x: new Date( img.creationDate ),
      y: img.votesCount,
      user: img.username,
      img: img.imageUrl
    } );
  } );


  photoChart.series[ 0 ].setData( data );
}



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


requestData();