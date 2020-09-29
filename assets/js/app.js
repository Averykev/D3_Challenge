
var svgWidth = 960;
var svgHeight = 600;

var margin = {
  top: 30,
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

//function used for updating xAxis variable upon click on axis label 
function renderXAxes(newXScale, xAxis) {

    var bottomAxis = d3.axisBottom(newXScale);

    xAxis.transition()
        .duration(1000)
        .call(bottomAxis);

    return xAxis;
}

//function used for updating yAxis variable upon click on axis label
function renderYAxes(newYScale, yAxis) {

    var leftAxis = d3.axisLeft(newYScale);

    yAxis.transition()
        .duration(1000)
        .call(leftAxis);
    
    return yAxis;
}

//function used for updating circles group with a transition to new circles
function renderCircles(circlesGroup, newXScale, newYScale, chosenXAxis, chosenYAxis) {

    circlesGroup.transition()
        .duration(1000)
        .attr("cx", d => newXScale(d[chosenXAxis]))
        .attr("cy", d => newYScale(d[chosenYAxis]));

    return circlesGroup;
}

//function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {

    var xLabel;

    if (chosenXAxis === "poverty") {
        xLabel = "Poverty"
    }
    else if (chosenXAxis === "age") {
        xLabel = "Age"
    }
    else {
        xLabel = "Household Income"
    }

    var yLabel;

    if (chosenYAxis === "obesity") {
        yLabel = "Obesity"
    }
    else if (chosenYAxis === "smokes") {
        yLabel = "Smokes"
    }
    else {
        yLabel = "Lacks Healthcare"
    }

    var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([80,-60])
        .html(function(d) {
            return (`${d.state}<br>${xLabel} ${d[chosenXAxis]}<br>${yLabel} ${d[chosenYAxis]}`);
        });

    circlesGroup.call(toolTip);

    circlesGroup.on("mouseover", function(data) {
        toolTip.show(data);
    })
        
        .on("mouseout", function(data, index) {
            toolTip.hide(data);
        });
    
    return circlesGroup;
}


//retrieve data from the CSV file and execute everything below

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
            .classed("y-axis", true)
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
    var labelsGroup = chartGroup.append("g")
            .attr("transform", `translate(${width / 2}, ${height +20})`);

    var povertyLabel = labelsGroup.append("text")
            .attr("x", 0)
            .attr("y", 20)
            .attr("value", "poverty") // value to grab for event listener
            .classed("active", true)
            .text("In Poverty (%)");

    var ageLabel = labelsGroup.append("text")
            .attr("x", 0)
            .attr("y", 40)
            .attr("value", "age") // value to grab for event listener
            .classed("inactive", true)
            .text("Age (Median)");

    var incomeLabel = labelsGroup.append("text")
            .attr("x", 0)
            .attr("y", 60)
            .attr("value", "income") // value to grab for event listener
            .classed("inactive", true)
            .text("Household Income (Median)");

    var obesityLabel = labelsGroup.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left)
            .attr("x", 0 - (height / 2))
            .attr("value", "obesity") // value to grab for event listener
            .attr("dy", "1em")
            .classed("active", true)
            .classed("aText", true)
            .text("Obese (%)")

    var smokesLabel = labelsGroup.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left + 20)
            .attr("x", 0 - (height / 2))
            .attr("value", "smokes") // value to grab for event listener
            .attr("dy", "1em")
            .classed("inactive", true)
            .classed("aText", true)
            .text("Smokes (%)")

    var healthcareLabel = labelsGroup.append("text")
            .attr("transform", "rotate(-90)")  
            .attr("y", 0 - margin.left + 40)
            .attr("x", 0 - (height / 2))
            .attr("value", "healthcare") // value to grab for event listener
            .attr("dy", "1em")
            .classed("inactive", true)
            .classed("aText", true)
            .text("Lacks Healthcare (%)")


    //updateToolTip function from above function list

    var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);


    //===============================This is where the code is breaking below==================Start here next time==============================

    

//labels event listener
    labelsGroup.selectAll("text")
        .on("click", function() {

            var xValue = d3.select(this).attr("value");

            var yValue = d3.select(this).attr("value");

            if (xValue != chosenXAxis) {
                chosenXAxis = xValue;

                xLinearScale = xScale(newsData, chosenXAxis);

                xAxis = renderXAxes(xLinearScale, xAxis);

                circlesGroup = renderCircles(circlesGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);

                circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

                if (chosenXAxis === "poverty") {
                    povertyLabel
                        .classed("active", true)
                        .classed("inactive", false);

                    ageLabel
                        .classed("active", false)
                        .classed("inactive", true);

                    incomeLabel
                        .classed("active", false)
                        .classed("inactive", true);
                }
                else if (chosenXAxis === "age") {
                    povertyLabel
                        .classed("active", false)
                        .classed("inactive", true);

                    ageLabel
                        .classed("active", true)
                        .classed("inactive", false);

                    incomeLabel
                        .classed("active", false)
                        .classed("inactive", true);
                }
                else {
                    povertyLabel
                        .classed("active", false)
                        .classed("inactive", true);

                    ageLabel
                        .classed("active", false)
                        .classed("inactive", true);

                    incomeLabel
                        .classed("active", true)
                        .classed("inactive", false);
                }
            }
            
            else if (yValue != chosenYAxis) {

                yLinearScale = yScale(newsData, chosenYAxis);

                yAxis = renderYAxes(yLinearScale, yAxis);

                circlesGroup = renderCircles(circlesGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);

                circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

                if (chosenYAxis === "obesity") {
                    obesityLabel
                        .classed("active", true)
                        .classed("inactive", false);

                    smokesLabel
                        .classed("active", false)
                        .classed("inactive", true);

                    healthcareLabel
                        .classed("active", false)
                        .classed("inactive", true);
                }
                else if (chosenYAxis === "smokes") {
                    obesityLabel
                        .classed("active", false)
                        .classed("inactive", true);

                    smokesLabel
                        .classed("active", true)
                        .classed("inactive", false);

                    healthcareLabel
                        .classed("active", false)
                        .classed("inactive", true);
                }
                else {
                    obesityLabel
                        .classed("active", false)
                        .classed("inactive", true);

                    smokesLabel
                        .classed("active", false)
                        .classed("inactive", true);

                    healthcareLabel
                        .classed("active", true)
                        .classed("inactive", false);
                }
            }
        });

}).catch(function(error) {
    console.log(error);
});