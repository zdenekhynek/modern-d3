import * as d3 from "d3";

export default function scales() {
  var margins = { top: 20, bottom: 20, left: 50, right: 10 };
  var svg = d3.select("svg");
  var g = svg
    .select("g")
    .style("transform", `translate(${margins.left}px, ${margins.top}px)`);

  var svgWidth = svg.attr("width");
  var svgHeight = svg.attr("height");
  var chartWidth = svgWidth - margins.left - margins.right;
  var chartHeight = svgHeight - margins.top - margins.bottom;
  console.log("svgHeight", svgHeight);

  d3.csv("../data/data-wb.csv").then(function (data) {
    var circle = g.selectAll("circle").data(data);
    var circleEnter = circle.enter().append("circle");
    var circleUpdate = circle.merge(circleEnter);
    circleUpdate.classed("red", true);

    //  set which csv columns to use for which dimensions
    var xKey = "2022_pop";
    var yKey = "2022_gdp_pc";
    var rKey = "2022_pop";

    //  get minimum and maximum values of each cvs column in the dataset
    var xMinMax = d3.extent(data, function (d) {
      return d[xKey] || 0;
    });
    var yMinMax = d3.extent(data, function (d) {
      return d[yKey] || 0;
    });

    //  create scales where the first parameter is an array with a minimum and maximum values
    //  from the dataset (input domain - e.g. what goes in) and the second parameter
    //  is an array with size of the svg (output range - e.g. what comes out)
    var xScale = d3.scaleLinear(xMinMax, [0, chartWidth]);
    var yScale = d3.scaleLinear(yMinMax, [chartHeight, 0]);

    //  @TODO: create a d3.scaleSqrt to set the radius of the circle on line 42

    circleUpdate.attr("cx", function (d, i) {
      return xScale(d[xKey] || 0);
    });

    circleUpdate.attr("cy", function (d, i) {
      return yScale(d[yKey]) || 0;
    });

    circleUpdate.attr("r", function (d, i) {
      return Math.sqrt(d[rKey] / 100000);
    });

    svg
      .append("g")
      .classed("x-axis", true)
      .attr("transform", `translate(${margins.left}, ${chartHeight})`)
      .call(d3.axisBottom(xScale).tickSize(-1 * chartHeight));

    svg
      .append("g")
      .classed("y-axis", true)
      .attr("transform", `translate(${margins.left},0)`)
      .call(d3.axisLeft(yScale).tickSize(-1 * chartWidth));

    //  @TODO: set circle fill color based on some data attribute, e.g. "Region"

    //  always add exit
    circleUpdate.exit().remove();
  });
}
