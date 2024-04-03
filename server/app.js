import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";


const port = 3000;

const app = express();
const server = createServer(app);
const io = new Server(server,{
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true,
    }
});

app.get("/", (req, res) => {
  res.send("Hare Krishna");
});

io.on("connection", (socket) => {
  console.log("User Connected");
  console.log("Id", socket.id);
});

server.listen(port, (req, res) => {
  console.log(`Server is Up and running on http://localhost:${port}`);
});
