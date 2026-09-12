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
    // CARPETAS DE LAS CIUDADES
    // ==========================================

    // IMPORTANTE:
    // Las claves tienen que coincidir EXACTAMENTE
    // con los nombres visibles de los botones del HTML.

    const cityFolders = {
        "Tolosa": null,
        "Clermont-Ferrand": "clermont ferrand",
        "Munich": "munich",
        "Praga": "praga",
        "Berlin": "berlin",
        "Amsterdam": "amsterdam",
        "Brujas": "brujas",
        "Paris": "paris"
    };

    const photosByCity = new Map();

    let currentCity = null;
    let currentPhotoIndex = 0;

    // ==========================================
    // CARGAR FOTOS DE UNA CIUDAD
    // ==========================================

    async function loadCityPhotos(cityName) {

        if (photosByCity.has(cityName)) {
            return photosByCity.get(cityName);
        }

        const folder = cityFolders[cityName];

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

                    if (file.type !== "file") {
                        return false;
                    }

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
    // MOSTRAR GALERÍA
    // ==========================================

    async function renderCityGallery(cityName) {

        currentCity = cityName;

        gallery.replaceChildren();

        const loadingMessage =
            document.createElement("p");

        loadingMessage.className =
            "gallery-empty";

        loadingMessage.textContent =
            "Argazkiak kargatzen…";

        gallery.appendChild(loadingMessage);

        const photos =
            await loadCityPhotos(cityName);

        gallery.replaceChildren();

        if (photos.length === 0) {

            const emptyMessage =
                document.createElement("p");

            emptyMessage.className =
                "gallery-empty";

            emptyMessage.textContent =
                cityName === "Tolosa"
                    ? "Ez dago argazkirik hiri honetarako."
                    : "Ez da argazkirik aurkitu.";

            gallery.appendChild(emptyMessage);

            return;
        }

        photos.forEach((photo, index) => {

            const photoButton =
                document.createElement("button");

            photoButton.type =
                "button";

            photoButton.className =
                "gallery-photo";

            photoButton.setAttribute(
                "aria-label",
                `${index + 1}. argazkia ireki`
            );

            const image =
                document.createElement("img");

            image.src =
                photo.url;

            image.alt =
                `${cityName} - ${index + 1}. argazkia`;

            image.loading =
                "lazy";

            image.decoding =
                "async";

            image.draggable =
                false;

            photoButton.appendChild(
                image
            );

            photoButton.addEventListener(
                "click",
                () => openPhoto(index)
            );

            gallery.appendChild(
                photoButton
            );
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
    // MOSTRAR UNA FOTO
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

        currentPhotoIndex =
            index;

        const photo =
            photos[currentPhotoIndex];

        viewerImage.classList.add(
            "photo-changing"
        );

        viewerImage.src =
            photo.url;

        viewerImage.alt =
            `${currentCity} - ${currentPhotoIndex + 1}. argazkia`;

        viewerImage.style.display =
            "block";

        const video =
            document.getElementById("viewer-video");

        if (video) {
            video.style.display =
                "none";
        }

        viewerImage.onload =
            () => {

                viewerImage.classList.remove(
                    "photo-changing"
                );

            };

        viewerImage.onerror =
            () => {

                viewerImage.classList.remove(
                    "photo-changing"
                );

                console.error(
                    "Ezin izan da argazkia kargatu:",
                    photo.url
                );
            };

        updateCounter();
    }

    // ==========================================
    // ABRIR FOTO
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
    // CERRAR FOTO
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
    // DESCARGAR FOTO DIRECTAMENTE
    // ==========================================

    async function downloadCurrentPhoto() {

        const photos =
            photosByCity.get(currentCity) || [];

        const photo =
            photos[currentPhotoIndex];

        if (!photo) return;

        try {

            // Descargamos el archivo real
            // desde GitHub.

            const response =
                await fetch(photo.url);

            if (!response.ok) {
                throw new Error(
                    `Error HTTP ${response.status}`
                );
            }

            const blob =
                await response.blob();

            // Creamos una URL temporal
            // para descargar el archivo.

            const blobUrl =
                URL.createObjectURL(blob);

            const link =
                document.createElement("a");

            link.href =
                blobUrl;

            link.download =
                photo.name ||
                `ikasbi-2026-${currentCity}.jpg`;

            document.body.appendChild(
                link
            );

            link.click();

            link.remove();

            // Liberamos la URL temporal.

            setTimeout(() => {
                URL.revokeObjectURL(blobUrl);
            }, 1000);

        } catch (error) {

            console.error(
                "Errorea argazkia deskargatzean:",
                error
            );

            // Si el navegador bloquea la descarga
            // directa, abrimos la imagen como
            // último recurso.

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

    // Cerrar haciendo clic en el fondo.

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
    // FUNCIÓN PÚBLICA
    // ==========================================

    window.renderCityGallery =
        renderCityGallery;

})();
