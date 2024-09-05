require("dotenv").config()
const express = require("express")
const layouts = require("express-ejs-layouts")
const router = require("./routes/index")
const path = require("path")
const methodOverride = require("method-override")
const db = require("./config/db")

port = process.env.PORT || 3000

db()
const app = express()

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.set("layout", path.join(__dirname, "views/layouts/main.ejs"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(layouts);
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method", { methods: ["POST", "GET"] }));
app.use(router);


app.listen(port, () => {
    console.log(`Listening on http://localhost:${port} `)
});