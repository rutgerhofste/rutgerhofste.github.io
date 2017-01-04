
var svg = d3.select("svg"),
    margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = svg.attr("width") - margin.left - margin.right,
    height = svg.attr("height") - margin.top - margin.bottom,
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");



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
});

 vis.append("g")
  .attr("class", "xaxis axis")  // two classes, one for css formatting, one for selection below
  .attr("transform", "translate(0," + (height - padding) + ")")
  .call(xAxis); 