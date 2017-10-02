(function() {

  axios
    .get('https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json')
    .then(function(res) {
      init(res.data.data.map(function(entry) {return [new Date(entry[0]), entry[1]]}));
    })
    .catch(function (err) {
      console.error(err);
    });

  function init(dataset) {

    var chartStyle = window.getComputedStyle(document.querySelector('#chart'), null);
    var padding = 50;
    var barWidth = 3;
    var height = parseFloat(chartStyle.height);
    var width = parseFloat(chartStyle.width);

    var formatTime = d3.timeFormat('%Y - %b');

    var xScale = d3.scaleTime()
                   .range([padding, width - padding]);
    xScale.domain(d3.extent(dataset, function (d) {return d[0]}));

    var yScale = d3.scaleLinear()
                   .domain([0, d3.max(dataset, function(d) {return d[1]})])
                   .range([height - padding, padding]);

    // define the div for the tooltip
    var div = d3.select('#chart').append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0);

    var svg = d3.select('#chart')
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .attr('x', 0)
      .attr('y', 0)

    svg.selectAll('rect')
      .data(dataset)
      .enter()
      .append('rect')
      .attr('x', function(d, i) {return xScale(d[0]) })
      .attr('y', function(d, i) {return yScale(d[1]) })
      .attr('width', barWidth)
      .attr('height', function(d, i) {return height - padding - yScale(d[1])})
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
          .style('left', (d3.event.pageX + 10) + 'px')
          .style('top', (d3.event.pageY - 30) + 'px');
      })
      .on('mouseout', function(d) {
        div.transition()
          .duration(500)
          .style('opacity', 0);
        d3.select(this)
          .attr('fill', 'lightsteelblue')
      });


    var xAxis = d3.axisBottom(xScale);

    svg.append('g')
     .attr('transform', 'translate(0, ' + (height - padding) + ')')
     .call(xAxis)
     .selectAll('.tick>text')
     .each(function(d, i) {
       d3.select(this).style('font-size', '16px')
     });

    var yAxis = d3.axisLeft(yScale);

    svg.append('g')
      .attr('transform', 'translate(' + padding + ', 0)')
      .call(yAxis)
      .selectAll('.tick>text')
      .each(function(d, i) {
        d3.select(this).style('font-size', '16px')
      });

  }



})()
