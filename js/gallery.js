// IKASBI 2026 — GALERÍAS INDEPENDIENTES POR CIUDAD

(() => {
    "use strict";

    if (window.__ikasbiGalleryInitialized) return;
    window.__ikasbiGalleryInitialized = true;

    const gallery = document.getElementById("gallery");
    const fileInput = document.getElementById("photo-file-input");

    const photoViewer = document.getElementById("photo-viewer");
    const viewerImage = document.getElementById("viewer-image");
    const closeViewer = document.getElementById("close-viewer");
    const previousPhoto = document.getElementById("previous-photo");
    const nextPhoto = document.getElementById("next-photo");
    const downloadPhoto = document.getElementById("download-photo");
    const photoCounter = document.getElementById("photo-counter");

    if (!gallery || !fileInput || !photoViewer || !viewerImage) {
        console.error("Faltan elementos de la galería en index.html.");
        return;
    }

    const STORAGE_KEY = "ikasbi2026-city-photos-v1";

    const cityNames = [
        "Tolosa",
        "Clermont-Ferrand",
        "Múnich",
        "Praga",
        "Berlín",
        "Ámsterdam",
        "Brujas",
        "París"
    ];

    // Cada ciudad tiene su propia lista.
    const photosByCity = Object.fromEntries(
        cityNames.map(city => [city, []])
    );

    let activeCity = null;
    let currentPhotoIndex = 0;

    function loadSavedPhotos() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (!saved) return;

            const parsed = JSON.parse(saved);

            cityNames.forEach(city => {
                if (Array.isArray(parsed[city])) {
                    photosByCity[city] = parsed[city].filter(photo =>
                        photo &&
                        typeof photo.original === "string" &&
                        typeof photo.fileName === "string"
                    );
                }
            });
        } catch (error) {
            console.warn("No se pudieron recuperar las fotos guardadas.", error);
        }
    }

    function savePhotos() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(photosByCity));
            return true;
        } catch (error) {
            console.error("No hay espacio suficiente para guardar las fotos en este navegador.", error);
            alert(
                "No se han podido guardar todas las fotos en este dispositivo. " +
                "Prueba con menos fotos o con archivos más pequeños."
            );
            return false;
        }
    }

    function getActivePhotos() {
        return activeCity ? photosByCity[activeCity] : [];
    }

    function renderCityGallery(cityName) {
        if (!cityNames.includes(cityName)) return;

        activeCity = cityName;
        gallery.replaceChildren();

        const addButton = document.createElement("button");
        addButton.type = "button";
        addButton.className = "gallery-add-button";
        addButton.textContent = "+";
        addButton.setAttribute("aria-label", `Añadir fotos a ${cityName}`);
        addButton.title = `Añadir fotos a ${cityName}`;

        addButton.addEventListener("click", () => {
            fileInput.click();
        });

        gallery.appendChild(addButton);

        photosByCity[cityName].forEach((photo, index) => {
            const photoButton = document.createElement("button");
            photoButton.type = "button";
            photoButton.className = "gallery-photo";
            photoButton.setAttribute(
                "aria-label",
                `Abrir foto ${index + 1} de ${cityName}`
            );

            const image = document.createElement("img");
            image.src = photo.original;
            image.alt = photo.fileName;
            image.loading = "lazy";
            image.decoding = "async";
            image.draggable = false;

            photoButton.appendChild(image);

            photoButton.addEventListener("click", () => {
                openPhoto(index);
            });

            gallery.appendChild(photoButton);
        });
    }

    function updateCounter() {
        const photos = getActivePhotos();

        if (photoCounter) {
            photoCounter.textContent = photos.length
                ? `${currentPhotoIndex + 1} / ${photos.length}`
                : "0 / 0";
        }
    }

    function showPhoto(index) {
        const photos = getActivePhotos();
        if (!photos.length) return;

        if (index < 0) index = photos.length - 1;
        if (index >= photos.length) index = 0;

        currentPhotoIndex = index;

        const photo = photos[currentPhotoIndex];
        viewerImage.src = photo.original;
        viewerImage.alt = photo.fileName;
        updateCounter();
    }

    function openPhoto(index) {
        showPhoto(index);
        photoViewer.classList.add("viewer-open");
        photoViewer.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
    }

    function closePhotoViewer() {
        photoViewer.classList.remove("viewer-open");
        photoViewer.setAttribute("aria-hidden", "true");
        viewerImage.removeAttribute("src");
        document.body.style.overflow = "";
    }

    function addSelectedPhotos(fileList) {
        if (!activeCity) {
            alert("Primero abre una ciudad para añadirle fotos.");
            return;
        }

        const files = Array.from(fileList || []).filter(file =>
            file.type.startsWith("image/")
        );

        if (!files.length) return;

        let pending = files.length;
        const addedPhotos = [];

        files.forEach(file => {
            const reader = new FileReader();

            reader.onload = () => {
                addedPhotos.push({
                    original: reader.result,
                    fileName: file.name || "foto-ikasbi.jpg"
                });

                pending--;

                if (pending === 0) {
                    photosByCity[activeCity].push(...addedPhotos);
                    savePhotos();
                    renderCityGallery(activeCity);
                }
            };

            reader.onerror = () => {
                pending--;
                console.error("No se pudo leer el archivo:", file.name);

                if (pending === 0 && addedPhotos.length) {
                    photosByCity[activeCity].push(...addedPhotos);
                    savePhotos();
                    renderCityGallery(activeCity);
                }
            };

            reader.readAsDataURL(file);
        });
    }

    function downloadCurrentPhoto() {
        const photos = getActivePhotos();
        const photo = photos[currentPhotoIndex];

        if (!photo) return;

        const link = document.createElement("a");
        link.href = photo.original;
        link.download = photo.fileName || "foto-ikasbi.jpg";
        document.body.appendChild(link);
        link.click();
        link.remove();
    }

    fileInput.addEventListener("change", event => {
        addSelectedPhotos(event.target.files);
        fileInput.value = "";
    });

    if (closeViewer) {
        closeViewer.addEventListener("click", closePhotoViewer);
    }

    if (previousPhoto) {
        previousPhoto.addEventListener("click", () => {
            showPhoto(currentPhotoIndex - 1);
        });
    }

    if (nextPhoto) {
        nextPhoto.addEventListener("click", () => {
            showPhoto(currentPhotoIndex + 1);
        });
    }

    if (downloadPhoto) {
        downloadPhoto.addEventListener("click", downloadCurrentPhoto);
    }

    photoViewer.addEventListener("click", event => {
        if (event.target === photoViewer) {
            closePhotoViewer();
        }
    });

    document.addEventListener("keydown", event => {
        if (!photoViewer.classList.contains("viewer-open")) return;

        if (event.key === "Escape") {
            closePhotoViewer();
        } else if (event.key === "ArrowLeft") {
            showPhoto(currentPhotoIndex - 1);
        } else if (event.key === "ArrowRight") {
            showPhoto(currentPhotoIndex + 1);
        }
    });

    loadSavedPhotos();

    // Funciones que app.js utiliza al abrir una ciudad.
    window.renderCityGallery = renderCityGallery;
    window.closePhotoViewer = closePhotoViewer;

    // No se abre ninguna ciudad automáticamente.
})();
