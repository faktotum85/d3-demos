(function(){

  var svg, nodes, links, height, width, simulation, nodeElements, textElements, linkElements, size;

  axios.get('https://raw.githubusercontent.com/DealPete/forceDirected/master/countries.json')
       .then(function (res) {
         nodes = res.data.nodes;
         links = res.data.links;
         init();
       })
       .catch(function(err) {
         console.error(err);
       });

  window.addEventListener('resize', render);

  function init() {

    size = 25;

    svg = d3
      .select('#chart')
      .append('svg');

    // append nodes and labels
    nodeElements = svg.append('g')
      .selectAll('rect')
      .data(nodes)
      .enter().append('rect')
        .attr('height', size)
        .attr('width', size)
        .attr('fill', 'red')

    // append links
    linkElements = svg.append('g')
      .selectAll('line')
      .data(links)
      .enter().append('line')
        .attr('stroke-width', 1)
        .attr('stroke', 'grey')

    var dragDrop = d3.drag()
      .on('start', function (node) {
        node.fx = node.x
        node.fy = node.y
      })
      .on('drag', function(node) {
        simulation.alphaTarget(0.7).restart()
        node.fx = d3.event.x
        node.fy = d3.event.y
      })
      .on('end', function(node) {
        if (!d3.event.active) {
          simulation.alphaTarget(0)
        }
        node.fx = null
        node.fy = null
      });

    nodeElements.call(dragDrop)

    // set up simulation
    simulation = d3.forceSimulation()
      .force('charge', d3.forceManyBody().strength(-10)) // add friction
      .force('link', d3.forceLink());

    render();

  }

  function render() {

    // adjust svg and simulation center based on height, width;
    height = window.innerHeight - document.querySelector('svg').getBoundingClientRect().y - 30;
    width = window.innerWidth - 30;

    svg
      .attr('height', height)
      .attr('width', width);

    // link nodes to simulation and tick function, which runs periodically
    simulation
      .nodes(nodes).on('tick', tickFunc);

    simulation
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('link').links(links); // needs to be done after nodes & tickFunc are provided

    console.log('running render')
    simulation.tick();
  }

  function tickFunc() {
    // update node and link positions
    nodeElements
      .attr('x', function (node) {return node.x = Math.max(size, Math.min(width - size, node.x))})
      .attr('y', function (node) {return node.y = Math.max(size, Math.min(height - size, node.y))});

    linkElements
      .attr('x1', function (link) {return link.source.x + size / 2})
      .attr('y1', function (link) {return link.source.y + size / 2})
      .attr('x2', function (link) {return link.target.x + size / 2})
      .attr('y2', function (link) {return link.target.y + size / 2});
  }

})()
