// Variables
const fileInput = document.getElementById('file-input');
const uploadArea = document.getElementById('upload-area');
const imagePreview = document.getElementById('image-preview');
const cropArea = document.getElementById('crop-area');
const cropControls = document.getElementById('crop-controls');
const previewSection = document.getElementById('preview-section');
const livePreview = document.getElementById('live-preview');
const downloadBtn = document.getElementById('download-btn');

let cropper;

// File upload handler
uploadArea.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = () => {
            imagePreview.src = reader.result;
            cropArea.style.display = 'block';
            cropControls.style.display = 'block';
            previewSection.style.display = 'block';

            // Initialize Cropper.js
            if (cropper) cropper.destroy();
            cropper = new Cropper(imagePreview, {
                aspectRatio: NaN, // Free aspect ratio
                viewMode: 1,
                autoCropArea: 1,
                crop() {
                    // Update live preview
                    const canvas = cropper.getCroppedCanvas({
                        width: 150, // Size of the preview
                        height: 150,
                    });

                    if (canvas) {
                        livePreview.innerHTML = ''; // Clear previous preview
                        const img = document.createElement('img');
                        img.src = canvas.toDataURL();
                        livePreview.appendChild(img);
                    }
                },
            });
        };
        reader.readAsDataURL(file);
    }
});

// Zoom In
document.getElementById('zoom-in').addEventListener('click', () => {
    if (cropper) cropper.zoom(0.1);
});

// Zoom Out
document.getElementById('zoom-out').addEventListener('click', () => {
    if (cropper) cropper.zoom(-0.1);
});

// Rotate Left
document.getElementById('rotate-left').addEventListener('click', () => {
    if (cropper) cropper.rotate(-45);
});

// Rotate Right
document.getElementById('rotate-right').addEventListener('click', () => {
    if (cropper) cropper.rotate(45);
});

// Reset
document.getElementById('reset').addEventListener('click', () => {
    if (cropper) cropper.reset();
});

// Download Cropped Image
downloadBtn.addEventListener('click', () => {
    if (cropper) {
        const croppedCanvas = cropper.getCroppedCanvas();
        const croppedImage = croppedCanvas.toDataURL('image/png');

        // Create a download link
        const link = document.createElement('a');
        link.href = croppedImage;
        link.download = 'cropped-image.png';
        link.click();
    }
});