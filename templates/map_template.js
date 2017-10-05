(function() {

  init();

  function init() {
    var width = 700;
    var height = 580;

    var svg = d3.select('#chart')
      .append('svg')
      .attr('height', height)
      .attr('width', width);

    var neighborhoods = svg.append('g');

    // a projection creates a function into which you can plug longitude and latitude values and get projected coordinates back.
    var albersProjection = d3.geoAlbers()
      .scale(190000)
      .rotate([71.057, 0])
      .center([0, 42.313])
      .translate([width/2, height/2]);

    // A geo path is a function that takes a GeoJSON feature and returns SVG path data, based on the specified projection.
    var geoPath = d3.geoPath()
      .pointRadius(function(d) {return d.properties.precinct / 100}) // Optionally you can specify a pointRadius to control the circle size
      .projection(albersProjection);


    neighborhoods.selectAll('path')
      .data(neighborhoods_json.features)
      .enter()
      .append('path')
      .attr('fill', '#ccc')
      .attr('d', geoPath); // In SVG Land d is an attribute that defines the coordinates of a path.

    var rodents = svg.append('g');

    rodents.selectAll('path')
      .data(rodents_json.features)
      .enter()
      .append('path')
      .attr('fill', '#900')
      .attr('stroke', '#999')
      .attr('d', geoPath); // When a path generator encounters point features, it draws a circle.




  }


})()
