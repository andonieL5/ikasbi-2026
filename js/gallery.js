// ==========================================
// ELEMENTOS DE LA INTERFAZ
// ==========================================

const gallery = document.getElementById("gallery");
const photoViewer = document.getElementById("photo-viewer");
const viewerImage = document.getElementById("viewer-image");
const closeViewerButton = document.getElementById("close-viewer");
const downloadButton = document.getElementById("download-photo");
const previousButton = document.getElementById("previous-photo");
const nextButton = document.getElementById("next-photo");
const photoCounter = document.getElementById("photo-counter");


// ==========================================
// FOTOS DE PRUEBA
// ==========================================

// Estas fotos son solo ejemplos.
// Más adelante las sustituiremos por fotos guardadas en Firebase.

const testPhotos = [
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1200&q=80"
];


// ==========================================
// FOTOS AÑADIDAS DESDE EL DISPOSITIVO
// ==========================================

// Se guardan temporalmente mientras la página está abierta.
// Al recargarla, estas fotos desaparecerán.
// Firebase permitirá guardarlas permanentemente más adelante.

const uploadedPhotosByCity = {};


// ==========================================
// SELECTOR DE ARCHIVOS
// ==========================================

const fileInput = document.createElement("input");

fileInput.type = "file";
fileInput.accept = "image/*";
fileInput.multiple = true;
fileInput.hidden = true;
fileInput.setAttribute("aria-label", "Seleccionar fotos");

document.body.appendChild(fileInput);


// ==========================================
// ESTADO DEL VISOR
// ==========================================

let currentCityName = null;
let currentPhotoIndex = 0;
let currentPhotos = [];


// ==========================================
// OBTENER FOTOS DE UNA CIUDAD
// ==========================================

function getPhotosForCity(cityName) {
    const uploadedPhotos = uploadedPhotosByCity[cityName] || [];

    return [
        ...testPhotos,
        ...uploadedPhotos
    ];
}


// ==========================================
// MOSTRAR GALERÍA DE UNA CIUDAD
// ==========================================

function renderCityGallery(cityName) {
    if (!gallery) {
        return;
    }

    currentCityName = cityName;
    currentPhotos = getPhotosForCity(cityName);

    gallery.innerHTML = "";

    // --------------------------------------
    // BOTÓN AÑADIR FOTOS
    // --------------------------------------

    const addButton = document.createElement("button");

    addButton.type = "button";
    addButton.className = "gallery-add-button";
    addButton.textContent = "+";
    addButton.setAttribute("aria-label", "Añadir fotos");

    // Importante para móviles:
    // abrir el selector directamente desde el toque del usuario.
    addButton.addEventListener("click", () => {
        fileInput.click();
    });

    gallery.appendChild(addButton);


    // --------------------------------------
    // MOSTRAR FOTOS
    // --------------------------------------

    currentPhotos.forEach((photoUrl, index) => {
        const image = document.createElement("img");

        image.src = photoUrl;
        image.alt = `Foto ${index + 1} de ${cityName}`;
        image.className = "gallery-photo";
        image.loading = "lazy";

        image.addEventListener("click", () => {
            openPhoto(index);
        });

        gallery.appendChild(image);
    });
}


// ==========================================
// CUANDO SE SELECCIONAN ARCHIVOS
// ==========================================

fileInput.addEventListener("change", () => {
    const selectedFiles = Array.from(fileInput.files || []);

    if (!selectedFiles.length || !currentCityName) {
        return;
    }

    if (!uploadedPhotosByCity[currentCityName]) {
        uploadedPhotosByCity[currentCityName] = [];
    }

    selectedFiles.forEach(file => {
        // Ignorar archivos que no sean imágenes.
        if (!file.type.startsWith("image/")) {
            return;
        }

        const imageUrl = URL.createObjectURL(file);

        uploadedPhotosByCity[currentCityName].push(imageUrl);
    });

    renderCityGallery(currentCityName);

    // Permite volver a seleccionar el mismo archivo.
    fileInput.value = "";
});


// ==========================================
// ABRIR VISOR DE FOTOS
// ==========================================

function openPhoto(index) {
    currentPhotos = getPhotosForCity(currentCityName);

    if (!currentPhotos.length) {
        return;
    }

    currentPhotoIndex = index;
    showPhoto();

    if (photoViewer) {
        photoViewer.classList.add("viewer-open");
        photoViewer.setAttribute("aria-hidden", "false");
    }

    document.body.style.overflow = "hidden";
}


// ==========================================
// MOSTRAR FOTO ACTUAL
// ==========================================

function showPhoto() {
    if (!viewerImage || !currentPhotos.length) {
        return;
    }

    viewerImage.src = currentPhotos[currentPhotoIndex];
    viewerImage.alt = `Foto ${currentPhotoIndex + 1}`;

    if (photoCounter) {
        photoCounter.textContent =
            `${currentPhotoIndex + 1} / ${currentPhotos.length}`;
    }
}


// ==========================================
// FOTO ANTERIOR
// ==========================================

function showPreviousPhoto() {
    if (!currentPhotos.length) {
        return;
    }

    currentPhotoIndex =
        (currentPhotoIndex - 1 + currentPhotos.length) %
        currentPhotos.length;

    showPhoto();
}


// ==========================================
// FOTO SIGUIENTE
// ==========================================

function showNextPhoto() {
    if (!currentPhotos.length) {
        return;
    }

    currentPhotoIndex =
        (currentPhotoIndex + 1) % currentPhotos.length;

    showPhoto();
}


// ==========================================
// CERRAR VISOR
// ==========================================

function closePhotoViewer() {
    if (photoViewer) {
        photoViewer.classList.remove("viewer-open");
        photoViewer.setAttribute("aria-hidden", "true");
    }

    if (viewerImage) {
        viewerImage.removeAttribute("src");
    }

    // Restaurar el desplazamiento normal de la página.
    document.body.style.overflow = "";
}


// ==========================================
// DESCARGAR FOTO
// ==========================================

function downloadCurrentPhoto() {
    if (!currentPhotos.length) {
        return;
    }

    const photoUrl = currentPhotos[currentPhotoIndex];

    const downloadLink = document.createElement("a");

    downloadLink.href = photoUrl;
    downloadLink.download = `foto-${currentPhotoIndex + 1}.jpg`;
    downloadLink.target = "_blank";
    downloadLink.rel = "noopener";

    document.body.appendChild(downloadLink);
    downloadLink.click();
    downloadLink.remove();
}


// ==========================================
// CONECTAR BOTONES DEL VISOR
// ==========================================

if (closeViewerButton) {
    closeViewerButton.addEventListener(
        "click",
        closePhotoViewer
    );
}

if (previousButton) {
    previousButton.addEventListener(
        "click",
        showPreviousPhoto
    );
}

if (nextButton) {
    nextButton.addEventListener(
        "click",
        showNextPhoto
    );
}

if (downloadButton) {
    downloadButton.addEventListener(
        "click",
        downloadCurrentPhoto
    );
}


// ==========================================
// TECLAS DEL VISOR
// ==========================================

document.addEventListener("keydown", event => {
    if (!photoViewer || !photoViewer.classList.contains("viewer-open")) {
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
// CONEXIÓN CON app.js
// ==========================================

// app.js llama a esta función cuando se abre una ciudad.

window.renderCityGallery = renderCityGallery;


// ==========================================
// INICIAR GALERÍA
// ==========================================

// Mostrar las fotos de la primera ciudad que se abra.
// No abrimos ningún panel automáticamente.
if (gallery) {
    renderCityGallery("París");
}
