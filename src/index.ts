import express from "express";
import http from "http";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import mongoose from "mongoose";
import router from "./router/routes";


const app = express();

app.use(cors({ credentials: true }));

app.use(compression());
app.use(bodyParser.json());
app.use(cookieParser());
require("dotenv").config();

const server = http.createServer(app);

server.listen(8080, () => {
  console.log("Server is running on port 8080");
});

const MONGO_URL = process.env.MONGO_URL;

//Set Mongoose to use the global Promise object
mongoose.Promise = global.Promise;

//Connect to mongoDB
mongoose
  .connect(MONGO_URL)
  .then(() => console.log("MongoDB connected"))
  .catch((error: Error) => console.log(error));


// Mount the router middleware on the root URL ("/")
app.use("/", router());