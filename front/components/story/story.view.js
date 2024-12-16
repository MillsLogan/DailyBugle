export class StoryView {

    static renderHeadline(parentElement, story) {
        parentElement.innerHTML = `
            <div class="mx-auto row redBoxShadow bg-body-primary rounded-3" data-story-id="${story._id}">
                <div class="col-3 m-auto">
                    <img src="${story.image}" class="img-fluid rounded-start" alt="${story.title}">
                </div>
                <div class="col-9 p-5 pb-1">
                    <h2 class="fs-2 fw-bold text-center">${story.title}</h2>
                    <hr>
                    <p class="fs-5 text-center">${story.teaser}</p>
                    <div class="row">
                        <a class="btn btn-danger col-8 my-auto" href="?story=${story._id}#article">Read More</a>
                        <p class="col-4 fs-6 text-end">
                            <small class="text-muted">
                                ${story.author} 
                                <br>
                                ${story.created_at.toLocaleDateString()} ${story.created_at.toLocaleTimeString()}
                            </small>
                        </p>
                    </div>
                </div>
            </div>
        `
    }

    static renderStoryPreview(parentElemenet, story) {
        parentElemenet.innerHTML += `
            <div class="card mb-3 bg-body-tertiary redBoxShadow col mx-auto p-0 storyPreview" style="max-width: 45%" data-story-id="${story._id}">
                <div class="row g-0 p-0">
                    <div class="col-12 p-2 text-center">
                        <div class="card-body">
                            <h5 class="card-title fs-4">${story.title}</h5>
                            <hr>
                            <p class="card-text fs-6">${story.teaser}</p>
                        </div>
                    </div>
                </div>
                <div class="row row-cols-2 mx-3 border-top">
                    <p class="card-text col text-start">
                        <small class="text-body-secondary">${story.author}</small>
                    </p>
                    <p class="card-text col text-end">
                        <small class="text-body-secondary">${story.created_at.toLocaleDateString()} ${story.created_at.toLocaleTimeString()}</small>
                    </p>
                </div>
            </div>
        `
    }

    static renderStoryPage(parentElement, story) {
        parentElement.innerHTML = `
        <div class="col-11 bg-body-tertiary border m-auto">
            <div class="row border-bottom text-center justify-content-center">
                <h1 class="fs-1 fw-bold">${story.title}</h1>
                <p class="fs-5">${story.teaser}</p>
                <img src="${story.image}" class="img-fluid rounded-3 py-3" style="max-width: 50%" alt="${story.title}">
                <div class="row justify-content-between text-center" id="categories-display-container">
                    <p class="fs-6 text-muted justify-content-between">
                        ${story.categories.map(category => {
                            return `<span class="badge bg-danger text-capitalize mx-auto">${category}</span>`
                        }).join(' ')}
                    </p>
                </div>
            </div>
            <div class="row mt-3">
                <div class="col-12">
                    <p class="fs-6">${story.body}</p>
                    <p class="fs-6 text-muted">
                        Written by: ${story.author} 
                        <br>
                        Posted on: ${story.created_at.toLocaleDateString()} ${story.created_at.toLocaleTimeString()}
                    </p>
                    ${story.edited_at ? `
                        <p class="fs-6 text-muted">
                            Last edited on: ${story.edited_at.toLocaleDateString()} ${story.edited_at.toLocaleTimeString()} by ${story.edited_by}
                        </p>
                    ` : ''}

                </div>
            </div>
        </div>
        `
    }
}