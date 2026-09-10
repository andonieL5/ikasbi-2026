// ==========================================
// CREAR RECORRIDO
// ==========================================

// Creamos los puntos del recorrido
// incluyendo un punto intermedio entre
// Ámsterdam y Brujas para mantener la ruta por tierra.

const routeCities = [
    cities[0], // Tolosa
    cities[1], // Clermont-Ferrand
    cities[2], // Múnich
    cities[3], // Praga
    cities[4], // Berlín
    cities[5], // Ámsterdam

    // Punto de control entre Ámsterdam y Brujas
    {
        x: projection([5.2, 51.0])[0],
        y: projection([5.2, 51.0])[1]
    },

    cities[6], // Brujas
    cities[7]  // París
];


const routeLine = d3
    .line()
    .x(city => city.x)
    .y(city => city.y)
    .curve(d3.curveCatmullRom.alpha(0.5));


const routePath = svg
    .append("path")
    .datum(routeCities)
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
