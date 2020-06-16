const express = require("express");
const app = express();
const http = require("http");
const socketio = require("socket.io");
const port = 3000;
const path = require("path");
const Filter = require("bad-words");
const { generatemsg,generatelocationmsg } = require("./src/utils/helper");
const {  addUser,removeUser,getUser,getroomUsers  } = require("./src/utils/users");


app.use(express.static(path.join(__dirname,"/public/")));
 
const server = http.createServer(app);
const io = socketio(server);

io.on("connection", (socket) => {


    socket.on("join", ({ username , room }, callback) => {

        const {  error,user  } = addUser({  id:socket.id,username:username,room:room  });

        if(error)
            return callback(error);

        socket.join(user.room);
        socket.emit("message", generatemsg("Admin","Welcome !"));
        socket.broadcast.to(user.room).emit("message", generatemsg("Admin",`${user.username} has joined !`));
        
        io.to(user.room).emit("roomData", {
            room: user.room,
            users: getroomUsers(user.room)
        });

        callback();       
    });


    socket.on("sendmessage", (val , callback) => {

        const user = getUser(socket.id);
        
        const filter = new Filter();
        if(filter.isProfane(val))
            return callback("Profanity is not allowed !");

        // console.log("Knpur")
        io.to(user.room).emit("message", generatemsg(user.username,val));
        // console.log("Tara ra ra !")
        callback();

    });
  

    socket.on("get_location", (position, callback) => {
        
        const user = getUser(socket.id);
        io.to(user.room).emit("locationmessage", generatelocationmsg(user.username , `https://www.google.com/maps?q=${position.latitude},${position.longitude}`));
        callback();
    });


    socket.on("disconnect", () => {

        const user = removeUser(socket.id);
        if(user){
            
            io.to(user.room).emit("message", generatemsg("Admin",`${user.username} has left !`));
            io.to(user.room).emit("roomData", {
                room: user.room,
                users: getroomUsers(user.room)
            });

        }

    });

});


server.listen(port,() => {
    console.log("Server is running !");
});











function f() {


    // io.on("connection", (socket) => {

//     let count = 0;

//     console.log("Web Socket Connection !");

//     socket.emit("countUpdated", count);
//     socket.on("increment" ,() => {
//         count++;
//         // socket.emit("countUpdated", count);

//         io.emit("countUpdated", count);
//     });

// });


}
