/* global $, tag, tagObject, moment */
/* exported changeLocale */


var baseUrl = $( 'html> head > base' ).prop( 'href' );
var OUT_DATE_FORMAT = 'YYYY-MM-DD_HH:mm:ss';
var DATE_FORMAT = 'YYYY-MM-DD';
var $from = $( '.from' );
var $to = $( '.to' );
var $spread = $( '.photo-spread' );
var $photos = $( '.top-photos' );
var $users = $( '.users' );






function createDatePlot( images ) {
  $spread.empty();
  var serie = {
    name: 'Photos',
    data: []
  };

  $.each( images, function( i, img ) {
    serie.data.push( {
      x: new Date( img.creationDate ),
      y: img.votesCount,
      name: img.shortLink
    } );
  } );


  $spread.highcharts( {
    chart: {
      type: 'scatter',
      zoomType: 'x'
    },
    title: {
      text: 'Photos'
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
    },
    yAxis: {
      title: {
        text: '# votes'
      },
      type: 'linear',
      min: 0
    },
    series: [serie]
  } );
}


function createTopUser( images ) {
  $users.empty();
  var high = {
    name: 'Highlited',
    data: []
  };
  var total = {
    name: 'Total',
    data: []
  };

  var users = {};

  $.each( images, function( i, img ) {
    var user = img.username;
    if( !users[ user ] ) {
      users[ user ] = {
        highlited: 0,
        total: 0
      };
    }

    if( img.highlited ) {
      users[ user ].highlited += 1;
    }

    users[ user ].total += 1;
  } );



  var usernames = $.map( users, function( data, username ) {
    return username;
  } );
  $.each( usernames, function( i, username ) {
    var data = users[ username ];
    high.data.push( data.highlited );

    total.data.push( data.total );
  } );




  console.log( usernames );
  console.log( high );
  console.log( total );


  $users.highcharts( {
    chart: {
      type: 'column',
    },
    plotOptions: {
      column: {
        stacking: 'normal',
      }
    },
    title: {
      text: 'Top posting users'
    },
    xAxis: {
      title: {
        text: 'Users'
      },
      categories: usernames
    },
    yAxis: {
      title: {
        text: '# photos'
      },
      type: 'linear',
      min: 0
    },
    series: [high,total]
  } );
}



$.ajax( {
  url: baseUrl+tag+'/data',
  dataType: 'json',
  cache: false
} )
.done( function( response ) {
  var images = response.images;
  var from = moment( response.from );
  var to = moment( response.to );
  console.log( 'From %s', from );
  console.log( 'To %s', to );

  if( from.isValid() ) {
    $from.text( from.format( DATE_FORMAT ) );
  } else {
    $from.text( 'All' );
  }
  if( to.isValid() ) {
    $to.text( to.format( DATE_FORMAT ) );
  } else {
    $to.text( 'All' );
  }

  console.log( 'Images (%d)', images.length );

  createDatePlot( images );
  createTopUser( images );
} )
.fail( function( err ) {
  console.error( err );
} )
;