import React from 'react';

//Initialize
var svg = d3.select("body").append("svg").attr("id","graph")
    .attr("viewBox", '0 0 1200 500')
    .attr('preserveAspectRatio',"xMidYMid meet")
    .attr('width','80vw');
var g = svg.append("g").attr("transform", "translate(" + 100 + "," + 100 + ")");
var parseTime = d3.timeParse("%Y-%m-%d");
var x = d3.scaleTime()
    .rangeRound([0, 900]);
var y = d3.scaleLinear()
    .rangeRound([300, 0]);
var z = d3.scaleOrdinal(d3.schemeCategory10);
var line = d3.line()
          .x(function(d) { return x(d.Date); })
          .y(function(d) { return y(d.value); });

export default class Canvas extends React.Component {
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
      z.domain(elements.map(function(c) { return c.el; }));    
      
      g.append("g")
        .attr("class", "x axis")
          .attr("transform", "translate(0,300)")
       g.append("g")
         .attr("class", "y axis")

      var svg = d3.select("body").select("#graph").transition();
      var lines = g.selectAll('.line').data(elements)

      lines.exit().transition().duration(300).remove()
      
      lines.enter().append('path')
          .attr("fill", "none")
          .attr("class", "line")

      lines.transition().duration(750)
      .attr("d", function(d) { return line(d.values);})
      .attr('stroke',function(d) { return z(d.el);})

        svg.select(".x.axis") // change the x axis
            .duration(750)
            .call(d3.axisBottom(x));
        svg.select(".y.axis") // change the y axis
            .duration(750)
            .call(d3.axisLeft(y));

    })
    return (
            <div>           
            </div> 
    );
  }
}