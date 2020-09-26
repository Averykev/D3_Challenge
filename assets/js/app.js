
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

    


    





    
})