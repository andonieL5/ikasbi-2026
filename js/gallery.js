// ==========================================
// GALERÍA
// ==========================================

const gallery =
    document.getElementById("gallery");


// ==========================================
// VISOR
// ==========================================

const photoViewer =
    document.getElementById("photo-viewer");

const viewerImage =
    document.getElementById("viewer-image");

const closeViewer =
    document.getElementById("close-viewer");

const downloadPhoto =
    document.getElementById("download-photo");

const previousPhoto =
    document.getElementById("previous-photo");

const nextPhoto =
    document.getElementById("next-photo");

const photoCounter =
    document.getElementById("photo-counter");


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
// FOTO ACTUAL
// ==========================================

let currentPhotoIndex = 0;


// ==========================================
// MOSTRAR FOTO
// ==========================================

function showPhoto(index) {

    if (index < 0) {

        index =
            testPhotos.length - 1;

    }


    if (
        index >= testPhotos.length
    ) {

        index = 0;

    }


    currentPhotoIndex = index;


    const photo =
        testPhotos[currentPhotoIndex];


    // Animación

    viewerImage.classList.add(
        "photo-changing"
    );


    setTimeout(() => {

        viewerImage.src =
            `${photo}?auto=format&fit=max&w=1800&q=90`;


        photoCounter.textContent =
            `${currentPhotoIndex + 1} / ${testPhotos.length}`;


        viewerImage.classList.remove(
            "photo-changing"
        );

    }, 120);

}


// ==========================================
// ABRIR VISOR
// ==========================================

function openPhoto(index) {

    showPhoto(index);


    photoViewer.style.display =
        "flex";


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


    setTimeout(() => {

        photoViewer.style.display =
            "none";

        viewerImage.src = "";

    }, 250);


    document.body.style.overflow =
        "hidden";

}


// ==========================================
// ANTERIOR
// ==========================================

function showPreviousPhoto() {

    showPhoto(
        currentPhotoIndex - 1
    );

}


// ==========================================
// SIGUIENTE
// ==========================================

function showNextPhoto() {

    showPhoto(
        currentPhotoIndex + 1
    );

}


// ==========================================
// CREAR GALERÍA
// ==========================================

function renderGallery() {

    gallery.innerHTML = "";


    // BOTÓN +

    const addButton =
        document.createElement("button");

    addButton.className =
        "gallery-add-button";

    addButton.textContent = "+";

    addButton.setAttribute(
        "aria-label",
        "Añadir fotografías"
    );

    gallery.appendChild(
        addButton
    );


    // FOTOS

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


            photoElement.appendChild(
                image
            );


            gallery.appendChild(
                photoElement
            );


            photoElement.addEventListener(
                "click",
                () => {

                    openPhoto(index);

                }
            );

        }
    );

}


// ==========================================
// CERRAR
// ==========================================

closeViewer.addEventListener(
    "click",
    closePhotoViewer
);


// ==========================================
// ANTERIOR
// ==========================================

previousPhoto.addEventListener(
    "click",
    showPreviousPhoto
);


// ==========================================
// SIGUIENTE
// ==========================================

nextPhoto.addEventListener(
    "click",
    showNextPhoto
);


// ==========================================
// DESCARGAR
// ==========================================

downloadPhoto.addEventListener(
    "click",
    () => {

        const photo =
            testPhotos[currentPhotoIndex];


        const link =
            document.createElement("a");


        link.href =
            `${photo}?auto=format&fit=max&w=2400&q=95`;


        link.download =
            `ikasbi-2026-foto-${currentPhotoIndex + 1}.jpg`;


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
// TECLADO
// ==========================================

document.addEventListener(
    "keydown",
    (event) => {

        if (
            !photoViewer.classList.contains(
                "viewer-open"
            )
        ) {

            return;

        }


        if (
            event.key === "Escape"
        ) {

            closePhotoViewer();

        }


        if (
            event.key === "ArrowLeft"
        ) {

            showPreviousPhoto();

        }


        if (
            event.key === "ArrowRight"
        ) {

            showNextPhoto();

        }

    }
);


// ==========================================
// INICIAR
// ==========================================

renderGallery();
