export class CategoryView {
    static getCategoryHeader(category) {
        const categoryHeader = document.createElement("div");
        categoryHeader.classList.add("category-header");
        categoryHeader.classList.add("col-11");
        categoryHeader.classList.add("mx-auto");
        categoryHeader.classList.add("my-3");
        categoryHeader.innerHTML = `
            <h1 class="fs-1 text-capitalize">${category}</h1>
            <hr>
        `;
        return categoryHeader;
    }
}