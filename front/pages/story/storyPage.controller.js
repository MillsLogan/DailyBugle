import { Story } from "../../components/story/story.controller.js";
import { Comment } from "../../components/comments/comment.controller.js"; 
import { StoryPageView } from "./storyPage.view.js";
import { setActiveCategories } from "../../router.js";

export class StoryPageController {
    constructor(story_id, user) {
        this.story = Story.fetchStory(story_id);
        this.user = user;
    }

    async render(parentElement) {
        this.story = await this.story;
        setActiveCategories(this.story.categories);

        this.story.showPage(parentElement);
        this.comments = await Comment.fetchCommentsByStoryId(this.story._id);
        const commentsContainer = await StoryPageView.getCommentsContainer();
        parentElement.appendChild(commentsContainer);
        if (!this.user.isAnonymous) { 
            Comment.renderCreateCommentForm(commentsContainer, this.story._id);
        } else {
            Comment.renderLoginToComment(commentsContainer);
        }

        this.comments.forEach(comment => {
            comment.show(commentsContainer);
        });

        if (this.user.isAuthor) {
            StoryPageView.showEditButton(parentElement, this.story._id);
        }
    }
}