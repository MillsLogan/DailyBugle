const express = require("express");
const cookieParser = require("cookie-parser");
const { MongoClient, ObjectId } = require("mongodb");

// Input Constants
const HOSTURL = process.env.HOSTURL || "localhost";
const AUTH_API = `http://${HOSTURL}:8080/api/dailybugle/auth/`;
const mongoURI = `mongodb://${HOSTURL}:27017`;
const appURL = process.env.LISTENING_IP || "localhost";
const port = process.env.PORT || 3062;

const db_name = "dailybugle";
const db_collection = "articles";

// Server Constants
const app = express();
const client = new MongoClient(mongoURI);

// Middleware
app.use(express.json());
// Helps with parsing cookies
app.use(cookieParser());

app.listen(port, appURL, () => {
    console.log(`Server running on port ${port}`);
});

app.get("/", async (req, res) => {
    getAllArticles(res);
});

app.get("/categories", async (req, res) => {
    getAllCategories(res);
});

app.get("/categories/:category", async (req, res) => {
    getCategoryArticles(req.params.category, res);
});

app.get("/:id", async (req, res) => {
    getArticleById(req.params.id, res);
});

app.post("/", async (req, res) => {
    res.locals.user = await validateUser(req, res);
    if (!res.locals.user) {
        return;
    }

    if (res.locals.user.role !== "author") {
        res.status(403).send("Forbidden");
        return;
    }

    createArticle(req.body, res);
});

app.put("/:id", async (req, res) => {
    res.locals.user = await validateUser(req, res);
    
    if (!res.locals.user) {
        return;
    }

    if (res.locals.user.role !== "author") {
        res.status(403).send("Forbidden");
        return;
    }

    updateArticle(req.params.id, req.body, res);
});

app.delete("/:id", async (req, res) => {
    res.locals.user = await validateUser(req, res);
    
    if (!res.locals.user) {
        return;
    }

    if (res.locals.user.role !== "author") {
        res.status(403).send("Forbidden");
        return;
    }

    deleteArticle(req.params.id, res);
});

app.get("/search/:query", async (req, res) => {
    searchArticles(req.params.query, res);
});

async function searchArticles(query, res) {
    try {
        await client.connect();
        await client.db(db_name).collection(db_collection)
            .createIndex({ title: "text", teaser: "text", body: "text" });
        return await client.db(db_name).collection(db_collection)
            .find({ $text: { $search: query, $caseSensitive: false } })
            .project({ body: 0 })
            .toArray()
            .then(articles => {
                res.json(articles);
            });
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    } finally {
        await client.close();
    }
}

async function deleteArticle(id, res) {
    if (!ObjectId.isValid(id)) {
        res.status(400).send("Invalid ID");
        return;
    }

    try {
        await client.connect();
        await client.db(db_name).collection(db_collection)
            .deleteOne({ _id: ObjectId.createFromHexString(id) })
            .then(result => {
                res.json(result);
            });
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    } finally {
        await client.close();
    }
}

async function updateArticle(id, article, res) {
    if (!ObjectId.isValid(id)) {
        res.status(400).send("Invalid ID");
        return;
    }

    article.edited_at = new Date();
    article.edited_by = ObjectId.createFromHexString(res.locals.user._id);
    article.categories = article.categories.map(category => category.toLowerCase().trim());

    try {
        await client.connect();
        await client.db(db_name).collection(db_collection)
            .updateOne({ _id: ObjectId.createFromHexString(id) }, { $set: article })
            .then(result => {
                res.json(result);
            });
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    } finally {
        await client.close();
    }
}

async function validateUser(req, res) {
    if (!req.cookies.session_id) {
        res.status(401).send("Unauthorized");
        return;
    }

    return fetch(AUTH_API, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Cookie": "session_id=" + req.cookies.session_id
        }
    }).then(res => {
        if (res.status === 200) {
            return res.json();
        } else {
            return null;
        }
    });
}

async function createArticle(article, res) {
    if (!article.title || 
        !article.teaser || 
        !article.body || 
        !article.categories) {
        res.status(400).send("Missing required fields");
        return;
    }
    article.author = ObjectId.createFromHexString(res.locals.user._id);
    article.created_at = new Date();
    article.edited_at = null;
    article.edited_by = null;

    article.categories = article.categories.map(category => category.toLowerCase().trim());

    try {
        await client.connect();
        await client.db(db_name).collection(db_collection)
            .insertOne(article)
            .then(result => {
                res.json(result);
            });
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    } finally {
        await client.close();
    }
}

async function getArticleById(id, res) {
    if (!ObjectId.isValid(id)) {
        res.status(400).send("Invalid ID");
        return;
    }

    try {
        await client.connect();
        return await client.db(db_name).collection(db_collection)
            .findOne({ _id: ObjectId.createFromHexString(id) })
            .then(article => {
                res.json(article);
            });
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    } finally {
        await client.close();
    }
}

async function getCategoryArticles(category, res) {
    try {
        await client.connect();
        return await client.db(db_name).collection(db_collection)
            .find({ categories: category })
            .project({ body: 0 })
            .toArray()
            .then(articles => {
                res.json(articles);
            });
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    } finally {
        await client.close();
    }
}

async function getAllCategories(res) {
    try {
        await client.connect();
        return await client.db(db_name).collection(db_collection)
            .distinct("categories")
            .then(categories => {
                res.json(categories);
            });
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    } finally {
        await client.close();
    }
}

async function getAllArticles(res) {
    try {
        await client.connect();
        return await client.db(db_name).collection(db_collection)
            .find()
            .project({ body: 0 })
            .toArray()
            .then(articles => {
                res.json(articles);
            });
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    } finally {
        await client.close();
    }
}