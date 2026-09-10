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
        coordinates: [-2.079, 43.135],
        button: "city-tolosa"
    },
    {
        name: "Clermont-Ferrand",
        coordinates: [3.087, 45.777],
        button: "city-clermont"
    },
    {
        name: "Múnich",
        coordinates: [11.582, 48.135],
        button: "city-munich"
    },
    {
        name: "Praga",
        coordinates: [14.438, 50.075],
        button: "city-prague"
    },
    {
        name: "Berlín",
        coordinates: [13.405, 52.520],
        button: "city-berlin"
    },
    {
        name: "Ámsterdam",
        coordinates: [4.904, 52.368],
        button: "city-amsterdam"
    },
    {
        name: "Brujas",
        coordinates: [3.224, 51.209],
        button: "city-bruges"
    },
    {
        name: "París",
        coordinates: [2.352, 48.857],
        button: "city-paris"
    }
];


// ==========================================
// CARGAR MAPA
// ==========================================

d3.json("assets/map/europe.geojson")
    .then((europe) => {

        console.log("Mapa de Europa cargado correctamente.");

        // ==========================================
        // PROYECCIÓN
        // ==========================================

        const projection = d3
            .geoNaturalEarth1()
            .fitExtent(
                [
                    [40, 80],
                    [width - 40, height - 40]
                ],
                europe
            );

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
        // CALCULAR POSICIÓN DE LAS CIUDADES
        // ==========================================

        cities.forEach(city => {

            const [x, y] = projection(city.coordinates);

            city.x = x;
            city.y = y;

        });


        // ==========================================
        // DIBUJAR RECORRIDO
        // ==========================================

        const routeLine = d3
            .line()
            .x(city => city.x)
            .y(city => city.y)
            .curve(d3.curveCatmullRom.alpha(0.5));


        svg
            .append("path")
            .datum(cities)
            .attr("class", "travel-route")
            .attr("d", routeLine);


        // ==========================================
        // DIBUJAR PUNTOS DE LAS CIUDADES
        // ==========================================

        svg
            .selectAll(".city-point")
            .data(cities)
            .join("circle")
            .attr("class", "city-point")
            .attr("cx", city => city.x)
            .attr("cy", city => city.y)
            .attr("r", 7);


        // ==========================================
        // COLOCAR BOTONES SOBRE EL MAPA
        // ==========================================

        cities.forEach(city => {

            const button = document.getElementById(city.button);

            if (!button) {
                return;
            }

            button.style.left = `${city.x}px`;
            button.style.top = `${city.y}px`;

        });


        console.log("Recorrido dibujado correctamente.");
        console.log("Ciudades posicionadas:", cities);

    })
    .catch((error) => {

        console.error(
            "Error cargando el mapa:",
            error
        );

    });
