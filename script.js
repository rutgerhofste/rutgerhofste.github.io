var svgWidth = 800;
var svgHeight = 300;

var margin = {top: 30, right: 40, bottom: 50, left: 60};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var originalCircle = {"cx" : -150 ,
                      "cy" : -15 ,
                      "r"  : 20};

var svgViewport = d3.select("body")
  .append('svg')
  .attr('width', svgWidth)
  .attr('height', svgHeight)
  .style("background", "red");



var xAxisScale =d3.scaleLinear()
  .domain([-200,-100])
  .range([0,width]);

var yAxisScale = d3.scaleLinear()
  .domain([-10,-20])
  .range([height,0]);

var xAxis = d3.axisBottom(xAxisScale);
var yAxis = d3.axisLeft(yAxisScale);

// Zoom Function
var zoom = d3.zoom()
    // specify extent here
    .on("zoom", zoomFunction);

// Inner Drawing Space
var innerSpace = svgViewport.append("g")
    .attr("class", "inner_space")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .call(zoom);

var clipPath = innerSpace.append("defs").append("clipPath")
        .attr("id", "clip")
    .append("rect")
        .attr("width", width)
        .attr("height", height);

var circles = innerSpace.append('circle')
    .attr("id","circles")
    .attr("class", "rondje")
    .attr("fill","steelblue")
    .attr("clip-path","url(#clip)")
    .attr("cx", xAxisScale(originalCircle.cx))
    .attr("cy", yAxisScale(originalCircle.cy))
    .attr('r', originalCircle.r)

// Draw Axis
var gX = innerSpace.append("g")
    .attr("class", "axis axis--x")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

var gY = innerSpace.append("g")
    .attr("class", "axis axis--y")
    .call(yAxis);



var view = innerSpace.append("rect")
  .attr("class", "zoom")
  .attr("width", width)
  .attr("height", height)
  .attr("transform", "translate(" + 0 + "," + 0 + ")")
  .style("fill","none")
  .call(zoom)

function zoomFunction(){
  // select all circles
  var new_xScale = d3.event.transform.rescaleX(xAxisScale)
  var new_yScale = d3.event.transform.rescaleY(yAxisScale)
  console.log(d3.event.transform)

  gX.call(xAxis.scale(new_xScale));
  gY.call(yAxis.scale(new_yScale));

  circles.attr("transform", d3.event.transform);

  clip.attr("transform", d3.event.transform);
};

  




// HTML Printout To Tell Us What Is Going ON
d3.select("body").append("div").attr("id", "v_scale").text("D3 Zoom Scale: ");
d3.select("#v_scale").append("span").attr("id", "v_scale_val");

