const express = require('express')
const connectDB = require('./config/db')
require('dotenv').config()
const userRoutes = require('./routes/user')
const chatRoutes = require('./routes/chats')
const { notFound, errorHandler } = require('./middleware/errorHandle')

const app = express()

connectDB() 

// ***************************
app.use(express.json())
// ************************

app.get('/', (req, res) => {
  res.send('API is running')
})
// **********************************

app.use('/api/user', userRoutes )
app.use('/api/chat', chatRoutes )
// *******************************

app.use(notFound)
app.use(errorHandler)

app.listen(process.env.PORT, console.log('Server started on PORT 5000') )

 


// require('dotenv').config()

// const express = require('express')
// const mongoose = require('mongoose')
// const workoutRoutes = require('./routes/workouts')
// const userRoutes = require('./routes/user')

// // express app
// const app = express()

// // middleware
// app.use(express.json())

// // try install cors package
// app.use(cors())

// app.use((req, res, next) => {
//   console.log(req.path, req.method)
//   next()
// })

// // routes
// app.use('/api/workouts', workoutRoutes)
// app.use('/api/user', userRoutes)

// // connect to db
// mongoose.connect(process.env.MONGO_URI)
//   .then(() => {
//     console.log('connected to database')
//     // listen to port
//     app.listen(process.env.PORT, () => {
//       console.log('listening for requests on port', process.env.PORT)
//     })

//   })
//   .catch((err) => {
//     console.log(err)
//   }) 