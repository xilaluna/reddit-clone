const express = require("express")
const bodyParser = require("body-parser")
const expressValidator = require("express-validator")

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(expressValidator())

const exphbs = require("express-handlebars")
app.engine("handlebars", exphbs({ defaultLayout: "main" }))
app.set("view engine", "handlebars")

require("./controllers/posts.js")(app)
require("./data/reddit-db")

app.get("/", (req, res) => {
  res.render("home")
})

app.listen(3000, () => {
  console.log(`Reddit clone listening at http://localhost:3000`)
})
