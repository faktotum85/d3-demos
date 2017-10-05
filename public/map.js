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
    var svg = d3.select('#chart')
                .append('svg');

    var height = window.innerHeight - document.querySelector('svg').getBoundingClientRect().y - 30;
    var width = window.innerWidth - 30;

    svg.attr('width', width)
       .attr('height', height);

    var countries = svg.append('g');

    var mercProjection = d3
      .geoEquirectangular()
      .center([13,52])
      .fitExtent([[20,20],[width - 40, height - 40]], map);

    var geoPath = d3
      .geoPath()
      .projection(mercProjection);

    countries.selectAll('path')
      .data(map.features)
      .enter()
      .append('path')
      .attr('fill', '#ccc')
      .attr('d', geoPath);

    var meteors = svg.append('g');

    meteors.selectAll('circle')
      .data(meteorStrikes.features.filter(function(strike) {return strike.geometry}))
      .enter()
      .append('circle')
      .attr('fill', 'red')
      .attr('cx', function (d) {return mercProjection(d.geometry.coordinates)[0]})
      .attr('cy', function (d) {return mercProjection(d.geometry.coordinates)[1]})
      .attr('r', function(d) {return +d.properties.mass / 10000 || 3})

  }

})()
