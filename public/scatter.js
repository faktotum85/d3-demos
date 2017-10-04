(function () {

  var dataset, svg, xScale, yScale, xAxis, yAxis, now, margin, width, height, bestTime, div, legend;

  axios
    .get('https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json')
    .then(function(res) {
      bestTime = res.data[0].Seconds;
      dataset = res.data;
      init();
    })
    .catch(function (err) {
      console.error(err);
    });

  window.addEventListener('resize', render);

  function init() {

    margin = {
      left: 50,
      right: 100,
      top: 25,
      bottom: 50
    }

    // define the div for the tooltip
    div = d3.select('#chart').append('div')
      .attr('class', 'tooltip wide')
      .style('opacity', 0);

    // define svg
    svg = d3.select('#chart')
      .append('svg')

    // Initialize and add axes
    xScale = d3.scaleLinear().domain([
      d3.max(dataset, function (d) {return d.Seconds}),
      d3.min(dataset, function (d) {return d.Seconds})
    ]);
    yScale = d3.scaleLinear().domain([dataset.length, 1]);

    xAxis = d3.axisBottom(xScale).tickFormat(formatRelativeTime);
    yAxis = d3.axisLeft(yScale);

    svg.append('g').classed('x axis', true);
    svg.append('g').classed('y axis', true);

    // axis labels
    svg.append('text')
       .classed('x label', true)
       .style('text-anchor', 'middle')
       .text('Minutes Behind Fastest Time')

   svg.append('text')
      .classed('y label', true)
      .style('text-anchor', 'middle')
      .text('Ranking')
      .attr('transform', 'rotate(-90)')

      // collect legend entries
      var entries = [];
      var legendText = '';
      dataset.forEach(function(entry) {
        legendText = entry.Doping ? 'Doping allegations' : 'No doping allegations';
        if (entries.indexOf(legendText) === -1) {
          entries.push(legendText)
        }
      });
      // append colors
      var colors = ['tomato', 'lightsteelblue'];
      var legendItems = [];
      entries.forEach(function (entry, index) {
        legendItems.push({
          text: entry,
          color: colors[index]
        })
      });

    // create scatters
    svg.selectAll('circle')
      .data(dataset)
      .enter()
      .append('circle')
      .classed('data', true)
      .attr('r', 5)
      .attr('fill', function (d) {return colors[entries.indexOf(d.Doping ? 'Doping allegations' : 'No doping allegations')]})
      .attr('data-fill', function (d) {return colors[entries.indexOf(d.Doping ? 'Doping allegations' : 'No doping allegations')]})
      .on('mouseover', showTooltip)
      .on('mouseout', hideTooltip);

    // add text labels
    svg.selectAll('.point.label')
      .data(dataset)
      .enter()
      .append('text')
      .classed('point label', true)
      .text(function (d) {return d.Name})
      .style('font-size', '12px')

    // add legend
    legend = svg.append('svg')
                .attr('height', 100)
                .attr('width', 150)

    legend
      .selectAll('text')
      .data(legendItems)
      .enter()
      .append('text')
      .text(function(d) {return d.text})
      .attr('y', function (d, i) {return (i + 2) * 20})
      .attr('x', 15)
      .style('font-family', 'sans-serif')
      .style('font-size', '14px')

    legend
      .selectAll('circle')
      .data(legendItems)
      .enter()
      .append('circle')
      .classed('legend', true)
      .attr('fill', function (d) { return d.color})
      .attr('r', 5)
      .attr('cy', function (d, i) {return (i + 2) * 20 - 4})
      .attr('cx', 5)

    legend
      .append('text')
      .text('Legend')
      .attr('x', 15)
      .attr('y', 20)
      .style('text-decoration', 'underline')
      .style('font-weight', 'bold')
      .style('font-family', 'sans-serif')
      .style('font-size', '14px')

    render();
  }

  function showTooltip(d) {

    d3.select(this)
      .attr('fill', 'steelblue');
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
    d3.select(this)
      .attr('fill', this.getAttribute('data-fill'))
  }

  function formatRelativeTime(absolute) {
    var delta = absolute - bestTime;
    return Math.floor(delta / 60) + ":" + (delta % 60)
  }

  function render() {
    var w = window;
    var d = document;
    var e = d.documentElement;
    var g = d.getElementsByTagName('body')[0];
    width = Math.min((w.innerWidth || e.clientWidth || g.clientWidth), 960) - 30 ;
    height = (w.innerHeight|| e.clientHeight|| g.clientHeight) - 150;

    // adjust tick based on window size
    if (width < 500) {
      xAxis.ticks(3);
    } else {
      xAxis.ticks(9);
    }

    // adjust sizing of chart area...
    svg.attr('width', width)
      .attr('height', height)

    // scales
    xScale.range([margin.left, width - margin.right]);
    yScale.range([height - margin.bottom, margin.top]);

    // and bars
    svg.selectAll('circle.data')
      .attr('cx', function(d) {return xScale(d.Seconds) })
      .attr('cy', function(d, i) {return yScale(i + 1) })

    // and adjust axes
    svg.select('.x.axis')
     .attr('transform', 'translate(0, ' + (height - margin.bottom) + ')')
     .call(xAxis)

    svg.select('.y.axis')
      .attr('transform', 'translate(' + margin.left + ', 0)')
      .call(yAxis)

    // and labels
    svg.select('.x.label')
      .attr('transform', 'translate(' + ((margin.left + width) / 2) + ',' + (height) + ')');
    svg.select('.y.label')
      .attr('x', 0 - height / 2)
      .attr('y', margin.left / 3);

    var display = width < 500 ? 'none' : 'block'
    svg.selectAll('.point.label')
      .attr('x', function(d) {return xScale(d.Seconds - 5)})
      .attr('y', function(d, i) {return yScale(i + 1)})
      .attr('display', display) // hide on smaller screens

    // and legend
    legend
      .attr('x', width / 2 )
      .attr('y', height / 2)
  }

})()
