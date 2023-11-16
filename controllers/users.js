const bcrypt = require('bcryptjs')
const usersRouter = require('express').Router()
const User = require('../models/users')


// add new user
usersRouter.post('/', async (req, res) => {
    if ( req.body.password.length < 3 ) return res.status(400).json({ error: "Bad password, be must atleast 3 chars" })
    const { username, name, password } = req.body


    // Hashing and salting
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({
        username,
        name,
        passwordHash
    })

    try {
        savedUser = await user.save()
        res.status(201).json(savedUser)
    }
    catch (error) {
        if (error.name === "ValidationError") {
            res.status(400).json( { 
                error: "Bad username, must be atleast 3 chars and unique" 
            })
        }
    }
})


// Show users
usersRouter.get('/', (req, res) => {
    User.find({})
    .populate('blogs')
    .then( response => res.json(response) )

})

module.exports = usersRouter