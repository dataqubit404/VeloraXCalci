# VeloraXCalci

Velora Demo - https://velora-rajdarlami.vercel.app

Calci Demo - https://velora-x-calci-4mbf.vercel.app

# 🧮 Calculator Studio — 3D Floating Calculator System

<div align="center">

![React](https://img.shields.io/badge/React-18-61dafb?style=for-the-badge&logo=react&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-11-ff0080?style=for-the-badge&logo=framer&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3-38bdf8?style=for-the-badge&logo=tailwindcss&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES2023-f7df1e?style=for-the-badge&logo=javascript&logoColor=black)
![No Backend](https://img.shields.io/badge/Backend-None-34d399?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-a78bfa?style=for-the-badge)

**A premium, 3D floating calculator experience built as a single-file React component.**  
Three distinct calculators float in 3D space — swipe between them, click to focus, and interact with full working logic.



</div>

---


## ✨ Features

### 🌐 3D Carousel System
- **Perspective 3D layout** — cards rotate on the Y-axis with `rotateY`, `scale`, and `blur` depth cues
- **Smooth Framer Motion animations** — spring physics on every transition
- **Idle float animation** — the center card gently bobs up and down when idle
- **Multiple navigation methods** — mouse drag, touch swipe, arrow keys, or dot buttons
- **Click to expand** — clicking the center card locks it in place for full interaction
- **Backdrop dismiss** — click the dark overlay or press `Escape` to return to carousel

### 🔊 Web Audio Feedback
- Subtle sine-wave click sounds on every button press
- Different pitch tones for different calculator types
- Implemented via the **Web Audio API** — no audio files required

---

## 🧮 The Three Calculators

### 1. `∑` Scientific Calculator
> **Theme:** Deep navy / indigo dark

| Feature | Details |
|---|---|
| **Display** | Shows live expression + evaluated result with history |
| **Trig functions** | `sin`, `cos`, `tan` with toggle between **RAD / DEG** mode |
| **Logarithms** | Natural log `ln` and base-10 `log` |
| **Other functions** | Square root `√`, square `x²`, reciprocal `1/x` |
| **Constants** | Pi `π` and Euler's number `ℇ` |
| **Memory** | `M+` add to memory, `MR` recall, `MC` clear |
| **Operators** | `+`, `−`, `×`, `÷`, `^` (power), `(` `)` brackets |
| **Layout** | 5-column grid, `=` spans 2 rows |

---

### 2. `◎` Classic iOS Calculator
> **Theme:** Pure black + amber orange (iOS-inspired)

| Feature | Details |
|---|---|
| **Display** | Large mono display, auto-scales font size for long numbers |
| **Chained operations** | Supports continuous arithmetic (e.g. `5 + 3 × 2`) |
| **Repeat last op** | Pressing `=` repeatedly repeats the last operation |
| **Active op highlight** | Currently selected operator button inverts its color |
| **Utility keys** | `AC` clear all, `+/-` toggle sign, `%` percentage |
| **Number formatting** | Auto switches to scientific notation for very large/small values |
| **Layout** | 4-column circular button grid, `0` key spans 2 columns |

---

### 3. `◈` Daily Life Tools
> **Theme:** Slate-blue frosted card

Four tools accessible via animated tabs:

#### 🏃 BMI Calculator
- Inputs: Height (cm), Weight (kg)
- Outputs: BMI value, Weight category (Underweight / Normal / Overweight / Obese), Ideal weight range

#### 💰 Simple Interest (SI)
- Inputs: Principal (₹), Annual rate (%), Duration (years)
- Outputs: Simple interest, Total amount, Monthly interest breakdown
- Smart formatting: displays values in **₹**, **L** (lakhs), or **Cr** (crores)

#### 📈 SIP Calculator
- Inputs: Monthly SIP amount (₹), Expected return (% p.a.), Duration (years)
- Outputs: Future value, Total amount invested, Estimated gains, Return multiple (e.g. `3.2×`)
- Uses standard SIP compound formula with monthly compounding

#### 🎂 Age Calculator
- Input: Date of birth
- Outputs: Exact age in years/months/days, Total days lived, Total hours lived, Days until next birthday

---


## 🚀 Getting Started

### Prerequisites

- Node.js `>= 16`
- npm or yarn

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/aio-calculator.git
cd calculator-studio

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

### Using with Vite (recommended)

```bash
npm create vite@latest calculator-studio -- --template react
cd calculator-studio
npm install framer-motion
# Replace src/App.jsx with 3d-calculator.jsx content
npm run dev
```

### Using with Create React App

```bash
npx create-react-app calculator-studio
cd calculator-studio
npm install framer-motion
# Replace src/App.js with 3d-calculator.jsx content
npm start
```

---

## 📦 Dependencies

| Package | Version | Purpose |
|---|---|---|
| `react` | `^18` | UI framework |
| `react-dom` | `^18` | DOM rendering |
| `framer-motion` | `^11` | 3D animations, spring physics, AnimatePresence |

> **No other dependencies.** Fonts are loaded from Google Fonts CDN. Audio uses the native Web Audio API. No Tailwind config needed (styles are written inline for portability).

---

## 🎮 Controls & Interaction

| Action | How to trigger |
|---|---|
| Navigate carousel | **Mouse drag** left/right |
| Navigate carousel | **Touch swipe** left/right |
| Navigate carousel | **← → Arrow keys** |
| Navigate carousel | **Click dot** indicators |
| Open a calculator | **Click** the center (focused) card |
| Close a calculator | **Click** the dark backdrop |
| Close a calculator | Press **Escape** |
| Focus a side card | **Click** either side card to bring it to center |

---

## 🎨 Design System

| Token | Value | Usage |
|---|---|---|
| Background | `#0a0a0c` | App shell |
| Scientific accent | `#6366f1` | Indigo — operator buttons, glow |
| Classic accent | `#ff9f0a` | Amber — operator buttons, iOS-style |
| Daily Tools accent | `#38bdf8` | Sky blue — action buttons, results |
| Success / SIP | `#34d399` | Emerald green |
| Memory / SI | `#f59e0b` | Amber |
| Age / misc | `#818cf8` | Violet |
| Font (UI) | `Inter` | Labels, buttons, headings |
| Font (numbers) | `JetBrains Mono` | All numeric displays |

---

## 🔧 Customization

### Change the number of cards
Add a new entry to the `CARDS` array in `App`:

```jsx
const CARDS = [
  { id:"sci",   label:"Scientific",  ..., Comp: ScientificCalc },
  { id:"ios",   label:"Classic",     ..., Comp: ClassicCalc    },
  { id:"daily", label:"Daily Tools", ..., Comp: DailyCalc      },
  // Add your own:
  { id:"custom", label:"My Calc", sub:"...", emoji:"⊕", accent:"#f472b6", Comp: MyCalc },
];
```

### Change card spacing
Edit the `offset * 310` value in the `Card` component's `animate.x` property.

### Adjust animation stiffness
The carousel uses Framer Motion spring physics. Tune these values in `Card`:

```jsx
x: { type:"spring", stiffness:270, damping:28 },  // higher stiffness = snappier
```

### Disable sound
Remove the `beep()` calls, or replace the `beep` function with a no-op:

```js
const beep = () => {};
```

---

## 🧠 Architecture Notes

### Why a single file?
The entire project is intentionally written as one `.jsx` file for maximum portability — drop it into any React project and it works. There are no CSS files, no asset imports, and no config changes needed.

### Pointer events over mouse/touch split
Swipe detection uses `onPointerDown / onPointerMove / onPointerUp` instead of separate `onMouseDown` / `onTouchStart` handlers. This unified API works correctly across desktop, mobile, and stylus inputs without event duplication.

### Carousel z-index layers
```
z: 110  ✕ Close button
z:  60  Active (expanded) card
z:  50  Backdrop overlay
z:  20  Center carousel card
z:   5  Side carousel cards
```

### SIP Formula used
```
FV = P × [ (1 + r)^n − 1 ] / r × (1 + r)

where:
  P = monthly investment
  r = monthly rate = annual rate / 12 / 100
  n = total months = years × 12
```

---

## 🌐 Browser Compatibility

| Browser | Support |
|---|---|
| Chrome / Edge | ✅ Full |
| Firefox | ✅ Full |
| Safari (iOS) | ✅ Full |
| Samsung Internet | ✅ Full |
| IE 11 | ❌ Not supported |

---

## 📋 Roadmap

- [ ] Add a **Currency Converter** tab to Daily Tools
- [ ] Add **EMI Calculator** tab
- [ ] **Theme switcher** — light / dark / system
- [ ] Persist last-used calculator with `localStorage`
- [ ] **Keyboard input** support for Scientific calculator
- [ ] Export SIP/SI results as a downloadable summary card

---

## 🤝 Contributing

Contributions are welcome!

```bash
# Fork the repo, then:
git checkout -b feature/my-new-calculator
git commit -m "feat: add currency converter tab"
git push origin feature/my-new-calculator
# Open a Pull Request
```

Please keep the single-file architecture intact for portability. New calculators should be added as self-contained function components following the pattern of `BMI()`, `SI()`, etc.

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

## 🙏 Acknowledgements

- [Framer Motion](https://www.framer.com/motion/) — for making 3D spring animations in React effortless
- [JetBrains Mono](https://www.jetbrains.com/lp/mono/) — the perfect monospace font for numeric displays
- [Inter](https://rsms.me/inter/) — clean, readable UI typeface
- Web Audio API — for zero-dependency click sound feedback

---

<div align="center">

Made with ☕ and way too many `rotateY` values.

⭐ **Star this repo** if you found it useful!

</div>