import { ROUTES, API_ROUTES } from './constants.js';
import { HomeController } from './pages/home/home.controller.js';
import { LoginController } from './pages/login/login.controller.js';
import { RegisterController } from './pages/register/register.controller.js';
import { StoryPageController } from './pages/story/storyPage.controller.js';
import { NewStoryController } from './pages/newStory/newStory.controller.js';
import { CategoryPageController } from './pages/category/category.controller.js';
import { SearchController } from './pages/search/search.controller.js';


export class User {
    constructor(_id, username, role) {
        this._id = _id;
        this.username = username;
        this.role = role;
    }

    static anonymous() {
        return new User(null, null, null);
    }

    static async fetchUser() {
        return fetch(API_ROUTES.AUTH, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Cookie": document.cookie
            }
        }).then(response => {
            if (response.status === 200) {
                return response.json().then(data => {
                    return new User(data._id, data.username, data.role);
                });
            } else {
                return User.anonymous();
            }
        });
    }

    get id() {
        return this._id;
    }

    get isAuthor() {
        return this.role === "author";
    }

    get isReader() {
        return this.role === "reader";
    }

    get isAnonymous() {
        return !this.role;
    }
}

export class Ad {
    constructor(id, image, title) {
        this.id = id;
        this.title = title;
        this.image = image
    }

    static async fetchAd() {
        return fetch(API_ROUTES.AD, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Cookie": document.cookie
            }
        }).then(response => {
            console.log(response);
            if (response.status === 200) {
                return response.json().then(data => {
                    console.log(data);
                    return new Ad(data._id, data.image, data.title);
                });
            } else {
                return null;
            }
        });
    }

    logImpression(page) {
        fetch(API_ROUTES.AD + "impression", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Cookie": document.cookie
            },
            body: JSON.stringify({ ad_id: this.id, page: page })
        });
    }

    logInteraction(page) {
        fetch(API_ROUTES.AD + "interaction", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Cookie": document.cookie
            },
            body: JSON.stringify({ ad_id: this.id, page: page, interaction_type: "click" })
        });
    }
}

export class Category {
    constructor(name) {
        this.name = name;
    }

    static async fetchCategories() {
        return fetch(API_ROUTES.ARTICLE + "categories", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        }).then(response => {
            if (response.status === 200) {
                return response.json().then(data => {
                    return data.map(category => new Category(category));
                });
            } else {
                return null;
            }
        });
    }

    renderNavLink(parentElement) {
        const navLink = document.createElement("a");
        navLink.classList.add("nav-link");
        navLink.classList.add("text-capitalize");
        navLink.href = `?category=${this.name}#category`;
        navLink.innerText = this.name;
        parentElement.appendChild(navLink);
    }

    setActive() {
        document.querySelector(`[href="?category=${this.name}#category"]`).classList.add("active");
    }

    static getActive() {
        return document.querySelector("#categoriesList a.active").innerText;
    }

    static clearActive() {
        document.querySelectorAll("#categoriesList a").forEach(a => a.classList.remove("active"));
    }
}

var user = null;
var ad = null;
var categories = null;
window.onhashchange = route;
document.onload = route();
var controller = null;
var GETPARAMS = null;

async function route() {
    user = User.fetchUser();
    ad = Ad.fetchAd();
    categories = await Category.fetchCategories().then(categories => {
        const categoryNav = document.getElementById("categoriesList");
        categoryNav.innerHTML = "";
        categoryNav.innerHTML = `<a href="#home" class="nav-link text-capitalize active">home</a> <a href="#search" class="nav-link text-capitalize">search</a>`;
        categories.forEach(category => category.renderNavLink(categoryNav));
        return categories;
    });
    
    GETPARAMS = new URLSearchParams(window.location.search);
    const ROUTE = window.location.hash;
    document.getElementById("content").innerHTML = "";
    showUserInformation();
    switch (ROUTE) {
        case ROUTES.HOME:
            controller = getHomeController();
            break;
        case ROUTES.ARTICLE:
            controller = getArticleController();
            break;
        case ROUTES.CATEGORY:
            controller = getCategoryController();
            break;
        case ROUTES.SEARCH:
            controller = getSearchController();
            break;
        case ROUTES.LOGIN:
            controller = getLoginController();
            break;
        case ROUTES.REGISTER:
            controller = getRegisterController();
            break;
        case ROUTES.LOGOUT:
            controller = getLogoutController();
            break;
        case ROUTES.NEWSTORY:
            controller = getNewStoryController();
            break;
        default:
            controller = getHomeController();
            break;
    }
    controller = await controller;
    controller.render(document.getElementById("content"));
    ad = await ad;
    if (!user.isAuthor){
        showAd(ad);
        ad.logImpression(ROUTE);
    } else {
        document.getElementById("adContainer").style.display = "none";
    }
}

async function getSearchController() {
    return new SearchController(await user);
}

async function getCategoryController() {
    return new CategoryPageController(new Category((await GETPARAMS.get("category"))), await user);
}

async function getNewStoryController() {
    return new NewStoryController(await user, await GETPARAMS.get("story"));
}

async function getRegisterController() {
    return new RegisterController(await user);
}

async function getLoginController() {
    return new LoginController(await user);
}

async function getHomeController() {
    return new HomeController(await user);
}

async function getLogoutController() {
    await user;
    LoginController.logout();
}

async function showUserInformation() {
    user = await user;
    if (user.isAnonymous) {
        document.getElementById("userProfile")
            .innerHTML = `<a href="${ROUTES.LOGIN}">Login</a> | <a href="${ROUTES.REGISTER}">Register</a>`;
    } else {
        const userProfile = document.getElementById("userProfile");
        userProfile.innerHTML = `Welcome, ${user.username}!`;
        userProfile.classList.add("text-capitalize");
        userProfile.href = "#logout";
    }
}

async function showAd(ad) {
    const adContainer = document.getElementById("adContainer");
    adContainer.innerHTML = `
        <img src="${ad.image}" alt="${ad.title}" class="img-fluid">
    `;
    adContainer.onclick = () => {
        ad.logInteraction(window.location.hash);
    }
}

async function getArticleController() {
    console.log(GETPARAMS.get("story"));
    return new StoryPageController(GETPARAMS.get("story"), await user);
}

export async function setActiveCategories(setActiveCats) {
    Category.clearActive();
    categories = await categories;
    categories.forEach(category => {
        if (setActiveCats.includes(category.name)) {
            category.setActive();
        }
    })
}

