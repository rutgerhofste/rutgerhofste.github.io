var svg = d3.select("svg");

var xScale = d3.scaleLinear()
  .domain([0,5000])
  .range([100,500]);

var dataPoints = [1,1010,1020,5000];

var k = 10 / (xScale(1020) - xScale(1010))

var tx = 200 - k * xScale(1010)

var t = d3.zoomIdentity.translate(tx, 0).scale(k)

svg.selectAll('circle')
  .data(dataPoints)
  .enter()
  .append('circle')
  .attr("fill","red")
  .attr('r', 7)
  .attr('cy',100)
  .attr('cx', function(d) {return t.applyX(xScale(d)); });

var xNewScale = t.rescaleX(xScale)

var xTopAxis = d3.axisTop()
    .scale(xNewScale)
    .ticks(3)

var gTopAxis = d3.axisTop()
    .scale(xScale)
    .ticks(3)

svg.append('g')
  .attr("transform", "translate(0," + 50 + ")")
  .call(xTopAxis);

svg.append('g')
  .attr("transform", "translate(0," + 80 + ")")
  .call(gTopAxis);

var circles = svg.selectAll('circle');
var zoom = d3.zoom().on('zoom', zoomed);

function zoomed(){
  var transform = d3.event.transform;
  var xNewScale = transform.rescaleX(xScale);
  xTopAxis.scale(xNewScale);
  gTopAxis.call(xTopAxis);

  circles.attr('cx', function(d) { return transform.applyX(xScale(d)); });
}

g.call(zoom)