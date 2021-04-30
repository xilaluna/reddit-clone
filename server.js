require("dotenv").config()
const express = require("express")
const bodyParser = require("body-parser")
const expressValidator = require("express-validator")
var cookieParser = require("cookie-parser")
const jwt = require("jsonwebtoken")

const app = express()

app.use(cookieParser())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(expressValidator())

const exphbs = require("express-handlebars")
app.engine("handlebars", exphbs({ defaultLayout: "main" }))
app.set("view engine", "handlebars")

require("./controllers/posts.js")(app)
require("./controllers/comments.js")(app)
require("./controllers/auth.js")(app)
require("./data/reddit-db")

app.listen(3000, () => {
  console.log(`Reddit clone listening at http://localhost:3000`)
})

module.exports = app
