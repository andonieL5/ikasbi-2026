// ==========================================
// CONTENEDOR DEL MAPA
// ==========================================

const mapContainer = document.getElementById("map");


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
// CREAR SVG
// ==========================================

const width = mapContainer.clientWidth;
const height = mapContainer.clientHeight;

const svg = d3
    .select("#map")
    .append("svg")
    .attr("viewBox", `0 0 ${width} ${height}`);


// ==========================================
// CARGAR EUROPA
// ==========================================

d3.json("./assets/map/europe.geojson")
    .then((europe) => {

        console.log("Europa cargada correctamente");

        // ======================================
        // PROYECCIÓN
        // ======================================

        const projection = d3
            .geoNaturalEarth1()
            .fitExtent(
                [
                    [100, 80],
                    [width - 100, height - 80]
                ],
                europe
            );


        const path = d3
            .geoPath()
            .projection(projection);


        // ======================================
        // DIBUJAR PAÍSES
        // ======================================

        svg
            .append("g")
            .attr("class", "countries")
            .selectAll("path")
            .data(europe.features)
            .join("path")
            .attr("class", "country")
            .attr("d", path);


        // ======================================
        // CALCULAR POSICIONES
        // ======================================

        cities.forEach((city) => {

            const position = projection(city.coordinates);

            city.x = position[0];
            city.y = position[1];

        });


        // ======================================
        // DIBUJAR RECORRIDO
        // ======================================

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


        // ======================================
        // DIBUJAR PUNTOS
        // ======================================

        svg
            .selectAll(".city-point")
            .data(cities)
            .join("circle")
            .attr("class", "city-point")
            .attr("cx", city => city.x)
            .attr("cy", city => city.y)
            .attr("r", 6);


        // ======================================
        // POSICIONAR BOTONES HTML
        // ======================================

        cities.forEach((city) => {

            const button = document.getElementById(city.button);

            if (!button) {
                console.error(
                    "No se encontró el botón:",
                    city.button
                );

                return;
            }

            button.style.left = `${city.x}px`;
            button.style.top = `${city.y}px`;

        });


        console.log("Mapa, recorrido y ciudades preparados");

    })
    .catch((error) => {

        console.error("ERROR AL CARGAR EL MAPA:", error);

    });
