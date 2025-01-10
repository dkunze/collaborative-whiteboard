const express = require('express')
const http = require('http')
const { Server } = require('socket.io')
const cors = require('cors')

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
})

app.use(cors())

io.on('connection', (socket) => {
  console.log('User connected:', socket.id)

  socket.on('beginPath', (data) => {
    socket.broadcast.emit('beginPath', data) // Enviar inicio de línea a otros usuarios
  })

  socket.on('draw', (data) => {
    socket.broadcast.emit('draw', data) // Enviar puntos de dibujo a otros usuarios
  })

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id)
  })
})

const PORT = 4000
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
