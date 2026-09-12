// ==========================================
// IKASBI 2026 — MAPA DE EUROPA
// ==========================================

(() => {
    "use strict";

    const mapElement = document.getElementById("map");

    if (!mapElement || typeof d3 === "undefined") {
        console.error("No se encuentra el mapa o D3 no se ha cargado.");
        return;
    }

    const cities = [
        { name: "Tolosa", coordinates: [-2.079, 43.135], button: "city-tolosa" },
        { name: "Clermont-Ferrand", coordinates: [3.087, 45.777], button: "city-clermont" },
        { name: "Múnich", coordinates: [11.582, 48.135], button: "city-munich" },
        { name: "Praga", coordinates: [14.438, 50.075], button: "city-prague" },
        { name: "Berlín", coordinates: [13.405, 52.520], button: "city-berlin" },
        { name: "Ámsterdam", coordinates: [4.904, 52.368], button: "city-amsterdam" },
        { name: "Brujas", coordinates: [3.224, 51.209], button: "city-bruges" },
        { name: "París", coordinates: [2.352, 48.857], button: "city-paris" }
    ];

    const routeOrder = [
        "Tolosa",
        "Clermont-Ferrand",
        "Múnich",
        "Praga",
        "Berlín",
        "Ámsterdam",
        "Brujas",
        "París"
    ];

    const europeBounds = {
        west: -12,
        east: 32,
        south: 35,
        north: 72
    };

    let resizeObserver = null;
    let resizeTimer = null;

    function drawMap() {
        const width = mapElement.clientWidth;
        const height = mapElement.clientHeight;

        if (!width || !height) return;

        mapElement.querySelector("svg")?.remove();

        const svg = d3.select(mapElement)
            .append("svg")
            .attr("viewBox", `0 0 ${width} ${height}`)
            .attr("preserveAspectRatio", "xMidYMid meet")
            .attr("role", "img")
            .attr("aria-label", "Mapa de Europa con el recorrido del viaje");

        const geoBounds = {
            type: "Feature",
            geometry: {
                type: "Polygon",
                coordinates: [[
                    [europeBounds.west, europeBounds.south],
                    [europeBounds.east, europeBounds.south],
                    [europeBounds.east, europeBounds.north],
                    [europeBounds.west, europeBounds.north],
                    [europeBounds.west, europeBounds.south]
                ]]
            }
        };

        const projection = d3.geoMercator()
            .fitExtent(
                [
                    [width * 0.045, height * 0.12],
                    [width * 0.955, height * 0.93]
                ],
                geoBounds
            );

        const path = d3.geoPath().projection(projection);

        d3.json("./assets/map/europe.geojson")
            .then(europe => {
                // Si el usuario ha cambiado el tamaño mientras cargaba el mapa,
                // se vuelve a dibujar con las dimensiones actuales.
                if (
                    width !== mapElement.clientWidth ||
                    height !== mapElement.clientHeight
                ) {
                    drawMap();
                    return;
                }

                svg.append("g")
                    .attr("class", "countries")
                    .selectAll("path")
                    .data(europe.features || [])
                    .join("path")
                    .attr("class", "country")
                    .attr("d", path);

                const projectedCities = cities.map(city => {
                    const point = projection(city.coordinates);
                    return {
                        ...city,
                        x: point[0],
                        y: point[1]
                    };
                });

                const byName = new Map(
                    projectedCities.map(city => [city.name, city])
                );

                const routeCities = routeOrder
                    .map(name => byName.get(name))
                    .filter(Boolean);

                // Punto de control para que el tramo Ámsterdam–Brujas
                // pase por tierra, sin crear un botón adicional.
                const landControl = projection([5.2, 51.0]);

                const routePoints = routeCities.map(city => ({
                    x: city.x,
                    y: city.y
                }));

                if (routePoints.length >= 6) {
                    routePoints.splice(6, 0, {
                        x: landControl[0],
                        y: landControl[1]
                    });
                }

                const line = d3.line()
                    .x(point => point.x)
                    .y(point => point.y)
                    .curve(d3.curveCatmullRom.alpha(0.5));

                const routePath = svg.append("path")
                    .datum(routePoints)
                    .attr("class", "travel-route")
                    .attr("d", line);

                const routeLength = routePath.node().getTotalLength();

                routePath
                    .attr("stroke-dasharray", routeLength)
                    .attr("stroke-dashoffset", routeLength)
                    .transition()
                    .duration(1500)
                    .ease(d3.easeCubicInOut)
                    .attr("stroke-dashoffset", 0);

                svg.selectAll(".city-point")
                    .data(projectedCities)
                    .join("circle")
                    .attr("class", "city-point")
                    .attr("cx", city => city.x)
                    .attr("cy", city => city.y)
                    .attr("r", 5);

                projectedCities.forEach(city => {
                    const button = document.getElementById(city.button);
                    if (!button) return;

                    button.style.left = `${city.x}px`;
                    button.style.top = `${city.y}px`;
                    button.classList.add("city-visible");
                });
            })
            .catch(error => {
                console.error("No se pudo cargar assets/map/europe.geojson:", error);
            });
    }

    drawMap();

    if ("ResizeObserver" in window) {
        resizeObserver = new ResizeObserver(() => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(drawMap, 120);
        });

        resizeObserver.observe(mapElement);
    } else {
        window.addEventListener("resize", () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(drawMap, 150);
        });
    }
})();
