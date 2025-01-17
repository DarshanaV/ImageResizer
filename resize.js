// Variables for resizing
let originalImage, resizedImage;
let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
let widthSlider = document.getElementById('width-slider');
let heightSlider = document.getElementById('height-slider');
let resizeBtn = document.getElementById('resize-btn');
let downloadBtn = document.getElementById('download-btn');
let widthLabel = document.getElementById('width-label');
let heightLabel = document.getElementById('height-label');
let uploadArea = document.getElementById('upload-area');

// Update the width and height labels when sliders are adjusted
widthSlider.addEventListener('input', function () {
    widthLabel.textContent = widthSlider.value;
});

heightSlider.addEventListener('input', function () {
    heightLabel.textContent = heightSlider.value;
});

// Function to upload and display the image
uploadArea.addEventListener('click', function () {
    let fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.click();

    fileInput.addEventListener('change', function () {
        let file = fileInput.files[0];
        if (file) {
            let reader = new FileReader();
            reader.onload = function (e) {
                let img = new Image();
                img.onload = function () {
                    originalImage = img;
                    canvas.width = img.width;
                    canvas.height = img.height;
                    ctx.drawImage(img, 0, 0);
                    widthSlider.value = img.width;
                    heightSlider.value = img.height;
                    widthLabel.textContent = img.width;
                    heightLabel.textContent = img.height;
                    document.getElementById('resize-section').style.display = 'block';
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });
});

// Function to resize the image
resizeBtn.addEventListener('click', function () {
    let width = widthSlider.value;
    let height = heightSlider.value;

    // Resize the canvas and draw the image
    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(originalImage, 0, 0, width, height);

    // Show the download button
    downloadBtn.style.display = 'inline-block';
});

// Function to download the resized image
downloadBtn.addEventListener('click', function () {
    let link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = 'resized-image.png';
    link.click();
});