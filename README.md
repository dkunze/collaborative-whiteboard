# Collaborative Whiteboard

A real-time collaborative whiteboard application where users can draw, change colors, adjust line thickness, and collaborate with others in real-time.

## Features

- Draw on a shared canvas with multiple users in real-time.
- Select different colors for drawing.
- Adjust line thickness (Thicker/Thinner).
- Automatically resizes the canvas to fit the browser window.
- Collaborative experience powered by WebSockets (Socket.IO).

---

## Getting Started

### Prerequisites

Make sure you have the following installed on your system:

- [Node.js](https://nodejs.org/) (v14 or later)
- npm (comes with Node.js)

---

### Installation

1. **Clone the repository:**

   ```bash
   git clone <REPOSITORY_URL>
   cd collaborative-whiteboard
   ```

2. **Install frontend dependencies:**

   ```bash
   npm install
   ```

3. **Set up the backend server:**
   Create a new folder named `server` and add a simple backend:

   - Navigate to the `server` folder:
     ```bash
     mkdir server && cd server
     ```
   - Initialize the backend:
     ```bash
     npm init -y
     npm install express socket.io cors
     ```
   - Create `server.js`:
     ```javascript
     const express = require('express');
     const http = require('http');
     const { Server } = require('socket.io');
     const cors = require('cors');

     const app = express();
     const server = http.createServer(app);
     const io = new Server(server, {
       cors: {
         origin: '*',
         methods: ['GET', 'POST'],
       },
     });

     app.use(cors());

     io.on('connection', (socket) => {
       console.log('User connected:', socket.id);

       socket.on('draw', (data) => {
         socket.broadcast.emit('draw', data);
       });

       socket.on('disconnect', () => {
         console.log('User disconnected:', socket.id);
       });
     });

     const PORT = 4000;
     server.listen(PORT, () => {
       console.log(`Server is running on http://localhost:${PORT}`);
     });
     ```

4. **Run the backend server:**

   ```bash
   node server.js
   ```

5. **Run the frontend application:**
   Open a new terminal window, navigate back to the root directory, and run:

   ```bash
   npm start
   ```

---

## Usage

- Open the application in your browser at `http://localhost:3000`.
- Draw on the canvas using your mouse.
- Adjust color and line thickness using the controls.
- Open the application in another browser or device to collaborate in real-time.

---

## Deployment

### Deploying Frontend

- Use services like [Netlify](https://www.netlify.com/) or [Vercel](https://vercel.com/).

### Deploying Backend

- Deploy the backend to a cloud service like [Heroku](https://www.heroku.com/) or [Render](https://render.com/).

---

## License

This project is licensed under the MIT License.

