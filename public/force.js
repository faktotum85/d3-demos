(function(){

  var svg, nodes, links, height, width, simulation, nodeElements, textElements;

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

    svg = d3
      .select('#chart')
      .append('svg');

    // append nodes and labels
    nodeElements = svg.append('g')
      .selectAll('circle')
      .data(nodes)
      .enter().append('circle')
        .attr('r', 10)
        .attr('fill', 'red')

    textElements = svg.append('g')
      .selectAll('text')
      .data(nodes)
      .enter().append('text')
        .text(function (node) {return node.country})
        .attr('font-size', 15)
        .attr('dx', 15) // x and y are set dynamically by the simulation
        .attr('dy', 4)

    // set up simulation
    simulation = d3.forceSimulation()
      .force('charge', d3.forceManyBody().strength(-20)) // add friction

    render();

  }

  function render() {

    // adjust svg and simulation center based on height, width;
    height = window.innerHeight - 150;
    width = Math.min(window.innerWidth, 960) - 30;

    svg
      .attr('height', height)
      .attr('width', width)

    simulation
      .force('center', d3.forceCenter(width / 2, height / 2))

    // link nodes to simulation and tick function, which runs periodically
    simulation.nodes(nodes).on('tick', tickFunc);

  }

  function tickFunc() {
    // update node and label positions
    nodeElements
      .attr('cx', function (node) {return node.x})
      .attr('cy', function (node) {return node.y});
    textElements
      .attr('x', function (node) {return node.x})
      .attr('y', function (node) {return node.y});
  }

})()
