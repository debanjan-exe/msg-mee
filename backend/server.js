require("dotenv").config()
const express = require("express");
const connectDB = require("./config/db");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const path = require("path");

const PORT = process.env.PORT || 5000;

connectDB()
const app = express();
app.use(express.json()); //to accept JSON data

app.get("/", (req, res) => {
    res.send("API running successfully");
})

app.use("/api/user", userRoutes)
app.use("/api/chat", chatRoutes)
app.use("/api/message", messageRoutes)

app.use(notFound)
app.use(errorHandler)

// -------------------Deployment-------------------

// const __dirname1 = path.resolve();

// if (process.env.NODE_ENV === "production") {
//     app.use(express.static(path.join(__dirname1, "/frontend/build")));

//     app.get("*", (req, res) =>
//         res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"))
//     );
// } else {
//     app.get("/", (req, res) => {
//         res.send("API is running..");
//     });
// }

// -------------------Deployment-------------------

const server = app.listen(PORT, () => {
    console.log(`server started on http://localhost:${PORT}`);
})

const io = require("socket.io")(server, {
    pingTimeout: 60000,
    cors: {
        origin: "http://localhost:3000",
    },
});

io.on("connection", (socket) => {
    console.log("connected to socket.io");

    socket.on('setup', (userData) => {
        socket.join(userData._id);
        socket.emit("connected");
    });

    socket.on("join chat", (room) => {
        socket.join(room);
        console.log("User joined Room : " + room);
    });

    socket.on("typing", (room) => {
        socket.in(room).emit("typing")
    })

    socket.on("stop typing", (room) => {
        socket.in(room).emit("stop typing")
    })

    socket.on("new message", (newMessageReceived) => {
        var chat = newMessageReceived.chat;
        if (!chat.users) return console.log("chat.users not defined");

        chat.users.forEach((user) => {
            if (user._id == newMessageReceived.sender._id) return;

            socket.in(user._id).emit("message received", newMessageReceived)
        })
    })

    socket.off("setup", () => {
        console.log("User Disconnected");
        socket.leave(userData._id);
    });
})