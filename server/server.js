const express = require('express')
const cors = require('cors')
const app = express()
const mongoose = require("mongoose")
require("dotenv").config();
const subscriptionRoutes = require('./routes/subscription.routes')
const notificationRoutes = require('./routes/notification.routes')

const { 
  PORT
} = process.env;

mongoose.connect(
  process.env.MONGODB_URL,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
)
mongoose.connection.once('open', () => {
  console.log('connected to mongoose')
})

app.use(cors())
app.use(express.json())
app.use(
  subscriptionRoutes,
  notificationRoutes
)

app.listen(PORT, () => console.log(`listening to port ${PORT}`))