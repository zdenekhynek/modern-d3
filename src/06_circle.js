import * as d3 from "d3";
import BeeswarmForce from "./beeswarm_force";

export default function beeswarmFn() {
  var margins = { top: 50, bottom: 50, left: 50, right: 50 };
  var svg = d3.select("svg");
  var g = svg
    .select("g")
    .style("transform", `translate(${margins.left}px, ${margins.top}px)`);

  var svgWidth = svg.attr("width");
  var svgHeight = svg.attr("height");
  var chartWidth = svgWidth - margins.left - margins.right;
  var chartHeight = svgHeight - margins.top - margins.bottom;

  d3.csv("../data/ai-elections.csv").then(function (data) {
    //  set which csv columns to use for which dimensions
    var xKey = "freedom_score";
    var yKey = "2022_gdp_pc";
    var rKey = "population";
    var colorKey = "freedom_status";
    //  get minimum and maximum values of each cvs column in the dataset
    var xMinMax = d3.extent(data, function (d) {
      return +d[xKey] || 0;
    });
    var yMinMax = d3.extent(data, function (d) {
      return +d[yKey] || 0;
    });
    var rMinMax = d3.extent(data, function (d) {
      return +d[rKey] || 0;
    });

    var regions = data.map(function (d) {
      return d[colorKey];
    });
    var uniqueRegions = [...new Set(regions)];

    //  create scales where the first parameter is an array with a minimum and maximum values
    //  from the dataset (input domain - e.g. what goes in) and the second parameter
    //  is an array with size of the svg (output range - e.g. what comes out)
    // var xScale = d3.scaleLinear(xMinMax, [0, chartWidth]);
    var xScale = d3.scaleLinear(xMinMax, [0, chartWidth]);
    var yScale = d3.scaleLinear(yMinMax, [chartHeight, 0]);
    var sizeScale = d3.scaleLinear(rMinMax, [0, 100]);
    var colorScale = d3.scaleOrdinal(uniqueRegions, d3.schemeTableau10);

    const cx = chartWidth / 2;
    const cy = chartHeight / 2;
    const r = Math.min(cx, cy) - 50;

    data.forEach((d, i) => {
      const angle = ((2 * Math.PI) / data.length) * i; // Calculate angle
      d.x = cx + r * Math.cos(angle); // X position
      d.y = cy + r * Math.sin(angle);
    });

    const beeswarmLayout = BeeswarmForce()
      .x((d) => xScale(d[xKey]))
      .y(chartHeight / 2)
      .r((d) => 1 + sizeScale(d[rKey]));
    const beeswarm = beeswarmLayout(data);

    var circle = g.selectAll("circle").data(data);
    var circleEnter = circle.enter().append("circle");
    var circleUpdate = circle.merge(circleEnter);
    circleUpdate.classed("red", true);

    //  @TODO: create a d3.scaleSqrt to set the radius of the circle on line 42

    circleUpdate.attr("cx", function (d, i) {
      // return d.x; //xScale(d[xKey] || 0);
      return d.data ? d.data.x : d.x; //xScale(d[xKey] || 0);
    });

    circleUpdate.attr("cy", function (d, i) {
      // return d.y; //yScale(d[yKey]) || 0;
      return d.data ? d.data.y : d.y; //yScale(d[yKey]) || 0;
    });

    circleUpdate.attr("r", function (d, i) {
      // return d.r; //sizeScale(d[rKey]) || 0;
      return sizeScale(d[rKey]) || 0;
    });

    circleUpdate.style("fill", function (d, i) {
      return d.data ? colorScale(d.data[colorKey]) : colorScale(d[colorKey]);
      // return colorScale(d[colorKey]);
    });
    circleUpdate.style("fill-opacity", 0.5);
    circleUpdate.style("stroke", function (d, i) {
      return d.data ? colorScale(d.data[colorKey]) : colorScale(d[colorKey]);
      // return colorScale(d[colorKey]);
    });

    // svg
    //   .append("g")
    //   .classed("x-axis", true)
    //   .attr(
    //     "transform",
    //     `translate(${margins.left}, ${margins.top + chartHeight})`
    //   )
    //   .call(d3.axisBottom(xScale).tickSize(-1 * chartHeight));

    // svg
    //   .append("g")
    //   .classed("y-axis", true)
    //   .attr("transform", `translate(${margins.left},${margins.top})`)
    //   .call(d3.axisLeft(yScale).tickSize(-1 * chartWidth));

    //  @TODO: set circle fill color based on some data attribute, e.g. "Region"

    //  always add exit
    circleUpdate.exit().remove();
  });
}
