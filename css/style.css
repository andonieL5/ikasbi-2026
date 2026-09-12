// ==========================================
// IKASBI 2026 — GALERÍA DE FOTOS
// ==========================================


// ==========================================
// ELEMENTOS DE LA INTERFAZ
// ==========================================

const gallery = document.getElementById("gallery");

const photoViewer = document.getElementById("photo-viewer");
const viewerImage = document.getElementById("viewer-image");
const closeViewer = document.getElementById("close-viewer");
const downloadPhoto = document.getElementById("download-photo");
const previousPhoto = document.getElementById("previous-photo");
const nextPhoto = document.getElementById("next-photo");
const photoCounter = document.getElementById("photo-counter");


// ==========================================
// FOTOS DE PRUEBA
// ==========================================

const testPhotos = [
    "https://images.unsplash.com/photo-1500534623283-312aade485b7",
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
    "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
    "https://images.unsplash.com/photo-1470770841072-f978cf4d019e",
    "https://images.unsplash.com/photo-1493246507139-91e8fad9978e",
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
    "https://images.unsplash.com/photo-1469474968028-56623f02e42e",
    "https://images.unsplash.com/photo-1500534623283-312aade485b7",
    "https://images.unsplash.com/photo-1519681393784-d120267933ba",
    "https://images.unsplash.com/photo-1500534623283-312aade485b7",
    "https://images.unsplash.com/photo-1470770841072-f978cf4d019e"
];


// ==========================================
// LISTA DE FOTOS
// ==========================================

// Cada foto tendrá:
// - url: dirección de la imagen
// - downloadUrl: dirección para descargarla
// - fileName: nombre del archivo
// - objectUrl: indica si es una imagen local temporal

const photos = testPhotos.map((url, index) => ({
    url: `${url}?auto=format&fit=crop&w=800&q=80`,
    downloadUrl: `${url}?auto=format&fit=max&w=2400&q=95`,
    fileName: `ikasbi-2026-foto-${index + 1}.jpg`,
    objectUrl: false
}));


// ==========================================
// FOTO ACTUAL
// ==========================================

let currentPhotoIndex = 0;


// ==========================================
// CREAR BOTÓN PARA SUBIR FOTOS
// ==========================================

const fileInput = document.createElement("input");

fileInput.type = "file";
fileInput.accept = "image/*";
fileInput.multiple = true;
fileInput.hidden = true;

fileInput.setAttribute(
    "aria-label",
    "Seleccionar fotografías"
);

document.body.appendChild(fileInput);


// ==========================================
// MOSTRAR FOTO EN EL VISOR
// ==========================================

function showPhoto(index) {
    if (photos.length === 0) {
        return;
    }

    // Volver al final si se retrocede desde la primera foto.
    if (index < 0) {
        index = photos.length - 1;
    }

    // Volver al principio si se avanza desde la última foto.
    if (index >= photos.length) {
        index = 0;
    }

    currentPhotoIndex = index;

    const photo = photos[currentPhotoIndex];

    viewerImage.classList.add("photo-changing");

    setTimeout(() => {
        viewerImage.src = photo.url;

        photoCounter.textContent =
            `${currentPhotoIndex + 1} / ${photos.length}`;

        viewerImage.classList.remove("photo-changing");
    }, 120);
}


// ==========================================
// ABRIR VISOR
// ==========================================

function openPhoto(index) {
    showPhoto(index);

    photoViewer.style.display = "flex";

    requestAnimationFrame(() => {
        photoViewer.classList.add("viewer-open");
    });
}


// ==========================================
// CERRAR VISOR
// ==========================================

function closePhotoViewer() {
    photoViewer.classList.remove("viewer-open");

    setTimeout(() => {
        photoViewer.style.display = "none";
        viewerImage.src = "";
    }, 250);
}


// ==========================================
// FOTO ANTERIOR
// ==========================================

function showPreviousPhoto() {
    showPhoto(currentPhotoIndex - 1);
}


// ==========================================
// FOTO SIGUIENTE
// ==========================================

function showNextPhoto() {
    showPhoto(currentPhotoIndex + 1);
}


// ==========================================
// AÑADIR FOTOS SELECCIONADAS
// ==========================================

function addSelectedPhotos(files) {
    const imageFiles = Array.from(files).filter(file =>
        file.type.startsWith("image/")
    );

    if (imageFiles.length === 0) {
        return;
    }

    imageFiles.forEach(file => {
        const localUrl = URL.createObjectURL(file);

        photos.push({
            url: localUrl,
            downloadUrl: localUrl,
            fileName: file.name,
            objectUrl: true
        });
    });

    renderGallery();
}


// ==========================================
// CREAR GALERÍA
// ==========================================

function renderGallery() {
    gallery.innerHTML = "";

    // ---------- Botón + ----------

    const addButton = document.createElement("button");

    addButton.type = "button";
    addButton.className = "gallery-add-button";
    addButton.textContent = "+";

    addButton.setAttribute(
        "aria-label",
        "Añadir fotografías"
    );

    addButton.title = "Añadir fotografías";

    addButton.addEventListener("click", () => {
        fileInput.click();
    });

    // El botón + aparece primero en la galería.
    gallery.appendChild(addButton);


    // ---------- Fotos ----------

    photos.forEach((photo, index) => {
        const photoElement = document.createElement("button");

        photoElement.type = "button";
        photoElement.className = "gallery-photo";

        photoElement.setAttribute(
            "aria-label",
            `Abrir fotografía ${index + 1}`
        );

        const image = document.createElement("img");

        image.src = photo.url;
        image.alt = `Fotografía ${index + 1}`;
        image.loading = "lazy";
        image.draggable = false;

        photoElement.appendChild(image);

        photoElement.addEventListener("click", () => {
            openPhoto(index);
        });

        gallery.appendChild(photoElement);
    });
}


// ==========================================
// SELECCIONAR ARCHIVOS
// ==========================================

fileInput.addEventListener("change", event => {
    addSelectedPhotos(event.target.files);

    // Permite volver a seleccionar el mismo archivo.
    fileInput.value = "";
});


// ==========================================
// CERRAR VISOR
// ==========================================

closeViewer.addEventListener(
    "click",
    closePhotoViewer
);


// ==========================================
// FOTO ANTERIOR
// ==========================================

previousPhoto.addEventListener(
    "click",
    showPreviousPhoto
);


// ==========================================
// FOTO SIGUIENTE
// ==========================================

nextPhoto.addEventListener(
    "click",
    showNextPhoto
);


// ==========================================
// DESCARGAR FOTO
// ==========================================

downloadPhoto.addEventListener("click", () => {
    if (photos.length === 0) {
        return;
    }

    const photo = photos[currentPhotoIndex];

    const link = document.createElement("a");

    link.href = photo.downloadUrl;
    link.download = photo.fileName;
    link.target = "_blank";
    link.rel = "noopener";

    document.body.appendChild(link);
    link.click();
    link.remove();
});


// ==========================================
// CERRAR AL PULSAR FUERA DE LA FOTO
// ==========================================

photoViewer.addEventListener("click", event => {
    if (event.target === photoViewer) {
        closePhotoViewer();
    }
});


// ==========================================
// CONTROLES DE TECLADO
// ==========================================

document.addEventListener("keydown", event => {
    if (!photoViewer.classList.contains("viewer-open")) {
        return;
    }

    if (event.key === "Escape") {
        closePhotoViewer();
    }

    if (event.key === "ArrowLeft") {
        showPreviousPhoto();
    }

    if (event.key === "ArrowRight") {
        showNextPhoto();
    }
});


// ==========================================
// INICIAR GALERÍA
// ==========================================

renderGallery();
