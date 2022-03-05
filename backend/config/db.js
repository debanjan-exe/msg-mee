const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(`mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASS}@cluster0.iswki.mongodb.net/msgmeDB`, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        // const conn = await mongoose.connect("mongodb://localhost:27017/chamtDB")

        console.log(`MongoDB connected : ${conn.connection.host}`);
    } catch (err) {
        console.log(`Error : ${err.message}`);
        process.exit();
    }
}


module.exports = connectDB;