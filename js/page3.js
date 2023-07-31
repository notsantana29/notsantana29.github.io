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

    data = data.filter(d => d.Decade >= 1920 && d.Decade <= 2010);

    const moviesCountByDecade = d3.rollup(data, v => v.length, d => d.Decade);
    const dataArray = Array.from(moviesCountByDecade, ([decade, count]) => ({ decade, count }));

    const margin = { top: 20, right: 20, bottom: 60, left: 80 };
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const xScale = d3.scaleBand()
        .domain(dataArray.map(d => d.decade))
        .range([0, width])
        .padding(0.2);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(dataArray, d => d.count)])
        .range([height, 0]);

    const svg = d3.select("#line-container")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    const line = d3.line()
        .x(d => xScale(d.decade))
        .y(d => yScale(d.count))
        .curve(d3.curveMonotoneX);

    svg.append("path")
        .data([dataArray])
        .attr("class", "line")
        .attr("d", line)
        .attr("fill", "none")
        .attr("stroke", "black")
        .attr("stroke-width", 2);

    svg.selectAll(".dot")
        .data(dataArray)
        .enter().append("circle")
        .attr("class", "dot")
        .attr("cx", d => xScale(d.decade))
        .attr("cy", d => yScale(d.count))
        .attr("r", 5)
        .attr("fill", d => colorMap[d.decade] || "#000000")
        .on("mouseover", function(event, d) {
            const decadeData = data.filter(item => item.Decade === d.decade);
            const avgRating = d3.mean(decadeData, item => item.IMDB_Rating);
            const avgGross = d3.mean(decadeData, item => item.Gross);

            tooltip.style("display", "block")
                .html(`
                    Count of Movies: ${decadeData.length}<br>
                    Average IMDB Rating: ${avgRating.toFixed(2)}<br>
                    Average Gross Earnings: $${avgGross.toLocaleString()}
                `)
                .style("left", (event.pageX + 15) + "px")
                .style("top", (event.pageY - 40) + "px");
        })
        .on("mouseout", function() {
            tooltip.style("display", "none");
        });

    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale).tickFormat(d => `${d}s`));

    svg.append("g")
        .call(d3.axisLeft(yScale).tickFormat(d => d));

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
        .text("Count of Movies")
        .style("font-family", "Arial")
        .style("font-size", "10px");
});
