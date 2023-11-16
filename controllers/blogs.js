const blogRouter = require("express").Router()
const Blog = require("../models/blogs")
const userExtractor = require("../utils/middleware").userExtractor

blogRouter.get("/", (request, response) => {
  Blog.find({})
    .populate("user")
    .then((blogs) => {
      response.json(blogs)
    })
})

blogRouter.post("/", userExtractor, async (request, response) => {
  const body = request.body
  const user = request.user
  console.log(user)
  const newBlog = {
    ...body,
    user: user.id,
  }

  const blog = new Blog(newBlog)

  try {
    const result = await blog.save()
    const data = await result.populate("user")
    response.status(201).json(data)
  } catch (error) {
    if (error.name === "ValidationError")
      response.status(400).json({ error: error.message })
  }
})

blogRouter.delete("/:id", userExtractor, async (request, response) => {
  let blog
  try {
    blog = await Blog.findById(request.params.id)
  } catch {
    return response.status(400).end()
  }

  if (blog.user.toString() === request.user.id.toString()) {
    try {
      await Blog.findByIdAndRemove(request.params.id)
      response.status(204).end()
    } catch (e) {
      response.status(500).json(e)
    }
  } else {
    response.status(401).end()
  }
})

blogRouter.put("/:id", (request, response) => {
  const likes = request.body.likes

  Blog.findByIdAndUpdate(
    request.params.id,
    { likes: likes },
    {
      new: false,
      runValidators: true,
      context: "query",
    }
  )
    .then((updatedBlog) => response.json(updatedBlog))
    .catch((error) => {
      console.log(error)
      response.status(400).end()
    })
})

blogRouter.post("/:id/comments", (request, response) => {
  const comments = request.body
  console.log(comments)
  Blog.findByIdAndUpdate(
    request.params.id,
    { comments:  comments},
    {
      new: true,
      runValidators: true,
      context: "query",
    }
  )
    .then((updatedBlog) => {
      
      console.log(updatedBlog)
      return response.json(updatedBlog)}
      
      )
    .catch((error) => {
      console.log(error)
      response.status(400).end()
    })
})

module.exports = blogRouter
