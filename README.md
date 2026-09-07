# 🎮 Tic-Tac-Toe Game

A modern, responsive, and feature-rich Tic-Tac-Toe web application built with **React 19**, **React Router**, and **Vite**. 

Play locally with a friend, challenge an intelligent AI across multiple difficulty levels, or create/join sessions in real-time multiplayer mode!

---

## 🚀 Features

- 🎮 **Multiple Game Modes**:
  - **Local 2-Player**: Pass & play on the same device.
  - **Play vs AI**: Challenge the computer across **Easy**, **Medium**, and **Hard** difficulty levels.
  - **Online Multiplayer**: Create a room, share a unique Session ID, and play remotely with friends.
- ⚡ **Real-Time Role & Turn Status**: Visual badges indicating host/visitor status and whose turn it is.
- 🎯 **Smart Win & Draw Detection**: Instant detection with winning line highlighting.
- 🎆 **Victory Celebration**: Animated fireworks when a player wins.
- 🛡️ **Move Protection**: Prevents overwriting occupied cells and invalid turns.
- 🧭 **Seamless Navigation**: Multi-page routing powered by `react-router-dom`.
- 📱 **Fully Responsive UI**: Modern glassmorphism-inspired dark aesthetic optimized for all screen sizes.
- 🔄 **Game Controls**: Quick restart, play again, quit game, and return to main menu actions.

---

## 🛠️ Technologies Used

- **React 19** - Frontend library for UI components
- **React Router DOM (v7)** - Client-side routing and page navigation
- **Vite** - High-performance frontend build tool
- **JavaScript (ES6+)** - Game logic and state handling
- **CSS3** - Custom styling, flexbox/grid layouts, animations, and transitions

---

## 📂 Project Structure

```text
tic-tac-toe/
├── public/
├── src/
│   ├── assets/
│   │   ├── react.svg
│   │   └── vite.svg
│   │
│   ├── components/
│   │   ├── Board.jsx          # 3x3 Grid Board component
│   │   ├── Fireworks.jsx      # Winner celebration animation
│   │   ├── GameStatus.jsx     # Turn & winner status banner
│   │   ├── PlayModal.jsx      # Start game & confirmation modal
│   │   └── Square.jsx         # Individual grid square component
│   │
│   ├── hooks/
│   │   └── useTicTacToe.js    # Custom hook encapsulating all game state & actions
│   │
│   ├── pages/
│   │   ├── CreateSession.jsx  # Host multiplayer session screen
│   │   ├── Difficulty.jsx     # AI difficulty selection screen
│   │   ├── Game.jsx           # Main interactive game arena
│   │   ├── Home.jsx           # Landing / Mode selection page
│   │   ├── JoinSession.jsx    # Join existing session screen
│   │   └── Multiplayer.jsx    # Multiplayer lobby (Create / Join)
│   │
│   ├── routes/
│   │   └── AppRouter.jsx      # Application route definitions
│   │
│   ├── utils/
│   │   ├── SessionGenerator.js# Unique session code generator
│   │   └── gameLogic.js       # Pure game rules, win calculations & AI moves
│   │
│   ├── App.css                # Global and component-level stylesheet
│   ├── App.jsx                # Root app component wrapping router
│   ├── index.css              # Base styling and resets
│   └── main.jsx               # React DOM entry point
│
├── eslint.config.js
├── index.html
├── package.json
└── vite.config.js
```

---

## 📚 React Concepts Covered

- **Component-Driven Architecture**: Modular, reusable functional components.
- **Custom Hooks**: Encapsulating complex game state and handlers with `useTicTacToe`.
- **Client-Side Routing**: Route parameters (`useParams`), programmatical navigation (`useNavigate`), and nested routing with `react-router-dom`.
- **State Management**: Managing state using React's `useState`, `useEffect`, and `useRef`.
- **Game Logic Separation**: Decoupling pure algorithmic logic (`gameLogic.js`) from UI rendering.
- **Props & Event Handling**: Bidirectional data flow and event-driven updates.
- **Conditional Rendering**: Dynamic UI rendering for modals, statuses, turn indicators, and animations.

---

## ⚙️ Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Sinan-kp10/Tic-Tac-Toe.git
   ```

2. **Navigate into the project directory**:
   ```bash
   cd tic-tac-toe
   ```

3. **Install dependencies**:
   ```bash
   npm install
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```

5. **Open in browser**:
   ```text
   http://localhost:5173
   ```

---

## 🎯 Game Rules

- Player **X** always starts first.
- Players take turns marking a cell on the 3 × 3 grid.
- The first player to align 3 of their symbols horizontally, vertically, or diagonally wins the match.
- If all 9 cells are filled without a winner, the match ends in a **Draw**.
- In Multiplayer mode, the host plays as **X** and the joining visitor plays as **O**.

---

## 🔮 Future Improvements

- 🌙 Light / Dark theme toggle
- 🔊 Sound effects for moves, win, and draw
- 📊 Global and local scoreboard & match stats
- ⏪ Move history and time-travel replay
- 🌐 WebSocket / WebRTC integration for true remote multiplayer sync

---

## 👨‍💻 Author

**Muhammed Sinan KP**
- GitHub: [@Sinan-kp10](https://github.com/Sinan-kp10)

---

## 📄 License

This project is created for learning React and is open-source for educational purposes.