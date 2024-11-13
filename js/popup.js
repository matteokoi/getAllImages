document.addEventListener('DOMContentLoaded', function () {
    let list = document.getElementById('alertButton');
    list.addEventListener('click', function () {

        function createDownloadList() {
            // Select all images on the page
            let images = document.querySelectorAll('img');

            // Create main container for the popup
            let container = document.createElement('div');
            container.id = 'generalContainer';

            // Add close button
            let closeButton = document.createElement('button');
            closeButton.innerHTML = '✕';
            closeButton.title = CLOSE;
            closeButton.id = 'closeContainer';

            // Add close button to the container
            container.appendChild(closeButton);

            // Add title for images
            container.innerHTML += `<strong>${IMAGES}</strong><br>`;

            // "Download All" button
            let downloadAllButton = document.createElement('button');
            downloadAllButton.innerHTML = `⬇️ ${DOWNLOAD_ALL}`;
            downloadAllButton.title = DOWNLOAD_ALL_IMAGES;
            downloadAllButton.classList.add('downloadAll');

            // Placeholder function for "Download All" button click
            downloadAllButton.addEventListener('click', function () {
                console.log("Download all images");
                // Implement the downloadAllImages function here
            });

            container.appendChild(downloadAllButton);

            // Loop through each image and create UI for it
            images.forEach(function (img, index) {
                let url = img.src;
                if (url) {
                    // Create a container for each image row
                    let itemContainer = document.createElement('div');
                    itemContainer.classList.add('divParent');

                    // Create left container for thumbnail and name
                    let leftContainer = document.createElement('div');
                    leftContainer.classList.add('divChild');

                    // Create the thumbnail
                    let thumbnail = document.createElement('img');
                    thumbnail.src = url;
                    thumbnail.classList.add('imgList');
                    thumbnail.alt = `Thumbnail ${index + 1}`;

                    // Image name/link
                    let nameSpan = document.createElement('span');
                    nameSpan.textContent = `Image ${index + 1}`;
                    nameSpan.classList.add('spanList');

                    // Buttons container
                    let buttonsContainer = document.createElement('div');
                    buttonsContainer.classList.add('gapDiv');

                    // Download button
                    let downloadButton = document.createElement('button');
                    downloadButton.innerHTML = '⬇️';
                    downloadButton.title = DOWNLOAD_ALL_IMAGES;
                    downloadButton.classList.add('imgDownload');

                    downloadButton.addEventListener('click', function () {
                        downloadImage(url, `image${index + 1}.jpg`);  // Implement downloadImage function
                    });

                    // Remove button
                    let removeButton = document.createElement('button');
                    removeButton.innerHTML = '❌';
                    removeButton.title = REMOVE_FROM_LIST;
                    removeButton.classList.add('removeFromListBtn');

                    removeButton.addEventListener('click', function () {
                        itemContainer.remove();
                        // If no more images, remove the main container
                        if (container.querySelectorAll('.divParent').length === 0) {
                            container.remove();
                        }
                    });

                    // Assemble the components
                    leftContainer.appendChild(thumbnail);
                    leftContainer.appendChild(nameSpan);

                    buttonsContainer.appendChild(downloadButton);
                    buttonsContainer.appendChild(removeButton);

                    itemContainer.appendChild(leftContainer);
                    itemContainer.appendChild(buttonsContainer);

                    // Add item container to the main container
                    container.appendChild(itemContainer);
                }
            });

            // Append the container to the body
            document.body.appendChild(container);
        }

        createDownloadList();

        let closeContainer = document.getElementById('closeContainer');
        closeContainer.addEventListener('click', function () {
            let generalContainer = document.getElementById('generalContainer');
            generalContainer.remove();
        });

    });


});
