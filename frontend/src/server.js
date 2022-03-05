require("dotenv").config()
const express = require("express");
const connectDB = require("./config/db");
const { chats } = require("./data/data");
const PORT = process.env.PORT || 5000;
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes")
const { notFound, errorHandler } = require("./middleware/errorMiddleware")

connectDB();
const app = express();

app.use(express.json()); //to accept JSON data

app.get("/", (req, res) => {
    console.log("API running successfully");
})

app.use("/api/user", userRoutes)
app.use("/api/chat", chatRoutes)

app.use(notFound)
app.use(errorHandler)

app.listen(PORT, () => {
    console.log(`server started on http://localhost:${PORT}`);
})