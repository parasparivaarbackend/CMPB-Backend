import express from "express";
import cors from "cors";
import dbConnect from "./DB/DBConnect.js";
import IndexRoute from "./routes/Index.routes.js";
import cookieParser from "cookie-parser";
const app = express();
import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT || 4100;

app.use(express.json({ limit: "50mb" }));
app.use(
  cors({
    origin: ["https://api.chatmangnipatbyah.org", `http://localhost:3000`],
    credentials: true,
  })
);
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());
app.use("/api/v1", IndexRoute);

dbConnect()
  .then(() =>
    app.listen(PORT, () => {
      console.log("server is running on PORT ", PORT);
    })
  )
  .catch((err) => console.error("error", err));
