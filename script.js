
//getting api
const req = new XMLHttpRequest();
req.open("GET","https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json")
req.send()
req.onload=function(){
    const json = JSON.parse(req.responseText);
    const baseTemp= json.baseTemperature;
    const dataSet = json.monthlyVariance;
    const w=1000;
    const h=700;
    const padding=53.83;
    const months =["","December","November","October","September","August","July","June","May","April","March","February","January"]

    //scale for x-axis
    const xScale = d3.scaleLinear()
        .domain([d3.min(dataSet,(d)=>getYear(d.year))
        ,d3.max(dataSet,(d)=>getYear(d.year))])   
        .range([padding,w-padding]);

    //scale for y-axis
    const yScale=d3.scaleLinear()
                    .domain([1,12])
                    .range([h-padding,padding])

    //adding svg to div
    const svg = d3.select(".container-fluid")
                    .append("svg")
                    .attr("width",w)
                    .attr("height",h);

    //x-axis without "," in 4 digit numbers
    const xAxis = d3.axisBottom(xScale)
                        .tickFormat(d3.format("d"));

    //y-axis where number of the month is converted to the name of the month
    const yAxis = d3.axisLeft(yScale)
                    .tickFormat((d)=>{
                        return months[d];
                    });
    
    //legend representing color with respective temperature variance
    const legend = svg.append("g")
                        .attr("id","legend")

    //tooltip
    const tooltip = d3.select(".container-fluid")
                    .append("div")
                    .attr("id","tooltip")
    
    //add x-axis to svg
    svg.append("g")
        .attr("id","x-axis")
        .attr("transform","translate(0,"+(h-padding)+")")
        .call(xAxis);
 
    //add label to x-axis
    svg.append("text")
        .attr("id","x-axis-label")
        .attr("transform","translate("+(w/2)+","+(h-10)+")")
        .text("Year")
        .style("stroke","black")
        .style("stroke-width","1px");
    
    //add y-axis to svg
    svg.append("g")
        .attr("id","y-axis")
        .attr("transform","translate("+(padding)+",0)")
        .call(yAxis);
    
    //add label to y-axis
    svg.append("text")
        .attr("id","y-axis-label")
        .attr("transform","rotate(-90)")
        .attr("x",-350)
        .attr("y",12)
        .text("Months")
        .style("stroke","black")
        .style("stroke-width","1px")
    
    //add rects for every month for every year
    svg.selectAll("rect")
        .data(dataSet)
        .enter()
        .append("rect")
        .attr("class","cell")
        .attr("x",(d,i)=>xScale(d.year))    //x co-ordinate equal to xScale
        .attr("y",(d,i)=>h-padding-yScale(d.month)) //inversing y co-ordinate 
        .attr("width",(w-padding)/(dataSet.length/12))  //adjusting width based on width of svg and length of data represented
        .attr("height",(h-padding)/12)  //adjusting height based on height of svg
        .style("fill",(d,i)=>getColor(d.variance))  //fill color based on variance
        .attr("data-month",(d,i)=>d.month-1)
        .attr("data-year",(d,i)=>getYear(d.year))
        .attr("data-temp",(d,i)=>d.variance)
        .on("mouseover",(d,i)=>{            //when mouse hovers on a data
            d3.select(event.currentTarget)  //select current data
                .style("stroke","black")    //add border
                .style("stroke-width","2px")

            tooltip.style("left",xScale(d.year)-350+"px")   //adjust position of tooltip
                .style("top",event.pageY-padding*3+"px")
                .style("display","inline-block")
                .style("background-color","black")
                .style("color","white")
                .style("opacity","0.7")
                .html("Year: "+d.year                       //displays details in html
                        +"<br> Month: "+months[13-d.month]
                        +"<br> Temperature: "+(baseTemp+d.variance)+" °C"
                        +"<br> Variance: "+(d.variance)+ " °C") 
                .attr("data-year",d.year)
        })
        .on("mouseout",(d,i)=>{
            d3.select(event.currentTarget)      //remove border and div
                .style("stroke","none")

            tooltip.style("display","none")
        })
    
    //line up all rects of different color for legend
    legend.append("rect")
           .attr("x",w-380)
           .attr("y",h-31)
           .attr("width",30)
           .attr("height",17)
           .style("fill","#2b8cbe")
    legend.append("rect")
           .attr("x",w-350)
           .attr("y",h-31)
           .attr("width",30)
           .attr("height",17)
           .style("fill","#a6bddb")
    legend.append("rect")
           .attr("x",w-320)
           .attr("y",h-31)
           .attr("width",30)
           .attr("height",17)
           .style("fill","#b3e4e6")
    legend.append("rect")
           .attr("x",w-290)
           .attr("y",h-31)
           .attr("width",30)
           .attr("height",17)
           .style("fill","#ece7f2")
    legend.append("rect")
           .attr("x",w-260)
           .attr("y",h-31)
           .attr("width",30)
           .attr("height",17)
           .style("fill","#ffeda0")
    legend.append("rect")
           .attr("x",w-230)
           .attr("y",h-31)
           .attr("width",30)
           .attr("height",17)
           .style("fill","#feb24c")
    legend.append("rect")
           .attr("x",w-200)
           .attr("y",h-31)
           .attr("width",30)
           .attr("height",17)
           .style("fill","#f68838")
    legend.append("rect")
           .attr("x",w-170)
           .attr("y",h-31)
           .attr("width",30)
           .attr("height",17)
           .style("fill","#f03b20")
    
    //give details of rects showing variance temperature above in legend
    legend.append("text")
           .attr("x",w-390)
           .attr("y",h)
           .text("<-2")
    legend.append("text")
           .attr("x",w-350)
           .attr("y",h)
           .text(">-2")
    legend.append("text")
           .attr("x",w-319)
           .attr("y",h)
           .text(">-1")
    legend.append("text")
           .attr("x",w-285)
           .attr("y",h)
           .text("<0")
    legend.append("text")
           .attr("x",w-255)
           .attr("y",h)
           .text(">0")
    legend.append("text")
           .attr("x",w-225)
           .attr("y",h)
           .text(">1")
    legend.append("text")
           .attr("x",w-195)
           .attr("y",h)
           .text(">2")
    legend.append("text")
           .attr("x",w-165)
           .attr("y",h)
           .text(">5")
    legend.append("text")
           .attr("x",w-135)
           .attr("y",h-2)
           .text("variance in °C")
}

//returns year in int type
function getYear(d){
    return(parseInt(d));
}

//returns color based on value of variance temperature
function getColor(d){
    if(d>5){
        return "#f03b20";
    } else if(d>2){
        return "#f68838";
    } else if(d>1){
        return "#feb24c";
    } else if(d>0){
        return "#ffeda0";
    } else if(d>-0.5){
        return "#ece7f2";
    } else if(d>-1){
        return "#b3e4e6";
    } else if (d>-2){
        return "#a6bddb";
    } else{
        return "#2b8cbe";
    }
}