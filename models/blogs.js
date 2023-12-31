const mongoose = require('mongoose')

const blogSchema = mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String,  required: true },
  url: String,
  likes: { type: Number, default: 0, required: true },
  comments: { type: Array, default: [], required: true },
  user: {type: mongoose.Schema.Types.ObjectId, ref: "User"}
})

blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})


module.exports = mongoose.model('Blog', blogSchema)
