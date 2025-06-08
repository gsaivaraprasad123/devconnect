import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.routes"
import userRoutes from "./routes/user.routes"
import postRoutes from "./routes/post.routes"


const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes)
app.use("/api/v1/posts", postRoutes )


app.get('/', (req, res) => {
  res.send('hello world')
})


export default app;