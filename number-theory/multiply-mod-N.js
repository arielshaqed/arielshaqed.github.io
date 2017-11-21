"use strict";

const rad = 300;
let numCircles = 100;
let multiplier = undefined;

let chart, axis, points;

function gcd(a, b) {
  if (a < b) [a, b] = [b, a];
  while (b > 0) {
    [a, b] = [b, a % b];
  }
  return a;
}

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
  d3.select('#multiplier').on('input', () => { drawDots(); drawLines(); });

  drawBase();
  drawLines();
}

function drawBase() {
  numCircles = d3.select('#numPoints').node().value;
  points = [];
  chart.selectAll('circle').remove();
  for (let i = 0; i < numCircles; i++) {
    const a = 2 * Math.PI / numCircles * i;
    points.push({ x: axis(Math.cos(a)), y: axis(Math.sin(a)) });
  }

  drawDots();
}

function drawDots() {
  const dots = chart.selectAll('.circle').data(points);
  multiplier = d3.select('#multiplier').node().value;
  const targetMultiplier = gcd(points.length, multiplier);

  dots.exit().remove();

    dots.enter()
    .append('circle')
    .attr('cx', d => d.x)
    .attr('cy', d => d.y)
    .attr('r', 2)
    .merge(dots)
    .attr('class', (d, idx) => idx % targetMultiplier === 0 ? 'dot target' : 'dot');
}

function drawLines() {
  multiplier = d3.select('#multiplier').node().value;

  const lines = chart.selectAll('.connector').data(points);

  lines.exit().remove();

  lines.enter()
    .append('line')
    .attr('class', 'connector')
    .attr('marker-end', 'url(#arrowhead)')
    .merge(lines)
    .attr('x1', d => d.x)
    .attr('y1', d => d.y)
    .attr('x2', (d, idx) => points[multiplier * idx % numCircles].x)
    .attr('y2', (d, idx) => points[multiplier * idx % numCircles].y)
}
