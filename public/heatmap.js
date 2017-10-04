(function() {

  var dataset;

  axios
    .get('https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json')
    .then(function(res) {
      dataset = res.data.monthlyVariance;
      console.log(dataset);
      init();
    })
    .catch(function (err) {
      console.error(err);
    });

    window.addEventListener('resize', render);

    function init() {

      margin = {
        left: 60,
        right: 30,
        top: 60,
        bottom: 30
      }

      height = dataset.length / 12 * 4;

      // define the div for the tooltip
      div = d3.select('#chart').append('div')
        .attr('class', 'tooltip wide')
        .style('opacity', 0);

      // define svg
      svg = d3.select('#chart')
        .append('svg')
        .attr('height', height)

      // Initialize and add axes

      xScale = d3.scaleLinear().domain([0, 12]);
      yScale = d3.scaleLinear()
        .domain([
          d3.max(dataset, function(d) {return d.year}),
          d3.min(dataset, function(d) {return d.year})
        ])
        .range([height - margin.bottom, margin.top]);

      xAxis = d3.axisTop(xScale);
      yAxis = d3.axisLeft(yScale).ticks(20).tickFormat(function(d) {return d});

      svg.append('g').classed('x axis', true);
      svg.append('g')
        .classed('y axis', true)
        .attr('transform', 'translate(' + margin.left + ', 0)')
        .call(yAxis)

      // axis labels
      svg.append('text')
         .classed('x label', true)
         .style('text-anchor', 'middle')
         .text('Months')

     svg.append('text')
        .classed('y label', true)
        .style('text-anchor', 'middle')
        .text('Year')
        .attr('transform', 'rotate(-90)')
        .attr('x', 0 - height / 2)
        .attr('y', margin.left / 3);

      // append datapoints
      svg
        .selectAll('rect')
        .data(dataset)
        .enter()
        .append('rect')
        .attr('height', yScale(1) - yScale(0))
        .attr('y', function(d, i) {
          return yScale(d.year)
        })

      render();
    }

    function render() {
      var w = window;
      var d = document;
      var e = d.documentElement;
      var g = d.getElementsByTagName('body')[0];
      width = Math.min((w.innerWidth || e.clientWidth || g.clientWidth), 960) - 30 ;

      // adjust sizing of chart area...
      svg.attr('width', width)

      // x-scale
      xScale.range([margin.left, width - margin.right]);

      // x-axis
      svg.select('.x.axis')
       .attr('transform', 'translate(0, ' + margin.top + ')')
       .call(xAxis)

      // and x-axis label
      svg.select('.x.label')
        .attr('x', width / 2)
        .attr('y', margin.top / 2);

      // adjust positioning and sizing of data pointer-events
      svg.selectAll('rect')
        .attr('width', xScale(1) - xScale(0))
        .attr('x', function(d, i) {return xScale(i % 12)})

    }

    function showTooltip(d) {

      div.transition()
        .duration(200)
        .style('opacity', .9);
      div.html(
        d.Nationality + ': ' + d.Name + '<br />' +
        'Year: ' + d.Year + ', Time: ' + d.Time + '<br />' +
        d.Doping
      )
      if ((width - d3.event.offsetX) < 130) { // near the right edge
        div
          .style('left', (d3.event.pageX - 220) + 'px')
          .style('top', (d3.event.pageY - 30) + 'px');
      } else if (d3.event.offsetX < 150) { // near the left edge
        div
          .style('left', (d3.event.pageX + 10) + 'px')
          .style('top', (d3.event.pageY - 30) + 'px');
      } else {
        div
          .style('left', (d3.event.pageX - 110) + 'px')
          .style('top', (d3.event.pageY + 10) + 'px');
      }
    }

    function hideTooltip(d) {
      div.transition()
        .duration(500)
        .style('opacity', 0);
    }
})()
