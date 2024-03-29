import mongoose from "mongoose";

mongoose.set('strictQuery', false);

mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

const db = mongoose.connection;

const handleOpen = () => console.log("Connected to DB");
const handleError = (error) => console.log("DB error", error);

db.once("open", handleOpen);
db.on("error", handleError);
