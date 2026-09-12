// IKASBI 2026 — MAPA DE EUROPA Y RECORRIDO

(() => {
    "use strict";

    const mapContainer = document.getElementById("map");

    if (!mapContainer || !window.d3) {
        console.error("No se encuentra el mapa o D3.");
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

    const svg = d3.select(mapContainer)
        .append("svg")
        .attr("role", "img")
        .attr("aria-label", "Mapa de Europa con el recorrido del viaje");

    const mapLayer = svg.append("g").attr("class", "countries");
    const routeLayer = svg.append("g").attr("class", "route-layer");
    const pointsLayer = svg.append("g").attr("class", "points-layer");

    let europeData = null;
    let resizeFrame = null;

    function drawMap() {
        if (!europeData) return;

        const width = Math.max(1, mapContainer.clientWidth);
        const height = Math.max(1, mapContainer.clientHeight);

        svg.attr("viewBox", `0 0 ${width} ${height}`);

        const projection = d3.geoMercator()
            .fitExtent(
                [[18, 18], [width - 18, height - 18]],
                europeData
            );

        const path = d3.geoPath().projection(projection);

        mapLayer.selectAll("path")
            .data(europeData.features || [])
            .join("path")
            .attr("class", "country")
            .attr("d", path);

        const projectedCities = cities.map(city => {
            const point = projection(city.coordinates);
            return { ...city, x: point[0], y: point[1] };
        });

        const controlPoint = projection([5.2, 51.0]);

        const routePoints = [
            ...projectedCities.slice(0, 6),
            { x: controlPoint[0], y: controlPoint[1] },
            ...projectedCities.slice(6)
        ];

        const routeLine = d3.line()
            .x(point => point.x)
            .y(point => point.y)
            .curve(d3.curveCatmullRom.alpha(0.5));

        routeLayer.selectAll("path")
            .data([routePoints])
            .join("path")
            .attr("class", "travel-route")
            .attr("d", routeLine);

        pointsLayer.selectAll("circle")
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
    }

    d3.json("./assets/map/europe.geojson")
        .then(data => {
            europeData = data;
            drawMap();
            console.log("Mapa de Europa cargado.");
        })
        .catch(error => {
            console.error("No se pudo cargar assets/map/europe.geojson:", error);
        });

    window.addEventListener("resize", () => {
        if (resizeFrame !== null) cancelAnimationFrame(resizeFrame);

        resizeFrame = requestAnimationFrame(() => {
            resizeFrame = null;
            drawMap();
        });
    });
})();
