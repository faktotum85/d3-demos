(function() {

  var dataset, margin, width, height, div, svg, xScale, yScale, xAxis, yAxis, colorScale, baseTemp, legendTicks;
  var monthNames = [ "January", "February", "March", "April", "May", "June",
                    "July", "August", "September", "October", "November", "December" ];

  axios
    .get('https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json')
    .then(function(res) {
      dataset = res.data.monthlyVariance;
      baseTemp = res.data.baseTemperature;
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
        bottom: 40
      }

      height = dataset.length / 12 * 4;

      // define the div for the tooltip
      div = d3.select('#chart').append('div')
        .attr('class', 'tooltip')
        .style('opacity', 0);

      // define svg
      svg = d3.select('#chart')
        .append('svg')
        .attr('height', height)

      // Initialize and add axes

      xScale = d3.scaleLinear().domain([0, 12]);
      yScale = d3.scaleLinear()
        .domain([
          d3.min(dataset, function(d) {return d.year}),
          d3.max(dataset, function(d) {return d.year})
        ])
        .range([height - margin.bottom, margin.top]);
      colorScale = d3.scaleLinear()
        .domain([
          d3.min(dataset, function(d) {return d.variance}),
          d3.max(dataset, function(d) {return d.variance})
        ])
        .range([0, 1]);

      xAxis = d3.axisTop(xScale)
        .tickValues([0.5, 1.5, 2.5, 3.5, 4.5, 5.5, 6.5, 7.5, 8.5, 9.5, 10.5, 11.5])
        .tickFormat(function (d) {return monthNames[d-0.5].substring(0,3)});
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
        .classed('data', true)
        .attr('height', yScale(0) - yScale(1))
        .attr('y', function(d, i) {
          return yScale(d.year)
        })
        .attr('fill', function(d) {return heatMapColorforValue(colorScale(d.variance))})
        .on('mouseover', showTooltip)
        .on('mouseout', hideTooltip);

      // append legend
      legendTicks = colorScale.ticks(8);

      svg
        .selectAll('rect.legend')
        .data(legendTicks)
        .enter()
        .append('rect')
        .classed('legend', true)
        .attr('height', 10)
        .attr('y', height - (margin.bottom / 2))
        .attr('fill', function (d) {return heatMapColorforValue(colorScale(d))})

      svg
        .selectAll('text.legend')
        .data(legendTicks)
        .enter()
        .append('text')
        .classed('legend', true)
        .attr('y', height - (margin.bottom / 2) + 20)
        .text(function(d, i) {return d + '°C'})
        .attr('text-anchor', 'middle')
        .style('font-size', '10px')
        .style('font-family', 'sans-serif');

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

      // adjust positioning and sizing of data points
      svg.selectAll('rect.data')
        .attr('x', function(d, i) {return xScale(i % 12)})
        .attr('width', xScale(1) - xScale(0));

      // and legend points
      svg.selectAll('rect.legend')
        .attr('x', function(d, i) {return (margin.left + (width - margin.left - margin.right) / legendTicks.length * i)})
        .attr('width', (width - margin.left - margin.right) / legendTicks.length)

      svg.selectAll('text.legend')
        .attr('x', function(d, i) {return (margin.left + (width - margin.left - margin.right) / legendTicks.length * (i + 0.5))})


    }

    function showTooltip(d) {

      div.transition()
        .duration(200)
        .style('opacity', .9);
      div.html(
        d.year + ' - ' + monthNames[d.month - 1] + '<br/>' +
        (baseTemp + d.variance).toFixed(3) + '°C <br />' +
        d.variance + '°C'
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

    function heatMapColorforValue(value) {
      var h = (1.0 - value) * 240
      return "hsl(" + h + ", 50%, 60%)";
    }
})()
