
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenXAxis = "poverty"
var chosenYAxis = "obesity"


//function for updating the x-scale variable upon click on axis label
function xScale(newsData, chosenXAxis){
    
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(newsData, d => d[chosenXAxis]) * 0.8,
            d3.max(newsData, d => d[chosenXAxis]) * 1.2
        ])
        .range([0, width]);

  return xLinearScale;
}

//function for updating the y-scale variable upon click on axis label
function yScale(newsData, chosenYAxis){

    var yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(newsData, d => d[chosenYAxis])])
        .range([height, 0]);

  return yLinearScale;
}




d3.csv("assets/data/data.csv").then(function(newsData, err){
    if(err) throw err;

    //parse data
    newsData.forEach(function(data) {
        data.poverty = +data.poverty
        data.age = +data.age
        data.income = +data.income
        data.healthcare = +data.healthcare
        data.obesity = +data.obesity
        data.smokes = +data.smokes
    });

    //create x and y linear scale using the function above
    var xLinearScale = xScale(newsData, chosenXAxis);

    var yLinearScale = yScale(newsData, chosenYAxis);

    //create initial axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    //append x-axis
    var xAxis = chartGroup.append("g")
            .classed("x-axis", true)
            .attr("transform", `translate(0, ${height})`)
            .call(bottomAxis);

    //append y-axis
    var yAxis = chartGroup.append("g")
            .call(leftAxis);

    
    //append initial circles
    var circlesGroup = chartGroup.selectAll("circle")
            .data(newsData)
            .enter()
            .append("circle")
            .attr("cx", d => xLinearScale(d[chosenXAxis]))
            .attr("cy", d => yLinearScale(d[chosenYAxis]))
            .attr("r", 20)
            .classed("stateCircle", true);

    //create group for three x-axis labels
    var xlabelsGroup = chartGroup.append("g")
            .attr("transform", `translate(${width / 2}, ${height +20})`);

    var povertyLabel = xlabelsGroup.append("text")
            .attr("x", 0)
            .attr("y", 20)
            .attr("value", "poverty") // value to grab for event listener
            .classed("active", true)
            .text("In Poverty (%)");

    var ageLabel = xlabelsGroup.append("text")
            .attr("x", 0)
            .attr("y", 40)
            .attr("value", "num_albums") // value to grab for event listener
            .classed("inactive", true)
            .text("Age (Median)");

    var incomeLabel = xlabelsGroup.append("text")
            .attr("x", 0)
            .attr("y", 60)
            .attr("value", "num_albums") // value to grab for event listener
            .classed("inactive", true)
            .text("Household Income (Median)");

    //create group for three y-axis labels
    var yLabelsGroup = chartGroup.append("g")
            .attr("transform", "rotate(-90)");

    var obesityLabel = yLabelsGroup.append("text")
            .attr("y", 0 - margin.left)
            .attr("x", 0 - (height / 2))
            .attr("dy", "1em")
            .classed("active", true)
            .classed("aText", true)
            .text("Obese (%)")

    var smokesLabel = yLabelsGroup.append("text")
            .attr("y", 0 - margin.left + 20)
            .attr("x", 0 - (height / 2))
            .attr("dy", "1em")
            .classed("inactive", true)
            .classed("aText", true)
            .text("Smokes (%)")

    var healthcareLabel = yLabelsGroup.append("text")
            .attr("y", 0 - margin.left + 40)
            .attr("x", 0 - (height / 2))
            .attr("dy", "1em")
            .classed("inactive", true)
            .classed("aText", true)
            .text("Lacks Healthcare (%)")


    //updateToolTip function from above function list









    





    
})