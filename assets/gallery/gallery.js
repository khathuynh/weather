const gallery = document.getElementById("gallery");
const pagination = document.getElementById("pagination");

const pageSize = 9;
const totalPages = Math.ceil(photos.length / pageSize);

// Read initial page from URL
const params = new URLSearchParams(window.location.search);
let currentPage = Math.max(
    1,
    Math.min(parseInt(params.get("page") || "1", 10), totalPages)
);

function renderPage(page, pushHistory = true) {
    currentPage = page;

    // Clear existing images
    gallery.replaceChildren();

    const start = (page - 1) * pageSize;
    const end = Math.min(start + pageSize, photos.length);

    // Add this page's images
    for (let i = start; i < end; i++) {
        const img = document.createElement("img");

        img.src = photos[i];
        img.loading = "lazy";
        img.decoding = "async";
        img.className = "photo";

        gallery.appendChild(img);
    }

    // Update URL without reloading
    const url =
        page === 1
            ? window.location.pathname
            : `${window.location.pathname}?page=${page}`;

    history.pushState({ page }, "", url);

    renderPagination();
}

function renderPagination() {
    pagination.replaceChildren();

    // Previous button
    if (currentPage > 1) {
        const prev = document.createElement("button");
        prev.textContent = "← Previous";
        prev.onclick = () => renderPage(currentPage - 1);
        pagination.appendChild(prev);
    }

    // Page numbers
    for (let page = 1; page <= totalPages; page++) {
        const button = document.createElement("button");
        button.textContent = page;

        if (page === currentPage) {
            button.disabled = true;
            button.classList.add("active");
        }

        button.onclick = () => renderPage(page);

        pagination.appendChild(button);
    }

    // Next button
    if (currentPage < totalPages) {
        const next = document.createElement("button");
        next.textContent = "Next →";
        next.onclick = () => renderPage(currentPage + 1);
        pagination.appendChild(next);
    }
}

// Support browser Back/Forward buttons
window.addEventListener("popstate", () => {
    const page = Number(new URLSearchParams(location.search).get("page")) || 1;
    renderPage(page, false);
});

// Initial render
renderPage(currentPage, false);