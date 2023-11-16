var util= require('util');
var encoder = new util.TextEncoder('utf-8');

const mongoose = require('mongoose')
const supertest = require('supertest')

const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blogs')


const initialBlogs = [
    {
        title: "Hello World!",
        author: "Jimi Jukkala",
        url: "www.google.com",
        likes: 242
    },
    {
        title: "Coding is fun!",
        author: "Peppi",
        url: "www.yahoo.com",
        likes: 243
    },
]


beforeEach(async () => {
    await Blog.deleteMany({})

    let blogObject = new Blog(initialBlogs[0])
    await blogObject.save()
    blogObject = new Blog(initialBlogs[1])
    await blogObject.save()
})


describe("Test api methods at api/blogs", () => {

    test("Get method is working", async () => {
        const response = await api.get('/api/blogs')
        expect(response.body).toHaveLength(initialBlogs.length)
    })

    test("blogs have id", async () => {
        const response = await api.get('/api/blogs')
        response.body.map( blog => expect(blog.id).toBeDefined() )
    })
})



describe("Some values are empty", () => {
    test("If we dont give likes a value", async () => {
        const request = {
            author: 'Mastermind',
            title: 'How to get likes',
            url: 'www.youtube.com'
        }

        await api.post('/api/blogs').send(request)
        const response = await api.get('/api/blogs')
        
        // test that every blog has likes key
        response.body.map( blog => expect(blog.likes).toBeDefined() )

        // test that title "How to get likes" has zero likes
        response.body.map( blog => { if (blog.title === 'How to get likes') expect(blog.likes).toBe(0) }
        )
    })

    test("if we dont give title", async () => {
        const request = {
            author: 'Sherlock',
            url: 'www.youtube.com',
            likes: 20
        }

        const response = await api.post('/api/blogs').send(request)

        // test that app returns code 400
        expect(response.statusCode).toBe(400)
    })

    test("if title is empty", async () => {
        const request = {
            author: 'Sherlock',
            title: '',
            url: 'www.youtube.com',
            likes: 20
        }

        const response = await api.post('/api/blogs').send(request)

        // test that app returns code 400
        expect(response.statusCode).toBe(400)
    })

    test("if we dont give author", async () => {
        const request = {
            title: 'Testing with JETS',
            url: 'www.youtube.com',
            likes: 20
        }

        const response = await api.post('/api/blogs').send(request)

        // test that app returns code 400
        expect(response.statusCode).toBe(400)
    })

    test("if author is empty", async () => {
        const request = {
            author: '',
            title: 'Testing with JETS',
            url: 'www.youtube.com',
            likes: 20
        }

        const response = await api.post('/api/blogs').send(request)

        // test that app returns code 400
        expect(response.statusCode).toBe(400)
    })
})


describe("Editing a blog", () => {
    test("Editing a single blog", async () => {
        const req = await api.get('/api/blogs')
        const updateID = req.body[0].id

        const newData = {
            likes: 200
        }

        await api.put(`/api/blogs/${updateID}`).send(newData)


        const r = await api.get('/api/blogs')
        Object.values(r.body).forEach(blog => {
            if (blog.id === updateID ) {
                expect(blog.likes).toBe(newData.likes)
                return
            }
        })
    })

})


afterAll(async () => {
    await mongoose.connection.close()
  })
