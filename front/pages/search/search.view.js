import { HomeView } from "../home/home.view.js";

export class SearchView {
    static renderPage(parentElement) {
        parentElement.innerHTML = `
            <div class="row">
                <div class="col-8 mx-auto">
                    <h1 class="text-center">Search</h1>
                    <hr>
                    <form id="search-form">
                        <div class="input-group mb-3">
                            <input class="form-control" type="search" placeholder="Search">
                            <button class="btn btn-danger" type="submit">Search</button>
                        </div>
                    </form>
                </div>
            </div>
            <div id="search-results">
            </div>
        `;

    }

    static getSearchForm() {
        return document.getElementById("search-form");
    }

    static getSearchResultsContainer() {
        return document.getElementById("search-results");
    }

    static clearSearchResults() {
        const searchResults = document.getElementById("search-results");
        searchResults.innerHTML = "";
        HomeView.getStoryContainer(searchResults);
    }
}