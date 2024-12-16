export class HomeView {
    static getStoryContainer(contentContainer) {
        const storyContainer = document.createElement("div");
        storyContainer.classList.add("row");
        storyContainer.classList.add("row-cols-1");
        storyContainer.classList.add("g-2");
        storyContainer.classList.add("justify-content-center");
        storyContainer.classList.add("align-items-center");
        storyContainer.classList.add("pt-3");
        contentContainer.appendChild(storyContainer);
        return storyContainer;
    }

    static getHeadlineContainer(contentContainer) {
        const headlineContainer = document.createElement("div");
        headlineContainer.classList.add("row");
        headlineContainer.classList.add("p-3");
        headlineContainer.classList.add("pb-0");
        headlineContainer.classList.add("mb-2");
        contentContainer.appendChild(headlineContainer);
        return headlineContainer;
    }

    static showNewStoryButton(contentContainer) {
        const newStoryButton = document.createElement("a");
        newStoryButton.classList.add("btn");
        newStoryButton.classList.add("btn-info");
        newStoryButton.classList.add("col-4");
        newStoryButton.classList.add("mx-auto");
        newStoryButton.classList.add("mt-3");
        newStoryButton.href = "#newstory";
        newStoryButton.innerHTML = "Create a New Story";
        contentContainer.appendChild(newStoryButton);
    }
}