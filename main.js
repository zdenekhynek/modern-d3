import "./style.css";

import * as d3 from "d3";

d3.selectAll("circle")
  .style("fill", "orange")
  .attr("r", function() {
    return Math.random() * 25;
  });

