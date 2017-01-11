var svg = d3.select("svg"),
    margin = {top: 20, right: 20, bottom: 110, left: 60},
    margin2 = {top: 430, right: 20, bottom: 30, left: 60},
    width = svg.attr("width") - margin.left - margin.right,
    height = svg.attr("height") - margin.top - margin.bottom,
    height2 = svg.attr("height") - margin2.top - margin2.bottom;

var xAxisScale = d3.scaleLinear().range([0, width]),
    x2AxisScale = d3.scaleLinear().range([0, width]),
    yAxisScale = d3.scaleLinear().range([height, 0]),
    y2AxisScale = d3.scaleLinear().range([height2, 0]);

var xAxis = d3.axisBottom(xAxisScale),
    xAxis2 = d3.axisBottom(x2AxisScale),
    yAxis = d3.axisLeft(yAxisScale);

var brush = d3.brushX()
    .extent([[0, 0], [width, height2]])
    .on("brush end", brushed);

var zoom = d3.zoom()
    .scaleExtent([1, Infinity])
    .translateExtent([[0, 0], [width, height]])
    .extent([[0, 0], [width, height]])
    .on("zoom", zoomed);

var area = d3.area()
    .curve(d3.curveLinear)
    .x(function(d) { return xAxisScale(d.date); })
    .y0(height)
    .y1(function(d) { return yAxisScale(d.price); });

var area2 = d3.area()
    .curve(d3.curveMonotoneX)
    .x(function(d) { return x2AxisScale(d.date); })
    .y0(height2)
    .y1(function(d) { return y2AxisScale(d.price); });

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
  xAxisScale.domain([-796562, 2015]);
  yAxisScale.domain([150, 410]);

  x2AxisScale.domain(xAxisScale.domain());
  y2AxisScale.domain(yAxisScale.domain());


  focus.append("path")
    .datum(data)
    .attr("class", "area")
    .attr("d", area)
    .style("opacity", 1);

/*
  focus.append("path")
    .datum(data)
    .attr("class","line")
    .attr("d",line)
    .style("opacity", 0.1);
*/

// draw dots
  focus.selectAll(".dot")
      .data(data)
    .enter().append("circle")
      .attr("class", "dot")
      .attr("r", 2)
      .attr("cx", function(d) { return xAxisScale(d.date)})
      .attr("cy", function(d) { return yAxisScale(d.price)})
      .attr("fill", function(d){
        if(d.bron == 1){
          seriesColor = "#DB553F";
        } else if (d.bron ==2) {
          seriesColor = "#FEDD38";
        } else if (d.bron ==3) {
          seriesColor = "#2666AF";
        }
        return seriesColor})
      .style("opacity", 1);


  focus.append("g")
    .attr("class", "axis axis--x")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

  // now add titles to the axes
  focus.append("text")
      .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
      .attr("transform", "translate("+ (-40) +","+(200)+")rotate(-90)")  // text is drawn off the screen top left, move down and out and rotate
      .text("CO2 Concentration [PPMV]")
      .attr("font","Arial")
      .attr("font-size",12);

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

  context.append("text")
    .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
    .attr("transform", "translate("+ (width/2) +","+(height2+margin2.bottom)+")")  // centre below axis
    .text("Year")
    .attr("font","Arial")
    .attr("font-size",12);

  context.append("g")
    .attr("class", "brush")
    .call(brush)
    .call(brush.move, xAxisScale.range());

  svg.append("rect")
    .attr("class", "zoom")
    .attr("width", width)
    .attr("height", height)
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .call(zoom)

  // Add the red line title
  svg.append("text")
    .attr("x", 0)             
    .attr("y", 20)    
    .attr("class", "legend")
    .style("fill", "red")         
    .on("click", clicked)
    .text("current");



});

function brushed() {
  if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") return; // ignore brush-by-zoom
  var s = d3.event.selection || x2AxisScale.range();
  xAxisScale.domain(s.map(x2AxisScale.invert, x2AxisScale));
  focus.select(".area").attr("d", area);
  focus.select(".line").attr("d", line); // seld added line of code
  focus.selectAll(".dot").attr("cx", function(d) { return xAxisScale(d.date); });
  focus.select(".axis--x").call(xAxis);
  svg.select(".zoom").call(zoom.transform, d3.zoomIdentity
      .scale(width / (s[1] - s[0]))
      .translate(-s[0], 0));
   // seld added line of code
}

function zoomed() {
  if (d3.event.sourceEvent && d3.event.sourceEvent.type === "brush") return; // ignore zoom-by-brush
  var t = d3.event.transform;

  //var new_xScale = t.rescaleX(xAxisScale)
  var new_x2AxisScale = t.rescaleX(x2AxisScale)
  //var new_yScale = t.rescaleY(yAxisScale)

  xAxisScale.domain(new_x2AxisScale.domain());
  focus.select(".area").attr("d", area);
  focus.select(".line").attr("d", line); // self added line of code
  focus.selectAll(".dot").attr("cx", function(d) { return xAxisScale(d.date); }); // seld added line of code
  focus.select(".axis--x").call(xAxis);
  context.select(".brush").call(brush.move, xAxisScale.range().map(t.invertX, t))
};

function type(d) {
  d.date = d.datum;
  d.price = d.waarde;
  d.bron = d.bron;
  return d;
}


var line = d3.line()
  .x(function(d) { return xAxisScale(d.datum); })
  .y(function(d) { return yAxisScale(d.waarde); });


function clicked(){
  console.log("clicked")
  var k = 1;
  var tx = xAxisScale(0);
  var t = d3.zoomIdentity.translate(tx, 0).scale(k);
  var new_xAxisScale = t.rescaleX(xAxisScale)
  focus.selectAll(".dot").attr("cx", function(d) { return new_xAxisScale(d.date); });
}


    
      