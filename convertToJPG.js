const convertFileInput = document.getElementById('convert-file-input');
const uploadConvertArea = document.getElementById('upload-convert-area');
const convertOptions = document.getElementById('convert-options');
const convertPreview = document.getElementById('convert-preview');
const convertToJpgBtn = document.getElementById('convert-to-jpg-btn');
const convertDownloadArea = document.getElementById('convert-download-area');
const downloadConvertBtn = document.getElementById('download-convert-btn');

let convertCanvasContext;

// Handle file upload
uploadConvertArea.addEventListener('click', () => convertFileInput.click());
convertFileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = () => {
            const img = new Image();
            img.onload = () => {
                // Display the canvas and draw the image
                convertPreview.width = img.width;
                convertPreview.height = img.height;
                convertCanvasContext = convertPreview.getContext('2d');
                convertCanvasContext.drawImage(img, 0, 0, img.width, img.height);

                convertOptions.style.display = 'block';
                convertDownloadArea.style.display = 'none';
            };
            img.src = reader.result;
        };
        reader.readAsDataURL(file);
    }
});

// Convert to JPG
convertToJpgBtn.addEventListener('click', () => {
    if (convertCanvasContext) {
        convertDownloadArea.style.display = 'block';
    }
});

// Download JPG
downloadConvertBtn.addEventListener('click', () => {
    if (convertCanvasContext) {
        const jpgDataUrl = convertPreview.toDataURL('image/jpeg', 0.8); // Convert to JPG (80% quality)

        // Create a download link
        const link = document.createElement('a');
        link.href = jpgDataUrl;
        link.download = 'converted-image.jpg';
        link.click();
    }
});