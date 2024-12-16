import { Story } from '../../components/story/story.controller.js';
import { HomeView } from './home.view.js';

export class HomeController {
    constructor(user) {
        this.user = user;
        this.setup();
    }

    async setup() {
        this.stories = Story.fetchAllStories();
    }

    async render(parentElement) {
        this.stories = await this.stories;
        const headlineContainer = HomeView.getHeadlineContainer(parentElement);
        this.stories[0].showHeadline(headlineContainer);
        
        if (this.user.isAuthor) {
            this.showNewStoryButton(parentElement);
        }
        
        const storyContainer = HomeView.getStoryContainer(parentElement);
        this.showStories(storyContainer, this.stories.slice(1));
        for (const story of this.stories) {
            story.attachEventHandlers();
        }
    }

    showStories(storyContainer, stories) {
        stories.forEach(story => {
            story.showPreview(storyContainer);
        });
    }

    showNewStoryButton(parentElement) {
        HomeView.showNewStoryButton(parentElement);
    }
}