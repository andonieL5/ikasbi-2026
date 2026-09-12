// ==========================================
// IKASBI 2026 — PANEL DE CIUDADES
// ==========================================

(() => {
    "use strict";

    const photoPanel = document.getElementById("photo-panel");
    const closePanel = document.getElementById("close-panel");
    const panelCity = document.getElementById("panel-city");

    if (!photoPanel || !closePanel || !panelCity) {
        console.error("Faltan elementos del panel de ciudades.");
        return;
    }

    let currentCity = null;

    function updateCityGallery(cityName) {
        window.activeCityName = cityName;

        if (typeof window.renderCityGallery === "function") {
            window.renderCityGallery(cityName);
        }
    }

    function openCity(cityName) {
        if (!cityName) return;

        currentCity = cityName;
        panelCity.textContent = cityName;

        updateCityGallery(cityName);

        photoPanel.classList.add("panel-open");
        photoPanel.setAttribute("aria-hidden", "false");

        document.querySelectorAll(".city-button").forEach(button => {
            const isActive = button.textContent.trim() === cityName;
            button.classList.toggle("city-active", isActive);
            button.setAttribute("aria-pressed", String(isActive));
        });
    }

    function closeCityPanel() {
        photoPanel.classList.remove("panel-open");
        photoPanel.setAttribute("aria-hidden", "true");

        currentCity = null;
        window.activeCityName = null;

        document.querySelectorAll(".city-button").forEach(button => {
            button.classList.remove("city-active");
            button.setAttribute("aria-pressed", "false");
        });
    }

    document.querySelectorAll(".city-button").forEach(button => {
        button.addEventListener("click", () => {
            openCity(button.textContent.trim());
        });

        button.setAttribute("aria-pressed", "false");
    });

    closePanel.addEventListener("click", closeCityPanel);

    document.addEventListener("keydown", event => {
        if (event.key === "Escape") {
            closeCityPanel();
        }
    });

    window.openCity = openCity;
    window.closeCityPanel = closeCityPanel;
})();
