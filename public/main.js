(function() {

  var dataset, xScale, yScale, xAxis, yAxis, svg, div, margin, barWidth, formatTime, width, height;

  axios
    .get('https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json')
    .then(function(res) {
      dataset = res.data.data.map(function(entry) {return [new Date(entry[0]), entry[1]]});
      init();
    })
    .catch(function (err) {
      console.error(err);
    });

  window.addEventListener('resize', render);

  function init() {

    margin = {
      left: 60,
      right: 20,
      top: 20,
      bottom: 20
    }
    barWidth = 3;
    formatTime = d3.timeFormat('%Y - %b');

    // define the div for the tooltip
    div = d3.select('#chart').append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0);

    // define svg
    svg = d3.select('#chart')
      .append('svg')

    // Initialize and add axes
    xScale = d3.scaleTime().domain(d3.extent(dataset, function (d) {return d[0]}));
    yScale = d3.scaleLinear().domain([0, d3.max(dataset, function(d) {return d[1]})]);

    xAxis = d3.axisBottom(xScale);
    yAxis = d3.axisLeft(yScale);

    svg.append('g').classed('x axis', true);
    svg.append('g').classed('y axis', true);

    // Put in data and add listeners
    svg.selectAll('rect')
      .data(dataset)
      .enter()
      .append('rect')
      .attr('width', barWidth)
      .attr('fill', 'lightsteelblue')
      .on('mouseover', function(d) {
        d3.select(this)
          .attr('fill', 'steelblue');
        div.transition()
          .duration(200)
          .style('opacity', .9);
        div.html(
            '<strong>' + d[1].toLocaleString('en-US', {style: 'currency', currency: 'USD'})
            + ' Billion</strong><br/>' + formatTime(d[0]))
        if (width - d3.event.pageX < 125) { // near the right edge
          div
            .style('left', (d3.event.pageX - 150) + 'px')
            .style('top', (d3.event.pageY - 30) + 'px');
        } else {
          div
            .style('left', (d3.event.pageX + 10) + 'px')
            .style('top', (d3.event.pageY - 30) + 'px');
        }
      })
      .on('mouseout', function(d) {
        div.transition()
          .duration(500)
          .style('opacity', 0);
        d3.select(this)
          .attr('fill', 'lightsteelblue')
      });

      render();
  }

  function render() {

    var w = window;
    var d = document;
    var e = d.documentElement;
    var g = d.getElementsByTagName('body')[0];
    width = Math.min((w.innerWidth || e.clientWidth || g.clientWidth), 960) - 30 ;
    height = (w.innerHeight|| e.clientHeight|| g.clientHeight) - 150;

    // adjust tick based on window size
    if (width < 400) {
      xAxis.ticks(d3.timeYear.every(15));
    } else if (width < 750) {
      xAxis.ticks(d3.timeYear.every(10));
    } else {
      xAxis.ticks(d3.timeYear.every(5));
    }

    // adjust height for lower screens (e.g. landscape)
    if (height < 300) {
      height+= 50;
    }

    // adjust sizing of chart area...
    svg.attr('width', width)
      .attr('height', height)

    // scales
    xScale.range([margin.left, width - margin.right]);
    yScale.range([height - margin.bottom, margin.top]);

    // and bars
    svg.selectAll('rect')
      .attr('x', function(d, i) {return xScale(d[0]) })
      .attr('y', function(d, i) {return yScale(d[1]) })
      .attr('height', function(d, i) {return height - margin.bottom - yScale(d[1])})

    // and adjust axes
    svg.select('.x.axis')
     .attr('transform', 'translate(0, ' + (height - margin.bottom) + ')')
     .call(xAxis)
     .selectAll('.tick>text')
     .each(function(d, i) {
       d3.select(this).style('font-size', '16px')
     });

    svg.select('.y.axis')
      .attr('transform', 'translate(' + margin.left + ', 0)')
      .call(yAxis)
      .selectAll('.tick>text')
      .each(function(d, i) {
        d3.select(this).style('font-size', '16px')
      });
  }

})()
