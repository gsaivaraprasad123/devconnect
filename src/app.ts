import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.routes"
import userRoutes from "./routes/user.routes"
import postRoutes from "./routes/post.routes"
import bookmarkRoutes from "./routes/bookmark.routes";
import searchRoutes from "./routes/search.routes";


const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes)
app.use("/api/v1/posts", postRoutes );
app.use("/api/v1/posts", bookmarkRoutes);
app.use("/api/v1/search", searchRoutes);


app.get('/', (req, res) => {
  res.send('hello world')
})


export default app;