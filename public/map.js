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
    height = window.innerHeight - document.querySelector('svg').getBoundingClientRect().y - 30;
    width = window.innerWidth - 30;

    var svg = d3.select('#chart')
                .append('svg')
                .attr('width', width)
                .attr('height', height);

    var countries = svg.append('g');

    var mercProjection = d3
      .geoMercator()
      .center([13,52])
      .translate([width/2, height/2]);


    var geoPath = d3.geoPath().projection(mercProjection);
    countries.selectAll('path')
      .data(map.features)
      .enter()
      .append('path')
      .attr('fill', '#ccc')
      .attr('d', geoPath);

  }

})()
