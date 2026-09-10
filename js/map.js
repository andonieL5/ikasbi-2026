// ==========================================
// CONTENEDOR DEL MAPA
// ==========================================

const mapContainer = document.getElementById("map");

const width = mapContainer.clientWidth;
const height = mapContainer.clientHeight;


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

const svg = d3
    .select("#map")
    .append("svg")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("preserveAspectRatio", "xMidYMid meet");


// ==========================================
// CARGAR MAPA
// ==========================================

d3.json("./assets/map/europe.geojson")
    .then((europe) => {

        console.log("Mapa de Europa cargado correctamente.");


        // ==========================================
        // CREAR COLECCIÓN DE CIUDADES
        // ==========================================

        const cityFeatures = cities.map(city => ({
            type: "Feature",
            geometry: {
                type: "Point",
                coordinates: city.coordinates
            }
        }));


        const cityCollection = {
            type: "FeatureCollection",
            features: cityFeatures
        };


        // ==========================================
        // PROYECCIÓN
        // ==========================================

        const projection = d3
            .geoMercator()
            .fitExtent(
                [
                    [60, 80],
                    [width - 60, height - 80]
                ],
                cityCollection
            );


        // ==========================================
        // GENERADOR DE MAPA
        // ==========================================

        const path = d3
            .geoPath()
            .projection(projection);


        // ==========================================
        // DIBUJAR PAÍSES
        // ==========================================

        svg
            .append("g")
            .attr("class", "countries")
            .selectAll("path")
            .data(europe.features)
            .join("path")
            .attr("class", "country")
            .attr("d", path);


        // ==========================================
        // CALCULAR POSICIONES
        // ==========================================

        cities.forEach(city => {

            const [x, y] = projection(city.coordinates);

            city.x = x;
            city.y = y;

        });


        // ==========================================
        // CREAR RECORRIDO
        // ==========================================

        const routeLine = d3
            .line()
            .x(city => city.x)
            .y(city => city.y)
            .curve(d3.curveCatmullRom.alpha(0.5));


        const routePath = svg
            .append("path")
            .datum(cities)
            .attr("class", "travel-route")
            .attr("d", routeLine);


        // ==========================================
        // ANIMACIÓN DEL RECORRIDO
        // ==========================================

        const routeLength = routePath
            .node()
            .getTotalLength();


        routePath
            .attr("stroke-dasharray", routeLength)
            .attr("stroke-dashoffset", routeLength)
            .transition()
            .duration(2200)
            .ease(d3.easeCubicInOut)
            .attr("stroke-dashoffset", 0);


        // ==========================================
        // PUNTOS DE LAS CIUDADES
        // ==========================================

        const cityPoints = svg
            .selectAll(".city-point")
            .data(cities)
            .join("circle")
            .attr("class", "city-point")
            .attr("cx", city => city.x)
            .attr("cy", city => city.y)
            .attr("r", 0);


        // ==========================================
        // ANIMACIÓN DE LOS PUNTOS
        // ==========================================

        cityPoints
            .transition()
            .delay(1800)
            .duration(500)
            .attr("r", 6);


        // ==========================================
        // COLOCAR BOTONES
        // ==========================================

        cities.forEach(city => {

            const button = document.getElementById(city.button);

            if (!button) {
                console.error(
                    "No se encontró:",
                    city.button
                );

                return;
            }


            button.style.left = `${city.x}px`;
            button.style.top = `${city.y}px`;


            // Mostrar botón después de comenzar la ruta
            setTimeout(() => {

                button.classList.add("city-visible");

            }, 1900);

        });


        console.log("Ruta y ciudades preparadas.");

    })
    .catch(error => {

        console.error(
            "Error cargando el mapa:",
            error
        );

    });
