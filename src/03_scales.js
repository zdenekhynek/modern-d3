import * as d3 from "d3";

export default function scales() {
  var svg = d3.select("svg");

  d3.csv("../data/data-wb.csv").then(function (data) {
    var circle = svg.selectAll("circle").data(data);
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

    var xScale = d3.scaleLinear(xMinMax, [0, 760]);
    var yScale = d3.scaleLinear(yMinMax, [0, 640]);

    //  @TODO: create a d3.scaleSqrt to set the radius of the circle on line 40

    circleUpdate.attr("cx", function (d, i) {
      return xScale(d[xKey] || 0);
    });

    circleUpdate.attr("cy", function (d, i) {
      return yScale(d[yKey]) || 0;
    });

    circleUpdate.attr("r", function (d, i) {
      return Math.sqrt(d[rKey] / 100000);
    });

    //  @TODO: set circle fill color based on some data attribute, e.g. "Region"


    //  always add exit
    circleUpdate.exit().remove();
  });
}
