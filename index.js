const express = require("express")
const dotenv = require('dotenv');
dotenv.config();
const app = express();
const port = 3000;
const path = require("path");
const mongoose = require('mongoose');
const methodOverride = require('method-override');

// Connect to MongoDB
mongoose.connect(`${process.env.MONGOODB_URI}`, {})
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
app.get("/", async (req, res) => {
    const tweets = await Tweet.find({});
    res.render("index.ejs", { tweets });
});

// Form for new tweet
app.get("/new", (req, res) => {
    res.render("new.ejs");
});

// Show tweet details
app.get("/:id", async (req, res) => {
    const { id } = req.params;
    const tweet = await Tweet.findById(id);
    res.render("show.ejs", { tweet });
});

// Create a new tweet
app.post("/", async (req, res) => {
    const { username, content } = req.body;
    await Tweet.create({ username, content });
    res.redirect("/");
});

// Form to update tweet
app.get("/:id/update", async (req, res) => {
    const { id } = req.params;
    const tweet = await Tweet.findById(id);
    res.render("update.ejs", { tweet });
});

// Update tweet
app.patch("/:id", async (req, res) => {
    const { id } = req.params;
    const { content } = req.body;
    await Tweet.findByIdAndUpdate(id, { content });
    res.redirect("/");
});

// Delete tweet
app.delete("/:id", async (req, res) => {
    const { id } = req.params;
    await Tweet.findByIdAndDelete(id);
    res.redirect("/");
});

app.listen(port, () => {
    console.log(`Running on ${port} port`);
});