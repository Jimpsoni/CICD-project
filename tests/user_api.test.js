const mongoose = require('mongoose')
const supertest = require('supertest')

const app = require('../app')
const api = supertest(app)

const User = require('../models/users')

const initialUsers = [
    {
        username: "TestUser",
        name: "Jimi",
        passwordHash: "testing",
        blogs: ['652e797477445400b31ca2f9']
    }
]


beforeEach(async () => {
    await User.deleteMany({})
    let userObject = new User(initialUsers[0])
    await userObject.save()
})


describe("Test adding a new user", () => {

    test("Bad username raises error", async () => {
        const newUser = {
            username: "Ji",
            name: "test",
            password: "testing"
        }

        const response = await api.post('/api/users').send(newUser)
        expect(response.status).toBe(400)
        expect(response.body.error).toBeDefined()

        newUser.username = ""
        const response2 = await api.post('/api/users').send(newUser)
        expect(response2.status).toBe(400)
        expect(response2.body.error).toBeDefined()
    }) 

    test("Username must be unique", async () => {
        const newUser = {
            username: "TestUser",
            name: "test",
            password: "testing"
        }
        
        const response = await api.post('/api/users').send(newUser)
        expect(response.status).toBe(400)
        expect(response.body.error).toBeDefined()


    })

    test("Bad password raises error", async () => {
        const newUser = {
            username: "TestUser",
            name: "test",
            password: "te"
        }
        
        const response = await api.post('/api/users').send(newUser)
        expect(response.status).toBe(400)
        expect(response.body.error).toBeDefined()


    })

})

afterAll(async () => {
    await mongoose.connection.close()
  })