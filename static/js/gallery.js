const gallery = document.getElementById("gallery");

let index = 0;
const batchSize = 30;

function loadMore() {
    const end = Math.min(index + batchSize, photos.length);

    while (index < end) {
        const img = document.createElement("img");

        img.src = photos[index];
        img.loading = "lazy";
        img.decoding = "async";
        img.className = "photo";

        gallery.appendChild(img);
        index++;
    }
}

loadMore();

window.addEventListener("scroll", () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 800) {
        loadMore();
    }
});