// Load the CSV data
d3.csv("data.csv").then(function(data) {
  // Convert string data to numbers where needed
  data.forEach(function(d) {
    d.Meta_score = +d.Meta_score;
    d.Gross = parseInt(d.Gross.replace(/,/g, ''));
    d.Released_Year = +d.Released_Year; // Convert to number
  });

  // Extract the decade from the "Released_Year" field
  data.forEach(function(d) {
    d.Decade = Math.floor(d.Released_Year / 10) * 10;
  });

  const decades = Array.from(new Set(data.map(d => d.Decade))).sort();

  // Populate the decade dropdown
  const select = d3.select("#decadeFilter");
  decades.forEach(decade => {
    select.append("option").text(`${decade}s`).attr("value", decade);
  });

  // Remove data points with missing or null values in either Meta_score or Gross
  data = data.filter(function(d) {
    return d.Meta_score && d.Gross;
  });

  const filteredDataAll = data;

  // Define the color scale for the decades
  const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

  // Define the dimensions and margins of the plot
  const margin = { top: 50, right: 50, bottom: 100, left: 80 }; // Increased bottom margin
  const width = 800 - margin.left - margin.right;
  const height = 600 - margin.top - margin.bottom;

  // Set the maximum value for the y-axis
  const maxYValue = 1.5e9; // 1.5 billion

  // Set the x and y axis limits
  const xMin = 0;
  const xMax = 100;

  // Create the SVG container for the plot
  const svg = d3
    .select("#plot-container")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  const tooltip = d3
    .select("body")
    .append("div")
    .attr("class", "tooltip");

  // Define the scales for the x and y axes (flipped y-axis with log scale base 100)
  const xScale = d3.scaleLinear().domain([xMin, xMax]).range([0, width]);

  const yScale = d3.scaleLog().base(100).domain([100, maxYValue]).range([height, 0]);

  // Define custom tick format functions for the x and y axes
  const xAxisTickFormat = d3.format(".0%");
  const yAxisTickFormat = d3.format("~s");
  const yAxisTickFormatWithB = d3.format(".1s"); // Format with "B" for billion

  // Set custom tick values for the x and y axes
  const xAxisTickValues = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
  const yAxisTickValues = [
    500, 1000, 5000, 10000, 50000, 100000,
    500000, 1000000, 5000000, 10000000, 50000000,
    100000000, 500000000, 1000000000, 1500000000
  ];

  // Create the x and y axes (flipped)
  const xAxis = d3.axisBottom(xScale)
    .tickValues(xAxisTickValues)
    .tickFormat(d => xAxisTickFormat(d / 100)); // Convert the value to percentage

  const yAxis = d3.axisLeft(yScale)
    .tickValues(yAxisTickValues)
    .tickFormat(d => {
      if (d === 1000000000) return "$1B"; // Display "$1B" for the value 1 billion
      if (d === 1500000000) return "$1.5B"; // Display "$1.5B" for the value 1.5 billion
      return "$" + yAxisTickFormat(d);
    });

  function updatePlot(selectedDecade) {
    let filteredData = filteredDataAll;
    if (selectedDecade !== "all") {
      filteredData = data.filter(d => d.Decade == selectedDecade);
    }
    // Clear old elements:
    svg.selectAll("g").remove();
    svg.selectAll("circle").remove();
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      .append("text")
      .attr("x", width / 2) // Center the label
      .attr("y", 40) // Move the label below the axis
      .attr("fill", "#000")
      .attr("font-weight", "bold")
      .attr("text-anchor", "middle")
      .text("Meta Score")
      .style("font-family", "Arial")
      .style("font-size", "10px");

    svg.append("g")
      .call(yAxis)
      .append("text")
      .attr("y", -60) // Move the label to the left of the axis
      .attr("x", -height / 2) // Center the label vertically
      .attr("fill", "#000")
      .attr("font-weight", "bold")
      .attr("text-anchor", "middle")
      .attr("transform", "rotate(-90)")
      .text("Gross Earnings")
      .style("font-family", "Arial")
      .style("font-size", "10px");

    // Create the scatter plot points with color-coded circles by decades
    svg.selectAll("circle")
      .data(filteredData)
      .enter()
      .append("circle")
      .attr("cx", d => xScale(d.Meta_score))
      .attr("cy", d => yScale(d.Gross))
      .attr("r", 5)
      .attr("fill", d => colorScale(d.Decade))
      .on("mouseover", function(event, d) { // mouseover event
        tooltip.transition()
          .duration(200)
          .style("display", "block");
        tooltip.html("<strong>" + d.Series_Title + "</strong><br>" +
          "Meta Score: " + d3.format(".0%")(d.Meta_score / 100) + "<br>" + // convert to percentage
          "Gross Earnings: " + d3.format("$.2s")(d.Gross) + "<br>" + // convert to dollar format
          "Decade: " + d.Decade)
          .style("left", (event.pageX + 5) + "px")
          .style("top", (event.pageY - 28) + "px");
      })
      .on("mouseout", function(d) { // mouseout event
        tooltip.transition()
          .duration(500)
          .style("display", "none");
      });
  }

  // Initially load with all data
  updatePlot("all");

  // Add event listener to dropdown
  d3.select("#decadeFilter").on("change", function() {
    const selectedDecade = d3.select(this).property("value");
    updatePlot(selectedDecade);
  });

  // Create a separate SVG container for the legend
  const legendContainer = d3.select("#legend-container")
    .append("svg")
    .attr("width", 300) // Adjust the width as needed
    .attr("height", 200); // Adjust the height as needed

  // Extract unique decades from the data
  const decades_ = Array.from(new Set(data.map(d => d.Decade)));

  // Create a legend group with two columns
  const legendGroup = legendContainer.append("g")
    .attr("transform", "translate(10, 10)");

  // Set the position for the legend entries
  const legendRowHeight = 20;
  const legendColumnWidth = 150;
  const numRows = Math.ceil(decades_.length / 2);

  // Create legend entries (circles and text)
  const legendEntries = legendGroup.selectAll(".legend-entry")
    .data(decades_)
    .enter()
    .append("g")
    .attr("class", "legend-entry")
    .attr("transform", (d, i) => {
      if (i < numRows) {
        return `translate(0,${i * legendRowHeight})`; // First column
      } else {
        return `translate(${legendColumnWidth},${(i - numRows) * legendRowHeight})`; // Second column
      }
    });

  // Append colored circles to the legend
  legendEntries.append("circle")
    .attr("cx", 6)
    .attr("cy", 6)
    .attr("r", 6)
    .attr("fill", d => colorScale(d));

  // Append text labels to the legend
  legendEntries.append("text")
    .attr("x", 20)
    .attr("y", 10)
    .text(d => `${d}s`)
    .style("font-family", "Arial")
    .style("font-size", "10px");

  decades.forEach(decade => {
    console.log(`Decade: ${decade}, Color: ${colorScale(decade)}`);
  });

});
