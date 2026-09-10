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


// Cargar mapa de Europa
d3.json("assets/map/europe.geojson")
    .then((europe) => {

        console.log("Mapa de Europa cargado correctamente.");

        // Proyección cartográfica
        const projection = d3
            .geoNaturalEarth1()
            .fitExtent(
                [
                    [40, 80],
                    [width - 40, height - 40]
                ],
                europe
            );

        // Convertir coordenadas geográficas en SVG
        const path = d3
            .geoPath()
            .projection(projection);


        // Dibujar países
        svg
            .selectAll(".country")
            .data(europe.features)
            .join("path")
            .attr("class", "country")
            .attr("d", path);

    })
    .catch((error) => {

        console.error(
            "Error cargando el mapa:",
            error
        );

    });
