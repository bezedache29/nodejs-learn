const router = require('express').Router();
const verify = require('../lib/verifyToken')
const ObjectID = require('mongoose').Types.ObjectId;
const Post = require('../models/Posts');
const User = require('../models/User');
const Comment = require('../models/Comment')
const jwt = require('jsonwebtoken')


router.get('/', async (req, res) => {
    Post.find((err, content) => {
        !err ? res.send(content) : res.send(err)
    });
})



router.post('/new', async (req, res) => {
    const current_token = req.header('auth-token');
    const current_user = jwt.verify(current_token, process.env.TOKEN_SECRET)
    console.log(current_user)
    const user = await User.findById(current_user.user.id)

    const newRecord = new Post({
        user_info: current_user.user,
        author: current_user.user.name,
        title: req.body.title,
        description: req.body.description,
        user: user.id
    });

    const savedPost = await newRecord.save()
    user.posts.push(savedPost)
    // user.posts = (savedPost)
    await user.save()

    res.send(savedPost)


    // newRecord.save((err, content) => {
    //     !err ? res.send(content) : res.send('Post new record : ' + err)
    // });
 });

 router.get("/:id", (req, res, next) => {
    const id = req.params.id;
    Post.findById(id)
      .exec()
      .then(doc => {
        console.log("From database", doc);
        if (doc) {
          res.status(200).json({
              posts: doc,
              request: {
                  type: 'GET',
                  url: 'http://localhost:3000/api/posts'
              }
          });
        } else {
          res
            .status(404)
            .json({ message: "No valid entry found for provided ID" });
        }
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({ error: err });
      });
  });

router.post('/:id/comments', async (req, res, next) => {
  const { id } = req.params
  const { content } = req.body

  const current_token = req.header('auth-token');
  const current_user = jwt.verify(current_token, process.env.TOKEN_SECRET)
  const user = await User.findById(current_user.user.id)
  const post = await Post.findById(id).populate('comments')
  console.log(post)

  const newRecord = new Comment({
    content,
    user_info: current_user.user,
    user: user.id,
    post_info: post,
    post: post.id
  });

  const savedPost = await newRecord.save()
  post.comments.push(savedPost)
  // user.posts = (savedPost)
  await post.save()

  res.send(post)

})

// http://localhost:8000/api/posts/624f3d2fc88a24cad8f006b8
router.put('/:id', async (req, res, next) => {
  const { id } = req.params
  const { title } = req.body
  
  Post.findOneAndUpdate({_id: id}, {$set:{title}}, {new: true}, (err, post) => {
    if (err) {
      console.log("Post not updating ! Retry later");
    }
    res.send(post)
  });
});

router.get("/:id/comments", (req, res, next) => {
  const { id } = req.params
  Post.findById(id)
    .exec()
    .then(doc => {
      console.log("From database", doc);
      if (doc) {
        res.status(200).json({
          post: doc,
        });
      } else {
        res
          .status(404)
          .json({ message: "No valid entry found for provided ID" });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

router.get("/:id/comments/:idComment", (req, res, next) => {
  const { id, idComment } = req.params
  Comment.findById(idComment)
    .exec()
    .then(doc => {
      console.log("From database", doc);
      if (doc) {
        res.status(200).json({
          comment: doc,
        });
      } else {
        res
          .status(404)
          .json({ message: "No valid entry found for provided ID" });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

module.exports = router; 
