document.addEventListener('DOMContentLoaded', function () {
    const container = d3.select(".container");

    const containerCanvas = container
        .append("svg")
        .attr("viewBox",
            `0
            0
            ${SVG_WIDTH + SVG_MARGIN.left + SVG_MARGIN.right}
            ${SVG_HEIGHT + SVG_MARGIN.top + SVG_MARGIN.bottom}`
        );

});
