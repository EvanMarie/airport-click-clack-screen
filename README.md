# ✈️ Flipboard Display

A mesmerizing digital recreation of those iconic airport departure boards that flip and clatter as they update flight information. This project captures that satisfying mechanical aesthetic with smooth animations and a collection of inspirational quotes.

## 🎯 What It Is

Remember those classic split-flap displays at airports? The ones that would *click-clack-flip* through letters and numbers to show flight departures? This is a web-based tribute to that beautiful piece of analog-digital design, complete with:

- **Authentic flip animations** that cascade across the board
- **Staggered timing** so characters don't all flip at once (just like the real thing!)
- **Randomized duration** for that organic, mechanical feel
- **Curated wisdom** from philosophers and thinkers throughout history

## ✨ Features

- 🔄 **Smooth character-by-character flip animations**
- 📱 **Fully responsive** - works on desktop and mobile
- ⌨️ **Keyboard navigation** - use arrow keys or spacebar
- 🎨 **Retro-futuristic design** with cyan glow effects
- 📖 **16 carefully selected quotes** from Uncle Iroh, Buddha, Lao Tsu, and more
- 🔧 **Pure HTML/CSS/JS** - no frameworks, ready for GitHub Pages

## 🚀 Live Demo

[View the live flipboard →]([https://yourusername.github.io/flipboard-display](https://evanmarie.github.io/airport-click-clack-screen/))

## 🛠️ How It Works

The magic happens through CSS 3D transforms and careful timing:

1. **Character Grid**: Each position on the board is an individual flip tile
2. **Animation Cascade**: When text changes, animations ripple across the board with staggered delays
3. **Realistic Timing**: Random variations in flip duration create that authentic mechanical feel
4. **Text Wrapping**: Smart word wrapping ensures quotes fit beautifully on the board

```javascript
// The core animation principle
flipCharacter(oldChar, newChar, x, y) {
    const delay = Math.sqrt(x * x + y * y) * 0.05; // Distance-based stagger
    const duration = 0.4 * (0.8 + Math.random() * 0.4); // ±20% variation
    // ... flip animation magic happens here
}
```

## 🎮 Controls

- **Next/Previous Buttons**: Navigate through quotes
- **Arrow Keys**: ← Previous, → Next
- **Spacebar**: Next quote
- **Auto-responsive**: Adapts to any screen size

## 🏗️ Architecture

### Original React/Remix Version
This component was originally built as a React component for use in Remix applications, featuring:
- Component-based architecture with `FlipCharacter` tiles
- React state management for grid updates
- Framer Motion for smooth 3D transforms
- TypeScript for type safety
- Designed for modern React/Remix development workflows

### Refactored HTML Version (Current)
To make this accessible on GitHub Pages and eliminate build dependencies, the entire component was refactored to pure web standards:
- Vanilla JavaScript `FlipboardDisplay` class
- CSS `@keyframes` animations replacing Framer Motion
- Zero dependencies - just save and open!
- Maintains all original functionality and visual fidelity

## 🎨 Design Philosophy

The aesthetic draws inspiration from:
- **Split-flap displays** of 1960s-80s airports and train stations
- **Retro-futuristic interfaces** with that satisfying mechanical precision
- **Terminal/console aesthetics** with monospace fonts and cyan highlights
- **Mindful minimalism** - letting the content and animation speak for themselves

## 📁 Project Structure

```
flipboard-display/
├── index.html          # Complete standalone flipboard
├── README.md           # This file
└── react-version.tsx  # Original React implementation
```

## 🚀 Quick Start

1. **Clone or download** this repository
2. **Open `index.html`** in any modern browser
3. **Watch the magic** happen!

For GitHub Pages:
1. Upload `index.html` to your repository
2. Enable GitHub Pages in Settings
3. Your flipboard is live!

## 🎯 Inspiration

> *"The best way to take care of the future is to take care of the present moment."*  
> ~Thich Nhat Hanh

This project celebrates both technological nostalgia and timeless wisdom. In our age of instant everything, there's something deeply satisfying about animations that take their time, characters that flip with purpose, and messages that encourage reflection.

## 🔧 Customization

Want to make it your own? The code is designed to be hackable:

```javascript
// Change board dimensions
const flipboard = new FlipboardDisplay('flipboard', {
    boardWidth: 30,     // Wider board
    boardHeight: 15,    // Taller board
    flipDuration: 0.6,  // Slower flips
});

// Add your own content
const contents = [
    "Your own wisdom here...",
    "More custom content..."
];
```

## 🏷️ Tags

`airport-board` `flip-animation` `retro-design` `vanilla-js` `css-animations` `split-flap-display` `quotes` `philosophy` `nostalgia` `web-animation`

## 📜 License

MIT License - Feel free to flip, modify, and share!

---

*Built with ❤️ and a deep appreciation for the satisfying click-clack of mechanical displays*
