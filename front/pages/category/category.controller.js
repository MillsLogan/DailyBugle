import { Story } from '../../components/story/story.controller.js';
import { HomeView } from '../home/home.view.js';
import { Category } from '../../router.js';
import { CategoryView } from './category.view.js';


export class CategoryPageController {
    constructor(category, user) {
        this.category = category;
        this.user = user;
        this.stories = Story.fetchStoriesByCategory(category.name);
    }

    async render(parentElement) {
        this.stories = await this.stories;
        Category.clearActive();
        this.category.setActive();
        parentElement.appendChild(CategoryView.getCategoryHeader(this.category.name));
        const storyContainer = HomeView.getStoryContainer(parentElement);
        this.showStories(storyContainer, this.stories);
        for (const story of this.stories) {
            story.attachEventHandlers();
        }
    }

    showStories(storyContainer, stories) {
        stories.forEach(story => {
            story.showPreview(storyContainer);
        });
    }
}