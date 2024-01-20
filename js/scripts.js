document.addEventListener('DOMContentLoaded', function () {
    var container = d3.select(".container");

    var containerSvg = container
        .append("svg")
        .attr("viewBox",
            `0
            0
            ${SVG_WIDTH + SVG_MARGIN.left + SVG_MARGIN.right}
            ${SVG_HEIGHT + SVG_MARGIN.top + SVG_MARGIN.bottom}`
        );

    var svgContents = containerSvg
        .append("g")
        .attr("transform", `translate(${SVG_MARGIN.left}, ${SVG_MARGIN.top})`);

    var legendTemperatures = {
        fillColors: [
            "#FF0000",
            "#FF6500",
            "#FFBB00",
            "#F4FF00",
            "#00FFE7",
            "#00D0FF",
            "#00A3FF",
            "#0000FF",
        ],
        degreesCelsius: [
            12,
            10,
            8,
            6,
            4,
            2,
            0,
        ],
        size: 30
    }

    var legend = containerSvg
        .append("g")
        .attr("id", "legend")
        .attr("transform",
            `translate(${SVG_MARGIN.left + legendTemperatures.size * legendTemperatures.degreesCelsius.length}, 
            ${SVG_MARGIN.top})`
        );

    legend
        .selectAll("rect")
        .data(legendTemperatures.fillColors)
        .enter()
        .append("rect")
        .attr("width", legendTemperatures.size)
        .attr("height", legendTemperatures.size)
        .attr("x", (d, i) => i * (-legendTemperatures.size))
        .attr("y", 0)
        .attr("fill", (d, i) => legendTemperatures.fillColors[i]);

    legend
        .selectAll("text")
        .data(legendTemperatures.degreesCelsius)
        .enter()
        .append("text")
        .attr("x", (d, i) => i * (-legendTemperatures.size) - legendTemperatures.size / 4)
        .attr("y", legendTemperatures.size + 10)
        .style("font-size", "0.7rem")
        .text((d, i) => `${legendTemperatures.degreesCelsius[i]}°`);

    var xScale = d3
        .scaleTime()
        .range([0, SVG_WIDTH]);

    var months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ];

    var yScale = d3
        .scaleBand()
        .range([legendTemperatures.size * 2, SVG_HEIGHT]);

    var parseTimeYear = d3.timeParse("%Y");

    var parseTimeMonth = d3.timeParse("%m");

    var formatTimeMonth = d3.timeFormat("%B");

    var request = new XMLHttpRequest();
    request.open("GET", DATA_SOURCE, true);
    request.send();
    request.onload = function () {
        let json = JSON.parse(request.responseText);
        generateHeatMap(json.baseTemperature, json.monthlyVariance);
    }

    function generateHeatMap(baseTemperature, data) {
        data.forEach((d) => {
            d["year"] = parseTimeYear(d["year"]);
            d["month"] = parseTimeMonth(d["month"]);
        });

        let maxScale = d3.max(data, d => d["year"]);
        let minScale = d3.min(data, d => d["year"]);

        let maxYear = maxScale.getFullYear();
        let minYear = minScale.getFullYear();

        xScale.domain([minScale, maxScale]);

        yScale.domain(months);

        var xAxis = d3
            .axisBottom(xScale)
            .tickFormat(d3.timeFormat("%Y"))
            .ticks(d3.timeYear.every(10))
            .tickSizeOuter(0);

        var minX = xScale.domain()[0];
        var maxX = xScale.domain()[1];

        var tickValues = d3.timeYear.range(minX, maxX, 10);

        tickValues.push(parseTimeYear(1753));

        xAxis.tickValues(tickValues);

        var yAxis = d3
            .axisLeft(yScale)
            .tickSizeOuter(0);

        svgContents
            .append("g")
            .attr("id", "x-axis")
            .attr("transform", `translate(0, ${SVG_HEIGHT})`)
            .call(xAxis);

        svgContents
            .append("g")
            .attr("id", "y-axis")
            .call(yAxis);

        var tooltip = container
            .append("div")
            .attr("id", "tooltip");

        svgContents
            .selectAll("rect")
            .data(data)
            .enter()
            .append("rect")
            .attr("class", "cell")
            .attr("data-month", (d) => d["month"].getMonth())
            .attr("data-year", (d) => d["year"].getFullYear())
            .attr("data-temp", (d) => d["variance"] + baseTemperature)
            .on("mouseenter", (event, d) => {
                tooltip
                    .attr("data-year", d["year"].getFullYear())
                    .style("opacity", 1)
                    .style("left", `${event.layerX}px`)
                    .style("top", `${event.layerY}px`)
                    .html(() => {
                        let year = d["year"].getFullYear();
                        let month = formatTimeMonth(d["month"]);
                        let temperature = (d["variance"] + baseTemperature).toFixed(2);
                        return `Year: ${year}<br>Month: ${month}<br>Degrees: ${temperature}`;
                    });
            })
            .on("mouseout", () => {
                tooltip
                    .style("opacity", 0);
            })
            .attr("x", (d) => xScale(d["year"]))
            .attr("y", (d) => yScale(formatTimeMonth(d["month"])))
            .attr("width", SVG_WIDTH / (maxYear - minYear))
            .attr("height", (SVG_HEIGHT - legendTemperatures.size * 2) / 12)
            .attr("fill", (d, i) => {
                let cellTemperature = d.variance + baseTemperature;
                if (cellTemperature > legendTemperatures.degreesCelsius[0]) {
                    return legendTemperatures.fillColors[0];
                }
                else if (cellTemperature > legendTemperatures.degreesCelsius[1]) {
                    return legendTemperatures.fillColors[1];
                }
                else if (cellTemperature > legendTemperatures.degreesCelsius[2]) {
                    return legendTemperatures.fillColors[2];
                }
                else if (cellTemperature > legendTemperatures.degreesCelsius[3]) {
                    return legendTemperatures.fillColors[3];
                }
                else if (cellTemperature > legendTemperatures.degreesCelsius[4]) {
                    return legendTemperatures.fillColors[4];
                }
                else if (cellTemperature > legendTemperatures.degreesCelsius[5]) {
                    return legendTemperatures.fillColors[5];
                }
                else if (cellTemperature > legendTemperatures.degreesCelsius[6]) {
                    return legendTemperatures.fillColors[6];
                }
                else {
                    return legendTemperatures.fillColors[7];
                }
            })
            .style("stroke", "black")
            .style("stroke-width", 0.5);
    }
});
