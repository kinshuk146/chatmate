const path = require('path')
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const Filter=require('bad-words');
const {generateMessage,generateLocationMessage}=require('./utils/messages')
const{addUser,removeUser,getUser,getUsersInRoom}=require('./utils/users')

const port=process.env.PORT||3000;

var count=0;

const publicDirectoryPath = path.join(__dirname, '../public')
//console.log(publicDirectoryPath)
app.use(express.static(publicDirectoryPath))


io.on('connection', (socket) => {
    console.log('New web socket connection')
    socket.on('sendMessage', ({message,Username},callback) => {
        const user=getUser(socket.id);
        if(user)
        {
        const filter=new Filter();
        if(filter.isProfane(message))
        {
            return callback('Profanity is not allowed')
        }
        console.log(message);
      io.to(user.room).emit('message',generateMessage({message,Username}));
      callback('Delivered');
        }});
    socket.on('countUpdated',()=>{
        io.emit('increment',(count++));
    })

    socket.on('join',({Username,room},callback)=>{
        const {error,user}=addUser({id:socket.id,Username,room});
        if(error)
        {
            return callback(error);
        }
        socket.join(user.room);
        socket.emit('message',generateMessage({message:'Welcome',Username:undefined}))
        socket.broadcast.to(user.room).emit('message',generateMessage({message:`${user.Username} has joined`,Username:'Admin'}));
        io.to(user.room).emit('roomData',{
            room:user.room,
            users:getUsersInRoom(user.room)
        })

        callback();
    })

    socket.on('disconnect',()=>{
        user=removeUser(socket.id)
        console.log(user);
        //console.log(getUsersInRoom(user.room))
        if(user)
        {
            io.to(user.room).emit('message',generateMessage({message:`${user.Username} has left the room`,Username:'Admin'}))
            io.to(user.room).emit('roomData',{
                room:user.room,
                users:getUsersInRoom(user.room)
            })
        }
    })

    socket.on('sendLocation',(position,callback)=>{
        //io.emit('message','longitude '+position.longitude+' latitude '+position.latitude);
        const user=getUser(socket.id);
        console.log(position.Username)
        io.to(user.room).emit('locationMessage',generateLocationMessage({url:`https://google.com/maps?q=${position.latitude},${position.longitude}`,Username:position.Username}));
        callback();
    })
  });
  
server.listen(port, () => {
    console.log('listening on port: '+port);
  });

