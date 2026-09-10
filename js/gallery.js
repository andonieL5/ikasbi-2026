// ==========================================
// GALERÍA DE FOTOS
// ==========================================

const gallery = document.getElementById("gallery");


// ==========================================
// VISOR DE FOTOS
// ==========================================

const photoViewer =
    document.getElementById("photo-viewer");

const viewerImage =
    document.getElementById("viewer-image");

const closeViewer =
    document.getElementById("close-viewer");

const downloadPhoto =
    document.getElementById("download-photo");


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
// ABRIR VISOR
// ==========================================

function openPhoto(photoUrl) {

    viewerImage.src =
        `${photoUrl}?auto=format&fit=max&w=1800&q=90`;

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

    document.body.style.overflow = "hidden";
}


// ==========================================
// CREAR GALERÍA
// ==========================================

function renderGallery() {

    gallery.innerHTML = "";


    // ==========================================
    // BOTÓN +
    // ==========================================

    const addButton =
        document.createElement("button");

    addButton.className =
        "gallery-add-button";

    addButton.innerHTML = "+";

    addButton.setAttribute(
        "aria-label",
        "Añadir fotografías"
    );

    gallery.appendChild(addButton);


    // ==========================================
    // FOTOS
    // ==========================================

    testPhotos.forEach(
        (photo, index) => {

            const photoElement =
                document.createElement("button");

            photoElement.className =
                "gallery-photo";

            photoElement.setAttribute(
                "aria-label",
                `Abrir fotografía ${index + 1}`
            );


            const image =
                document.createElement("img");

            image.src =
                `${photo}?auto=format&fit=crop&w=800&q=80`;

            image.alt =
                `Fotografía ${index + 1}`;


            photoElement.appendChild(image);

            gallery.appendChild(photoElement);


            // ==========================================
            // ABRIR FOTO AL HACER CLICK
            // ==========================================

            photoElement.addEventListener(
                "click",
                () => {

                    openPhoto(photo);

                }
            );

        }
    );
}


// ==========================================
// CERRAR CON BOTÓN X
// ==========================================

closeViewer.addEventListener(
    "click",
    closePhotoViewer
);


// ==========================================
// DESCARGAR FOTO
// ==========================================

downloadPhoto.addEventListener(
    "click",
    () => {

        if (!viewerImage.src) {
            return;
        }

        const link =
            document.createElement("a");

        link.href =
            viewerImage.src;

        link.download =
            "ikasbi-2026-foto.jpg";

        link.target =
            "_blank";

        link.click();

    }
);


// ==========================================
// CERRAR AL PULSAR FUERA
// ==========================================

photoViewer.addEventListener(
    "click",
    (event) => {

        if (
            event.target === photoViewer
        ) {

            closePhotoViewer();

        }

    }
);


// ==========================================
// CERRAR CON ESC
// ==========================================

document.addEventListener(
    "keydown",
    (event) => {

        if (
            event.key === "Escape" &&
            photoViewer.classList.contains(
                "viewer-open"
            )
        ) {

            closePhotoViewer();

        }

    }
);


// ==========================================
// INICIAR GALERÍA
// ==========================================

renderGallery();
