import { SearchView } from "./search.view.js";
import { Story } from "../../components/story/story.controller.js";

export class SearchController {
    async render(parentElement) {
        SearchView.renderPage(parentElement);
        this.attachEventHandlers();
    }

    attachEventHandlers() {
        const searchForm = SearchView.getSearchForm();
        searchForm.addEventListener("submit", async (event) => {
            event.preventDefault();
            const searchValue = searchForm.querySelector("input").value;
            this.search(searchValue);
        });
    }

    async search(searchValue) {
        const stories = await Story.fetchStoriesBySearch(searchValue);
        if (stories) {
            SearchView.clearSearchResults();
            stories.forEach(story => {
                story.showPreview(SearchView.getSearchResultsContainer());
            });

            stories.forEach(story => {
                story.attachEventHandlers();
            });
        } else {
            SearchView.showNoResults();
        }
    }
}