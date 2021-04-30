const Post = require("../models/post")

module.exports = (app) => {
  app.get("/", (req, res) => {
    Post.find({})
      .lean()
      .then((posts) => {
        res.render("posts-index", { posts })
      })
      .catch((err) => {
        console.log(err.message)
      })
  })

  app.get("/n/:subreddit", function (req, res) {
    Post.find({ subreddit: req.params.subreddit })
      .lean()
      .then((posts) => {
        res.render("posts-index", { posts })
      })
      .catch((err) => {
        console.log(err)
      })
  })

  app.get("/posts/new", (req, res) => {
    res.render("posts-new")
  })

  app.post("/posts/new", (req, res) => {
    const post = new Post(req.body)
    post.save((err, post) => {
      return res.redirect("/")
    })
  })

  app.get("/posts/:id", function (req, res) {
    Post.findById(req.params.id)
      .lean()
      .then((post) => {
        res.render("posts-show", { post })
      })
      .catch((err) => {
        console.log(err.message)
      })
  })
}
