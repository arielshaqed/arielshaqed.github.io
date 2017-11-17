"use strict";

const rad = 300;
let numCircles = 100;
let multiplier = undefined;

let chart, axis, points;

function chartInit() {
  chart = d3.select('#chart')
    .attr('width', 2 * rad + 60)
    .attr('height', 2 * rad + 60);

  axis = d3.scaleLinear()
    .domain([-1, 1])
    .range([10, 2 * rad + 10]);

  points = [];
  // (http://logogin.blogspot.co.il/2013/02/d3js-arrowhead-markers.html)
  chart.append("defs").append("marker")
    .attr("id", "arrowhead")
    .attr("refX", 6 + 3) /*must be smarter way to calculate shift*/
    .attr("refY", 2)
    .attr("markerWidth", 6)
    .attr("markerHeight", 4)
    .attr("orient", "auto")
    .append("path")
    .attr("d", "M 0,0 V 4 L6,2 Z"); 

  d3.select('#numPoints').on('input', () => { drawBase(); drawLines(); });
  d3.select('#multiplier').on('input', drawLines);

  drawBase();
  drawLines();
}

function drawBase() {
  numCircles = d3.select('#numPoints').node().value;
  points = [];
  chart.selectAll('circle').remove();
  for (let i = 0; i < numCircles; i++) {
    const a = 2 * Math.PI / numCircles * i;
    points.push([axis(Math.cos(a)), axis(Math.sin(a))]);
  }

  chart.selectAll('circle')
    .data(points)
    .enter().append('circle')
    .attr('cx', d => d[0])
    .attr('cy', d => d[1])
    .attr('r', 2)
    .classed('dot', true);
}

function drawLines() {
  chart.selectAll('line').remove();
  multiplier = d3.select('#multiplier').node().value;
  for (let i = 0; i < numCircles; i++)
    chart.append('line')
    .attr('x1', points[i][0])
    .attr('y1', points[i][1])
    .attr('x2', points[multiplier * i % numCircles][0])
    .attr('y2', points[multiplier * i % numCircles][1])
    .classed('connector', true).attr("marker-end", "url(#arrowhead)");
}
