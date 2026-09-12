// IKASBI 2026 — PANEL DE CIUDADES

(() => {
    "use strict";

    const photoPanel = document.getElementById("photo-panel");
    const closePanel = document.getElementById("close-panel");
    const panelCity = document.getElementById("panel-city");

    let currentCity = null;

    function openCity(cityName) {
        if (!photoPanel || !panelCity) return;

        currentCity = cityName;
        panelCity.textContent = cityName;

        photoPanel.classList.add("panel-open");
        photoPanel.setAttribute("aria-hidden", "false");

        if (typeof window.renderCityGallery === "function") {
            window.renderCityGallery(cityName);
        }
    }

    function closeCityPanel() {
        if (!photoPanel) return;

        photoPanel.classList.remove("panel-open");
        photoPanel.setAttribute("aria-hidden", "true");
        currentCity = null;

        if (typeof window.closePhotoViewer === "function") {
            window.closePhotoViewer();
        }
    }

    document.querySelectorAll(".city-button").forEach(button => {
        button.addEventListener("click", () => {
            openCity(button.textContent.trim());
        });
    });

    if (closePanel) {
        closePanel.addEventListener("click", closeCityPanel);
    }

    document.addEventListener("keydown", event => {
        if (event.key === "Escape") {
            if (photoPanel && photoPanel.classList.contains("panel-open")) {
                closeCityPanel();
            }
        }
    });

    window.openCity = openCity;
    window.closeCityPanel = closeCityPanel;
    window.getActiveCityName = () => currentCity;
})();
