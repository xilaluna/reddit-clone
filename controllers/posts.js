const Post = require("../models/post")

module.exports = (app) => {
  app.get("/posts/new", (req, res) => {
    res.render("posts-new")
  })
  app.post("/posts/new", (req, res) => {
    const post = new Post(req.body)
    post.save((err, post) => {
      return res.redirect("/")
    })
  })
}
