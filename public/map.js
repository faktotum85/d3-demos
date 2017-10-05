(function() {

  var meteorStrikes, map, div, height, width;

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

    height = window.innerHeight - document.querySelector('svg').getBoundingClientRect().y - 30;
    width = window.innerWidth - 30;

    svg.attr('width', width)
       .attr('height', height);

    var countries = svg.append('g');

    div = d3.select('#chart').append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0);

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
      .attr('fill', 'rgba(255,0,0,0.2)')
      .attr('stroke', 'red')
      .attr('stroke-width', 0.5)
      .attr('cx', function (d) {return mercProjection(d.geometry.coordinates)[0]})
      .attr('cy', function (d) {return mercProjection(d.geometry.coordinates)[1]})
      .attr('r', function(d) {return Math.pow(+d.properties.mass, 1/4) || 1})
      .on('mouseover', showTooltip)
      .on('mouseout', hideTooltip)
      .on('click', function() {this.remove()})

  }

  function showTooltip(d) {

    div.transition()
      .duration(200)
      .style('opacity', .9);
    div.html(
      '<strong>' + d.properties.name + '</strong><br/>' +
      'Mass: ' + d.properties.mass + '<br/>' +
      'Year: ' + d.properties.year.substring(0,4) + '<br/>' +
      'Class: ' + d.properties.recclass + '<br/>' +
      'Longitute: ' + Number(d.properties.reclong).toFixed(2) + '<br/>' +
      'Latitude: ' + Number(d.properties.reclat).toFixed(2) + '<br/>'
    )
    if ((width - d3.event.offsetX) < 130) { // near the right edge
      div.style('left', (d3.event.pageX - 160) + 'px')
    } else if (d3.event.offsetX < 150) { // near the left edge
      div.style('left', (d3.event.pageX + 10) + 'px')
    } else {
      div.style('left', (d3.event.pageX - 70) + 'px')
    }
    if ((height - d3.event.offsetY) < 100) { // near the bottom
      div.style('top', (d3.event.pageY - 60) + 'px');
    } else {
      div.style('top', (d3.event.pageY + 10) + 'px');
    }
  }

  function hideTooltip(d) {
    div.transition()
      .duration(500)
      .style('opacity', 0);
  }


})()
