// ==========================================
// GALERÍA DE FOTOS
// ==========================================

const gallery = document.getElementById("gallery");


// ==========================================
// FOTOS DE PRUEBA
// ==========================================

// De momento utilizamos imágenes de prueba.
// Más adelante estas imágenes vendrán
// directamente desde Firebase.

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
    // CREAR FOTOS
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

        }
    );

}


// ==========================================
// INICIAR GALERÍA
// ==========================================

renderGallery();
