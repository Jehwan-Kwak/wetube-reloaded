import mongoose from "mongoose";

mongoose.set('strictQuery', false);

mongoose.connect("mongodb://127.0.0.1:27017/wetube");

const db = mongoose.connection;

const handleOpen = () => console.log("Connected to DB");
const handleError = (error) => console.log("DB error", error);

db.once("open", handleOpen);
db.on("error", handleError);
