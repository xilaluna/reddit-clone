const jwt = require("jsonwebtoken")

const User = require("../models/user")

module.exports = (app) => {
  app.get("/sign-up", (req, res) => {
    res.render("sign-up")
  })
  app.post("/sign-up", (req, res) => {
    // Create User and JWT
    const user = new User(req.body)

    user
      .save()
      .then((user) => {
        var token = jwt.sign({ _id: user._id }, process.env.SECRET, { expiresIn: "60 days" })
        res.cookie("nToken", token, { maxAge: 900000, httpOnly: true })
        res.redirect("/")
      })
      .catch((err) => {
        console.log(err.message)
        return res.status(400).send({ err: err })
      })
  })
  app.get("/logout", (req, res) => {
    res.clearCookie("nToken")
    res.redirect("/")
  })
  app.get("/login", (req, res) => {
    res.render("login")
  })

  app.post("/login", (req, res) => {
    const username = req.body.username
    const password = req.body.password
    // Find this user name
    User.findOne({ username }, "username password")
      .then((user) => {
        if (!user) {
          // User not found
          return res.status(401).send({ message: "Wrong Username or Password" })
        }
        // Check the password
        user.comparePassword(password, (err, isMatch) => {
          if (!isMatch) {
            // Password does not match
            return res.status(401).send({ message: "Wrong Username or password" })
          }
          // Create a token
          const token = jwt.sign({ _id: user._id, username: user.username }, process.env.SECRET, {
            expiresIn: "60 days",
          })
          // Set a cookie and redirect to root
          res.cookie("nToken", token, { maxAge: 900000, httpOnly: true })
          res.redirect("/")
        })
      })
      .catch((err) => {
        console.log(err)
      })
  })
}
