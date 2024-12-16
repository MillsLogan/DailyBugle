import { API_ROUTES } from '../../constants.js';
import { StoryView } from './story.view.js';

export class Story {
    constructor({ _id, title, teaser, body, categories, 
            image, author, created_at, edited_at, edited_by }) {
        this._id = _id;
        this.title = title;
        this.teaser = teaser;
        this.body = body;
        this.categories = categories;
        this.image = image;
        this.author = author;
        this.created_at = new Date(created_at);
        this.edited_at = edited_at ? new Date(edited_at) : null;
        this.edited_by = edited_by;
    }

    static async fetchStoriesByCategory(category) {
        return fetch(API_ROUTES.ARTICLE + "categories/" +  category, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        }).then(response => {
            if (response.status === 200) {
                return response.json().then(data => Story.fillAuthor(Story.fromData(data)));
            } else {
                return null;
            }
        });
    }

    showPage(parentElement) {
        StoryView.renderStoryPage(parentElement, this);
    }

    showHeadline(parentElement) {
        StoryView.renderHeadline(parentElement, this);
    }

    showPreview(parentElement) {
        StoryView.renderStoryPreview(parentElement, this);
    }

    attachEventHandlers() {
        const storyElement = document.querySelector(`[data-story-id="${this._id}"]`);
        console.log(storyElement);
        console.log(this._id);
        storyElement.addEventListener("click", () => {
            this.onClick();
        });
    }

    onClick() {
        window.location.href = `?story=${this._id}#article`;
    }

    static async fetchStoriesBySearch(searchValue) {
        return fetch(API_ROUTES.ARTICLE + "search/" + searchValue, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        }).then(response => {
            if (response.status === 200) {
                return response.json().then(data => Story.fillAuthor(Story.fromData(data)));
            } else {
                return null;
            }
        });
    }

    static async fetchAllStories() {
        return fetch(API_ROUTES.ARTICLE, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        }).then(response => {
            if (response.status === 200) {
                return response.json().then(data => Story.fillAuthor(Story.fromData(data)));
            } else {
                return null;
            }
        })
    }

    static async fillAuthor(data) {
        const author_ids = data.map(story => story.author);
        const edited_by_ids = data.filter(story => story.edited_by).map(story => story.edited_by);
        const all_ids = author_ids.concat(edited_by_ids);
        const authors = await Story.fetchAuthors(all_ids);

        return data.map(story => {
            const author = authors.find(author => author._id === story.author);
            story.author = author.username;
            if (story.edited_by) {
                const editor = authors.find(author => author._id === story.edited_by);
                story.edited_by = editor.username;
            }
            return new Story({ ...story });
        });
    }

    static async fillSingleAuthor(story) {
        let authors;
        
        if (!story.edited_by) {
            authors = await Story.fetchAuthors([story.author]);
        } else {
            authors = await Story.fetchAuthors([story.author, story.edited_by]);
        }

        const author = authors.find(author => author._id === story.author);
        story.author = author.username;

        if (story.edited_by) {
            const editor = authors.find(author => author._id === story.edited_by);
            story.edited_by = editor.username
        }

        return story;
    }

    static async fetchAuthors(author_ids) {
        return fetch(API_ROUTES.AUTH + "/user", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ users: author_ids })
        }).then(response => {
            if (response.status === 200) {
                return response.json();
            } else {
                return [];
            }
        });
    }

    static async fetchStory(story_id) {
        return fetch(API_ROUTES.ARTICLE + story_id, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        }).then(response => {
            if (response.status === 200) {
                return response.json().then(data => Story.fillSingleAuthor(new Story(data)));
            } else {
                return null;
            }
        });
    }

    static fromData(data) {
        return data.map(story => new Story(story));
    }
}