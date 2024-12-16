export class CommentView {
    static renderComment(comment, parentElement) {
        const commentElement = document.createElement("div");
        commentElement.classList.add("comment");
        commentElement.classList.add("border");
        commentElement.classList.add("p-3");
        commentElement.classList.add("my-3");
        commentElement.classList.add("bg-body-tertiary");
        commentElement.setAttribute("data-comment-id", comment._id);
        commentElement.innerHTML = `
            <div class="border-bottom row">
                <p class="text-muted comment-author col text-capitalize">Posted by: ${comment.user}</p>
                <p class="text-muted comment-date col text-end">Posted on: ${comment.created_at.toLocaleDateString()} ${comment.created_at.toLocaleTimeString()}</p>
            </div>
            <div class="comment-body p-2 fs-5">${comment.body}</div>
        `;
        parentElement.appendChild(commentElement);
    }

    static renderCommentForm(parentElement, story_id) {
        const form = document.createElement("form");
        form.classList.add("comment-form");
        form.setAttribute("id", "add-comment-form");
        form.innerHTML = `
            <div class="alert alert-danger d-none" id="comment-error" role="alert"></div>
            <div class="row d-flex">
            <div class="col-10">
                <div class="form-floating">
                    <textarea class="form-control" placeholder="Leave a comment here" id="commentInput"></textarea>
                    <label for="commentInput">Leave a Comment</label>
                </div>
                <input type="hidden" name="story_id" value="${story_id}">
            </div>
            <div class="col-2">
                <button class="btn btn-success my-auto" type="submit">Post Comment</button>
            </div>
            </div>
        `;
        parentElement.appendChild(form);
    }

    static renderLoginToComment(parentElement) {
        const loginMessage = document.createElement("div");
        loginMessage.classList.add("alert");
        loginMessage.classList.add("alert-warning");
        loginMessage.classList.add("text-center");
        loginMessage.classList.add("my-3");
        loginMessage.setAttribute("id", "login-message");
        loginMessage.classList.add("fs-6");
        loginMessage.innerHTML = `
            <p class="fs-5">Please <a href="#login">login</a> to leave a comment</p>
        `;
        loginMessage.style.display = "block";
        parentElement.appendChild(loginMessage);
    }

    static renderCommentError(message) {
        const errorElement = document.getElementById("comment-error");
        errorElement.textContent = message;
        errorElement.classList.remove("d-none");
        errorElement.style.display = "block";
    }

    static clearCommentError() {
        const errorElement = document.getElementById("comment-error");
        errorElement.textContent = "";
        errorElement.style.display = "none";
    }
}