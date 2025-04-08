const express = require("express")
const app = express();
const port = 3000;
const path = require("path");
const mongoose = require('mongoose');
const methodOverride = require('method-override');

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/twitterDB", {})
.then(() => {
    console.log("Connected to MongoDB");
})
.catch((err) => {
    console.error("Error connecting to MongoDB", err);
});

const tweetSchema = new mongoose.Schema({
    username: String,
    content: String
});
const Tweet = mongoose.model("Tweet", tweetSchema);

app.use(express.urlencoded({ extended: true }))
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride('_method'))

// List all tweets
app.get("/twitter", async (req, res) => {
    const tweets = await Tweet.find({});
    res.render("index.ejs", { tweets });
});

// Form for new tweet
app.get("/twitter/new", (req, res) => {
    res.render("new.ejs");
});

// Show tweet details
app.get("/twitter/:id", async (req, res) => {
    const { id } = req.params;
    const tweet = await Tweet.findById(id);
    res.render("show.ejs", { tweet });
});

// Create a new tweet
app.post("/twitter", async (req, res) => {
    const { username, content } = req.body;
    await Tweet.create({ username, content });
    res.redirect("/twitter");
});

// Form to update tweet
app.get("/twitter/:id/update", async (req, res) => {
    const { id } = req.params;
    const tweet = await Tweet.findById(id);
    res.render("update.ejs", { tweet });
});

// Update tweet
app.patch("/twitter/:id", async (req, res) => {
    const { id } = req.params;
    const { content } = req.body;
    await Tweet.findByIdAndUpdate(id, { content });
    res.redirect("/twitter");
});

// Delete tweet
app.delete("/twitter/:id", async (req, res) => {
    const { id } = req.params;
    await Tweet.findByIdAndDelete(id);
    res.redirect("/twitter");
});

app.listen(port, () => {
    console.log(`Running on ${port} port`);
});