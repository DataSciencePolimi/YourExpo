/* global $, photo, posts, moment */



var $graph = $( '#graph' );

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

var sum = 0;
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
  name: 'Platform',
  data: $.map( photo.platform, platformToPoint ).sort( compare )
};

var series = [ instagramSerie, platformSerie ];
/*
$.each( posts, function( i, post ) {
  sum = 0;
  var name = post.provider[0].toUpperCase();
  name += post.provider.substring( 1 );
  var postSerie = {
    name: name,
    data: $.map( post.votes, toPoint ).sort( compare )
  };

  series.push( postSerie );
} );
*/


$graph.highcharts( {
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
    type: 'datetime'
  },
  yAxis: {
    title: {
      text: 'Votes'
    },
    type: 'linear'
  },
  series: series
} );