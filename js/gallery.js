// ==========================================
// IKASBI 2026 — GALERÍA DESDE GITHUB
// ==========================================

(() => {
    "use strict";

    if (window.__ikasbiGalleryInitialized) return;
    window.__ikasbiGalleryInitialized = true;

    const gallery = document.getElementById("gallery");
    const photoViewer = document.getElementById("photo-viewer");
    const viewerImage = document.getElementById("viewer-image");
    const closeViewer = document.getElementById("close-viewer");
    const downloadPhoto = document.getElementById("download-photo");
    const previousPhoto = document.getElementById("previous-photo");
    const nextPhoto = document.getElementById("next-photo");
    const photoCounter = document.getElementById("photo-counter");

    if (!gallery || !photoViewer || !viewerImage) {
        console.error("Faltan elementos necesarios para la galería.");
        return;
    }

    // ==========================================
    // CONFIGURACIÓN DE GITHUB
    // ==========================================

    const GITHUB_USER = "andonieL5";
    const GITHUB_REPO = "ikasbi-2026";
    const GITHUB_BRANCH = "main";

    const GITHUB_API =
        `https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/contents/assets/assets/fotos`;

    const RAW_BASE =
        `https://raw.githubusercontent.com/${GITHUB_USER}/${GITHUB_REPO}/${GITHUB_BRANCH}/assets/assets/fotos`;

    // ==========================================
    // NOMBRES DE LAS CARPETAS
    // ==========================================

    const cityFolders = {
        "Tolosa": null,
        "Clermont-Ferrand": "clermont ferrand",
        "Múnich": "munich",
        "Praga": "praga",
        "Berlín": "berlin",
        "Ámsterdam": "amsterdam",
        "Brujas": "brujas",
        "París": "paris"
    };

    // ==========================================
    // ESTADO
    // ==========================================

    const photosByCity = new Map();

    let currentCity = null;
    let currentPhotoIndex = 0;

    // ==========================================
    // OBTENER FOTOS DE UNA CIUDAD
    // ==========================================

    async function loadCityPhotos(cityName) {

        if (photosByCity.has(cityName)) {
            return photosByCity.get(cityName);
        }

        const folder = cityFolders[cityName];

        // Tolosa no tiene fotos
        if (!folder) {
            photosByCity.set(cityName, []);
            return [];
        }

        try {

            const response = await fetch(
                `${GITHUB_API}/${encodeURIComponent(folder)}`
            );

            if (!response.ok) {
                throw new Error(
                    `GitHub respondió con ${response.status}`
                );
            }

            const files = await response.json();

            const photos = files
                .filter(file => {

                    if (file.type !== "file") return false;

                    const extension = file.name
                        .split(".")
                        .pop()
                        .toLowerCase();

                    return [
                        "jpg",
                        "jpeg",
                        "png",
                        "webp"
                    ].includes(extension);
                })
                .sort((a, b) =>
                    a.name.localeCompare(
                        b.name,
                        undefined,
                        {
                            numeric: true,
                            sensitivity: "base"
                        }
                    )
                )
                .map(file => ({

                    name: file.name,

                    url:
                        `${RAW_BASE}/${encodeURIComponent(folder)}/${encodeURIComponent(file.name)}`,

                    type: "image"

                }));

            photosByCity.set(cityName, photos);

            return photos;

        } catch (error) {

            console.error(
                `Error cargando las fotos de ${cityName}:`,
                error
            );

            photosByCity.set(cityName, []);

            return [];
        }
    }

    // ==========================================
    // GALERÍA
    // ==========================================

    async function renderCityGallery(cityName) {

        currentCity = cityName;

        gallery.replaceChildren();

        // Mensaje de carga

        const loadingMessage = document.createElement("p");

        loadingMessage.className = "gallery-empty";

        loadingMessage.textContent =
            "Cargando fotografías…";

        gallery.appendChild(loadingMessage);

        const photos = await loadCityPhotos(cityName);

        gallery.replaceChildren();

        // ==========================================
        // SIN FOTOS
        // ==========================================

        if (photos.length === 0) {

            const emptyMessage =
                document.createElement("p");

            emptyMessage.className = "gallery-empty";

            emptyMessage.textContent =
                cityName === "Tolosa"
                    ? "No hay fotografías disponibles para esta ciudad."
                    : "No se han encontrado fotografías.";

            gallery.appendChild(emptyMessage);

            return;
        }

        // ==========================================
        // CREAR MINIATURAS
        // ==========================================

        photos.forEach((photo, index) => {

            const photoButton =
                document.createElement("button");

            photoButton.type = "button";

            photoButton.className =
                "gallery-photo";

            photoButton.setAttribute(
                "aria-label",
                `Abrir fotografía ${index + 1}`
            );

            const image =
                document.createElement("img");

            image.src = photo.url;

            image.alt =
                `Fotografía ${index + 1} de ${cityName}`;

            image.loading = "lazy";

            image.decoding = "async";

            image.draggable = false;

            photoButton.appendChild(image);

            photoButton.addEventListener(
                "click",
                () => openPhoto(index)
            );

            gallery.appendChild(photoButton);
        });
    }

    // ==========================================
    // CONTADOR
    // ==========================================

    function updateCounter() {

        const photos =
            photosByCity.get(currentCity) || [];

        if (!photoCounter) return;

        if (photos.length > 0) {

            photoCounter.textContent =
                `${currentPhotoIndex + 1} / ${photos.length}`;

        } else {

            photoCounter.textContent =
                "0 / 0";
        }
    }

    // ==========================================
    // MOSTRAR FOTO
    // ==========================================

    function showPhoto(index) {

        const photos =
            photosByCity.get(currentCity) || [];

        if (!photos.length) return;

        if (index < 0) {
            index = photos.length - 1;
        }

        if (index >= photos.length) {
            index = 0;
        }

        currentPhotoIndex = index;

        const photo =
            photos[currentPhotoIndex];

        viewerImage.classList.add(
            "photo-changing"
        );

        viewerImage.src = photo.url;

        viewerImage.alt =
            `Fotografía ${currentPhotoIndex + 1} de ${currentCity}`;

        viewerImage.style.display =
            "block";

        const video =
            document.getElementById("viewer-video");

        if (video) {
            video.style.display = "none";
        }

        viewerImage.onload = () => {

            viewerImage.classList.remove(
                "photo-changing"
            );

        };

        viewerImage.onerror = () => {

            viewerImage.classList.remove(
                "photo-changing"
            );

            console.error(
                "No se pudo cargar:",
                photo.url
            );
        };

        updateCounter();
    }

    // ==========================================
    // ABRIR VISOR
    // ==========================================

    function openPhoto(index) {

        const photos =
            photosByCity.get(currentCity) || [];

        if (!photos.length) return;

        showPhoto(index);

        photoViewer.style.display =
            "flex";

        photoViewer.setAttribute(
            "aria-hidden",
            "false"
        );

        requestAnimationFrame(() => {

            photoViewer.classList.add(
                "viewer-open"
            );

        });

        document.body.style.overflow =
            "hidden";
    }

    // ==========================================
    // CERRAR VISOR
    // ==========================================

    function closePhotoViewer() {

        photoViewer.classList.remove(
            "viewer-open"
        );

        photoViewer.setAttribute(
            "aria-hidden",
            "true"
        );

        setTimeout(() => {

            if (
                !photoViewer.classList.contains(
                    "viewer-open"
                )
            ) {

                photoViewer.style.display =
                    "none";

                viewerImage.removeAttribute(
                    "src"
                );
            }

        }, 230);

        document.body.style.overflow =
            "";
    }

    // ==========================================
    // FOTO ANTERIOR
    // ==========================================

    function showPreviousPhoto() {

        showPhoto(
            currentPhotoIndex - 1
        );
    }

    // ==========================================
    // FOTO SIGUIENTE
    // ==========================================

    function showNextPhoto() {

        showPhoto(
            currentPhotoIndex + 1
        );
    }

    // ==========================================
    // DESCARGAR FOTO
    // ==========================================

    async function downloadCurrentPhoto() {

        const photos =
            photosByCity.get(currentCity) || [];

        const photo =
            photos[currentPhotoIndex];

        if (!photo) return;

        try {

            const response =
                await fetch(photo.url);

            const blob =
                await response.blob();

            const blobUrl =
                URL.createObjectURL(blob);

            const link =
                document.createElement("a");

            link.href = blobUrl;

            link.download =
                photo.name ||
                `ikasbi-2026-${currentCity}.jpg`;

            document.body.appendChild(link);

            link.click();

            link.remove();

            URL.revokeObjectURL(blobUrl);

        } catch (error) {

            console.error(
                "Error descargando la fotografía:",
                error
            );

            // Si el navegador bloquea la descarga,
            // abrimos la imagen directamente.

            window.open(
                photo.url,
                "_blank"
            );
        }
    }

    // ==========================================
    // EVENTOS
    // ==========================================

    if (closeViewer) {

        closeViewer.addEventListener(
            "click",
            closePhotoViewer
        );
    }

    if (previousPhoto) {

        previousPhoto.addEventListener(
            "click",
            showPreviousPhoto
        );
    }

    if (nextPhoto) {

        nextPhoto.addEventListener(
            "click",
            showNextPhoto
        );
    }

    if (downloadPhoto) {

        downloadPhoto.addEventListener(
            "click",
            downloadCurrentPhoto
        );
    }

    // ==========================================
    // CERRAR HACIENDO CLICK FUERA
    // ==========================================

    photoViewer.addEventListener(
        "click",
        event => {

            if (
                event.target === photoViewer
            ) {

                closePhotoViewer();
            }
        }
    );

    // ==========================================
    // TECLADO
    // ==========================================

    document.addEventListener(
        "keydown",
        event => {

            if (
                !photoViewer.classList.contains(
                    "viewer-open"
                )
            ) {
                return;
            }

            if (event.key === "Escape") {

                closePhotoViewer();

            } else if (
                event.key === "ArrowLeft"
            ) {

                showPreviousPhoto();

            } else if (
                event.key === "ArrowRight"
            ) {

                showNextPhoto();
            }
        }
    );

    // ==========================================
    // CONECTAR CON APP.JS
    // ==========================================

    window.renderCityGallery =
        renderCityGallery;

})();
