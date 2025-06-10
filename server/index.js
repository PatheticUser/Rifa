import express from "express";
import { Server } from "socket.io";
import cors from "cors";
import fs from "fs";
import https from "https";
import path from "path";

// SSL certs from root
const certOptions = {
  key: fs.readFileSync(path.resolve("./localhost+1-key.pem")),
  cert: fs.readFileSync(path.resolve("./localhost+1.pem")),
};

const app = express();

// HTTPS server
const httpsServer = https.createServer(certOptions, app);

// Socket.IO with CORS config
const io = new Server(httpsServer, {
  cors: {
    origin: ["https://localhost:5173", "https://192.168.1.105:5173"],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(cors());
app.use(express.json());

// Active rooms and users
const rooms = new Map();
const users = new Map();

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    activeRooms: rooms.size,
    activeUsers: users.size,
  });
});

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Handle joining a room
  socket.on("join-room", (data) => {
    const { roomId, username } = data;

    console.log(`${username} (${socket.id}) joining room: ${roomId}`);

    // Store user info
    users.set(socket.id, { username, roomId });

    // Join the socket room
    socket.join(roomId);

    // Get or create room
    if (!rooms.has(roomId)) {
      rooms.set(roomId, {
        id: roomId,
        users: [],
        createdAt: new Date(),
      });
    }

    const room = rooms.get(roomId);

    // Check if room is full
    if (room.users.length >= 2) {
      socket.emit("error", {
        message: "Room is full! Maximum 2 users allowed.",
      });
      return;
    }

    // Add user to room
    room.users.push({ socketId: socket.id, username });

    // Notify others in the room
    socket.to(roomId).emit("user-joined", { username, socketId: socket.id });

    // Send room info to the user
    socket.emit("room-joined", {
      roomId,
      users: room.users,
      isInitiator: room.users.length === 2, // Second person becomes initiator
    });

    console.log(`Room ${roomId} now has ${room.users.length} users`);
  });

  // Handle WebRTC signaling
  socket.on("webrtc-signal", (data) => {
    const { roomId, targetSocketId, signal } = data;
    const user = users.get(socket.id);

    if (!user) return;

    console.log(
      `Relaying ${signal.type} from ${user.username} to ${targetSocketId}`
    );

    // Send signal to specific user or broadcast to room
    if (targetSocketId) {
      socket.to(targetSocketId).emit("webrtc-signal", {
        signal,
        fromSocketId: socket.id,
        fromUsername: user.username,
      });
    } else {
      socket.to(roomId).emit("webrtc-signal", {
        signal,
        fromSocketId: socket.id,
        fromUsername: user.username,
      });
    }
  });

  // Handle chat messages
  socket.on("chat-message", (data) => {
    const { roomId, message } = data;
    const user = users.get(socket.id);

    if (!user) return;

    const chatMessage = {
      id: Date.now().toString(),
      username: user.username,
      text: message,
      timestamp: new Date(),
    };

    // Broadcast to room (including sender for confirmation)
    io.to(roomId).emit("chat-message", chatMessage);
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    const user = users.get(socket.id);

    if (user) {
      console.log(`${user.username} (${socket.id}) disconnected`);

      const { roomId } = user;
      const room = rooms.get(roomId);

      if (room) {
        // Remove user from room
        room.users = room.users.filter((u) => u.socketId !== socket.id);

        // Notify others in the room
        socket.to(roomId).emit("user-left", {
          username: user.username,
          socketId: socket.id,
        });

        // Clean up empty rooms
        if (room.users.length === 0) {
          rooms.delete(roomId);
          console.log(`Room ${roomId} deleted (empty)`);
        }
      }

      users.delete(socket.id);
    }
  });

  // Handle explicit leave room
  socket.on("leave-room", () => {
    const user = users.get(socket.id);

    if (user) {
      const { roomId } = user;
      socket.leave(roomId);

      // Trigger disconnect logic
      socket.emit("disconnect");
    }
  });
});

const PORT = process.env.PORT || 3001;

httpsServer.listen(PORT, () => {
  console.log(`Signaling server running on port ${PORT}`);
  console.log(`WebSocket endpoint: https://localhost:${PORT}`);
  console.log(`Health check: https://localhost:${PORT}/health`);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully");
  httpsServer.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});
