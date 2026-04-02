# MiniPlay - Project Guidelines

## Project Details
- Course: Foundations of Computations (GXEST203)
- College: College of Engineering Trivandrum
- Year: 2026
- Team Members:
  - Sooraj D S
  - Sreeraj R S

---

## Project Description
MiniPlay is a static interactive website that hosts multiple mini-games such as Memory Game, Flappy Bird, Dino Game, and Emoji Pong. The platform focuses on clean UI, smooth animations, and engaging gameplay.

---

## Technology Stack (STRICT)
- HTML → Structure
- CSS → Styling, animations, themes
- JavaScript → Logic, interactivity

---

## Restrictions
- ❌ No backend (PHP, Flask, Django, etc.)
- ❌ No external programming languages (Python, Java, etc.)
- ❌ No database usage

---

## Deployment Options
- Localhost
- GitHub Pages
- Vercel

---

## Core Features (MUST HAVE)
- At least **2 fully functional games**
- Responsive design
- Smooth UI transitions
- Score tracking system
- Restart / Replay option
- Navigation between games

---

## Recommended Features
- Dark themed UI
- Hover animations
- Sound effects (optional)
- Game difficulty levels
- Local leaderboard using `localStorage`

---

## UI/UX Guidelines

### Theme
- Primary Color: #0f172a (Dark blue)
- Secondary: #1e293b
- Accent: #38bdf8 (Neon blue)
- Highlight: #facc15 (Yellow)
- Text: #e2e8f0

### Design Style
- Glassmorphism / Neon arcade feel
- Rounded corners (border-radius: 12px+)
- Soft shadows and glowing effects

---

## Animations (REQUIRED)
- Button hover scale + glow
- Page transitions (fade/slide)
- Game element movement animations
- Smooth score updates

---

## Folder Structure
MiniPlay/
│
├── index.html
├── style.css
├── script.js
│
├── games/
│ ├── memory.html
│ ├── flappy.html
│ ├── dino.html
│ ├── pong.html
│
├── css/
├── js/
└── assets/