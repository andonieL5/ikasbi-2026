// ==========================================
// ELEMENTOS DE LA INTERFAZ
// ==========================================

const photoPanel = document.getElementById("photo-panel");
const closePanel = document.getElementById("close-panel");
const panelCity = document.getElementById("panel-city");


// ==========================================
// CIUDAD ACTUAL
// ==========================================

let currentCity = null;


// ==========================================
// ACTUALIZAR LA GALERÍA
// ==========================================

function updateCityGallery(cityName) {
    // Guardar la ciudad activa para que otros scripts puedan consultarla
    window.activeCityName = cityName;

    // Si gallery.js ya está preparado, mostrar las fotos de esta ciudad
    if (typeof window.renderCityGallery === "function") {
        window.renderCityGallery(cityName);
    }
}


// ==========================================
// ABRIR PANEL DE UNA CIUDAD
// ==========================================

function openCity(cityName) {

    // Si ya estamos en esa ciudad,
    // no hacemos ninguna animación
    if (
        currentCity === cityName &&
        photoPanel.classList.contains("panel-open")
    ) {
        return;
    }


    // ==========================================
    // SI HAY OTRA CIUDAD ABIERTA
    // ==========================================

    if (
        currentCity !== null &&
        photoPanel.classList.contains("panel-open")
    ) {

        // Cerrar temporalmente el panel
        photoPanel.classList.remove("panel-open");


        // Esperar a que termine la animación
        setTimeout(() => {

            // Cambiar ciudad
            panelCity.textContent = cityName;
            currentCity = cityName;

            // Actualizar las fotos de la nueva ciudad
            updateCityGallery(cityName);

            // Volver a abrir
            photoPanel.classList.add("panel-open");

        }, 350);


        return;
    }


    // ==========================================
    // PRIMERA APERTURA
    // ==========================================

    panelCity.textContent = cityName;
    currentCity = cityName;

    // Actualizar las fotos de la ciudad
    updateCityGallery(cityName);

    // Abrir el panel
    photoPanel.classList.add("panel-open");


    console.log("Ciudad abierta:", cityName);
}


// ==========================================
// CERRAR PANEL
// ==========================================

function closeCityPanel() {

    photoPanel.classList.remove("panel-open");

    currentCity = null;
    window.activeCityName = null;


    console.log("Panel cerrado");
}


// ==========================================
// BOTONES DE LAS CIUDADES
// ==========================================

function setupCityButtons() {

    const cityButtons = document.querySelectorAll(".city-button");

    cityButtons.forEach(button => {

        button.addEventListener("click", () => {

            const cityName = button.textContent.trim();

            openCity(cityName);

        });

    });

}


// ==========================================
// BOTÓN CERRAR
// ==========================================

if (closePanel) {
    closePanel.addEventListener("click", closeCityPanel);
}


// ==========================================
// TECLA ESC
// ==========================================

document.addEventListener("keydown", event => {

    if (event.key === "Escape") {
        closeCityPanel();
    }

});


// ==========================================
// INICIAR
// ==========================================

setupCityButtons();
