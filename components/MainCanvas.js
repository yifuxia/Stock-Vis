import React from 'react';
import {color_map} from '../utils/color_map'

//Initialize
var svg = d3.select("body").append("svg").attr("id","graph")
    .attr("viewBox", '0 0 1100 600')
    .attr('preserveAspectRatio',"xMidYMid meet")
    .attr('width','100vw');
var g = svg.append("g").attr("transform", "translate(" + 100 + "," + 50 + ")");
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
        .attr("transform", "translate(" + 100 + "," + 370 + ")")
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
        var diffDays = Math.round(Math.abs((range[1].getTime() - range[0].getTime())/(24*60*60*1000)));
        console.log(diffDays);
        x.domain(range);
        x_bar.domain(range)
        g.select(".axis.x").call(d3.axisBottom(x));
        g.selectAll(".line").attr("d", function(d) { return line(d.values);});
        g.selectAll('.bar')
          .attr('stroke-width',900/diffDays)
          .attr("x1", function(d) { return x_bar(d.Date); })
          .attr("x2", function(d) { return x_bar(d.Date); })
          .attr("y2", function(d) { return y_bar(d.Volume); })
          .attr("y1", function(d) { return 300 })
          
      }
function abbreviateNumber(value) {
    var newValue = value;
    if (value >= 1000) {
        var suffixes = ["", "K", "M", "B","T"];
        var suffixNum = Math.floor( (""+value).length/3 );
        var shortValue = '';
        for (var precision = 2; precision >= 1; precision--) {
            shortValue = parseFloat( (suffixNum != 0 ? (value / Math.pow(1000,suffixNum) ) : value).toPrecision(precision));
            var dotLessShortValue = (shortValue + '').replace(/[^a-zA-Z 0-9]+/g,'');
            if (dotLessShortValue.length <= 2) { break; }
        }
        if (shortValue % 1 != 0)  shortNum = shortValue.toFixed(1);
        newValue = shortValue+suffixes[suffixNum];
    }
    return newValue;
}
export default class MainCanvas extends React.Component {
  constructor(props) {
    super(props);
  }
    
  render() {
    const {display, name} = this.props;
    d3.csv('public/data/'+name + ".csv", function(error, data) {
      if (error) throw error;
      data.reverse()
      function mousemove() {
        var x0 = x.invert(d3.mouse(this)[0]);
        var bisect_date = d3.bisector(function(d){return d.Date}).right;

        var i = bisect_date(data, x0)
        var d = data[i];
        focus.attr("transform", "translate(" + x(d.Date) + "," + y(d.Close) + ")");
        focus.select("text").text(d.Date.getFullYear()+'-'+(d.Date.getMonth()+1)+'-'+d.Date.getDate());
        focus.select(".vertical_line")
        .attr('x1', 0)
        .attr('y1', -y(d.Close))
        .attr('x2',0)
        .attr('y2',300-y(d.Close))
        /*
        focus.select(".horizontal_line")
        .attr('x1', 0)
        .attr('y1', 0)
        .attr('x2',-x(d.Date))
        .attr('y2',0)
        */
        document.getElementById('Close').innerHTML = 'Close '+d.Close.toFixed(2)
        document.getElementById('Open').innerHTML = 'Open '+d.Open.toFixed(2)
        document.getElementById('High').innerHTML = 'High '+d.High.toFixed(2)
        document.getElementById('Low').innerHTML = 'Low '+d.Low.toFixed(2)
        document.getElementById('Vol').innerHTML = 'Vol '+abbreviateNumber(d.Volume)
      }

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
            .call(d3.axisRight(y).ticks(5).tickSize(900));

/*

Volume bar

*/
      var bars = g.selectAll(".bar").data(data)

      bars.exit().transition().duration(500).remove()

      bars.enter()
      .append("line")
      .attr("class", "bar")

      bars.transition().duration(750)
      .attr("x1", function(d) { return x_bar(d.Date); })
      .attr("x2", function(d) { return x_bar(d.Date); })
      .attr("stroke-width", 900/data.length)
      .attr("stroke-alignment","center")
      .attr("y2", function(d) { return y_bar(d.Volume); })
      .attr("y1", function(d) { return 300 })
      .style('opacity','0.5')
      .attr('stroke',function(d,i){
        if (i>0 && d.Close>bars.data()[i-1].Close){
          return 'green'
        }else if (i>0 && d.Close<bars.data()[i-1].Close){
          return 'red'
        }else{
          return 'grey'
        }
      })

/*

  Tooltip

*/
      var focus = g.append("g")
            .attr("class", "focus")
            .style("display", "none");

        focus.append("circle")
            .attr("r", 3)
            .attr("stroke-width", 1)
            .style('stroke','black');

        focus.append("line")
        .attr('class','vertical_line')
        .attr('stroke-dasharray','5,5')
        .attr('stroke-width',1)
        .style('stroke','black')

        focus.append("line")
        .attr('class','horizontal_line')
        .attr('stroke-dasharray','5,5')
        .attr('stroke-width',1)
        .style('stroke','black')

        focus.append("text")
            .attr("x", 10)
            .attr('fill','black')
            .attr("dy", ".35em")
            .attr('font-size','20');

        g.append("rect")
            .attr("class", "overlay")
            .attr("width", 1000)
            .attr("height", 500)
            //.style('fill','rgba(255,255,255,0)')
            .on("mouseover", function() { focus.style("display", null); })
            .on("mouseout", function() { focus.style("display", "none"); })
            .on("mousemove", mousemove);

    })
    return (
            <div>           
            </div> 
    );
  }
}