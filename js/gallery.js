// ==========================================
// IKASBI 2026 — GALERÍA DE FOTOS
// ==========================================

(() => {
    "use strict";

    // Evita inicializar el mismo script dos veces.
    if (window.__ikasbiGalleryInitialized) {
        return;
    }
    window.__ikasbiGalleryInitialized = true;

    // ==========================================
    // ELEMENTOS
    // ==========================================

    const gallery = document.getElementById("gallery");
    const photoViewer = document.getElementById("photo-viewer");
    const viewerImage = document.getElementById("viewer-image");
    const closeViewer = document.getElementById("close-viewer");
    const downloadPhoto = document.getElementById("download-photo");
    const previousPhoto = document.getElementById("previous-photo");
    const nextPhoto = document.getElementById("next-photo");
    const photoCounter = document.getElementById("photo-counter");

    // Si falta algún elemento principal, evita que la página se rompa.
    if (!gallery) {
        console.error('No se encontró el elemento con id="gallery".');
        return;
    }

    // ==========================================
    // FOTOS DE PRUEBA
    // ==========================================

    // "original" se usa en el visor.
    // "preview" se usa en las miniaturas.
    const testPhotos = [
        "https://images.unsplash.com/photo-1500534623283-312aade485b7",
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
        "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
        "https://images.unsplash.com/photo-1470770841072-f978cf4d019e",
        "https://images.unsplash.com/photo-1493246507139-91e8fad9978e",
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
        "https://images.unsplash.com/photo-1469474968028-56623f02e42e",
        "https://images.unsplash.com/photo-1519681393784-d120267933ba",
        "https://images.unsplash.com/photo-1500534623283-312aade485b7",
        "https://images.unsplash.com/photo-1470770841072-f978cf4d019e",
        "https://images.unsplash.com/photo-1501785888041-af3ef285b470"
    ];

    const photos = testPhotos.map((url, index) => ({
        original: url,
        preview: `${url}?auto=format&fit=max&w=700&q=75`,
        fileName: `ikasbi-2026-foto-${index + 1}.jpg`,
        temporaryObjectUrl: false
    }));

    let currentPhotoIndex = 0;

    // ==========================================
    // SELECTOR DE ARCHIVOS
    // ==========================================

    const fileInput = document.createElement("input");

    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.multiple = true;
    fileInput.hidden = true;
    fileInput.setAttribute("aria-label", "Seleccionar fotografías");

    document.body.appendChild(fileInput);

    // ==========================================
    // ACTUALIZAR CONTADOR
    // ==========================================

    function updateCounter() {
        if (photoCounter) {
            photoCounter.textContent =
                `${currentPhotoIndex + 1} / ${photos.length}`;
        }
    }

    // ==========================================
    // MOSTRAR FOTO EN EL VISOR
    // ==========================================

    function showPhoto(index) {
        if (!viewerImage || photos.length === 0) {
            return;
        }

        if (index < 0) {
            index = photos.length - 1;
        }

        if (index >= photos.length) {
            index = 0;
        }

        currentPhotoIndex = index;

        const photo = photos[currentPhotoIndex];

        viewerImage.classList.add("photo-changing");

        // Carga la imagen original, no la miniatura.
        const originalImage = new Image();

        originalImage.onload = () => {
            viewerImage.src = photo.original;
            viewerImage.alt = `Fotografía ${currentPhotoIndex + 1}`;
            viewerImage.classList.remove("photo-changing");
            updateCounter();
        };

        originalImage.onerror = () => {
            // Si la original falla, intenta mostrar la versión de miniatura.
            viewerImage.src = photo.preview;
            viewerImage.alt = `Fotografía ${currentPhotoIndex + 1}`;
            viewerImage.classList.remove("photo-changing");
            updateCounter();
        };

        originalImage.src = photo.original;
    }

    // ==========================================
    // ABRIR VISOR
    // ==========================================

    function openPhoto(index) {
        if (!photoViewer || !viewerImage) {
            console.error(
                'Falta photo-viewer o viewer-image en el HTML.'
            );
            return;
        }

        showPhoto(index);

        photoViewer.style.display = "flex";

        requestAnimationFrame(() => {
            photoViewer.classList.add("viewer-open");
        });

        document.body.style.overflow = "hidden";
    }

    // ==========================================
    // CERRAR VISOR
    // ==========================================

    function closePhotoViewer() {
        if (!photoViewer) {
            return;
        }

        photoViewer.classList.remove("viewer-open");

        setTimeout(() => {
            photoViewer.style.display = "none";

            if (viewerImage) {
                viewerImage.removeAttribute("src");
            }

            document.body.style.overflow = "";
        }, 220);
    }

    // ==========================================
    // ANTERIOR / SIGUIENTE
    // ==========================================

    function showPreviousPhoto() {
        showPhoto(currentPhotoIndex - 1);
    }

    function showNextPhoto() {
        showPhoto(currentPhotoIndex + 1);
    }

    // ==========================================
    // DESCARGAR FOTO
    // ==========================================

    function downloadCurrentPhoto() {
        if (photos.length === 0) {
            return;
        }

        const photo = photos[currentPhotoIndex];
        const link = document.createElement("a");

        link.href = photo.original;
        link.download = photo.fileName;
        link.target = "_blank";
        link.rel = "noopener";

        document.body.appendChild(link);
        link.click();
        link.remove();
    }

    // ==========================================
    // AÑADIR FOTOS DESDE EL DISPOSITIVO
    // ==========================================

    function addSelectedPhotos(fileList) {
        const files = Array.from(fileList || []).filter(file =>
            file.type.startsWith("image/")
        );

        if (files.length === 0) {
            return;
        }

        files.forEach(file => {
            const localUrl = URL.createObjectURL(file);

            photos.push({
                original: localUrl,
                preview: localUrl,
                fileName: file.name || "foto-ikasbi.jpg",
                temporaryObjectUrl: true
            });
        });

        renderGallery();
    }

    // ==========================================
    // DIBUJAR GALERÍA
    // ==========================================

    function renderGallery() {
        gallery.replaceChildren();

        // Botón para añadir fotos.
        const addButton = document.createElement("button");

        addButton.type = "button";
        addButton.className = "gallery-add-button";
        addButton.textContent = "+";
        addButton.title = "Añadir fotografías";
        addButton.setAttribute("aria-label", "Añadir fotografías");

        addButton.addEventListener("click", () => {
            fileInput.click();
        });

        gallery.appendChild(addButton);

        // Una foto = un botón = una celda de la cuadrícula.
        photos.forEach((photo, index) => {
            const photoButton = document.createElement("button");

            photoButton.type = "button";
            photoButton.className = "gallery-photo";
            photoButton.setAttribute(
                "aria-label",
                `Abrir fotografía ${index + 1}`
            );

            const image = document.createElement("img");

            image.src = photo.preview;
            image.alt = `Fotografía ${index + 1}`;
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

    // ==========================================
    // EVENTOS
    // ==========================================

    fileInput.addEventListener("change", event => {
        addSelectedPhotos(event.target.files);

        // Permite volver a seleccionar el mismo archivo.
        fileInput.value = "";
    });

    if (closeViewer) {
        closeViewer.addEventListener("click", closePhotoViewer);
    }

    if (previousPhoto) {
        previousPhoto.addEventListener("click", showPreviousPhoto);
    }

    if (nextPhoto) {
        nextPhoto.addEventListener("click", showNextPhoto);
    }

    if (downloadPhoto) {
        downloadPhoto.addEventListener("click", downloadCurrentPhoto);
    }

    // Cerrar al tocar el fondo oscuro, no la foto.
    if (photoViewer) {
        photoViewer.addEventListener("click", event => {
            if (event.target === photoViewer) {
                closePhotoViewer();
            }
        });
    }

    // Teclado: Escape, flecha izquierda y flecha derecha.
    document.addEventListener("keydown", event => {
        if (
            !photoViewer ||
            !photoViewer.classList.contains("viewer-open")
        ) {
            return;
        }

        if (event.key === "Escape") {
            closePhotoViewer();
        } else if (event.key === "ArrowLeft") {
            showPreviousPhoto();
        } else if (event.key === "ArrowRight") {
            showNextPhoto();
        }
    });

    // ==========================================
    // INICIAR
    // ==========================================

    renderGallery();
})();
