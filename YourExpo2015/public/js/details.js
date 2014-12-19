/* global $, photo, posts, moment */

var sum = 0;
var MIN_POINTS = 30;

var $graph = $( '#graph' );



function padData( data ) {
  if( data.length>0 && data.length<MIN_POINTS ) {
    var toAdd = MIN_POINTS-data.length;
    var initalPad = Math.floor( toAdd/2 );
    var finalPad = Math.ceil( toAdd/2 );

    var firstPoint = data[0];
    for( var i=0; i<initalPad; i++ ) {
      firstPoint = {
        y: firstPoint.y,
        x: moment( firstPoint.x ).utc().subtract( 1, 'h' ).toDate()
      };
      data.unshift( firstPoint );
    }

    var lastPoint = data[ data.length-1 ];
    for( var j=0; j<finalPad; j++ ) {
      lastPoint = {
        y: lastPoint.y,
        x: moment( lastPoint.x ).utc().add( 1, 'h' ).toDate()
      };
      data.push( lastPoint );
    }
  }
}

function compare( a, b ) {
  return a.x - b.x;
}
function date( timestamp ) {
  return moment( timestamp ).utc().toDate();
  // return moment( timestamp ).utc().startOf( 'day' ).toDate();
}
function toPoint( element ) {
  return {
    x: date( element.timestamp ),
    y: element.votes
  };
}

function platformToPoint( element ) {
  sum += element.votes;
  var point = toPoint( element );
  point.y = sum;
  return point;
}

var instagramSerie = {
  name: 'Instagram',
  data: $.map( photo.votes, toPoint ).sort( compare )
};
var platformSerie = {
  name: 'Challenge site',
  data: $.map( photo.platform, platformToPoint ).sort( compare )
};

var series = [ instagramSerie /*, platformSerie */ ];


padData( instagramSerie.data );
//padData( platformSerie.data );

$graph.highcharts( {
  plotOptions: {
    spline: {
      marker: {
        enabled: false
      }
    }
  },
  chart: {
    type: 'spline',
    zoomType: 'x'
  },
  tooltip: {
    enabled: false
  },
  title: {
    text: 'Votes'
  },
  xAxis: {
    title: {
      text: 'Time'
    },
    type: 'datetime',
    maxPadding: 0.1,
    minPadding: 0.1,
  },
  yAxis: {
    title: {
      text: 'Votes'
    },
    type: 'linear',
    allowDecimals: false,
    maxPadding: 0.1,
    minPadding: 0.1,
    minTickInterval: 1,
    // min: 0
  },
  series: series
} );