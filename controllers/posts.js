const Post = require("../models/post")
const User = require("../models/user")

module.exports = (app) => {
  app.get("/", (req, res) => {
    var currentUser = req.user

    console.log(req.cookies)

    Post.find({})
      .lean()
      .populate("author")
      .then((posts) => {
        res.render("posts-index", { posts, currentUser })
      })
      .catch((err) => {
        console.log(err.message)
      })
  })

  // CREATE
  app.post("/posts/new", (req, res) => {
    if (req.user) {
      var post = new Post(req.body)
      post.author = req.user._id
      post.upVotes = []
      post.downVotes = []
      post.voteScore = 0

      post
        .save()
        .then((post) => {
          return User.findById(req.user._id)
        })
        .then((user) => {
          user.posts.unshift(post)
          user.save()

          res.redirect(`/posts/${post._id}`)
        })
        .catch((err) => {
          console.log(err.message)
        })
    } else {
      return res.sendStatus(401) // UNAUTHORIZED
    }
  })

  app.get("/posts/new", (req, res) => {
    let currentUser = req.user

    res.render("posts-new", { currentUser })
  })

  // SHOW
  app.get("/posts/:id", function (req, res) {
    var currentUser = req.user
    Post.findById(req.params.id)
      .populate("comments")
      .lean()
      .then((post) => {
        res.render("posts-show", { post, currentUser })
      })
      .catch((err) => {
        console.log(err.message)
      })
  })

  // SUBREDDIT
  app.get("/n/:subreddit", function (req, res) {
    var currentUser = req.user
    Post.find({ subreddit: req.params.subreddit })
      .lean()
      .then((posts) => {
        res.render("posts-index", { posts, currentUser })
      })
      .catch((err) => {
        console.log(err)
      })
  })

  app.put("/posts/:id/vote-up", function (req, res) {
    User.findById(req.user._id).then((user) => {
      Post.findById(req.params.id).then((post) => {
        if (!post.upVotes.includes(user._id)) {
          if (post.downVotes.includes(user._id)) {
            console.log("removing from downvotes")
            let index = post.downVotes.indexOf(user._id)
            post.downVotes.splice(index, 1)
          }
          post.upVotes.push(req.user._id)
          post.voteScore = post.upVotes.length - post.downVotes.length
          post.save()
          res.status(200).send({})
        } else {
          res.status(200).send({})
        }
      })
    })
  })

  app.put("/posts/:id/vote-down", function (req, res) {
    User.findById(req.user._id).then((user) => {
      Post.findById(req.params.id).then((post) => {
        if (!post.downVotes.includes(user._id)) {
          if (post.upVotes.includes(user._id)) {
            console.log("removing from upvotes")
            let index = post.upVotes.indexOf(user._id)
            post.upVotes.splice(index, 1)
          }
          post.downVotes.push(req.user._id)
          post.voteScore = post.upVotes.length - post.downVotes.length
          post.save()
          res.status(200).send({})
        } else {
          res.status(200).send({})
        }
      })
    })
  })
}
