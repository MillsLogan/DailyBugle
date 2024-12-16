import { ROUTES } from "../../constants.js";

export class StoryPageView {
    static async getCommentsContainer() {
        const commentsContainer = document.createElement("div");
        commentsContainer.classList.add("comments-container");
        commentsContainer.classList.add("col-11");
        commentsContainer.classList.add("mx-auto");
        commentsContainer.classList.add("my-3");
        commentsContainer.classList.add("bg-body-secondary");
        commentsContainer.classList.add("border");
        commentsContainer.classList.add("p-3");
        commentsContainer.innerHTML = `
            <h2 class="fs-4">Comments</h2>
            <hr>
        `;
        return commentsContainer;
    }

    static showEditButton(parentElement, story_id) {
        const editButton = document.createElement("a");
        editButton.classList.add("btn");
        editButton.classList.add("btn-primary");
        editButton.classList.add("my-3");
        editButton.href = `?story=${story_id}${ROUTES.NEWSTORY}`;
        editButton.textContent = "Edit Story";
        parentElement.prepend(editButton);
    }
}