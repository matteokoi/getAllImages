// Content script (content-script.js)
let imageListContainer = null;

// Helper function to format file size
function formatFileSize(bytes) {
    if (!bytes) return 'N/A';
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;
    while (size >= 1024 && unitIndex < units.length - 1) {
        size /= 1024;
        unitIndex++;
    }
    return `${size.toFixed(1)} ${units[unitIndex]}`;
}

// Helper function to get image dimensions and size
async function getImageInfo(url) {
    try {
        const response = await fetch(url);
        const blob = await response.blob();
        const size = blob.size;

        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                resolve({
                    width: img.width,
                    height: img.height,
                    size: formatFileSize(size)
                });
            };
            img.onerror = () => {
                resolve({
                    width: 0,
                    height: 0,
                    size: 'N/A'
                });
            };
            img.src = url;
        });
    } catch (error) {
        console.error('Error getting image info:', error);
        return { width: 0, height: 0, size: 'N/A' };
    }
}

// Download multiple images
async function downloadAllImages() {
    const rows = imageListContainer.querySelectorAll('.ext-image-list-row');
    for (const row of rows) {
        const thumbnail = row.querySelector('.ext-image-thumbnail');
        const fileName = row.querySelector('.ext-file-name').textContent;

        try {
            const response = await fetch(thumbnail.src);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);

            // Add a small delay between downloads to prevent overwhelming the browser
            await new Promise(resolve => setTimeout(resolve, 500));
        } catch (error) {
            console.error(`Error downloading image ${fileName}:`, error);
        }
    }
}

// Listen for messages from the extension popup/background
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'toggleImageList') {
        if (!imageListContainer) {
            createImageList();
        } else {
            imageListContainer.remove();
            imageListContainer = null;
        }
    }
});

async function createImageList() {
    // Create container
    imageListContainer = document.createElement('div');
    imageListContainer.setAttribute('class', 'ext-image-list-container');

    // Create navbar
    const navbar = document.createElement('div');
    navbar.setAttribute('class', 'ext-navbar');

    // Create title
    const title = document.createElement('div');
    title.setAttribute('class', 'ext-nav-title');

    const navButtons = document.createElement('div');
    navButtons.setAttribute('class', 'ext-nav-buttons');

    // Counter
    const counter = document.createElement('div');
    counter.setAttribute('class', 'ext-nav-counter');

    // Loading spinner
    const loadingSpinner = document.createElement('div');
    loadingSpinner.setAttribute('class', 'ext-nav-loading');
    loadingSpinner.innerHTML = `
          <svg class="ext-loading-icon" viewBox="0 0 24 24">
              <circle class="circle" cx="12" cy="12" r="10" fill="none" stroke-width="4"></circle>
          </svg>
      `;

    // Download all button
    const downloadAllBtn = document.createElement('button');
    downloadAllBtn.setAttribute('class', 'ext-nav-button');
    downloadAllBtn.setAttribute('title', DOWNLOAD_ALL_IMAGES);
    downloadAllBtn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
        </svg>
    `;
    downloadAllBtn.onclick = downloadAllImages;

    // Close button
    const closeListBtn = document.createElement('button');
    closeListBtn.setAttribute('class', 'ext-nav-button');
    closeListBtn.setAttribute('title', CLOSE_LIST);
    closeListBtn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
        </svg>
    `;
    closeListBtn.onclick = () => {
        imageListContainer.remove();
        imageListContainer = null;
    };

    // Add buttons to navbar
    navbar.appendChild(counter);
    navbar.appendChild(loadingSpinner);
    navButtons.appendChild(downloadAllBtn);
    navButtons.appendChild(closeListBtn);

    // Add buttons to navbar
    navbar.appendChild(downloadAllBtn);
    navbar.appendChild(closeListBtn);

    navbar.appendChild(title);
    navbar.appendChild(navButtons);

    // Add navbar to container
    imageListContainer.appendChild(navbar);

    // Add container to document
    document.body.appendChild(imageListContainer);

    // Create modal
    const modal = document.createElement('div');
    modal.setAttribute('class', 'ext-modal');
    modal.innerHTML = `
        <span class="ext-modal-close">×</span>
        <img class="ext-modal-content">
    `;
    document.body.appendChild(modal);

    // Close modal functionality
    const closeBtn = modal.querySelector('.ext-modal-close');
    closeBtn.onclick = () => modal.style.display = 'none';
    modal.onclick = (e) => {
        if (e.target === modal) modal.style.display = 'none';
    };

    // Get all images
    const images = Array.from(document.getElementsByTagName('img'));
    const totalImages = images.length;

    // Update counter
    counter.textContent = `${totalImages} images`;

    // Hide loading spinner after initial list creation
    loadingSpinner.style.display = 'none';

    // Process each image
    for (const img of images) {
        if (img.src) {
            const imageInfo = await getImageInfo(img.src);
            const fileName = img.src.split('/').pop() || IMAGE_DEFAULT;

            const row = document.createElement('div');
            row.setAttribute('class', 'ext-image-list-row');

            // Create image container for thumbnail and filename
            const imageContainer = document.createElement('div');
            imageContainer.setAttribute('class', 'ext-image-container');

            // Thumbnail
            const thumbnail = document.createElement('img');
            thumbnail.src = img.src;
            thumbnail.setAttribute('class', 'ext-image-thumbnail');

            // Filename
            const fileNameElement = document.createElement('div');
            fileNameElement.setAttribute('class', 'ext-file-name');
            fileNameElement.setAttribute('title', fileName);
            fileNameElement.textContent = fileName;

            imageContainer.appendChild(thumbnail);
            imageContainer.appendChild(fileNameElement);

            // Info container
            const infoContainer = document.createElement('div');
            infoContainer.setAttribute('class', 'ext-info-container');

            // Dimensions
            const dimensions = document.createElement('div');
            dimensions.setAttribute('class', 'ext-dimensions');
            dimensions.textContent = `${imageInfo.width} × ${imageInfo.height}`;

            // Size
            const size = document.createElement('div');
            size.setAttribute('class', 'ext-size');
            size.textContent = imageInfo.size;

            infoContainer.appendChild(dimensions);
            infoContainer.appendChild(size);

            // Buttons container
            const buttonsContainer = document.createElement('div');
            buttonsContainer.setAttribute('class', 'ext-buttons-container');

            // Preview button
            const previewBtn = document.createElement('button');
            previewBtn.innerHTML = '👁️';
            previewBtn.setAttribute('class', 'ext-button');
            previewBtn.setAttribute('title', PREVIEW);
            previewBtn.onclick = () => {
                modal.style.display = 'block';
                modal.querySelector('.ext-modal-content').src = img.src;
            };

            // Download button
            const downloadBtn = document.createElement('button');
            downloadBtn.innerHTML = '⬇️';
            downloadBtn.setAttribute('class', 'ext-button');
            downloadBtn.setAttribute('title', DOWNLOAD);
            downloadBtn.onclick = async () => {
                try {
                    const response = await fetch(img.src);
                    const blob = await response.blob();
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = fileName + ".jpg";
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    window.URL.revokeObjectURL(url);
                } catch (error) {
                    console.error(ERROR_DOWNLOADERROR_DOWNLOAD, error);
                    alert(FAIL_DOWNLOAD);
                }
            };

            // Remove button
            const removeBtn = document.createElement('button');
            removeBtn.innerHTML = '🗑️';
            removeBtn.setAttribute('class', 'ext-button');
            removeBtn.setAttribute('title', REMOVE_FROM_LIST);
            removeBtn.onclick = () => {
                row.remove();
            };

            // Add buttons to container
            buttonsContainer.appendChild(previewBtn);
            buttonsContainer.appendChild(downloadBtn);
            buttonsContainer.appendChild(removeBtn);

            // Add all elements to row
            row.appendChild(imageContainer);
            row.appendChild(infoContainer);
            row.appendChild(buttonsContainer);

            // Add row to container
            imageListContainer.appendChild(row);
        }
    }
}