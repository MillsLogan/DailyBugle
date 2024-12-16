import { NewStoryView } from './newStory.view.js';
import { API_ROUTES, ROUTES } from '../../constants.js';
import { Story } from '../../components/story/story.controller.js';

export class NewStoryController {
    constructor(user, story=null) {
        this.user = user;
        this.view = new NewStoryView();
        this.story = story;
    }

    async render(parentElement) {
        this.view.render(parentElement, this.story);
        if (this.story) {
            this.story = await Story.fetchStory(this.story);
            this.view.fillForm(this.story);
        }
        document.getElementById("new-story-form").addEventListener("submit", this.submitForm.bind(this));
    }

    async submitForm(event) {
        event.preventDefault();
        const title = document.getElementById("title").value;
        const teaser = document.getElementById("teaser").value;
        const body = document.getElementById("body").value;
        const categories = document.getElementById("categories").value.toLowerCase().split(",");
        const image = document.getElementById("image").value;
        const data = {
            title,
            teaser,
            body,
            image,
            categories
        }

        if (this.user.isAuthor &&
                this.validateTitle(title) && 
                this.validateBody(body) && 
                this.validateCategories(categories) && 
                this.validateTeaser(teaser)) {

            if (this.story) {
                this.updateStory(data);
            } else {
                this.createStory(data);
            }
        }
    }

    async createStory(data) {
        fetch(API_ROUTES.ARTICLE, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Cookie": document.cookie
            },
            body: JSON.stringify(data)
        }).then(response => {
            console.log(response);
            if (response.status === 200) {
                window.location.href = ROUTES.HOME;
                window.location.reload();
            } else {
                response.json().then(data => {
                    this.view.showError(data.message);
                });
            }
        });
    }

    async updateStory(data) {
        fetch(API_ROUTES.ARTICLE + this.story._id, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Cookie": document.cookie
            },
            body: JSON.stringify(data)
        }).then(response => {
            if (response.status === 200) {
                window.location.href = ROUTES.HOME;
            } else {
                response.json().then(data => {
                    this.view.showError(data.message);
                });
            }
        });
    }

    validateTeaser(teaser) {
        teaser = teaser.trim();
        if (teaser.length === 0) {
            this.view.showTeaserError("Teaser is required");
        } else {
            this.view.removeError();
            return true;
        }
    }

    validateTitle(title) {
        title = title.trim();
        if (title.length === 0) {
            this.view.showTitleError("Title is required");
        } else {
            this.view.removeError();
            return true;
        }
    }

    validateBody(body) {
        body = body.trim();
        if (body.length === 0) {
            this.view.showBodyError("Body is required");
        } else {
            this.view.removeError();
            return true;
        }
    }

    validateCategories(categories) {
        if (categories.length === 0) {
            this.view.showCategoriesError("Categories are required");
        } else {
            this.view.removeError();
            return true;
        }
    }
}