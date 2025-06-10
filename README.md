# Rifa - WebRTC Video Chat Application

A romantic video chat application built with React and Node.js, designed for connecting hearts across any distance.

## Architecture

This application is structured as a client-server architecture:

- **Frontend (Client)**: React application running on Vite dev server (port 5173)
- **Backend (Server)**: Node.js signaling server using Socket.IO (port 3001)

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

### Running the Application

#### Option 1: Run both client and server together
```bash
npm run dev
```

#### Option 2: Run client and server separately

**Terminal 1 - Start the signaling server:**
```bash
npm run server
```

**Terminal 2 - Start the client:**
```bash
npm run client
```

### Accessing the Application

- **Client**: http://localhost:5173
- **Server Health Check**: http://localhost:3001/health

## How It Works

1. **Signaling Server**: Handles room management and WebRTC signaling between peers
2. **WebRTC Connection**: Direct peer-to-peer connection for video/audio streams
3. **Chat System**: Real-time messaging through the signaling server

## Features

- 🎥 HD Video calling
- 🎤 Crystal clear audio
- 💬 Real-time chat messaging
- 🏠 Room-based connections
- 📱 Responsive design
- 💖 Romantic, minimal UI

## Troubleshooting

### Common Issues

1. **"Server connection lost"**: Make sure the signaling server is running on port 3001
2. **Camera/Microphone access denied**: Allow permissions in your browser
3. **Connection fails**: Check if both users are in the same room with the correct room code

### Debug Information

- Check browser console for detailed logs
- Server logs show connection status and room management
- Health check endpoint: `http://localhost:3001/health`

## Technical Details

- **Frontend**: React 18, TypeScript, Tailwind CSS, Vite
- **Backend**: Node.js, Express, Socket.IO
- **WebRTC**: Native browser APIs with STUN servers for NAT traversal
- **Signaling**: Socket.IO for real-time communication

## Development

The application uses a modular structure:

- `src/components/`: React components
- `src/utils/`: WebRTC and signaling utilities
- `src/types/`: TypeScript type definitions
- `server/`: Node.js signaling server

## Production Deployment

For production deployment:

1. Build the client: `npm run build`
2. Deploy the server to a cloud provider
3. Update the signaling server URL in `src/utils/signaling.ts`
4. Serve the built client files statically