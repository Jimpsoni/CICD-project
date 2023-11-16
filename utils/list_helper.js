const dummy = (blogs) => {
    return 1
  }


const totalLikes = (blogs) => {
  if (blogs.length == 0) return 0

  let total = 0

  Object.values(blogs).forEach(blog => {
    total += blog.likes
  });

  return total
}


const favoriteBlog = (blogs) => {
  if (blogs.length == 0) return null

  let bestBlog = blogs[0]

  Object.values(blogs).forEach( blog => {
      if (blog.likes > bestBlog.likes) bestBlog = blog
    }
  )

  return {
    'title': bestBlog.title,
    'author': bestBlog.author,
    'likes': bestBlog.likes   
  }
}





module.exports = {
    dummy, 
    totalLikes,
    favoriteBlog
  }