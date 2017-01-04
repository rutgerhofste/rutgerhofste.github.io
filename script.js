var data = [
  {xvalue: 1, yvalue: 200},
  {xvalue: 2, yvalue: 280},
  {xvalue: 3, yvalue: 15},
  {xvalue: 4, yvalue: 11},
  {xvalue: 5, yvalue: 14},
  {xvalue: 6, yvalue: 23},
  {xvalue: 7, yvalue: 9}
];



var svg = d3.select("svg"),
    margin = {top: 20, right: 20, bottom: 110, left: 40},
    margin2 = {top: 430, right: 20, bottom: 30, left: 40},
    width = svg.attr("width") - margin.left - margin.right,
    height = svg.attr("height") - margin.top - margin.bottom,
    height2 = svg.attr("height") - margin2.top - margin2.bottom;

var x = d3.scaleLinear().range([0, width]),
    x2 = d3.scaleLinear().range([0, width]),
    y = d3.scaleLinear().range([height, 0]),
    y2 = d3.scaleLinear().range([height2, 0]);

var xAxis = d3.axisBottom(x),
    xAxis2 = d3.axisBottom(x2),
    yAxis = d3.axisLeft(y);

var brush = d3.brushX()
    .extent([[0, 0], [width, height2]])
    .on("brush end", brushed);

var zoom = d3.zoom()
    .scaleExtent([1, Infinity])
    .translateExtent([[0, 0], [width, height]])
    .extent([[0, 0], [width, height]])
    .on("zoom", zoomed);

var area = d3.area()
    .curve(d3.curveMonotoneX)
    .x(function(d) { return x(d.date); })
    .y0(height)
    .y1(function(d) { return y(d.price); });

var area2 = d3.area()
    .curve(d3.curveMonotoneX)
    .x(function(d) { return x2(d.date); })
    .y0(height2)
    .y1(function(d) { return y2(d.price); });

svg.append("defs").append("clipPath")
    .attr("id", "clip")
  .append("rect")
    .attr("width", width)
    .attr("height", height);

var focus = svg.append("g")
    .attr("class", "focus")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var context = svg.append("g")
    .attr("class", "context")
    .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

d3.csv("800KYV2.csv", type, function(error, data) {
  if (error) throw error;

  //x.domain(d3.extent(data, function(d) { return d.date; }));
  //y.domain([0, d3.max(data, function(d) { return d.price; })]);
  x.domain([-800000, 2000]);
  y.domain([150, 300]);

  x2.domain(x.domain());
  y2.domain(y.domain());

  focus.append("path")
      .datum(data)
      .attr("class", "area")
      .attr("d", area);

  focus.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  focus.append("g")
      .attr("class", "axis axis--y")
      .call(yAxis);

  context.append("path")
      .datum(data)
      .attr("class", "area")
      .attr("d", area2);

  context.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height2 + ")")
      .call(xAxis2);

  context.append("g")
      .attr("class", "brush")
      .call(brush)
      .call(brush.move, x.range());

  svg.append("rect")
      .attr("class", "zoom")
      .attr("width", width)
      .attr("height", height)
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
      .call(zoom);
});

svg.selectAll("dot")
    .data(data)
  .enter().append("circle")
    .attr("r", 1000)
    .attr("cx", function(d) { return x(d.xvalue); })
    .attr("cy", function(d) { return y(d.yvalue); })
    //.on("mouseover", handleMouseOver)
    //.on("mouseout",handleMouseOut)
    //.on("click",handleMouseClick)
    ;



function brushed() {
  if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") return; // ignore brush-by-zoom
  var s = d3.event.selection || x2.range();
  x.domain(s.map(x2.invert, x2));
  focus.select(".area").attr("d", area);
  focus.select(".axis--x").call(xAxis);
  svg.select(".zoom").call(zoom.transform, d3.zoomIdentity
      .scale(width / (s[1] - s[0]))
      .translate(-s[0], 0));
}

function zoomed() {
  if (d3.event.sourceEvent && d3.event.sourceEvent.type === "brush") return; // ignore zoom-by-brush
  var t = d3.event.transform;
  x.domain(t.rescaleX(x2).domain());
  focus.select(".area").attr("d", area);
  focus.select(".axis--x").call(xAxis);
  context.select(".brush").call(brush.move, x.range().map(t.invertX, t));
}

function type(d) {
  d.date = d.datum;
  d.price = d.waarde;
  d.bron = d.bron;
  return d;
}





/* Old script

var data = [
  {xvalue: 1, yvalue: 10},
  {xvalue: 2, yvalue: 20},
  {xvalue: 3, yvalue: 15},
  {xvalue: 4, yvalue: 11},
  {xvalue: 5, yvalue: 14},
  {xvalue: 6, yvalue: 23},
  {xvalue: 7, yvalue: 9}
];

var valueline = d3.line()
    .x(function(d) { return x(d.xvalue); })
    .y(function(d) { return y(d.yvalue); });


var div = d3.select("charts").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);
  

// Set the dimensions of the canvas / graph
var margin = {top: 30, right: 20, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;



// Set the ranges
var x = d3.scaleLinear().range([0,width]);
var y = d3.scaleLinear().range([height, 0]);

// set the domain
x.domain([0,7]);
y.domain([0,100]);



// Adds the svg canvas
var svg = d3.select("charts")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .style('background','grey')
    .call(d3.zoom().on("zoom", function () {
        svg.attr("transform", d3.event.transform)
    }))

  .append("g")
      .attr("transform", 
            "translate(" + margin.left + "," + margin.top + ")");

  // Add the x Axis
  svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  // Add the y Axis
  svg.append("g")
      .call(d3.axisLeft(y));

  // Add the valueline path.
  svg.append("path")
      .data([data])
      .attr("class", "line")
      .attr("d", valueline);

  // Add the scatterplot
  svg.selectAll("dot")
      .data(data)
    .enter().append("circle")
      .attr("r", 10)
      .attr("cx", function(d) { return x(d.xvalue); })
      .attr("cy", function(d) { return y(d.yvalue); })
      .on("mouseover", handleMouseOver)
      .on("mouseout",handleMouseOut)
      .on("click",handleMouseClick);

var charts = d3.select("charts");


charts.call(d3.zoom()
    .scaleExtent([1 / 2, 4])
    .on("zoom", zoomed));  

// interactivity scatterplot

function handleMouseOver(d){
  console.log("handleMouseOverTooltip");
  // tooltip  
  div.transition()
    .duration(500)
    .style("opacity", .5);
  div.html(d.yvalue)
    .style("left", (d3.event.pageX) + "px")
    .style("top", (d3.event.pageY - 28) + "px");
  // circle
  d3.select(this).transition()
    .duration(500)
    .style("fill","red");
    
};

function handleMouseOut(d){
  console.log("handleMouseOut")
  div.transition()
    .duration(500)
    .style("opacity", 0);
  // circle
  d3.select(this).transition()
    .duration(500)
    .style("fill","blue");  
};         

      
function handleMouseClick(d){
  console.log("clicked");
  //d3.select(this).style("fill","red");
};


function zoomed() {
  console.log("zoomed")
}
*/ 

    
      