const config = require('./utils/config')
const logger = require('./utils/logger')
const app = require('./app')

// Getting the port
const PORT = 5000

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`)
})
