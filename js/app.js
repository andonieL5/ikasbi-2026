// ==========================================
// ELEMENTOS DE LA INTERFAZ
// ==========================================

const photoPanel = document.getElementById("photo-panel");
const closePanel = document.getElementById("close-panel");
const panelCity = document.getElementById("panel-city");


// ==========================================
// ABRIR PANEL DE UNA CIUDAD
// ==========================================

function openCity(cityName) {

    // Cambiar el título
    panelCity.textContent = cityName;

    // Abrir el panel
    photoPanel.classList.add("panel-open");

    console.log("Ciudad abierta:", cityName);
}


// ==========================================
// CERRAR PANEL
// ==========================================

function closeCityPanel() {

    photoPanel.classList.remove("panel-open");

    console.log("Panel cerrado");
}


// ==========================================
// PREPARAR BOTONES
// ==========================================

function setupCityButtons() {

    const cityButtons =
        document.querySelectorAll(".city-button");


    cityButtons.forEach(button => {

        button.addEventListener("click", () => {

            const cityName =
                button.textContent.trim();

            openCity(cityName);

        });

    });

}


// ==========================================
// BOTÓN DE CERRAR
// ==========================================

closePanel.addEventListener(
    "click",
    closeCityPanel
);


// ==========================================
// TECLA ESC
// ==========================================

document.addEventListener(
    "keydown",
    event => {

        if (event.key === "Escape") {

            closeCityPanel();

        }

    }
);


// ==========================================
// INICIAR
// ==========================================

setupCityButtons();
