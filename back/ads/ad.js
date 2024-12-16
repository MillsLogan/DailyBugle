// Dependencies
const express = require("express");
const cookieParser = require("cookie-parser");
const useragent = require("express-useragent");
const { MongoClient, ObjectId } = require("mongodb");

// Input Constants
const HOST_URL = process.env.HOSTURL || "localhost";
const mongoURI = `mongodb://${HOST_URL}:27017`;
const appURL = process.env.LISTENING_IP || "localhost";
const port = process.env.PORT || 3065;

// Server Constants
const app = express();
const client = new MongoClient(mongoURI);

const db_name = "dailybugle";
const db_collections = {
    ads: "ads",
    impressions: "impressions",
    interactions: "interactions"
}

app.use(express.json());
app.use(cookieParser());
app.use(useragent.express());

app.listen(port, appURL, () => {
    console.log(`Server running on port ${appURL}:${port}`);
});

async function logImpression(impression_data) {
    try {
        await client.connect();
        await client.db(db_name)
            .collection(db_collections.impressions)
            .insertOne(impression_data);
    } catch (error) {
        console.log(error);
        return false;
    } finally {
        await client.close();
    }
    return true;
}

async function logInteraction(interaction_data) {
    try {
        await client.connect();
        await client.db(db_name)
            .collection(db_collections.interactions)
            .insertOne(interaction_data);
    } catch (error) {
        console.log(error);
        return false;
    } finally {
        await client.close();
    }
    return true;
}

app.get("/", async (req, res) => {
    let ad = null;
    try {
        await client.connect();
        await client.db(db_name).collection(db_collections.ads)
            .aggregate([ { $sample: { size: 1 } } ])
            .toArray()
            .then(ads => {
                if (ads.length === 0) {
                    return res.status(404).send("No ads found");
                } else {
                    ad = ads[0];
                    res.json(ads[0]);
                }
            });
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    } finally {
        await client.close();
    }
});

app.post("/impression", async (req, res) => {
    let impression_data = collecUserData(req);
    if (!impression_data) {
        return res.status(400).send("Bad Request");
    }

    if (await logImpression(impression_data))
        res.status(200).send("Impression logged");
    else
        res.status(500).send("Internal Server Error");
});

app.post("/interaction", async (req, res) => {
    let interaction_data = collecUserData(req);
    if (!interaction_data) {
        return res.status(400).send("Bad Request");
    }

    if (req.body.interaction_type)
        interaction_data.interaction_type = req.body.interaction_type;
    else
        return res.status(400).send("Bad Request");

    if (await logInteraction(interaction_data))
        res.status(200).send("Interaction logged");
    else
        res.status(500).send("Internal Server Error");
});

function collecUserData(req) {
    impression_data = {};
    if (req.body.ad_id) 
        impression_data.ad_id = req.body.ad_id;
    else
        return null;

    if (req.body.page)
        impression_data.page = req.body.page;
    else
        impression_data.page = "#home";

    if (req.body.user_id)
        impression_data.user_id = req.body.user_id;
    else
        impression_data.user_id = "anonymous";

    impression_data.user_os = req.useragent.os;
    impression_data.user_browser = req.useragent.browser;
    impression_data.user_platform = req.useragent.platform;
    impression_data.user_ip = req.ip;
    impression_data.user_is_mobile = req.useragent.isMobile;
    impression_data.user_is_desktop = req.useragent.isDesktop;
    impression_data.created_date = new Date();
    return impression_data;
}
