## Realtime Chat App

Full-stack chat application with WebSocket backend and modern React frontend

## Live Demo

- Frontend: https://jonkermoo.github.io/chat-app/
- Backend: https://chat-app-server-2y11.onrender.com

## Tools:

# Frontend:

- Vite
- React
- TypeScript
- Tailwind CSS
- Redux Toolkit
- Redux-Saga

# Backend:

- Node.js
- WebSockets

## Features

- Realtime messaging
- Frontend hosted on GitHub Pages
- Backend hosting on Render
- Responsive UI
- Falls back to 'localhost' if cloud server unavailable
- Render server auto pinged by UptimeRobot

## 📝 Notes

- Render Free Plan: Backend may sleep if idle
- UptimeRobot keeps keeps backend awake
- To test locally:

  ```bash
  # start backend
  cd server && npm start

  # start frontend
  npm run dev
  ```
