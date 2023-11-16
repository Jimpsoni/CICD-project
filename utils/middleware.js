const User = require('../models/users')
const jwt = require('jsonwebtoken')

const tokenExtractor = (request, response, next) => {
    const authorization = request.get('authorization')
    if (authorization && authorization.startsWith('Bearer ')) request.token = authorization.replace('Bearer ', '')
    else request.token = null
    next()
}

const userExtractor = async (request, response, next) => {
    let token
    const authorization = request.get('authorization')
    if (authorization && authorization.startsWith('Bearer ')) token = authorization.replace('Bearer ', '')
    else return response.status(400).json({ error: 'token missing or invalid' })

    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!decodedToken.id) return response.status(401).json({ error: 'token invalid' })
    const user = await User.findById(decodedToken.id)
    request.user = user
    next()
}

const errorhandler = (error, request, response, next) => {
    if (error.name ===  'JsonWebTokenError') return response.status(400).json({ error: 'token missing or invalid' })
    next()
}

module.exports = { tokenExtractor, errorhandler, userExtractor }