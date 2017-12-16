d3.json('data/final.json', function(error, data) {
  if (error) {
    return console.error(error);
  }

//uses the browser window and document elements to determine the current screen size
  var w = window;
  var doc = document;
  var el = doc.documentElement;
  var body = doc.getElementsByTagName('body')[0];
  var width = w.innerWidth || el.clientWidth || body.clientWidth;
  var height = w.innerHeight|| el.clientHeight|| body.clientHeight;

  var counties = topojson.feature(data, data.objects.counties).features;
  var meanDensity = d3.mean(counties, function(d) {
    return d.properties.density;
  });

  var scaleDensity = d3.scaleLinear()
    .domain([0, meanDensity])
    .range([0, 1]);

  var color = d3.scaleSequential(d3.interpolateReds);

//sets width and height of the svg canvus
  var svg = d3.select('body')
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .append('g');

  var projection = d3.geoAlbersUsa();

  var path = d3.geoPath()
    .projection(projection);

  svg.selectAll('.county')
    .data(counties)
    .enter()
    .append('path')
    .attr('d', path)
    .attr('stroke', 'grey')
    .attr('stroke-width', 0.3)

    //adds population density data
    .attr('fill', function(d) {
      var countyDensity = d.properties.density;
      var density = countyDensity ? countyDensity : 0;
      return color(scaleDensity(density));
    });
});
