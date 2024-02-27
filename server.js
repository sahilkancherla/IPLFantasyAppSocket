const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const {Server} = require("socket.io")
const cors = require("cors")

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
      origin: ['http://localhost:3001'],
    }
})

app.use(cors());

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on("join_room", (data) => {

    const room = data.room
    const username = data.username
    console.log(username, " joined room ", room)


    socket.join(room)
  })

  socket.on("send_auction_joined", (data) => {
    const room = data.room
    socket.to(room).emit('receive_auction_joined')
  })

  socket.on("send_auction_players_added", (data) => {
    const room = data.room
    socket.to(room).emit('receive_auction_players_added')
  })

  socket.on("send_activate_auction", (data) => {
    const room = data.room
    socket.to(room).emit('receive_activate_auction')
  })

  // DURING AUCTION
  socket.on("send_current_player_selected", (data) => {
    const room = data.room
    socket.to(room).emit('receive_current_player_selected')
  })

  socket.on("send_current_player_sold", (data) => {
    const room = data.room
    socket.to(room).emit('receive_current_player_sold')
  })

  socket.on("send_end_auction", (data) => {
    const room = data.room
    socket.to(room).emit('receive_end_auction')
  })

  // STANDARD

  socket.on("send_player_added", (data) => {
    const room = data.room
    socket.to(room).emit('receive_player_added')
  })




  socket.on('send_message', (data) => {
    console.log(data)
    socket.to(data.room).emit('receive_message', {message: data.message});
  });

  socket.on('send_join_user_update', (room) => {
    io.to(room).emit('receive_join_user_update');
  });

  socket.on('send_draft_pick', (room) => {
    console.log("Draft pick sent for room ", room)
    io.to(room).emit('receive_draft_pick');
  });

  socket.on('send_data_scraped', () => {
    
    // edit this to emit to everyone listening
    io.emit('receive_data_scraped');
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

const PORT = process.env.PORT || 3050;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
