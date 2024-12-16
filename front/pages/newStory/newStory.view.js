export class NewStoryView {
    constructor() {
        this.form = document.createElement('form');
        this.form.classList.add('col-11');
        this.form.classList.add('mx-auto');
        this.form.classList.add('my-3');
        this.form.classList.add('bg-body-secondary');
        this.form.classList.add('border');
        this.form.classList.add('p-3');
        this.form.setAttribute('id', 'new-story-form');
        this.form.innerHTML = `
            <h2 class="fs-3">Create a New Story</h2>
            <hr>
            <div class="alert alert-danger d-none" id="story-error" role="alert"></div>
            <div class="form-floating mb-3">
                <input type="text" class="form-control" id="title" placeholder="Title">
                <label for="title">Title</label>
                <div class="invalid-feedback">
                    Please enter a title for your story
                </div>
            </div>
            <div class="form-floating mb-3">
                <input type="text" class="form-control" id="teaser" placeholder="Teaser">
                <label for="teaser">Teaser</label>
                <div class="invalid-feedback">
                    Please enter a teaser for your story
                </div>
            </div>
            <div class="form-floating mb-3">
                <textarea class="form-control" id="body" placeholder="Body" rows="10" style="height:100%"></textarea>
                <label for="body">Body</label>
                <div class="invalid-feedback">
                    Please enter the body of your story
                </div>
            </div>
            <div class="form-floating mb-3">
                <input type="text" class="form-control" id="categories" placeholder="Categories">
                <label for="categories">Categories</label>
                <div class="input-hint">
                    Separate categories with commas (,) e.g. news, politics, sports
                </div>
                <div class="invalid-feedback">
                    Please enter the categories for your story
                </div>
            </div>
            <div class="form-floating mb-3">
                <input type="text" class="form-control" id="image" placeholder="Image URL">
                <label for="image">Image URL</label>
                <div class="invalid-feedback">
                    Please enter the image URL for your story
                </div>
            </div>
        <button type="submit" class="btn btn-primary">Submit</button>
        `;
    }

    render(parentElement) {
        parentElement.appendChild(this.form);
    }

    removeError() {
        const errorElement = document.getElementById('story-error');
        errorElement.classList.add('d-none');
        errorElement.style.display = 'none';

        const formControls = this.form.querySelectorAll('.form-control');
        formControls.forEach(control => {
            control.classList.remove('is-invalid');
        });
    }

    showError(message) {
        const errorElement = document.getElementById('story-error');
        errorElement.textContent = message;
        errorElement.classList.remove('d-none');
        errorElement.style.display = 'block';
    }

    fillForm(story) {
        document.getElementById('title').value = story.title;
        document.getElementById('teaser').value = story.teaser;
        document.getElementById('body').value = story.body;
        document.getElementById('categories').value = story.categories.join(',');
        document.getElementById('image').value = story.image;
    }

    showTitleError(message) {
        const title = document.getElementById('title');
        title.classList.add('is-invalid');
        title.nextElementSibling.textContent = message;
    }

    showBodyError(message) {
        const body = document.getElementById('body');
        body.classList.add('is-invalid');
        body.nextElementSibling.textContent = message;
    }

    showCategoriesError(message) {
        const categories = document.getElementById('categories');
        categories.classList.add('is-invalid');
        categories.nextElementSibling.textContent = message;
    }

    showTeaserError(message) {
        const teaser = document.getElementById('teaser');
        teaser.classList.add('is-invalid');
        teaser.nextElementSibling.textContent = message;
    }
}
