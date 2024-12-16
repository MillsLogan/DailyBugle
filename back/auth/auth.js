// Dependencies
const express = require("express");
const cookieParser = require("cookie-parser");
const { MongoClient, ObjectId } = require("mongodb");
const bcrypt = require("bcrypt");

// Input Constants
const HOSTURL = process.env.HOSTURL || "localhost";
const mongoURI = `mongodb://${HOSTURL}:27017`;
const appURL = process.env.LISTENING_IP || "localhost";
const port = process.env.PORT || 3061;

const db_name = "dailybugle";
const db_collections = {
    sessions: "sessions",
    users: "users"
};

// Server Constants
const app = express();
const client = new MongoClient(mongoURI);
addSessionTTL();

function addSessionTTL() {
    client.db(db_name)
        .collection(db_collections.sessions)
        .createIndex({ "createdAt": 1 }, { expireAfterSeconds: 3600 });
}

// Middleware
app.use(express.json());
// Helps with parsing cookies
app.use(cookieParser());
// Check and validate session on all requests
app.use(async (req, res, next) => {
    let session_id = req.cookies.session_id;
    res.locals.user_id = await validateSession(session_id);
    next();
});

app.listen(port, appURL, () => {
    console.log(`Server running on port ${port}`);
});

app.get("/", async (req, res) => {
    if (!res.locals.user_id) {
        res.status(401).send("Unauthorized");
        return;
    }

    res.status(200).json(await getUserInfo(res.locals.user_id));
});

app.post("/login", async (req, res) => {
    if (res.locals.user_id) {
        res.status(200).json(await getUserInfo(res.locals.user_id));
        return;
    }

    let username = req.body.username;
    let password = req.body.password;
    let user = await login(username, password);
    
    if (!user) {
        res.status(400).send("Invalid username or password.");
        return;
    }

    let session_id = await createNewSession(user._id);
    if (!session_id) {
        res.status(500).send("Failed to create session.");
        return;
    }

    res.cookie("session_id", session_id, { expireAfterSeconds: 3600 });
    res.status(200).json(user);
});

app.post("/register", async (req, res) => {
    if (res.locals.user_id) {
        res.status(200).json(await getUserInfo(res.locals.user_id));
        return;
    }

    let username = req.body.username;
    let password = req.body.password;
    let user = await register(username, password);

    if (!user) {
        res.status(400).send("Username already exists.");
        return;
    }

    let session_id = await createNewSession(user._id);
    if (!session_id) {
        res.status(500).send("Failed to create session.");
        return;
    }

    res.cookie("session_id", session_id);
    res.status(200).json(user);
});

app.delete("/logout", async (req, res) => {
    if (!res.locals.user_id) {
        res.status(401).send("Unauthorized");
        return;
    }

    try {
        await client.connect();
        await client.db(db_name)
            .collection(db_collections.sessions)
            .deleteOne({ _id: ObjectId.createFromHexString(req.cookies.session_id) })
            .then((result) => {
                if (result.deletedCount === 0) {
                    res.status(500).send("Failed to delete session");
                    return;
                }
                res.clearCookie("session_id");
                res.status(200).send("Logged out");
            });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
        return;
    } finally {
        await client.close();
    }
});

app.post("/user", async (req, res) => {
    if (!req.body.users) {
        res.status(400).send("Bad Request");
        return;
    }

    let user_ids = [];
    for (let user_id of req.body.users) {
        if (!ObjectId.isValid(user_id)) {
            res.status(400).send("Bad Request");
            return;
        }
        user_ids.push(ObjectId.createFromHexString(user_id));
    }


    try {
        await client.connect();
        await client.db(db_name)
            .collection(db_collections.users)
            .find({ _id: { $in: user_ids } })
            .project({ password: 0, role: 0 })
            .toArray()
            .then((users) => {
                res.status(200).json(users);
            });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    } finally {
        await client.close();
    }
});

async function login(username, password) {
    let user = await getUserByUsername(username);
    if (!user) {
        return null;
    }

    let match = await bcrypt.compare(password, user.password);
    return match ? user : null;
}

async function getUserByUsername(username) {
    try {
        await client.connect();
        return await client.db(db_name)
            .collection(db_collections.users)
            .findOne({ username: username })
            .then((user) => {
                return user;
            })
            .catch((error) => {
                console.error(error);
            });
    } catch (error) {
        console.error(error);
    } finally {
        await client.close();
    }
}

async function validateSession(session_id) {
    if (!session_id || !ObjectId.isValid(session_id)) {
        return null;
    }

    try {
        await client.connect();
        return await client.db(db_name)
            .collection(db_collections.sessions)
            .findOne({ _id: ObjectId.createFromHexString(session_id) })
            .then((session) => {
                return session ? session.user : null;
            })
            .catch((error) => {
                console.error(error);
            });
    } catch (error) {
        console.error(error);
    } finally {
        await client.close();
    }
}

async function getUserInfo(user_id) {
    try {
        await client.connect();
        return await client.db(db_name)
            .collection(db_collections.users)
            .findOne({ _id: user_id }, { projection: { password: 0 } })
            .then((user) => {
                return user;
            })
            .catch((error) => {
                console.error(error);
            });
    } catch (error) {
        console.error(error);
    } finally {
        await client.close();
    }
}

async function createNewSession(user_id) {
    let session_id = new ObjectId();
    try {
        await client.connect();
        await client.db(db_name)
            .collection(db_collections.sessions)
            .insertOne({ _id: session_id, user: user_id, createdAt: new Date() });
    } catch (error) {
        console.error(error);
    } finally {
        await client.close();
    }

    return session_id.toHexString();
}

async function register(username, password) {
    let user = await getUserByUsername(username);
    if (user) {
        return null;
    }

    let hashed_password = await bcrypt.hash(password, 10);
    user = { username: username, password: hashed_password, role: "reader" };
    try {
        await client.connect();
        await client.db(db_name)
            .collection(db_collections.users)
            .insertOne(user)
            .then((result) => {
                user._id = result.insertedId;
            })
            .catch((error) => {
                console.error(error);
            });
    } catch (error) {
        console.error(error);
    } finally {
        await client.close();
    }

    user.password = undefined;
    return user;
}