// Dependencies
const express = require("express");
const cookieParser = require("cookie-parser");
const { MongoClient, ObjectId } = require("mongodb");

// Input Constants
const HOSTURL = process.env.HOSTURL || "localhost";
const AUTH_API = `http://${HOSTURL}:8080/api/dailybugle/auth/`;
const mongoURI = `mongodb://${HOSTURL}:27017`;
const appURL = process.env.LISTENING_IP || "localhost";
const port = process.env.PORT || 3064;
const db_name = "dailybugle";
const db_collection = "comments";

// Server Constants
const client = new MongoClient(mongoURI);
const app = express();

app.use(express.json());
app.use(cookieParser());

app.listen(port, appURL, () => {
    console.log(`Server running on port ${port}`);
});

app.get("/article/:article_id", async (req, res) => {
    let article_id = req.params.article_id;
    let comments = await getCommentsByArticleId(article_id);
    res.json(comments);
});

app.post("/", async (req, res) => {
    let userID = await validateUserSession(req.cookies.session_id);
    if (!userID) {
        res.status(401).send("Unauthorized");
        return;
    } 
    
    let commentInfo = getCommentInfo(req.body, userID);
    if (!commentInfo) {
        res.status(400).send("Bad Request");
        return;
    }

    try {
        await client.connect();
        await client.db(db_name)
            .collection(db_collection)
            .insertOne(commentInfo);
        res.status(201).send("Comment created");
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    } finally {
        await client.close();
    }
});

async function validateUserSession(session_id) {
    if (!session_id || !ObjectId.isValid(session_id)) {
        return false;
    }

    try {
        return await fetch(AUTH_API, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Cookie": `session_id=${session_id}`
            }
        }).then(response => {
            if (response.status === 200) {
                return response.json().then(data => {
                    return data._id;
                });
            } else {
                return null;
            }
        });
    } catch (error) {
        console.log(error);
        return null;
    }
}

function getCommentInfo(body, user_id) {
    if (!body.story_id || !body.body) {
        return null;
    }

    return {
        story_id: ObjectId.createFromHexString(body.story_id),
        user_id: ObjectId.createFromHexString(user_id),
        body: body.body,
        created_at: new Date(),
        edited_at: null,
        edited_by: null
    };
}

async function getCommentsByArticleId(story_id) {
    if (!ObjectId.isValid(story_id)) {
        return [];
    }
    try {
        await client.connect();
        return await client.db(db_name)
            .collection(db_collection)
            .find({ story_id: ObjectId.createFromHexString(story_id) })
            .sort({ created_at: -1 })
            .toArray()
            .then(comments => {
                return comments
                });
    } catch (error) {
        console.log(error);
        return [];
    } finally {
        await client.close();
    }
}
