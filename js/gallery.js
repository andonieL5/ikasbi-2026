// ==========================================
// IKASBI 2026 — GALERÍA INDEPENDIENTE POR CIUDAD
// ==========================================

(() => {
    "use strict";

    if (window.__ikasbiGalleryInitialized) return;
    window.__ikasbiGalleryInitialized = true;

    const gallery = document.getElementById("gallery");
    const photoPanel = document.getElementById("photo-panel");
    const photoViewer = document.getElementById("photo-viewer");
    const viewerImage = document.getElementById("viewer-image");
    const closeViewer = document.getElementById("close-viewer");
    const downloadPhoto = document.getElementById("download-photo");
    const previousPhoto = document.getElementById("previous-photo");
    const nextPhoto = document.getElementById("next-photo");
    const photoCounter = document.getElementById("photo-counter");
    const addPhotoButton = document.getElementById("add-photo-button");

    if (!gallery || !photoViewer || !viewerImage) {
        console.error("Faltan elementos necesarios para la galería.");
        return;
    }

    /*
     * Cada ciudad tiene su propia lista.
     * Las fotos añadidas existen solo en memoria durante esta sesión.
     * Firebase se conectará después.
     */
    const photosByCity = new Map();

    let currentCity = null;
    let currentPhotoIndex = 0;
    let currentObjectUrl = null;

    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*,video/*";
    fileInput.multiple = true;
    fileInput.hidden = true;
    fileInput.setAttribute("aria-label", "Seleccionar fotos o vídeos");

    document.body.appendChild(fileInput);

    function getCityPhotos(cityName) {
        if (!photosByCity.has(cityName)) {
            photosByCity.set(cityName, []);
        }

        return photosByCity.get(cityName);
    }

    function revokeTemporaryUrls(photos) {
        photos.forEach(photo => {
            if (photo.objectUrl) {
                URL.revokeObjectURL(photo.objectUrl);
            }
        });
    }

    function openFilePicker() {
        if (!currentCity) return;
        fileInput.click();
    }

    function renderCityGallery(cityName) {
        currentCity = cityName;
        gallery.replaceChildren();

        const photos = getCityPhotos(cityName);

        const addButton = document.createElement("button");
        addButton.type = "button";
        addButton.className = "gallery-add-button";
        addButton.setAttribute("aria-label", `Añadir fotos o vídeos a ${cityName}`);

        const plus = document.createElement("span");
        plus.className = "add-symbol";
        plus.textContent = "+";

        const label = document.createElement("span");
        label.className = "add-label";
        label.textContent = "Añadir";

        addButton.append(plus, label);
        addButton.addEventListener("click", openFilePicker);
        gallery.appendChild(addButton);

        if (photos.length === 0) {
            const emptyMessage = document.createElement("p");
            emptyMessage.className = "gallery-empty";
            emptyMessage.textContent =
                `Todavía no has añadido fotos o vídeos a ${cityName}.`;
            gallery.appendChild(emptyMessage);
            return;
        }

        photos.forEach((photo, index) => {
            const photoButton = document.createElement("button");
            photoButton.type = "button";
            photoButton.className = "gallery-photo";
            photoButton.setAttribute(
                "aria-label",
                photo.type === "video"
                    ? `Abrir vídeo ${index + 1}`
                    : `Abrir fotografía ${index + 1}`
            );

            if (photo.type === "video") {
                const video = document.createElement("video");
                video.src = photo.url;
                video.muted = true;
                video.playsInline = true;
                video.preload = "metadata";
                video.setAttribute("aria-label", `Vídeo ${index + 1}`);
                photoButton.appendChild(video);
            } else {
                const image = document.createElement("img");
                image.src = photo.url;
                image.alt = `Fotografía ${index + 1} de ${cityName}`;
                image.loading = "lazy";
                image.decoding = "async";
                image.draggable = false;
                photoButton.appendChild(image);
            }

            photoButton.addEventListener("click", () => openPhoto(index));
            gallery.appendChild(photoButton);
        });
    }

    function updateCounter() {
        const photos = getCityPhotos(currentCity);

        if (photoCounter) {
            photoCounter.textContent =
                photos.length > 0
                    ? `${currentPhotoIndex + 1} / ${photos.length}`
                    : "0 / 0";
        }
    }

    function showPhoto(index) {
        const photos = getCityPhotos(currentCity);
        if (!photos.length) return;

        if (index < 0) index = photos.length - 1;
        if (index >= photos.length) index = 0;

        currentPhotoIndex = index;

        const photo = photos[currentPhotoIndex];

        if (currentObjectUrl) {
            URL.revokeObjectURL(currentObjectUrl);
            currentObjectUrl = null;
        }

        if (photo.type === "video") {
            viewerImage.style.display = "none";

            let video = document.getElementById("viewer-video");

            if (!video) {
                video = document.createElement("video");
                video.id = "viewer-video";
                video.controls = true;
                video.playsInline = true;
                video.className = "viewer-video";
                photoViewer.appendChild(video);
            }

            video.style.display = "block";
            video.src = photo.url;
            video.load();
        } else {
            const video = document.getElementById("viewer-video");

            if (video) {
                video.pause();
                video.removeAttribute("src");
                video.load();
                video.style.display = "none";
            }

            viewerImage.style.display = "block";
            viewerImage.classList.add("photo-changing");

            const image = new Image();

            image.onload = () => {
                viewerImage.src = photo.url;
                viewerImage.alt = `Fotografía ${currentPhotoIndex + 1} de ${currentCity}`;
                viewerImage.classList.remove("photo-changing");
            };

            image.onerror = () => {
                viewerImage.src = photo.url;
                viewerImage.classList.remove("photo-changing");
            };

            image.src = photo.url;
        }

        updateCounter();
    }

    function openPhoto(index) {
        if (!currentCity || !getCityPhotos(currentCity).length) return;

        showPhoto(index);

        photoViewer.style.display = "flex";
        photoViewer.setAttribute("aria-hidden", "false");

        requestAnimationFrame(() => {
            photoViewer.classList.add("viewer-open");
        });

        document.body.style.overflow = "hidden";
    }

    function closePhotoViewer() {
        photoViewer.classList.remove("viewer-open");
        photoViewer.setAttribute("aria-hidden", "true");

        const video = document.getElementById("viewer-video");
        if (video) {
            video.pause();
            video.removeAttribute("src");
            video.load();
            video.style.display = "none";
        }

        setTimeout(() => {
            if (!photoViewer.classList.contains("viewer-open")) {
                photoViewer.style.display = "none";
                viewerImage.removeAttribute("src");
                viewerImage.style.display = "block";
            }
        }, 230);

        document.body.style.overflow = "";
    }

    function showPreviousPhoto() {
        showPhoto(currentPhotoIndex - 1);
    }

    function showNextPhoto() {
        showPhoto(currentPhotoIndex + 1);
    }

    function downloadCurrentPhoto() {
        const photos = getCityPhotos(currentCity);
        const photo = photos[currentPhotoIndex];

        if (!photo) return;

        const link = document.createElement("a");
        link.href = photo.url;
        link.download = photo.name || `ikasbi-2026-${currentCity}`;
        link.rel = "noopener";
        document.body.appendChild(link);
        link.click();
        link.remove();
    }

    function addSelectedFiles(fileList) {
        if (!currentCity) return;

        const files = Array.from(fileList || []).filter(file =>
            file.type.startsWith("image/") ||
            file.type.startsWith("video/")
        );

        if (!files.length) return;

        const cityPhotos = getCityPhotos(currentCity);

        files.forEach(file => {
            const objectUrl = URL.createObjectURL(file);

            cityPhotos.push({
                url: objectUrl,
                objectUrl,
                name: file.name || `ikasbi-${currentCity}`,
                type: file.type.startsWith("video/") ? "video" : "image"
            });
        });

        renderCityGallery(currentCity);
    }

    fileInput.addEventListener("change", event => {
        addSelectedFiles(event.target.files);
        fileInput.value = "";
    });

    if (addPhotoButton) {
        addPhotoButton.addEventListener("click", openFilePicker);
    }

    if (closeViewer) closeViewer.addEventListener("click", closePhotoViewer);
    if (previousPhoto) previousPhoto.addEventListener("click", showPreviousPhoto);
    if (nextPhoto) nextPhoto.addEventListener("click", showNextPhoto);
    if (downloadPhoto) downloadPhoto.addEventListener("click", downloadCurrentPhoto);

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
            showPreviousPhoto();
        } else if (event.key === "ArrowRight") {
            showNextPhoto();
        }
    });

    // La galería se actualiza cuando app.js abre una ciudad.
    window.renderCityGallery = renderCityGallery;

    // Limpia las direcciones temporales al abandonar la página.
    window.addEventListener("beforeunload", () => {
        photosByCity.forEach(revokeTemporaryUrls);
    });
})();
