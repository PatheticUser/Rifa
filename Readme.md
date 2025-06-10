# Rifa - Connect Across Distance

A real-time, peer-to-peer video chat app built using **React**, **WebRTC**, and **Socket.IO** over a secure **HTTPS/WSS** connection. This project enables 1-on-1 video calls, dynamic room handling, and WebRTC signaling over LAN with support for mobile and desktop clients.

---

## 🔧 Features

- Real-time 1-on-1 video calls via WebRTC
- Custom signaling server using Express and Socket.IO
- Secure communication using HTTPS and WSS
- LAN support — works across local devices (PC and mobile)
- Room join/leave management and cleanup
- Chat messages (optional feature)
- Health check endpoint for backend status

---

## 📦 Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Backend**: Node.js + Express + Socket.IO
- **WebRTC**: Peer connection, ICE candidates, media stream handling
- **Security**: Self-signed certificate for HTTPS/WSS communication

---

## 🚀 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/yourusername/rifa-webrtc.git
cd rifa-webrtc
npm install
````

---

### 2. Generate SSL Certificates (Dev only)

Use `mkcert` (or similar) to generate self-signed certificates:

```bash
mkcert localhost 127.0.0.1
```

Move generated files to project root:

```bash
mv ./localhost+1.pem ./project/
mv ./localhost+1-key.pem ./project/
```

---

### 3. Start Backend

```bash
npm run server
```

This starts the HTTPS server on `https://localhost:3001` with WSS enabled.

---

### 4. Start Frontend

```bash
npm run client
```

Access the frontend at:

* `https://localhost:5173` *(on PC)*
* `https://<your-local-ip>:5173` *(on Mobile)*

> ⚠ Visit the backend link in browser first (e.g. [https://192.168.1.105:3001](https://192.168.1.105:3001)) and **"Proceed Anyway"** to trust the self-signed cert.

---

## 🧪 Test on Two Devices

1. Open the app on PC and Mobile (via local IP)
2. Enter same room ID and username
3. Initiate call from one device — WebRTC will handle the rest

---

## 📋 Health Check Endpoint

Access: `https://localhost:3001/health`

Returns JSON status of server, rooms, and active users.

---

## 📄 License

MIT — free to use, build on, and modify.

---

> Made with coffee and console.logs by [Rameez](https://github.com/PatheticUser)

