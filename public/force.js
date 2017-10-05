(function(){

  var svg, nodes, links, height, width, simulation, nodeElements, textElements, linkElements, size, offsets;

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

    w = 16;
    h = 10;

    svg = d3
      .select('#chart')
      .append('svg');

    // append links
    linkElements = svg.append('g')
      .selectAll('line')
      .data(links)
      .enter().append('line')
        .attr('stroke-width', 1)
        .attr('stroke', 'grey')

    // append nodes and labels
    nodeElements = svg.append('g')
      .selectAll('svg')
      .data(nodes)
      .enter().append('svg')
        .attr('height', h)
        .attr('width', w)
        .attr('viewBox', function (node) {return offsets[node.code][0] + ',' + offsets[node.code][1] + ','+ w +','+ h})

    nodeElements
      .append('image')
      .attr('xlink:href', 'flags.png')
      .append('title')
      .text(function (node) {return node.country})

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

    simulation.tick();
  }

  function tickFunc() {
    // update node and link positions
    nodeElements
      .attr('x', function (node) {return node.x = Math.max(w, Math.min(width - w, node.x))})
      .attr('y', function (node) {return node.y = Math.max(h, Math.min(height - h, node.y))});

    linkElements
      .attr('x1', function (link) {return link.source.x + w / 2})
      .attr('y1', function (link) {return link.source.y + h / 2})
      .attr('x2', function (link) {return link.target.x + w / 2})
      .attr('y2', function (link) {return link.target.y + h / 2});
  }

  offsets = {
    sv: [48,143],
    au: [192,0],
    gl: [32,55],
    tibet: [192,143],
    cg: [112,22],
    qa: [160,121],
    af: [32,0],
    it: [208,66],
    mr: [96,99],
    wales: [80,165],
    scotland: [48,132],
    se: [80,132],
    cd: [80,22],
    io: [144,66],
    hk: [208,55],
    ye: [144,165],
    gp: [80,55],
    sh: [112,132],
    do: [144,33],
    ru: [224,121],
    ky: [192,77],
    at: [176,0],
    wf: [96,165],
    sk: [160,132],
    cl: [176,22],
    ge: [208,44],
    nu: [144,110],
    kurdistan: [160,77],
    la: [224,77],
    vc: [240,154],
    gq: [96,55],
    cz: [64,33],
    pr: [80,121],
    ls: [64,88],
    no: [96,110],
    bf: [64,11],
    pa: [192,110],
    mn: [32,99],
    fo: [128,44],
    dj: [96,33],
    st: [32,143],
    er: [0,44],
    us: [176,154],
    zm: [208,165],
    by: [16,22],
    cm: [192,22],
    tw: [96,154],
    vg: [16,165],
    zw: [224,165],
    pl: [32,121],
    tk: [224,143],
    ga: [160,44],
    ba: [0,11],
    uy: [192,154],
    km: [96,77],
    fk: [96,44],
    mp: [64,99],
    lv: [112,88],
    co: [224,22],
    rs: [208,121],
    sb: [16,132],
    in: [128,66],
    bj: [128,11],
    ck: [160,22],
    im: [112,66],
    tj: [208,143],
    jp: [16,77],
    bt: [224,11],
    pt: [112,121],
    fm: [112,44],
    sx: [64,143],
    nf: [32,110],
    mk: [240,88],
    ad: [0,0],
    ni: [64,110],
    sj: [144,132],
    ps: [96,121],
    gs: [128,55],
    ch: [128,22],
    fj: [80,44],
    ci: [144,22],
    es: [16,44],
    cf: [96,22],
    th: [176,143],
    ma: [144,88],
    kn: [112,77],
    re: [176,121],
    cv: [16,33],
    dk: [112,33],
    za: [176,165],
    ss: [16,143],
    pm: [48,121],
    hn: [240,55],
    om: [176,110],
    ug: [144,154],
    bm: [144,11],
    gg: [240,44],
    mu: [144,99],
    bn: [160,11],
    catalonia: [64,22],
    ar: [144,0],
    um: [160,154],
    zanzibar: [192,165],
    li: [16,88],
    yt: [160,165],
    ml: [0,99],
    mc: [160,88],
    ve: [0,165],
    sd: [64,132],
    bw: [0,22],
    ne: [16,110],
    ag: [48,0],
    md: [176,88],
    ir: [176,66],
    kp: [128,77],
    fi: [64,44],
    ly: [128,88],
    nc: [0,110],
    va: [224,154],
    dm: [128,33],
    il: [96,66],
    kw: [176,77],
    sc: [32,132],
    tv: [80,154],
    tf: [144,143],
    is: [192,66],
    mw: [176,99],
    bb: [16,11],
    tt: [64,154],
    dz: [160,33],
    eg: [208,33],
    na: [240,99],
    jo: [0,77],
    bi: [112,11],
    me: [192,88],
    my: [208,99],
    nr: [128,110],
    bv: [240,11],
    mq: [80,99],
    lr: [48,88],
    ax: [224,0],
    as: [160,0],
    sn: [208,132],
    hr: [0,66],
    mh: [224,88],
    py: [144,121],
    aw: [208,0],
    fr: [144,44],
    uz: [208,154],
    gd: [192,44],
    ws: [112,165],
    tr: [48,154],
    tz: [112,154],
    mm: [16,99],
    td: [128,143],
    vu: [64,165],
    bd: [32,11],
    cu: [0,33],
    gw: [176,55],
    np: [112,110],
    gb: [176,44],
    lc: [0,88],
    nz: [160,110],
    cy: [48,33],
    ms: [112,99],
    eu: [48,44],
    vi: [32,165],
    kz: [208,77],
    al: [80,0],
    cw: [32,33],
    jm: [240,66],
    ke: [32,77],
    an: [112,0],
    so: [224,132],
    lk: [32,88],
    mv: [160,99],
    be: [48,11],
    pk: [16,121],
    bg: [80,11],
    az: [240,0],
    gm: [48,55],
    tc: [112,143],
    ie: [80,66],
    mx: [192,99],
    sm: [192,132],
    bs: [208,11],
    iq: [160,66],
    gt: [144,55],
    kh: [64,77],
    ht: [16,66],
    gu: [160,55],
    bz: [32,22],
    bh: [96,11],
    ph: [0,121],
    sg: [96,132],
    kr: [144,77],
    gn: [64,55],
    sy: [80,143],
    ca: [48,22],
    ua: [128,154],
    vn: [48,165],
    je: [224,66],
    hu: [32,66],
    cr: [240,22],
    am: [96,0],
    tl: [240,143],
    bo: [176,11],
    ki: [80,77],
    id: [64,66],
    gh: [0,55],
    tn: [16,154],
    somaliland: [240,132],
    lb: [240,77],
    br: [192,11],
    gf: [224,44],
    england: [240,33],
    pn: [64,121],
    de: [80,33],
    sl: [176,132],
    sr: [0,143],
    to: [32,154],
    gi: [16,55],
    gr: [112,55],
    ng: [48,110],
    sa: [0,132],
    hm: [224,55],
    xk: [128,165],
    ae: [16,0],
    ic: [48,66],
    ao: [128,0],
    pe: [208,110],
    cn: [208,22],
    mg: [208,88],
    si: [128,132],
    lu: [96,88],
    gy: [192,55],
    pf: [224,110],
    ai: [64,0],
    nl: [80,110],
    mz: [224,99],
    tg: [160,143],
    mo: [48,99],
    mt: [128,99],
    rw: [240,121],
    et: [32,44],
    eh: [224,33],
    ee: [192,33],
    tm: [0,154],
    lt: [80,88],
    pw: [128,121],
    pg: [240,110],
    ro: [192,121],
    kg: [48,77],
    ec: [176,33],
    sz: [96,143]
  }

})()
