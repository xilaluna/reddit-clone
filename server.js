const express = require("express")
const app = express()

const exphbs = require("express-handlebars")

app.engine("handlebars", exphbs({ defaultLayout: "main" }))
app.set("view engine", "handlebars")

app.get("/", (req, res) => {
  res.render("home")
})

app.listen(3000, () => {
  console.log(`Reddit clone listening at http://localhost:3000`)
})
