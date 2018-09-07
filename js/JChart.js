/**
 * @desc 
 * This class is used for Speedometer Graph generation for Right Mechanics.
 * 
 * @version 1.0.0
 * @author  Jayesh Lahare
 * @created 02 July 2018
 * @updated 20 Aug 2018
 * @link    www.yash.com
 * 
 */



var JColors = [
    // "#FF5733",
    // "#42A5F5",
    // "#26A69A",
    // "#69F0AE",
    // "#827717",
    // "#FFD740",
    // "#9C27B0",
    // "#AA00FF",
    // "#B2EBF2" 

    "#283593",
    "#C62828",
    "#558B2F",
    "#4E342E",
    "#827717",
    "#0B5345",
    "#7B7D7D",
    "#82E0AA",
    "#AED6F1"];

function JChart()
{
    
}

JChart.generateGaugeChart = function (elementName , data , config, showNull)
{
   // d3.select("#"+elementName).selectAll("svg > *").remove();
    d3.selectAll("#"+elementName).selectAll("svg").remove();

    var showNiddleValue = false;

    var width = 300;
    var height = 120;
    var arcRadius = 60;
    var holoRadius = 10;
    var arcStrokeWidth = 20;
    var labelOffset = 20;
    
    var lowerBound = 0;
    var upperBound = 0;
    
    var lengendXoffset = 20;
    var lengendYoffset = 20;

    var confidenceRect = 15;
    
    var legendRectWidth = confidenceRect+ 5;
    var legendRectHeight = 5;
    
    
    var bottomLabelHeight = 20;
    var bottomLabelOffsetY = 5;
    
    var confidanceColor = "#AED6F1";
    var labelFontSize = "12px";

    var legendFontSize = "12px";
    
    const START_ANGLE = -1.55;
    const END_ANGLE = 1.55;
  
    var labelTextLengthHeight = 0;

    if(config !== undefined)
    {
       // console.log("showLegend : " + config.showLegend);
       // console.log("showBottomLabel : " + config.showBottomLabel);
        
        if(config.showLegend !== undefined && config.showLegend==false)
        {
            if(data.confidence == undefined)
            {
                width = arcRadius * 2 + labelOffset * 2 ;
            }

            
        } 

        if(config.showBottomLabel !== undefined && config.showBottomLabel==true)
        {
           height = height + bottomLabelHeight;
        }else
        {
            bottomLabelHeight = 0;
        }       
    }
    else
    {
        //console.log("config is null");
    }

    
 
   // console.log(lowerBound + "  ,  " + upperBound);

  
   
       var marginLeft = width/2 - arcRadius - labelOffset;
    


  var tooltipDiv = d3.select("#"+elementName) .append("div")	
   // .attr("class", "tooltip")				
    .style("opacity", 0)
    .style("position", "absolute")			
    .style("padding", "2px")				
    .style("font", "12px sans-serif")		
    .style("background", "rgba(254, 255, 254, 0.5)")
    .style("border", "1px solid gray")		
    .style("border-radius", "2px")			
    .style("pointer-events", "none");	

    //d3.select("divElement > *").remove();

    var noData = false;
    
    if(data==undefined || data.axis==undefined ||  data.axis.length<= 0 || (showNull!=undefined && showNull==true) || isDataValid(data)==false)
    {
        noData = true;
        width = width/2;
    }

    var svgDiv = d3.select("#"+elementName) 
    .append("svg")
    .attr("width", width)
    .attr("height", height);

   
    var divElement =  svgDiv.append("g")
    .attr("transform", "translate(" + (width/2-marginLeft+labelTextLengthHeight) + "," + (height-holoRadius-10-bottomLabelHeight)  +  ")");

    if(noData == true)
    {
                    //-- NO DATA AVAILABLE LABEL ---------
                    
                        // TEXT WIDTH CALCULATION START
                        let arr = [];
                        arr.push("No Data Available.");
                        
                        let noTxtWidth = 0;
                        divElement.append('g')
                        .selectAll('.dummyText')
                        .data(arr)
                        .enter()
                        .append("text")
                        .attr("font-size", labelFontSize+5)
                        .style('font-family', 'open_sanssemibold')
                        .style('font-weight', 'normal')
                        .text(function(d) { return d})
                        .each(function(d,i) 
                        {
                            noTxtWidth = this.getComputedTextLength()
                            //console.log("Bottom Text Width at " +i + " Is " + noTxtWidth);
                            
                            this.remove(); // remove them just after displaying them
                        });
                    // TEXT WIDTH CALCULATION ENDS 

                        //console.log("OutSide Bottom Text Width at    Is " + noTxtWidth);

                        divElement.append('text')
                        .attr('x', 0)
                        .attr('y',-holoRadius-10-bottomLabelHeight)
                       // .attr('dy', '1em')
                       // .attr('dx', '2em')
                        //.attr('text-anchor', 'middle')
                        //.attr("startOffset", "10%")
                        .style("font-size", legendFontSize+5)
                        .style('font-family', 'open_sanssemibold')
                        .style('font-weight', 'normal')
                        .text("No Data Available.");
                    
        return;
    }

    var niddleCounts = data.axis.length;

    var leftLabel = data.leftLabel;
    var rightLabel = data.rightLabel;

    if(data.lowerBound == undefined)
    {
        lowerBound = data.min;
    }else{
        lowerBound = data.lowerBound;
    }

    if(data.upperBound == undefined)
    {
        upperBound = data.max;
    }else
    {
        upperBound = data.upperBound;
    }


     //Popup Code
     let html = "<div><table border='0' cellpadding='0' cellspacing='0' style='border-collapse: collapse;' >";
     for(let i =0 ; i< data.axis.length ; i++)
     {
             html +=  "<tr style='padding: 0px; margin: 0px;'>";
             html +=  "<td style='maring:0px; padding:0px;'><p style='padding: 0px; margin: 0px; width:10px; height: 10px; background-color:"+ JColors[i] +"; border: 1px solid darkgray;'></p></td>";
             html +=  "<td style='padding:0px; margin: 0px; text-align:left;'><span style='padding: 0px; margin: 0px; margin-left: 5px; text-align:left;'>" + data.axis[i].key+ "</span></td>";
             html += "<td style='padding: 0; margin: 0; text-align:left;'><span style='margin-left: 5px'><b>" + data.axis[i].value + "</b></span></td></tr>";
     }
   html += "</table></div>";
   
    divElement.on("mousemove", function(d) 
    {		
      
       var coordinates = [0, 0];
       coordinates = d3.mouse(this);
       var x = Math.abs(coordinates[0]);
       var y = Math.abs(coordinates[1]);
       //console.log("Inside mousemove " +  x + " , " + y);

        // D3 v4
        //var dx = d3.event.pageX - document.getElementById(elementName).getBoundingClientRect().x + 10
        //var dy = d3.event.pageY - document.getElementById(elementName).getBoundingClientRect().y + 10
        //console.log("Inside mousemove d: " +  dx + " , " + dy);

        tooltipDiv.transition()		
            .duration(200)		
            .style("opacity", .99);		

            tooltipDiv	.html( html )	
            .style("left", (x) + "px")		
            .style("top", (y) + "px");	

        // tooltipDiv	.html( html )	
        //     .style("left", (d3.event.pageX) + "px")		
        //     .style("top", (d3.event.pageY - 28) + "px");	
        })
   				
    .on("mouseout", function(d) {		
       // console.log("Inside mouseout");
        tooltipDiv.transition()		
            .duration(500)		
            .style("opacity", 0);	
    });
 
    var preGap = 0.5;
    
    var nW = 5;
    var st = 0
    var diff = -0.02;
    
    // var SERIES_MIN = data.min + Math.abs(START_ANGLE);
    // var SERIES_MAX = data.max - Math.abs(END_ANGLE);

    // var sampleSize = (SERIES_MAX - SERIES_MIN) / (data.max - data.min);

    var sampleSize = (data.max - data.min) / 9; // 9 because i m doing 10 parts

    var extraGap  =0;
    if(data.min < 1)
    {
        extraGap = 0;
    }else
    {
        extraGap = sampleSize;
    }

   

    let arr = [];

    // for (let i =0; i < data.axis.length ; i++)
    // {
    //     arr.push( data.axis[i].value);
    // }
    arr.push(getRounded( data.leftLabel));
    arr.push(getRounded( data.rightLabel));
   
    let maxDiff = 1;
    divElement.append('g')
    .selectAll('.dummyText')
    .data(arr)
    .enter()
    .append("text")
    .attr("font-size", labelFontSize)
    .style('font-family', 'open_sansregular')
    
    .text(function(d) { return d})
    .each(function(d,i) 
    {
        var thisWidth = this.getComputedTextLength()
       // console.log("Text Width at " +i + " Is " + thisWidth);
        maxDiff = thisWidth;
        this.remove() // remove them just after displaying them
    });

    
if(showNiddleValue)
{
    svgDiv.style("padding-left", maxDiff/2)
    .style("width", width+maxDiff/2);
}

/* COMMENTING FOR NOW AS WE ARE NOT GOING TO SHOW NIDDLE VALUE

 // This loop is for illusion it draws invisible arc with text
 for( var i =0; i<data.axis.length ; i++)
 {
            // st = SERIES_MIN + (data.axis[i].value * sampleSize) - extraGap;
            // st = data.axis[i].value - st;

            let position = (data.axis[i].value - data.min) / sampleSize;

            let actualSample = (Math.abs(START_ANGLE) + Math.abs(END_ANGLE)) / 9; // 9 because 10 samples
            st = START_ANGLE + (actualSample * position);



             var niddleArc = d3.arc()
             .startAngle(st)
             //.endAngle(st - diff+preGap/2)
             .endAngle(st - diff)
             
             .innerRadius(0)
             .outerRadius(arcRadius+maxDiff/2 + maxDiff/4 + 10);
             //.outerRadius(arcRadius+10);
             
             var sector = divElement.append("path")
             .attr("fill", "none")
             .attr("id", elementName+"txt"+i)
             .attr("stroke", "none")
             .attr("d", niddleArc);
 
             divElement.append("text")
             .append("textPath") //append a textPath to the text element
            // .attr("dy", 4)
             //.attr("dx" , -100)
             .attr("xlink:href", "#"+ elementName+"txt"+i ) //place the ID of the path here
            //.style("text-anchor","middle") //place the text halfway on the arc
            // .attr("startOffset", "-1%")
            .style("font-size", labelFontSize) 
            .text("" + getRounded(data.axis[i].value));
       
 }
*/

  // MAIN ARC DRAWING 
   var mainArc = d3.arc()
     .startAngle(START_ANGLE)
     .endAngle(END_ANGLE)
     .innerRadius(0)
     .outerRadius(arcRadius);
      
   
   var sector = divElement.append("path")
     .attr("fill", "#EAECEE")
    // .attr("stroke-width", 30)
     .attr("stroke", "#EAECEE")
     .attr("d", mainArc);
  
   

    // CONFIDANCE ARC CALCULATION
 
    let actualSample = (Math.abs(START_ANGLE) + Math.abs(END_ANGLE)) / 9; // 9 because 10 samples

    let lposition = (lowerBound - data.min) / sampleSize;
    let nStartPoint = START_ANGLE + (actualSample * lposition);

    let uposition = (upperBound - data.min) / sampleSize;
    let nEndPoint = START_ANGLE + (actualSample * uposition);


    if(data.lowerBound == undefined)
    {
        lowerBound = START_ANGLE;
        nStartPoint = lowerBound;
    }
    if(data.upperBound == undefined)
    {
        upperBound = END_ANGLE;
        nEndPoint = upperBound;
    }

    // CONFIDANCE ARC DRAWING 
     var confidanceArc = d3.arc()
     .startAngle(nStartPoint)
     .endAngle(nEndPoint)
     .innerRadius(0)
     .outerRadius(arcRadius);
    
      
     var sector = divElement.append("path")
      .attr("fill", confidanceColor)
     .attr("id", "thing")
     //.attr("stroke", confidanceColor)
     .attr("d", confidanceArc);
      
    
    
      // CIRLCE CREATING HOLLOW ARC
       divElement.append("circle")
       .attr("cx", 0)
       .attr("cy", 0)
       .attr("r", arcRadius - arcStrokeWidth)
       .attr("fill", "white");
 
       
   //------ NIDDLE CODE
   for(let n = 0 ; n <  data.axis.length ; n++)
   {
       /** OLD HELPFUL BUDDY CODE IN CASE IF REAL NIDDLE DONOT WORKS: JAYESH
        let position = (data.axis[n].value - data.min) / sampleSize;
        let actualSample = (Math.abs(START_ANGLE) + Math.abs(END_ANGLE)) / 9; // 9 because 10 samples
        st = START_ANGLE + (actualSample * position);
    
        var niddleArc = d3.arc()
        .startAngle(st)
        .endAngle(st - diff)
        .innerRadius(0)
        .outerRadius(arcRadius+5);

      
        

        var sector = divElement.append("path")
       
        .attr("fill", JColors[n])
        .attr("id", "niddle"+n)
        .attr("stroke", JColors[n])
        .attr("d", niddleArc);
        */

         // ACTUAL NIDDLE LOGIC

         var poly = [{"x":0, "y":0},
         {"x":-3,"y":-3},
         {"x":0,"y":-arcRadius},
         {"x":3,"y":-3},
         {"x":0,"y":0}
         ];
          

         let po = (data.axis[n].value - data.min) / sampleSize;
         let asp = (Math.abs(-90) + Math.abs(90)) / 9; // 9 because 10 samples
         let stAng = -90 + (asp * po);
         
         var pl = divElement.selectAll(elementName+"polygon" + n)
         .data([poly])
         .enter().append("polygon")
         .attr("points",function(d) { 
             return d.map(function(d) {
                 //return [scaleX(d.x),scaleY(d.y)].join(",");
                 return [ d.x , d.y ].join(",");
             }).join(" ");
         })
         .attr("stroke",JColors[n])
         .attr("fill",JColors[n])
         .attr("stroke-width",0.5)
         .attr("transform", "rotate("+stAng+")");

       
   }
   

  

 
  

 //---------SHADOW CIRCLE CODE
 defineShadowFilter(divElement);

divElement.append("circle")
.attr("cx", 0)
.attr("cy", 0)
.attr("r", holoRadius)
.style("filter", "url(#drop-shadow)")
.attr("fill", "white");

//-- LEFT LABEL 
divElement.append('text')
.attr('x', -arcRadius - maxDiff/2 + arcStrokeWidth/2 )
.attr('y', 0)
.attr('dy', '1em')
//.attr('dx', '0.5em')
//.attr('text-anchor', 'middle')
.attr("startOffset", "10%")
.text(getRounded(leftLabel))
.style("font-size", legendFontSize)
.style('font-family', 'open_sansregular')
.style('font-weight', 'normal')
 .style('font-style', 'normal');


//-- RIGHT LABEL 
divElement.append('text')
.attr('x', arcRadius - arcStrokeWidth/2 - maxDiff/2 )
.attr('y', 0)
.attr('dy', '1em')
//.attr('dx', '0.5em')
.style("font-size", legendFontSize)
//.attr('text-anchor', 'middle')
//.attr("startOffset", "10%")
.text(getRounded(rightLabel))
.style('font-family', 'open_sansregular')
.style('font-weight', 'normal');

var legendX = arcRadius + lengendXoffset;
var legendY = -arcRadius;

var verticalYoffset = arcRadius/(data.axis.length + 1);
//RIGHT SIDE LEGEND DRAW
if(config !== undefined && config.showLegend==true)
{
            for( var i =0; i<niddleCounts ; i++)
            {
                legendY = legendY + verticalYoffset*i;

                divElement.append("rect")
                .attr("x", legendX)
                .attr("y", legendY  )
                .attr("fill" , JColors[i])
                .attr("width", legendRectWidth)
                .attr("height", legendRectHeight);

                divElement.append('text')
                .attr('x', legendX + legendRectWidth +lengendXoffset/4)
                .attr('y', legendY)
                .attr('dy', '0.5em')
                .attr('dx', '0.5em')
                .style("font-size", legendFontSize)
                .style('font-family', 'open_sansregular')
                .style('font-weight', 'normal')
                .text(data.axis[i].key);
            
            }
}

legendY = legendY + verticalYoffset;

//TOP SIDE LEGEND DRAW
var lX = -arcRadius;
if(config !== undefined && config.showTopLegends==true)
{
            for( var i =0; i<niddleCounts ; i++)
            {
                var lY = -arcRadius - lengendYoffset-lengendYoffset/2;
               
                divElement.append("rect")
                .attr('x', lX   )
                .attr("y", lY  )
                .attr("fill" , JColors[i])
                .attr("width", legendRectWidth)
                .attr("height", legendRectHeight);

                 divElement.append('text')
                .attr('x', lX + legendRectWidth +lengendXoffset/4)
                .attr('y', lY)
                .attr('dy', '0.5em')
                .attr('dx', '0.5em')
                .style("font-size", legendFontSize)
                .style('font-family', 'open_sansregular')
                .style('font-weight', 'normal')
                .text(data.axis[i].key);

                lX = lX + legendRectWidth +lengendXoffset/4 + 35;
            
            }
}



//----- CONFIDANCE RECT---------
if(data.confidence != undefined)
{  
    divElement.append("rect")
    .attr("x", legendX + ( legendRectWidth/2 - confidenceRect/2))
    .attr("y", legendY  )
    .attr("fill" , confidanceColor)
    .attr("width", confidenceRect)
    .attr("height", confidenceRect);

    divElement.append('text')
    .attr('x', legendX + legendRectWidth +lengendXoffset/4)
    .attr('y', legendY + legendRectWidth/4)
    .attr('dy', '0.5em')
    .attr('dx', '0.5em')
    .style("font-size", legendFontSize)
    .style('font-family', 'open_sansregular')
    .style('font-weight', 'normal')
    .text(data.confidence);

        // divElement.append("rect")
        // .attr("x", legendX)
        
        // .attr("fill" ,  confidanceColor)
        // .attr("width", confidenceRect)
        // .attr("height", confidenceRect);

       
        // divElement.append('text')
        // .attr('x', arcRadius   + lengendXoffset)
         
        // .attr('dy', '1em')
        // .attr('dx', '2em')
       
        // .style("font-size", legendFontSize)
        // .text(data.confidence);
}

//-- BOTTOM LABEL LABEL ---------
if(config.showBottomLabel !== undefined && config.showBottomLabel==true && data.bottomLabel !== undefined)
{
    // TEXT WIDTH CALCULATION START
    let arr = [];
    arr.push(data.bottomLabel);
    
    let bottomTxtWidth = 0;
    divElement.append('g')
    .selectAll('.dummyText')
    .data(arr)
    .enter()
    .append("text")
    .attr("font-size", labelFontSize)
    .style("font-weight" , "bold")
    .style('font-family', 'open_sanssemibold')
    
    .text(function(d) { return d})
    .each(function(d,i) 
    {
         bottomTxtWidth = this.getComputedTextLength()
       // console.log("Bottom Text Width at " +i + " Is " + bottomTxtWidth);
       // bottomTxtWidth = bottomTxtWidth;
        this.remove() // remove them just after displaying them
    });
  // TEXT WIDTH CALCULATION ENDS 

    //console.log("OutSide Bottom Text Width at " +i + " Is " + bottomTxtWidth);

    divElement.append('text')
    .attr('x', -bottomTxtWidth/2   )
    .attr('y', holoRadius + bottomLabelOffsetY)
    .attr('dy', '1.25em')
   // .attr('dx', '2em')
    //.attr('text-anchor', 'middle')
    //.attr("startOffset", "10%")
    .style("font-size", legendFontSize)
    .style('font-family', 'open_sanssemibold')
  
    .style("font-weight" , "bold")
    .text(data.bottomLabel);
}



}





function defineShadowFilter(divElement)
{
    var defs = divElement.append("defs");
    
    
    var filter = defs.append("filter")
     .attr("id", "drop-shadow")
     .attr("height", "120%")
     .attr("width", "120%");
    
    filter.append("feGaussianBlur")
     .attr("in", "SourceAlpha")
     .attr("stdDeviation", 2)
     .attr("result", "blur");
    
    
    filter.append("feOffset")
     .attr("in", "blur")
     .attr("dx", 0.2)
     .attr("dy", -0.2)
     .attr("result", "offsetBlur");

    var feMerge = filter.append("feMerge");
    
    feMerge.append("feMergeNode")
     .attr("in", "offsetBlur");
    feMerge.append("feMergeNode")
     .attr("in", "SourceGraphic");
}


function isDataValid(data)
{
     if(data == undefined)
        return false;

     if(data.min == undefined || isNaN(data.min)==true || data.min == null)
     {
         // INVALID NUMBER
         return false;
     }

     if(data.max == undefined || isNaN(data.max)==true || data.max == null)
     {
         // INVALID NUMBER
         return false;
     }

    for(let n = 0 ; n <  data.axis.length ; n++)
    {
    
       if(  (isNaN(data.axis[n].value) == true)  || ( data.axis[n].value == null) )
       {
           // INVALID NUMBER
           return false;
       }
    }

    
   // if(data.upperBound != undefined && data.upperBound==null)
    if( (data.upperBound != undefined) && (data.upperBound == 'null') || (data.upperBound == null) )
    {
        return false;
    }

    //if ((data.lowerBound) != undefined && ((data.lowerBound === 'null') || (data.lowerBound === null)) )
    if( (data.lowerBound != undefined) && (data.lowerBound == 'null') || (data.lowerBound == null) )
    {
        return false;
    }

    return true;
}

function getRounded(string)
{
    var str = string + "";
  try
  {
       
       var idx = str.indexOf(".");
       if(idx== -1)
       { 
            return str;
       }else
       {
          var firstPart = str.slice(0,idx);
          var secondPart = str.slice(idx , str.length);
          secondPart = secondPart.replace("." , "");
          if(secondPart.length > 1)
          {
            secondPart = secondPart.substring(0,1);
          }
          return firstPart + "."+ secondPart;
       }
  }catch(error)
  {
    //  console.log("Error printing " + str + " error : "  + error );
    return str; 
  }
}
