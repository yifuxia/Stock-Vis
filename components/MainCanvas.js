import React from 'react';
import {color_map} from '../utils/color_map'

//Sizes
var width = 900,
    main_graph_height = 200,
    bar_chart_height = 50,
    main_graph_margin = {top:20, left:100},
    selector_graph_height = 40,
    selector_graph_top = 240;

//Initialize
var svg = d3.select("body").append("svg").attr("id","graph")
    .attr("viewBox", '0 -50 1100 400')
    .attr('preserveAspectRatio',"xMidYMid meet")
    .attr('width','100vw');
var g = svg.append("g").attr("transform", "translate(" + main_graph_margin.left + "," + main_graph_margin.top + ")");
var parseTime = d3.timeParse("%Y-%m-%d");
  //Scales
var x = d3.scaleTime()
    .rangeRound([0, width]);
var y = d3.scaleLinear()
    .rangeRound([main_graph_height-50, 0]);
var x2 = d3.scaleTime()
    .rangeRound([0, width]);
var y2 = d3.scaleLinear()
    .rangeRound([selector_graph_top + selector_graph_height, selector_graph_top]);
var x_bar = d3.scaleTime()
    .rangeRound([0, width]);
var y_bar = d3.scaleLinear()
    .rangeRound([main_graph_height, (main_graph_height - bar_chart_height)]);


  //Path generators
var line = d3.line()
          .curve(d3.curveMonotoneX)
          .x(function(d) { return x(d.Date); })
          .y(function(d) { return y(d.value); });
var cmp_line = d3.line()
          .curve(d3.curveMonotoneX)
          .x(function(d) { return x(d.Date); })
          .y(function(d) { return y(d.Close); });
var line2 = d3.line()
          .curve(d3.curveMonotoneX)
          .x(function(d) { return x2(d.Date); })
          .y(function(d) { return y2(d.value); });

// To avoid line exceeds aixs, add a clip path to filter
g.append("defs").append("clipPath")
    .attr("id", "clip")
    .append("rect")
    .attr("width", width)
    .attr("height", main_graph_height);
 
//Big number convertor
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

function getComparingStockData(name){
  var res
  var p = new Promise(function(resolve, reject){
      d3.csv('public/data/'+name + ".csv", function(error, data) {
        if (error) throw error;
        data.reverse()
        // format the data
        data.forEach(function(d) {
            d.Date = parseTime(d.Date);
            d.Close = +d.Close;
        });
        resolve(data.slice())
      })
  }).then(function(response){
    res = response
  })
  return res
}


export default class MainCanvas extends React.Component {
  constructor(props) {
    super(props);
  }
    
  render() {
    const {display, name, time_range, comparing_stocks} = this.props;
    var cmp_data
    //Synchrnously read in data
    var cmp_data_promise = comparing_stocks.map(function(el){
      return new Promise(function(resolve, reject){
        d3.csv('public/data/'+el.name + ".csv", function(error, data) {
          if (error) throw error;
          data.reverse()
          // format the data
          data.forEach(function(d) {
              d.Date = parseTime(d.Date);
              d.Close = +d.Close;
          });
          resolve({id:el.id,name:el.name,data:data.slice()})
        })
      })
    })
    
    Promise.all(cmp_data_promise).then(function(cmp_data){
      console.log(cmp_data);
      d3.csv('public/data/'+name + ".csv", function(error, data) {
        if (error) throw error;
        var range = time_range;
        data.reverse()
        
        function mousemove() {
          var x0 = x.invert(d3.mouse(this)[0]);
          var bisect_date = d3.bisector(function(d){return d.Date}).right;
          var i = bisect_date(data, x0)
          //get main stock data
          var d = data[i];
          //get comparing stocks data
          var e = cmp_data.map(function(el){ 
            return  {id:el.id, data:el.data[i].Close}
          })

          focus.attr("transform", "translate(" + x(d.Date) + "," + y(d.Close) + ")");
          focus.select("text")
          .text(d.Date.getFullYear()+'-'+(d.Date.getMonth()+1)+'-'+d.Date.getDate())
          .attr("x",0)
          .attr("y",-y(d.Close)-5)
          focus.select(".vertical_line")
          .attr('x1', 0)
          .attr('y1', -y(d.Close))
          .attr('x2',0)
          .attr('y2',main_graph_height-y(d.Close))
          
          focus.select(".horizontal_line")
          .attr('x1', width-x(d.Date))
          .attr('y1', 0)
          .attr('x2',-x(d.Date))
          .attr('y2',0)

          //display main stock data
          document.getElementById('Close').innerHTML = 'Close '+d.Close.toFixed(2)
          document.getElementById('Open').innerHTML = 'Open '+d.Open.toFixed(2)
          document.getElementById('High').innerHTML = 'High '+d.High.toFixed(2)
          document.getElementById('Low').innerHTML = 'Low '+d.Low.toFixed(2)
          document.getElementById('Vol').innerHTML = 'Vol '+abbreviateNumber(d.Volume)
          //display comparing stock data
          e.forEach(function(d){
            document.getElementById("cmp_"+d.id).innerHTML = d.data.toFixed(2)
          })

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

        //Get current range in days
        var diffDays = Math.round(Math.abs((range[1].getTime() - range[0].getTime())/(24*60*60*1000)));

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
        x.domain(range);
        
        //tricky
        y.domain([
          Math.min(
            d3.min(elements, function(c) { return d3.min(c.values, function(d) { return d.value; }); }),
            cmp_data.length === 0?999:d3.min(cmp_data, function(c) { return d3.min(c.data, function(d){ return d.Close})})
            )
          ,
          Math.max(
            d3.max(elements, function(c) { return d3.max(c.values, function(d) { return d.value; }); }),
            cmp_data.length === 0?-1:d3.max(cmp_data, function(c) { return d3.max(c.data, function(d){ return d.Close})})
            )  
        ]); 

        x2.domain(d3.extent(data, function(d) { return d.Date; })); 
        y2.domain([
          d3.min(elements, function(c) { return d3.min(c.values, function(d) { return d.value; }); }),
          d3.max(elements, function(c) { return d3.max(c.values, function(d) { return d.value; }); })
          ]);
        x_bar.domain(range);
        y_bar.domain([0, d3.max(data, function(d) { return d.Volume; })]);
        
        //Establish axises
        g.append("g")
          .attr("class", "x2 axis")
            .attr("transform", "translate(0," + (selector_graph_top+ selector_graph_height) + ")")
        g.append("g")
          .attr("class", "x axis")
            .attr("transform", "translate(0,"+ main_graph_height +")")
         g.append("g")
           .attr("class", "y axis")


      
        
        
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
        .attr('stroke-width',2)
        .style('opacity',function(d) {
          if (display.indexOf(d.el) === -1){
            return 0;
          }
          return 1
        })

        //Comparing lines
        var cmp_line_color_scale = d3.scaleOrdinal(d3.schemeCategory20)
        var category = []
        for (var i=0;i<20;i++){
          category.push(i)
        }
        cmp_line_color_scale.domain(category)

        var cmp_lines = g.selectAll('.cmp_line').data(cmp_data)
        cmp_lines.exit().transition().duration(500).remove()
        cmp_lines.enter().append('path')
          .attr("fill", "none")
          .attr("class", "cmp_line")

        cmp_lines.transition().duration(500)
          .attr("d", function(d) { return cmp_line(d.data);})
          .attr('stroke-dasharray',"2, 2")
          .attr('stroke',function(d){ return cmp_line_color_scale(d.id % 20)})
          .attr('stroke-width',2)


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
              .call(d3.axisRight(y).ticks(10).tickSize(width));

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
        .attr("stroke-alignment","center")
        .attr("y2", function(d) { return y_bar(d.Volume); })
        .attr("y1", function(d) { return 300 })
        .attr('stroke-width',(width-50)/diffDays)
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
              .attr("r", 2)
              .attr("stroke-width", 1)
              .style('stroke','red');

          focus.append("line")
          .attr('class','vertical_line')
          .attr('stroke-dasharray','5,5')
          .attr('stroke-width',1)
          .style('stroke','grey')

          focus.append("line")
          .attr('class','horizontal_line')
          .attr('stroke-dasharray','5,5')
          .attr('stroke-width',1)
          .style('stroke','grey')

          focus.append("text")
              .attr('fill','black')
              .attr('font-size','10');

          g.append("rect")
              .attr("class", "overlay")
              .attr("width", width)
              .attr("height", main_graph_height)
              //.style('fill','rgba(255,255,255,0)')
              .on("mouseover", function() { focus.style("display", null); })
              .on("mouseout", function() { focus.style("display", "none"); })
              .on("mousemove", mousemove);

    })
  })
    
    return (
            <div>           
            </div> 
    );
  }
}