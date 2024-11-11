document.addEventListener('DOMContentLoaded', function () {
    var alertButton = document.getElementById('alertButton');
    alertButton.addEventListener('click', function () {

        if (confirm('Do you want to download all these images? Remember to allow the multiple download from your browser...')) {

            function createDownloadList() {
                var images = document.querySelectorAll('img');
                var container = document.createElement('div');

                // Style the container
                container.style.position = 'fixed';
                container.style.top = '10px';
                container.style.right = '10px';
                container.style.background = 'white';
                container.style.padding = '10px';
                container.style.zIndex = 1000;
                container.style.maxHeight = '300px';
                container.style.overflowY = 'auto';
                container.style.border = '1px solid #ddd';
                container.style.width = '200px';
                container.innerHTML = '<strong>Download Images:</strong><br>';

                images.forEach(function (img, index) {
                    var url = img.src;
                    if (url) {
                        // Create a container for each image link and thumbnail
                        var itemContainer = document.createElement('div');
                        itemContainer.style.display = 'flex';
                        itemContainer.style.alignItems = 'center';
                        itemContainer.style.marginBottom = '5px';

                        // Create the thumbnail
                        var thumbnail = document.createElement('img');
                        thumbnail.src = url;
                        thumbnail.style.width = '40px';
                        thumbnail.style.height = '40px';
                        thumbnail.style.objectFit = 'cover';
                        thumbnail.style.marginRight = '10px';
                        thumbnail.alt = `Thumbnail ${index + 1}`;

                        // Create the download link
                        var link = document.createElement('a');
                        link.href = url;
                        link.target = '_blank';
                        link.download = `image${index + 1}.jpg`;  // Use .jpg or original extension if available
                        link.textContent = `Image ${index + 1}`;
                        link.style.textDecoration = 'none';
                        link.style.color = '#0073e6';

                        // Append thumbnail and link to the item container
                        itemContainer.appendChild(thumbnail);
                        itemContainer.appendChild(link);

                        // Add item container to the main container
                        container.appendChild(itemContainer);
                    }
                });

                // Append the container to the body
                document.body.appendChild(container);
            }

            createDownloadList();



            //                 (function() {

            //     function downloadImage(url, name, delay) {
            //         setTimeout(function() {
            //             var a = document.createElement('a');
            //             a.href = url;
            //             a.download = name;
            //             document.body.appendChild(a);
            //             a.click();
            //             document.body.removeChild(a);
            //         }, delay);
            //     }

            //     function downloadAllImages() {
            //         var images = document.querySelectorAll('img');
            //         images.forEach(function(img, index) {
            //             var url = img.src;

            //             if (!url) {
            //                 console.warn(`Image at index ${index} has no source.`);
            //                 return;
            //             }

            //             // Handle cases where file extension may be missing or malformed
            //             var extension = url.split('.').pop().split(/#|\?/)[0];
            //             if (extension.length > 4 || !/^[a-z0-9]+$/i.test(extension)) {
            //                 extension = 'jpg'; // Default to jpg if extension is missing or invalid
            //             }

            //             var name = `image${index + 1}.${extension}`;

            //             // Only try downloading if image is from the same origin
            //             try {
            //                 // Delay each download by 200 ms times the index
            //                 downloadImage(url, name, index * 200); 
            //             } catch (error) {
            //                 console.warn(`Could not download image at index ${index}:`, error);
            //             }
            //         });
            //     }

            //     downloadAllImages();



        }
    });
});
