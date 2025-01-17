// Compress Functionality
const compressFileInput = document.getElementById('compress-file-input');
const compressPreviewContainer = document.getElementById('compress-preview-container');
const compressOptions = document.getElementById('compress-options');
const compressQualitySlider = document.getElementById('compress-quality-slider');
const compressQualityValue = document.getElementById('compress-quality-value');
const compressMaxWidthInput = document.getElementById('compress-max-width');
const compressMaxHeightInput = document.getElementById('compress-max-height');
const compressAllBtn = document.getElementById('compress-all-btn');
const compressDownloadBtn = document.getElementById('compress-download-btn');
const compressProgress = document.getElementById('compress-progress');
const uploadCompressBtn = document.getElementById('upload-compress-btn');
const compressPreviewArea = document.getElementById('compress-preview-area');
const resetBtn = document.getElementById('reset-btn'); // New Reset Button
const originalDimensions = document.getElementById('original-dimensions'); // Original image dimensions

const compressByQualityRadio = document.getElementById('compress-by-quality');
const compressByDimensionsRadio = document.getElementById('compress-by-dimensions');
const qualityOption = document.getElementById('quality-option');
const dimensionsOption = document.getElementById('dimensions-option');

let compressImages = [];

// Open file selector on button click
uploadCompressBtn.addEventListener('click', () => {
    compressFileInput.click();
});

// Show/hide options based on selected radio button
compressByQualityRadio.addEventListener('change', () => {
    if (compressByQualityRadio.checked) {
        qualityOption.style.display = 'block';
        dimensionsOption.style.display = 'none';
        updateImagePreview();  // Update preview when option changes
    }
});

compressByDimensionsRadio.addEventListener('change', () => {
    if (compressByDimensionsRadio.checked) {
        qualityOption.style.display = 'none';
        dimensionsOption.style.display = 'block';
        updateImagePreview();  // Update preview when option changes
    }
});

// Update the displayed quality value when the slider is adjusted
compressQualitySlider.addEventListener('input', () => {
    compressQualityValue.textContent = `${compressQualitySlider.value}%`;
    if (compressByQualityRadio.checked) {
        updateImagePreview();  // Trigger live preview when quality slider is adjusted
    }
});

// Handle File Upload
compressFileInput.addEventListener('change', (e) => {
    const files = e.target.files;
    if (files.length) {
        compressImages = [];
        compressPreviewContainer.innerHTML = '';
        compressOptions.style.display = 'block';
        compressPreviewArea.style.display = 'block';
        originalDimensions.innerHTML = ''; // Clear original dimensions

        Array.from(files).forEach((file, index) => {
            const reader = new FileReader();
            reader.onload = () => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');

                    // Calculate aspect ratio
                    const aspectRatio = img.width / img.height;
                    if (index === 0) {  // Update max width/height for the first image
                        compressMaxWidthInput.value = img.width;
                        compressMaxHeightInput.value = img.height;
                        originalDimensions.innerHTML = `Original Dimensions: ${img.width} x ${img.height}`;
                    }

                    canvas.width = img.width;
                    canvas.height = img.height;
                    ctx.drawImage(img, 0, 0);

                    compressImages.push({ file, canvas, ctx, originalImg: img, aspectRatio });

                    const previewItem = document.createElement('div');
                    previewItem.classList.add('preview-item');
                    previewItem.appendChild(canvas);
                    compressPreviewContainer.appendChild(previewItem);
                };
                img.src = reader.result;
            };
            reader.readAsDataURL(file);
        });
    } else {
        compressOptions.style.display = 'none';
        compressPreviewArea.style.display = 'none';
        originalDimensions.innerHTML = ''; // Clear original dimensions
    }
});

// Function to update image preview with current quality or dimensions
function updateImagePreview() {
    compressImages.forEach((imgData, index) => {
        const img = imgData.originalImg;

        let quality = 1;
        let width = img.width;
        let height = img.height;

        // Check if compress by quality or by dimensions
        if (compressByQualityRadio.checked) {
            quality = parseInt(compressQualitySlider.value, 10) / 100;
        } else if (compressByDimensionsRadio.checked) {
            let maxWidth = parseInt(compressMaxWidthInput.value, 10);
            let maxHeight = parseInt(compressMaxHeightInput.value, 10);

            // Validate inputs: Ensure values are numbers and positive
            if (isNaN(maxWidth) || isNaN(maxHeight) || maxWidth <= 0 || maxHeight <= 0) {
                alert("Please enter valid positive numbers for max width and max height.");
                return;
            }

            // If only one dimension is specified, calculate the other based on the aspect ratio
            if (maxWidth && !maxHeight) {
                maxHeight = Math.round(maxWidth / imgData.aspectRatio);
                compressMaxHeightInput.value = maxHeight;  // Update height input dynamically
            } else if (maxHeight && !maxWidth) {
                maxWidth = Math.round(maxHeight * imgData.aspectRatio);
                compressMaxWidthInput.value = maxWidth;  // Update width input dynamically
            }

            // Resize image while maintaining aspect ratio
            width = maxWidth;
            height = maxHeight;
        }

        const canvas = imgData.canvas;
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Create a compressed data URL with the selected quality
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);

        // Store the compressed data URL in imgData object
        imgData.compressedDataUrl = compressedDataUrl;

        // Re-render preview with the new compressed quality (use <img> tag for the canvas)
        const previewItem = compressPreviewContainer.children[index];
        const imgTag = previewItem.querySelector('img') || document.createElement('img');
        imgTag.src = compressedDataUrl;

        // Append the image if it's not already there
        if (!previewItem.contains(imgTag)) {
            previewItem.innerHTML = ''; // Clear any existing content in preview item
            previewItem.appendChild(imgTag); // Add the new image
        }
    });
}

// Compress All Images
compressAllBtn.addEventListener('click', () => {
    const quality = parseInt(compressQualitySlider.value, 10) / 100;
    const maxWidth = parseInt(compressMaxWidthInput.value, 10);
    const maxHeight = parseInt(compressMaxHeightInput.value, 10);

    // Validate inputs before processing
    if (compressByDimensionsRadio.checked && (isNaN(maxWidth) || isNaN(maxHeight) || maxWidth <= 0 || maxHeight <= 0)) {
        alert("Please enter valid positive numbers for max width and max height.");
        return;
    }

    // Show progress bar
    compressProgress.style.display = 'block';
    compressProgress.style.width = '0%';

    compressImages.forEach((imgData, index) => {
        const img = imgData.originalImg;

        let width = img.width;
        let height = img.height;

        // Check if compress by quality or by dimensions
        if (compressByQualityRadio.checked) {
            // Resize image according to quality
            width = img.width;
            height = img.height;
        } else if (compressByDimensionsRadio.checked) {
            // Resize image by dimensions
            if (maxWidth && maxHeight) {
                if (width > maxWidth || height > maxHeight) {
                    const aspectRatio = width / height;
                    if (width > height) {
                        width = maxWidth;
                        height = Math.round(maxWidth / aspectRatio);
                    } else {
                        height = maxHeight;
                        width = Math.round(maxHeight * aspectRatio);
                    }
                }
            }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Generate compressed image with the specified quality
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        imgData.compressedDataUrl = compressedDataUrl; // Store the compressed image URL
    });

    // Hide progress bar and show download button
    compressProgress.style.width = '100%';
    setTimeout(() => {
        compressDownloadBtn.style.display = 'block';
        compressProgress.style.display = 'none';
    }, 500);
});

// Download Compressed Images
compressDownloadBtn.addEventListener('click', () => {
    compressImages.forEach((imgData, index) => {
        const link = document.createElement('a');
        link.href = imgData.compressedDataUrl; // Use the compressed data URL
        link.download = `compressed-image-${index + 1}.jpg`;
        link.click();
    });
});

// Reset the inputs and preview
resetBtn.addEventListener('click', () => {
    compressFileInput.value = '';
    compressPreviewContainer.innerHTML = '';
    compressMaxWidthInput.value = '';
    compressMaxHeightInput.value = '';
    compressQualitySlider.value = 80; // Default quality
    compressQualityValue.textContent = '80%';
    originalDimensions.innerHTML = '';
    compressImages = [];
    compressOptions.style.display = 'none';
    compressPreviewArea.style.display = 'none';
    compressDownloadBtn.style.display = 'none';
    compressProgress.style.display = 'none';
});
