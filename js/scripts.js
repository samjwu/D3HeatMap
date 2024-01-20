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
});
