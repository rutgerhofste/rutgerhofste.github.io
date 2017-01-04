
var svg = d3.select("svg"),
    margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = svg.attr("width") - margin.left - margin.right,
    height = svg.attr("height") - margin.top - margin.bottom,
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    padding = 0;



var x = d3.scaleLinear()
    .range([0,width]);

var y = d3.scaleLinear()
    .range([height, 0]);

var line = d3.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.close); });

d3.csv("800KY.csv", function(d) {
  d.date = d.date;
  d.close = d.close;
  return d;
}, function(error, data) {
  if (error) throw error;

  //x.domain(d3.extent(data, function(d) { return d.date; }));
  x.domain([-800000,2016]);
  y.domain([0,400]);

  g.append("g")
      .attr("class", "axis axis--x")
  	  .attr("transform", "translate(0," + height  + ")")
      .call(d3.axisBottom(x));

  g.append("g")
      .attr("class", "axis axis--y")
      .call(d3.axisLeft(y))


  g.append("path")
      .datum(data)
      .attr("class", "line")
      .attr("d", line);

  g.selectAll(".xaxis text")  // select all the text elements for the xaxis
            .attr("transform", function(d) {
               return "translate(" + this.getBBox().height*-2 + "," + this.getBBox().height + ")rotate(-45)";
           });      

  g.append("text")
      .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
      .attr("transform", "translate("+ (padding/2) +","+(height/2)+")rotate(-90)")  // text is drawn off the screen top left, move down and out and rotate
      .text("Value");
  g.append("text")
      .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
      .attr("transform", "translate("+ (width/2) +","+(height-(padding/3))+")")  // centre below axis
      .text("Date");        
});

