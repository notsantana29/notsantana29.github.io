const tooltip = d3.select(".tooltip");

const colorMap = {
    1920: "#1f77b4",
    1930: "#ff7f0e",
    1940: "#2ca02c",
    1950: "#d62728",
    1960: "#9467bd",
    1970: "#8c564b",
    1980: "#e377c2",
    1990: "#7f7f7f",
    2000: "#bcbd22",
    2010: "#17becf",
    2020: "#1f77b4"
};

d3.csv("data.csv").then(function(data) {
    data.forEach(function(d) {
        d.Gross = parseInt(d.Gross.replace(/,/g, ''));
        d.Decade = Math.floor(d.Released_Year / 10) * 10;
    });

    // Filter for decades from 1920 to 2010
    data = data.filter(d => d.Decade >= 1920 && d.Decade <= 2010);

    // Group by decade and sum earnings
    const earningsByDecade = d3.rollup(data, v => d3.sum(v, d => d.Gross), d => d.Decade);
    const dataArray = Array.from(earningsByDecade, ([decade, gross]) => ({ decade, gross }));

    // Dimensions
    const margin = { top: 20, right: 20, bottom: 60, left: 80 };
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    // Scales
    const xScale = d3.scaleBand()
        .domain(dataArray.map(d => d.decade))
        .range([0, width])
        .padding(0.2);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(dataArray, d => d.gross)])
        .range([height, 0]);

    const svg = d3.select("#bar-container")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Bars
    svg.selectAll(".bar")
        .data(dataArray)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", d => xScale(d.decade))
        .attr("width", xScale.bandwidth())
        .attr("y", d => yScale(d.gross))
        .attr("height", d => height - yScale(d.gross))
        .attr("fill", d => colorMap[d.decade] || "red")
        .on("mouseover", function(event, d) {
            // Filtering original data for the respective decade
            const decadeData = data.filter(item => item.Decade === d.decade);
            // Calculating average IMDB_Rating
            const avgRating = d3.mean(decadeData, item => item.IMDB_Rating);
            // Finding the highest grossing Series_Title
            const highestGrossingSeries = d3.max(decadeData, item => item.Gross);
            const seriesTitle = decadeData.find(item => item.Gross === highestGrossingSeries).Series_Title;

            // Show tooltip
            tooltip.style("display", "block")
                .html(`
                    Total Gross Earnings: $${d.gross.toLocaleString()}<br>
                    Average IMDB Rating: ${avgRating.toFixed(2)}<br>
                    Highest Grossing Series: ${seriesTitle}
                `)
                .style("left", (event.pageX + 15) + "px")
                .style("top", (event.pageY - 40) + "px");
        })
        .on("mouseout", function() {
            tooltip.style("display", "none");
        });

    // Axes
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale).tickFormat(d => `${d}s`));

    svg.append("g")
        .call(d3.axisLeft(yScale).tickFormat(d => `$${d/1e9}B`)); // Convert gross amount to billions

    // Labels
    svg.append("text")
        .attr("class", "axis-label")
        .attr("x", width / 2)
        .attr("y", height + 40)
        .attr("text-anchor", "middle")
        .text("Decade")
        .style("font-family", "Arial")
        .style("font-size", "10px");

    svg.append("text")
        .attr("class", "axis-label")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", -60)
        .attr("text-anchor", "middle")
        .text("Total Gross Earnings (in Billions)")
        .style("font-family", "Arial")
        .style("font-size", "10px");
});
