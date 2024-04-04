import React, { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import {
  Box,
  Button,
  Container,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

const App = () => {
  const socket = useMemo(
    () =>
      io("http://localhost:3000", {
        withCredentials: true,
      }),
    []
  );

  const [room, setRoom] = useState("");
  const [message, setMessage] = useState("");
  const [socketId, setSocketId] = useState("");
  const [messages, setMessages] = useState([]);
  const [roomName, setRoomName] = useState("");

  // console.log(messages);

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("message", { message, room });
    setMessage("");
  };

  const joinRoomHandler = (e) => {
    e.preventDefault();
    socket.emit("join-room", roomName);
    setRoomName("");
  };

  useEffect(() => {
    socket.on("connect", () => {
      setSocketId(socket.id);
      console.log("Connected", socket.id);
    });
    socket.on("wellcome", (data) => {
      console.log(data);
    });

    socket.on("receive-message", (data) => {
      console.log(data);
      setMessages((messages) => [...messages, data]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <Container maxWidth="sm">
      <Box sx={{ height: 100 }} />
      <Typography variant="h5" component="div" gutterBottom>
        Wellcome to Socket IO
      </Typography>
      <Typography variant="h5" component="div" gutterBottom>
        {socketId}
      </Typography>
      <form onSubmit={joinRoomHandler}>
        <h5>Join Room</h5>
        <TextField
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          id="outlined-basic"
          label="Room Name"
          variant="outlined"
        />
        <Button type="submit" variant="contained" color="primary">
          Join
        </Button>
      </form>
      <form onSubmit={handleSubmit}>
        <TextField
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          variatnt="outlined"
          autoComplete="off"
        ></TextField>
        <TextField
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          variatnt="outlined"
          autoComplete="off"
        ></TextField>
        <Button type="submit" variant="contained" color="primary">
          Send
        </Button>
      </form>
      <Stack>
        {messages.map((message, index) => (
          <Typography key={index} variant="h5" component="div" gutterBottom>
            {message}
          </Typography>
        ))}
      </Stack>
    </Container>
  );
};

export default App;
