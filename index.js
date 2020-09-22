const express = require('express')
const app = express()

require('./startup/config')()
require('./startup/handle-uncaught-errors')()
require('./startup/routes')(app)
require('./startup/model-association')()
// require('./db/db-sync')()

app.listen(port = (process.env.PORT || 3000), () => {
  console.log(`Listening on port ${port}`)
})
