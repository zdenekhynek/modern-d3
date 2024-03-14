import * as d3 from "d3";

/*
  Join is an alternative to the enter, update, and exit pattern.
  When we simply want to keep elements up to date with data,
  and don't care about adding and removing elements in particular
  way (e.g. animation).
  https://d3js.org/d3-selection/joining
*/
export default function join() {
  const matrix = [
    [11975, 5871, 8916, 2868],
    [1951, 10048, 2060, 6171],
    [8010, 16145, 8090, 8045],
    [1013, 990, 940, 6907],
  ];

  d3.select("body")
    .append("table")
    .selectAll("tr")
    .data(matrix)
    .join("tr")
    .selectAll("td")
    .data((d) => d)
    .join("td")
    .text((d) => d);
}
