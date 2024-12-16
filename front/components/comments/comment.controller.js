import { API_ROUTES } from "../../constants.js";
import { CommentView } from "./comment.view.js";

export class Comment {
    constructor({ _id, story_id, user_id, body, created_at, edited_at, edited_by, username }) {
        this._id = _id;
        this.story_id = story_id;
        this.user_id = user_id;
        this.user = username;
        this.body = body;
        this.created_at = new Date(created_at);
        this.edited_at = edited_at ? new Date(edited_at) : null;
        this.edited_by = edited_by;
    }

    show(parentElement) {
        CommentView.renderComment(this, parentElement);
    }

    static async renderLoginToComment(parentElement) {
        CommentView.renderLoginToComment(parentElement);
    }

    static async renderCreateCommentForm(parentElement, story_id) {
        CommentView.renderCommentForm(parentElement, story_id);
        document.getElementById("add-comment-form").addEventListener("submit", async event => {
            Comment.submitCommentForm(event);
        });
    }

    static async submitCommentForm(event) {
        event.preventDefault();
        const comment = document.getElementById("commentInput").value;
        const story_id = document.getElementById("add-comment-form").querySelector("input[name='story_id']").value;

        const data = {
            story_id: story_id,
            body: comment
        }

        if (Comment.validateBody(data.body)) {
            Comment.createComment(data);
        }
    }

    static async validateBody(body) {
        body = body.trim();
        if (body.length === 0) {
            CommentView.renderCommentError("Cannot submit an empty comment");        
            errorElement.style.display = "block";
            return
        } else {
            return true;
        }
    }

    static async createComment(data) {
        fetch(API_ROUTES.COMMENT, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        }).then(response => {
            if (response.status === 201) {
                window.location.reload();
            } else {
                CommentView.renderCommentError("Failed to create comment");
            }
        });
    }

    static async fetchCommentsByStoryId(story_id) {
        return fetch(API_ROUTES.COMMENT + "article/" + story_id, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        }).then(response => {
            if (response.status === 200) {
                return response.json().then(data => Comment.fillUsernames(data));
            } else {
                return null;
            }
        });
    }

    static async fillUsernames(data) {
        const user_ids = data.map(comment => comment.user_id);
        const users = await Comment.fetchUsernames(user_ids);
        return data.map(comment => {
            const user = users.find(user => user._id === comment.user_id);
            return new Comment({ ...comment, username: user.username });
        });
    }

    static async fetchUsernames(user_ids) {
        return fetch(API_ROUTES.AUTH + "user", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ users: user_ids })
        }).then(response => {
            if (response.status === 200) {
                return response.json();
            } else {
                return [];
            }
        });
    }

    static fromData(data) {
        return data.map(comment => new Comment(comment));
    }
}