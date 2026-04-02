# MiniPlay - Detailed Development Instructions

## Project Goal
Build a visually appealing arcade-style website with multiple mini-games using only HTML, CSS, and JavaScript.

---

# 1. WEBSITE STRUCTURE

## Pages
1. Home Page (index.html)
2. Game Pages:
   - Memory Game
   - Flappy Bird
   - Dino Game
   - Emoji Pong

---

# 2. HOME PAGE DESIGN

## Layout
- Centered title: "MiniPlay"
- Subtitle: "Play. Compete. Enjoy."
- Grid of game cards

## Game Card Design
- Rounded corners
- Glow on hover
- Slight scale animation
- Icon + Game name

## Animations
- Fade-in on load
- Hover → scale(1.05)
- Button glow effect

---

# 3. NAVIGATION
- Clicking a game → opens game page
- Back button in all games

---

# 4. GAME IMPLEMENTATION DETAILS

---

## 4.1 MEMORY GAME (DOM BASED)

### Features
- Grid of cards (4x4 or 6x6)
- Flip animation
- Matching logic
- Score tracking
- Move counter
- Restart button

### Logic
- Store card states in array
- On click:
  - Flip card
  - Compare two cards
  - If match → keep open
  - Else → flip back

### Animations
- Card flip (CSS transform rotateY)
- Match highlight glow

---

## 4.2 FLAPPY BIRD (CANVAS BASED)

### Features
- Gravity physics
- Pipe obstacles
- Score counter
- Game over screen

### Logic
- Bird falls constantly (gravity)
- Space key → jump
- Pipes move left
- Collision detection

### Animations
- Smooth movement using requestAnimationFrame

---

## 4.3 DINO GAME (CANVAS OR DOM)

### Features
- Jumping dinosaur
- Obstacles
- Increasing speed
- Score tracking

### Logic
- Space key → jump
- Obstacles move toward player
- Collision detection

---

## 4.4 EMOJI PONG (DOM OR CANVAS)

### Features
- Two paddles
- Ball movement
- Score tracking

### Controls
- Player 1 → W/S
- Player 2 → Arrow keys

### Logic
- Ball bounces on walls
- Paddle collision detection

---

# 5. JAVASCRIPT STRUCTURE

## Core Concepts
- Event Listeners
- DOM Manipulation
- Game Loop
- Timers
- Arrays for state tracking

---

# 6. UI DESIGN DETAILS

## Colors
- Background: linear-gradient(#0f172a, #020617)
- Buttons: #38bdf8
- Hover glow: box-shadow

## Fonts
- Use Google Fonts (Poppins / Orbitron)

---

## Effects
- Glass effect:
  backdrop-filter: blur(10px);
- Neon glow:
  box-shadow: 0 0 10px #38bdf8;

---

# 7. SOUND (OPTIONAL)
- Click sound
- Game over sound

---

# 8. LOCAL STORAGE (OPTIONAL)
- Store high scores
- Retrieve on load

---

# 9. RESPONSIVENESS
- Use Flexbox/Grid
- Ensure mobile compatibility

---

# 10. FINAL CHECKLIST

- [ ] All 4 games fully working
- [ ] UI looks polished
- [ ] Smooth animations
- [ ] Score system implemented
- [ ] Restart functionality
- [ ] Navigation works
- [ ] Code understood completely

---

# 11. DEVELOPMENT STRATEGY

Step 1: Build Home Page  
Step 2: Implement Memory Game  
Step 3: Add Flappy Bird  
Step 4: Improve UI/Animations  
Step 5: Add extra games (if time permits)

---

# FINAL NOTE
Focus on quality over quantity. A polished 4-game website will score higher.