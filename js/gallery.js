// ==========================================
// GALERÍA IKASBI 2026
// Selector de archivos y fotos de prueba
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
// Se retirarán cuando conectemos Firebase
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
    "https://images.unsplash.com/photo-1519681393784-d120267933ba"
];

// ==========================================
// FOTOS AÑADIDAS DESDE EL DISPOSITIVO
// Se guardan temporalmente en memoria
// ==========================================

const uploadedPhotosByCity = {};

let currentCityName = "París";
let currentPhotos = [];
let currentPhotoIndex = 0;

// Selector de archivos creado por JavaScript
const fileInput = document.createElement("input");

fileInput.type = "file";
fileInput.accept = "image/*";
fileInput.multiple = true;
fileInput.hidden = true;

document.body.appendChild(fileInput);

// ==========================================
// OBTENER FOTOS DE LA CIUDAD
// ==========================================

function getPhotosForCity(cityName) {
    const uploadedPhotos = uploadedPhotosByCity[cityName] || [];

    // Por ahora mostramos las fotos de prueba
    // y las fotos que hayas elegido para esta ciudad.
    return [
        ...testPhotos.map((url) => ({
            src: `${url}?auto=format&fit=crop&w=800&q=80`,
            fullSrc: `${url}?auto=format&fit=max&w=1800&q=90`,
            name: "Foto de prueba",
            isUploaded: false
        })),
        ...uploadedPhotos
    ];
}

// ==========================================
// ABRIR EL SELECTOR DE ARCHIVOS
// ==========================================

function openFilePicker() {
    if (!currentCityName) {
        alert("Primero abre una ciudad del mapa.");
        return;
    }

    fileInput.value = "";
    fileInput.click();
}

// ==========================================
// AÑADIR ARCHIVOS SELECCIONADOS
// ==========================================

fileInput.addEventListener("change", () => {
    const files = Array.from(fileInput.files || []);

    if (files.length === 0) {
        return;
    }

    const imageFiles = files.filter((file) =>
        file.type.startsWith("image/")
    );

    if (imageFiles.length === 0) {
        alert("Selecciona archivos de imagen.");
        return;
    }

    if (!uploadedPhotosByCity[currentCityName]) {
        uploadedPhotosByCity[currentCityName] = [];
    }

    imageFiles.forEach((file) => {
        const temporaryUrl = URL.createObjectURL(file);

        uploadedPhotosByCity[currentCityName].push({
            src: temporaryUrl,
            fullSrc: temporaryUrl,
            name: file.name,
            isUploaded: true
        });
    });

    renderCityGallery(currentCityName);
});

// ==========================================
// MOSTRAR GALERÍA DE UNA CIUDAD
// ==========================================

function renderCityGallery(cityName) {
    currentCityName = cityName;
    currentPhotos = getPhotosForCity(cityName);

    gallery.innerHTML = "";

    // Botón +
    const addButton = document.createElement("button");

    addButton.className = "gallery-add-button";
    addButton.type = "button";
    addButton.textContent = "+";
    addButton.setAttribute("aria-label", `Añadir fotos de ${cityName}`);

    addButton.addEventListener("click", openFilePicker);

    gallery.appendChild(addButton);

    // Fotos
    currentPhotos.forEach((photo, index) => {
        const photoButton = document.createElement("button");

        photoButton.className = "gallery-photo";
        photoButton.type = "button";
        photoButton.setAttribute(
            "aria-label",
            `Abrir fotografía ${index + 1}`
        );

        const image = document.createElement("img");

        image.src = photo.src;
        image.alt = photo.name || `Fotografía ${index + 1}`;

        photoButton.appendChild(image);

        photoButton.addEventListener("click", () => {
            openPhoto(index);
        });

        gallery.appendChild(photoButton);
    });
}

// Permite que app.js cambie la galería al abrir otra ciudad.
window.renderCityGallery = renderCityGallery;

// ==========================================
// MOSTRAR FOTO EN GRANDE
// ==========================================

function showPhoto(index) {
    if (currentPhotos.length === 0) {
        return;
    }

    if (index < 0) {
        index = currentPhotos.length - 1;
    }

    if (index >= currentPhotos.length) {
        index = 0;
    }

    currentPhotoIndex = index;

    const photo = currentPhotos[currentPhotoIndex];

    viewerImage.classList.add("photo-changing");

    setTimeout(() => {
        viewerImage.src = photo.fullSrc;

        photoCounter.textContent =
            `${currentPhotoIndex + 1} / ${currentPhotos.length}`;

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

    document.body.style.overflow = "hidden";
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

    // La página ya está limitada por #app;
    // no bloqueamos el desplazamiento aquí.
    document.body.style.overflow = "";
}

// ==========================================
// FOTO ANTERIOR / SIGUIENTE
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

downloadPhoto.addEventListener("click", () => {
    const photo = currentPhotos[currentPhotoIndex];

    if (!photo) {
        return;
    }

    const link = document.createElement("a");

    link.href = photo.fullSrc;
    link.download =
        photo.name || `ikasbi-2026-foto-${currentPhotoIndex + 1}.jpg`;

    link.target = "_blank";
    link.click();
});

// ==========================================
// BOTONES DEL VISOR
// ==========================================

closeViewer.addEventListener("click", closePhotoViewer);
previousPhoto.addEventListener("click", showPreviousPhoto);
nextPhoto.addEventListener("click", showNextPhoto);

// Cerrar al pulsar fuera de la fotografía
photoViewer.addEventListener("click", (event) => {
    if (event.target === photoViewer) {
        closePhotoViewer();
    }
});

// Teclado
document.addEventListener("keydown", (event) => {
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
// INICIAR
// ==========================================

renderCityGallery("París");
