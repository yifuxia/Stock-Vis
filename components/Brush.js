/*
The purpose of this component is 
to seperate the brush as a range selector

*/

import React from 'react';
import {change_time_range} from '../actions'

var svg = d3.select('#graph')
var brushg = svg.append("g")
        .attr("class", "brush")
        .attr("transform", "translate(" + 100 + "," + 370 + ")")
var brush = d3.brushX()
        .extent([[0,0], [900,80]])
        .on("brush", brushed);
var x2 = d3.scaleTime()
    .rangeRound([0, 900]);

function brushed() {
    var range = d3.brushSelection(this)
        .map(x2.invert);
    window.store.dispatch(change_time_range(range))
}
var parseTime = d3.timeParse("%Y-%m-%d");

//Get initial range value
d3.csv("public/data/AAPL.csv", function(error, data) {
  if (error) throw error;
  // format the data
  data.forEach(function(d) {
      d.Date = parseTime(d.Date);
  });

  x2.domain(d3.extent(data, function(d) { return d.Date; }));
  brushg.call(brush)
  .call(brush.move, x2.range())
})

export default class Brush extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
            <div>
            </div> 
    );
  }
}