# Multiplayer Bomberman

**Multiplayer Bomberman** is a real-time browser-based game built with **vanilla JavaScript**, a **custom mini-framework**, and **WebSockets** for multiplayer functionality. This project was developed as an educational experiment in client-server game design.

---

## 📝 Overview

This project implements a classic Bomberman-style game in the browser. Players can move around a grid, place bombs, and interact with each other in real-time. The project focuses on:

- Real-time multiplayer networking.
- Client-server architecture with WebSockets.
- Game state management using a custom mini-framework.

---

## ⚡ Features

- Real-time multiplayer gameplay.
- Custom mini-framework for game rendering and logic.
- Browser-based, using only **vanilla JavaScript** (no frameworks like React or Vue).
- Bomb placement, explosions, and player interactions.
- Lightweight and educational: demonstrates networking, state synchronization, and game loop mechanics.

---

## 💻 Installation & Running

1. Clone the repository:

```bash
git clone https://github.com/yourusername/multiplayer-bomberman.git
cd multiplayer-bomberman
```

2. Start the Backend server (Node.js required):

```bash
cd backend
npm install
npm start
```

3. Start the frontend (Go required):

```bash
cd frontend
go run main.go
```

4. Open your browser at:

  *http://localhost:8000*

5. Connect multiple clients in different tabs or devices to play multiplayer.

---

## 🎯 Purpose

This project was developed to demonstrate:

- Building real-time multiplayer games using WebSockets.
- Implementing client-server communication and game state synchronization.
- Designing a custom mini-framework for game logic and rendering.
- Practical experience in JavaScript, Go, and Node.js development.
- A strong example to showcase full-stack and real-time application skills on a CV.
