const express = require('express')
const connectDB = require('./config/db')
// const io = require('socket.io')
// const cors =require('cors')
require('dotenv').config()
const userRoutes = require('./routes/user')
const chatRoutes = require('./routes/chats')
// ************* send message api **********************
const messageRoutes = require('./routes/messages')
// ******************************************************
const { notFound, errorHandler } = require('./middleware/errorHandle')

const app = express()

connectDB()


// const corsOptions = {
//   origin: 'http://localhost:3000',
//   methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
//   // allowedHeaders: [
//   //   'Content-Type', ''
//   // ]
// }

// app.use(cors(corsOptions))

app.use(express.json())

app.get('/', (req, res) => {
  res.send('API is running')
})

app.use((req, res, next) => {
  console.log(req.path, req.method)
  next()
})

app.use('/api/user', userRoutes)
app.use('/api/chat', chatRoutes)
// **********************************
app.use('/api/message', messageRoutes)
// *******************************

app.use(notFound)
app.use(errorHandler)

const server = app.listen(process.env.PORT, console.log('Server started on PORT 5000'))

const io = require('socket.io')(server, {
  // amount of time it will wait before closing connection
  // to save bandwidth
  pingTimeout: 60000,
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
  }
})

io.on("connection", (socket) => {
  console.log("Connection made")

  // User should be connected to personal socket
  socket.on("setup", (userData) => {
    // creates new room for client with use id
    socket.join(userData._id)
    // console.log(userData._id)
    // to pass connection updates
    socket.emit("connected")
  })
  // for joining chats 
  socket.on("join_chat", (room) => {
    socket.join(room)
    console.log("User Joined Room: " + room)
  })

  socket.on("typing", (room) =>
    socket.in(room).emit("typing")
  )

  socket.on("stop_typing", (room) =>
    socket.in(room).emit("stop_typing")
  )
  
  socket.on("new_message", (newMessageReceived) => {

    // which chat it belongs to, parse in a var
    var chat = newMessageReceived.chat_owner

    // if no user exists
    if (!chat.users) {
      return console.log('Chat user not defined')
    }

    console.log('success pass')

    // pass to all other users but me
    chat.users.forEach((user) => {
      // if chat of owner is the same as that  of sender, return 
      if (user._id === newMessageReceived.sender._id) {
        return console.log('not success')
      }

      socket.in(user._id).emit("message_received", newMessageReceived)
      console.log('success')
    })

  })

  socket.off("setup", (userData) => {
    console.log(" USER DISCONNECTED")
    socket.leave(userData._id)
  })

})

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