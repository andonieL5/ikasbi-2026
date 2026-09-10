const mapContainer = document.getElementById("map");

const width = mapContainer.clientWidth;
const height = mapContainer.clientHeight;

const svg = d3
    .select("#map")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("preserveAspectRatio", "xMidYMid meet");

console.log("Mapa SVG creado correctamente.");
