// ==========================================
// ELEMENTOS DE LA INTERFAZ
// ==========================================

const photoPanel = document.getElementById("photo-panel");
const closePanel = document.getElementById("close-panel");
const panelCity = document.getElementById("panel-city");


// ==========================================
// CIUDADES
// ==========================================

const cityButtons = document.querySelectorAll(".city-button");


// ==========================================
// ABRIR PANEL DE UNA CIUDAD
// ==========================================

function openCity(cityName) {

    // Cambiar el nombre de la ciudad
    panelCity.textContent = cityName;


    // Abrir el panel
    photoPanel.classList.add("panel-open");


    console.log(
        "Panel abierto:",
        cityName
    );
}


// ==========================================
// CERRAR PANEL
// ==========================================

function closeCityPanel() {

    photoPanel.classList.remove(
        "panel-open"
    );


    console.log(
        "Panel cerrado."
    );
}


// ==========================================
// BOTONES DE LAS CIUDADES
// ==========================================

cityButtons.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            // Obtener el nombre de la ciudad
            const cityName =
                button.textContent.trim();


            // Abrir/cambiar el panel
            openCity(cityName);

        }
    );

});


// ==========================================
// BOTÓN CERRAR
// ==========================================

closePanel.addEventListener(
    "click",
    closeCityPanel
);


// ==========================================
// CERRAR CON ESC
// ==========================================

document.addEventListener(
    "keydown",
    event => {

        if (event.key === "Escape") {

            closeCityPanel();

        }

    }
);
