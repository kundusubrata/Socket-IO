import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
// import cors from "cors";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

const secretKeyJWT = "asdasdsadasdasdasdsa";
const port = 3000;

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// app.use(
//   cors({
//     origin: "http://localhost:5173",
//     methods: ["GET", "POST"],
//     credentials: true,
//   })
// );

app.get("/", (req, res) => {
  res.send("Hare Krishna");
});

app.get("/login", (req, res) => {
  const token = jwt.sign({ _id: "asdasjdhkasdasdas" }, secretKeyJWT);

  res
    .cookie("token", token, { httpOnly: true, secure: true, sameSite: "none" })
    .json({
      message: "Login Success",
    });
});

io.use((socket, next) => {
  cookieParser()(socket.request, socket.request.res, (err) => {
    if (err) return next(err);

    const token = socket.request.cookies.token;
    if (!token) return next(new Error("Authentication Error"));

    const decoded = jwt.verify(token, secretKeyJWT);
    next();
  });
});

io.on("connection", (socket) => {
  console.log("====================User Connected===========================");
  console.log("Id", socket.id);
  // socket.emit("wellcome", `Wellcome to the server, ${socket.id}`);
  // socket.broadcast.emit("wellcome", `${socket.id}, Joined the server`);    // usually we use (emit) on frontend and we use (on) on backend

  // socket.on("message", (data) => {
  //   console.log(data,socket.id);
  //   // io.emit("receive-message", data);
  //   socket.broadcast.emit("receive-message", data);
  // });

  socket.on("message", ({ message, room }) => {
    console.log(message, room);
    // io.emit("receive-message", data);
    io.to(room).emit("receive-message", message);
    // socket.to(room).emit("receive-message", message);     // It will give same effect as above line of code gives.
  });
  socket.on("join-room", (room) => {
    console.log(room);
    socket.join(room);
    console.log(`User with ID: ${socket.id} joined room: ${room}`);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

server.listen(port, (req, res) => {
  console.log(`Server is Up and running on http://localhost:${port}`);
});
