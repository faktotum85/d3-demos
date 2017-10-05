(function() {

  var meteorStrikes, map;

  function getStrikes () {
    return axios.get('https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/meteorite-strike-data.json');
  }

  function getMap () {
    return axios.get('custom.geo.json');
  }

  axios.all([getStrikes(), getMap()])
    .then(axios.spread(function(strikes, geoMap) {
      meteorStrikes = strikes.data;
      map = geoMap.data;
      init();
    }))
    .catch(function(err) {console.error(err)});

  function init() {
    console.log(map);
    var width = 2000;
    var height = 2000;

    var svg = d3.select('#chart')
                .append('svg')
                .attr('width', width)
                .attr('height', height);

    var countries = svg.append('g');

    // // a projection creates a function into which you can plug longitude and latitude values and get projected coordinates back.
    var mercProjection = d3.geoMercator()

    // // A geo path is a function that takes a GeoJSON feature and returns SVG path data, based on the specified projection.
    var geoPath = d3.geoPath().projection(mercProjection);
    // var geoPath = d3.geoPath()
    //   .pointRadius(function(d) {return d.properties.precinct / 100}) // Optionally you can specify a pointRadius to control the circle size
    //   .projection(albersProjection);
    //
    countries.selectAll('path')
      .data(map.features)
      .enter()
      .append('path')
      .attr('fill', '#ccc')
      .attr('d', geoPath);
    // neighborhoods.selectAll('path')
    //   .data(neighborhoods_json.features)
    //   .enter()
    //   .append('path')
    //   .attr('fill', '#ccc')
    //   .attr('d', geoPath); // In SVG Land d is an attribute that defines the coordinates of a path.
    //
    // var rodents = svg.append('g');
    //
    // rodents.selectAll('path')
    //   .data(rodents_json.features)
    //   .enter()
    //   .append('path')
    //   .attr('fill', '#900')
    //   .attr('stroke', '#999')
    //   .attr('d', geoPath); // When a path generator encounters point features, it draws a circle.



  }


})()
