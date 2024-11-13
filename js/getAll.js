
function downloadImage(url, filename) {
    // Use fetch to get the image data
    fetch(url, { mode: 'cors' }) // mode: 'cors' handles cross-origin images if allowed
        .then(response => {
            if (!response.ok) throw new Error("Network response was not ok");
            return response.blob(); // Convert response to Blob
        })
        .then(blob => {
            // Create a temporary URL for the Blob object
            const blobUrl = URL.createObjectURL(blob);

            // Create a link element for downloading
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = filename;

            // Append link to the body, trigger the download, and clean up
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Release the Blob URL
            URL.revokeObjectURL(blobUrl);
        })
        .catch(error => {
            console.error("Error downloading the image:", error);
        });
}


function downloadAllImages() {
    let images = document.querySelectorAll('img');
    images.forEach(function (img, index) {
        let url = img.src;
        let extension = url.split('.').pop().split(/#|\?/)[0];
        if (extension.length > 4 || !/^[a-z0-9]+$/i.test(extension)) {
            extension = 'jpg'; 
        }
        let name = `image${index + 1}.${extension}`;
        try {
            downloadImage(url, name);
        } catch (error) {
            console.warn(`Could not download image at index ${index}:`, error);
        }
    });
}