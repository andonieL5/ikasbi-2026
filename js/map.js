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


// ==========================================
// CIUDADES DEL VIAJE
// ==========================================

const cities = [
    {
        name: "Tolosa",
        coordinates: [-2.079, 43.135]
    },
    {
        name: "Clermont-Ferrand",
        coordinates: [3.087, 45.777]
    },
    {
        name: "Múnich",
        coordinates: [11.582, 48.135]
    },
    {
        name: "Praga",
        coordinates: [14.438, 50.075]
    },
    {
        name: "Berlín",
        coordinates: [13.405, 52.520]
    },
    {
        name: "Ámsterdam",
        coordinates: [4.904, 52.368]
    },
    {
        name: "Brujas",
        coordinates: [3.224, 51.209]
    },
    {
        name: "París",
        coordinates: [2.352, 48.857]
    }
];


// ==========================================
// CARGAR MAPA
// ==========================================

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

        // Generador de formas
        const path = d3
            .geoPath()
            .projection(projection);


        // ==========================================
        // DIBUJAR PAÍSES
        // ==========================================

        svg
            .selectAll(".country")
            .data(europe.features)
            .join("path")
            .attr("class", "country")
            .attr("d", path);


        // ==========================================
        // CONVERTIR CIUDADES A POSICIONES SVG
        // ==========================================

        cities.forEach(city => {

            const [x, y] = projection(city.coordinates);

            city.x = x;
            city.y = y;

        });


        console.log("Ciudades posicionadas:", cities);

    })
    .catch((error) => {

        console.error(
            "Error cargando el mapa:",
            error
        );

    });
