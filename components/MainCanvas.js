import React from 'react';
import {color_map} from '../utils/color_map'

//Initialize
var svg = d3.select("body").append("svg").attr("id","graph")
    .attr("viewBox", '0 0 1000 800')
    .attr('preserveAspectRatio',"xMidYMid meet")
    .attr('width','80vw');
var g = svg.append("g").attr("transform", "translate(" + 100 + "," + 100 + ")");
var parseTime = d3.timeParse("%Y-%m-%d");
var x = d3.scaleTime()
    .rangeRound([0, 900]);
var y = d3.scaleLinear()
    .rangeRound([300, 0]);
var x2 = d3.scaleTime()
    .rangeRound([0, 900]);
var y2 = d3.scaleLinear()
    .rangeRound([400, 320]);
var x_bar = d3.scaleTime()
    .rangeRound([0, 900]);
var y_bar = d3.scaleLinear()
    .rangeRound([300, 200]);

var brushg = svg.append("g")
        .attr("class", "brush")
        .attr("transform", "translate(" + 100 + "," + 420 + ")")
var line = d3.line()
          .curve(d3.curveMonotoneX)
          .x(function(d) { return x(d.Date); })
          .y(function(d) { return y(d.value); });
var line2 = d3.line()
          .curve(d3.curveMonotoneX)
          .x(function(d) { return x2(d.Date); })
          .y(function(d) { return y2(d.value); });

// To avoid line exceeds aixs, add a clip path to filter
g.append("defs").append("clipPath")
    .attr("id", "clip")
    .append("rect")
    .attr("width", 900)
    .attr("height", 300);
 
function brushed() {
        var range = d3.brushSelection(this)
            .map(x2.invert);
        console.log(range);
        x.domain(range);
        x_bar.domain(range)
        g.select(".axis.x").call(d3.axisBottom(x));
        g.selectAll(".line").attr("d", function(d) { return line(d.values);});
        g.selectAll('.bar')
          .attr("x", function(d) { return x_bar(d.Date); })
          .attr("width", 1)
          .attr("y", function(d) { return y_bar(d.Volume); })
          .attr("height", function(d) { return 300 - y_bar(d.Volume); })
      }
export default class MainCanvas extends React.Component {
  constructor(props) {
    super(props);
  }
    
  render() {
    const {display, name} = this.props;
    d3.csv('public/data/'+name + ".csv", function(error, data) {
      if (error) throw error;
      // format the data
      data.forEach(function(d) {
          d.Date = parseTime(d.Date);
          d.Open = +d.Open;
          d.Close = +d.Close;
          d.High = +d.High;
          d.Low = +d.Low;
          d.Volume = +d.Volume;
      });

      var brush = d3.brushX()
        .extent([[0,0], [900,80]])
        .on("brush", brushed);

      //Clipping data
      var elements = data.columns.slice(1,5,6).map(function(el) {
              return {
                el: el,
                values: data.map(function(d) {
                  return {Date: d.Date, value: d[el]};
                })
              };
            });

      // Scale the range of the data
      x.domain(d3.extent(data, function(d) { return d.Date; }));  
      y.domain([
        d3.min(elements, function(c) { return d3.min(c.values, function(d) { return d.value; }); }),
        d3.max(elements, function(c) { return d3.max(c.values, function(d) { return d.value; }); })
      ]); 
      x2.domain(x.domain()); 
      y2.domain(y.domain());
      x_bar.domain(d3.extent(data, function(d) { return d.Date; }));
      y_bar.domain([0, d3.max(data, function(d) { return d.Volume; })]);

      //Establish axises
      g.append("g")
        .attr("class", "x2 axis")
          .attr("transform", "translate(0,400)")
      g.append("g")
        .attr("class", "x axis")
          .attr("transform", "translate(0,300)")
       g.append("g")
         .attr("class", "y axis")

    
      brushg.call(brush)
        .call(brush.move, x.range())
      
/*

Static line in time selector

*/
      var lines2 = g.selectAll('.line2').data(elements)
      
      lines2.enter().append('path')
          .attr("fill", "none")
          .attr("class", "line2")
      
      lines2.attr("d", function(d) { return line2(d.values);})
      .attr('stroke',function(d) { return color_map[d.el];})
      .style('opacity',function(d) {
        if (display.indexOf(d.el) === -1){
          return 0;
        }
        return 1
      })

      

/*

Lines

*/

      var lines = g.selectAll('.line').data(elements)
      

      lines.exit().transition().duration(500).remove()
      
      lines.enter().append('path')
          .attr("fill", "none")
          .attr("class", "line")

      lines.transition().duration(750)
      .attr("d", function(d) { return line(d.values);})
      .attr('stroke',function(d) { return color_map[d.el];})
      .style('opacity',function(d) {
        if (display.indexOf(d.el) === -1){
          return 0;
        }
        return 1
      })
/*

Axises

*/
      var svg = d3.select("body").select("#graph").transition();
        svg.select(".x.axis") // change the x axis
            .duration(750)
            .call(d3.axisBottom(x));
        svg.select(".x2.axis") // change the x2 axis
            .duration(750)
          .call(d3.axisBottom(x2))
        svg.select(".y.axis") // change the y axis
            .duration(750)
            .call(d3.axisLeft(y));

/*

Volume bar

*/
      var bars = g.selectAll(".bar").data(data)

      bars.exit().transition().duration(500).remove()

      bars.enter()
      .append("rect")
      .attr("class", "bar")

      bars.transition().duration(750)
      .attr("x", function(d) { return x_bar(d.Date); })
      .attr("width", 1)
      .attr("y", function(d) { return y_bar(d.Volume); })
      .attr("height", function(d) { return 300 - y_bar(d.Volume); })
      .attr('fill',function(d,i){
        if (i<data.length-1 && d.Volume>bars.data()[i+1].Volume){
          return 'lightgreen'
        }else if (i<data.length-1 && d.Volume<bars.data()[i+1].Volume){
          return 'pink'
        }else{
          return 'grey'
        }
      })

    })
    return (
            <div>           
            </div> 
    );
  }
}