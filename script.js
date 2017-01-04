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

    
      