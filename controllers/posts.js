const Post = require("../models/post")

module.exports = (app) => {
  app.post("/posts/new", (req, res) => {
    const post = new Post(req.body)
    post.save((err, post) => {
      return res.redirect("/")
    })
  })
}
